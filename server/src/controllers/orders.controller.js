import constants, { REGEX } from '../constants.js';
import orderService from '../services/order.service.js';
import vnpayService from '../services/vnpay.service.js';
import ResponseUtils from '../utils/ResponseUtils.js';
import User from '../models/user.model.js';
import authService from '../services/auth.service.js';
import momoService from '../services/momo.service.js';

// Order manager by user
export const getOne = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await orderService.getOne(orderId);

    if (order) {
      ResponseUtils.status200(
        res,
        'Get order info success',
        JSON.parse(JSON.stringify(order))
      );
    } else {
      ResponseUtils.status404(
        res,
        'Order not found'
      );
    }
  } catch (err) { next(err); }
};

export const getList = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const status = req.query.status || null;
    const paymentStatus = req.query.paymentStatus || null;
    const userId = req?.user?._id || null;

    let result;
    if (userId) {
      result = await orderService.getListByUser(userId, search, status, paymentStatus);
    }
    ResponseUtils.status200(
      res,
      'Get order list success',
      result
    );
  } catch (err) { next(err); }
};

export const getByUser = async (req, res, next) => {
  try {
    const status = req.query.status;
    const userId = req.user._id;
    const orders = await orderService.getListByUser(userId, status);

    ResponseUtils.status200(
      res,
      'Get order successfully',
      orders
    )
  } catch (err) { next(err); }
}

export const createByUser = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;
    const language = req.headers['accept-language'];
    const clientUrl = req.body?.clientUrl || req.headers.origin;

    const order = await orderService.create(
      userId,
      req.body
    );
    let paymentUrl = '';
    if (order) {
      if (req.body.paymentMethod === constants.ORDER.PAYMENT_METHOD.VNPAY) {
        const apiUrl = `${req.protocol}://${req.get('host')}`
        paymentUrl = await vnpayService.createPaymentUrl(
          req.ipv4,
          apiUrl,
          clientUrl,
          order._id.toString(),
          order.total
        );
      }
      else if (req.body.paymentMethod === constants.ORDER.PAYMENT_METHOD.MOMO) {
        const apiUrl = `${req.protocol}://${req.get('host')}`
        const result = await momoService.createPaymentUrl(
          req.ipv4,
          apiUrl,
          clientUrl,
          order._id.toString(),
          order.total
        );
        paymentUrl = result.payUrl;
      }

      const user = await User.findOne({ _id: userId }).lean().exec();
      const orderSend = await orderService.getOne(order?._id);
      if (user) {
        await authService.sendOrderViaMail(user?.email, orderSend, language);
      }
      ResponseUtils.status200(
        res,
        'Order created successfully',
        order,
        { paymentUrl }
      )
    } else {
      ResponseUtils.status400(
        res,
        'Order created failed'
      )
    }
  } catch (error) { next(error); }

}

export const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.cancel(orderId);
    if (order) {
      ResponseUtils.status200(
        res,
        'Order cancelled',
        order
      );
    } else {
      ResponseUtils.status400(
        res,
        'Order cancelled fail',
      )
    }

  } catch (error) {
    next(error);
  }
}

export const rePayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOne(orderId);
    if (!order) {
      ResponseUtils.status400(
        res,
        'Order not found'
      );
    }
    else if (order.paymentStatus === constants.ORDER.PAYMENT_STATUS.PAID) {
      ResponseUtils.status400(
        res,
        'Order has been paid'
      );
    }
    else if (order.paymentMethod === constants.ORDER.PAYMENT_METHOD.VNPAY) {
      const apiUrl = `${res.protocol}://${res.get('host')}`
      const paymentUrl = await vnpayService.createPaymentUrl(
        req.ipv4,
        apiUrl,
        req.headers.origin,
        order._id.toString(),
        order.total
      );
      ResponseUtils.status200(
        res,
        'Create payment url success',
        paymentUrl
      )
    }
  } catch (error) {
    next(error);
  }
}

export const updateByUser = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.update(req.user._id, orderId, req.body);
    if (order) {
      ResponseUtils.status200(
        res,
        'Update order success',
        order
      )
    } else {
      ResponseUtils.status400(
        res,
        'Update order fail',
        order
      )
    }
  } catch (error) {
    next(error);
  }
}

// Order manager by admin
export const getTotal = async (req, res, next) => {
  try {
    let total = 0;
    const list = await orderService.getTotal();
    list.map((x) => total += x.subTotal)
    if (list) {
      ResponseUtils.status200(
        res,
        'Get list order success',
        total
      )
    } else {
      ResponseUtils.status200(
        res,
        'Get list order fail'
      )
    }
  } catch (error) {
    next(error);
  }
}

export const getAllOrders = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const status = req.query.status || null;
    const paymentStatus = req.query.paymentStatus || null;

    const list = await orderService.getAlls(search, status, paymentStatus);
    if (list) {
      ResponseUtils.status200(
        res,
        'Get list order success',
        list
      )
    } else {
      ResponseUtils.status200(
        res,
        'Get list order fail'
      )
    }
  } catch (error) {
    next(error);
  }
}

export const createOrderByAdminOrStaff = async (req, res, next) => {
  try {
    const createById = req.user._id;
    const userId = req.body?.customer?.userId || null;
    let customerInfo = null;
    if (userId) {
      customerInfo = userId;
    } else {
      customerInfo = req.body.customer;
    }

    const order = await orderService.create(
      customerInfo,
      { ...req.body, status: constants.ORDER.STATUS.CONFIRMED },
      createById
    );
    if (order) {
      ResponseUtils.status201(
        res,
        'Create order success',
        order
      );
    } else {
      ResponseUtils.status400(
        res,
        'Create order fail'
      );
    }

  } catch (error) {
    next(error);
  }
}

export const updateOrderByAdminOrStaff = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    let updateData = {};
    if (req.body.status) {
      updateData.status = req.body.status;
    }

    if (req.body.paymentStatus) {
      updateData.paymentStatus = req.body.paymentStatus;
    }
    if (req.body.paymentMethod) {
      updateData.paymentMethod = req.body.paymentMethod;
    }

    const order = await orderService.update(userId, orderId, updateData);
    if (order.status === constants.ORDER.STATUS.CANCELLED) {
      const orderCancel = await orderService.cancel(orderId);
      if (orderCancel) {
        return ResponseUtils.status200(
          res,
          'Order cancelled',
          orderCancel
        );
      }
    }
    if (order) {
      const result = await orderService.getOne(order._id);
      ResponseUtils.status200(
        res,
        'Update order success',
        result
      );
    } else {
      ResponseUtils.status400(
        res,
        'Update order fail'
      );
    }
  } catch (err) {
    next(err);
  }
};
