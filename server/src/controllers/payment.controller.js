
import mongoose from 'mongoose';
import vnpayService from '../services/vnpay.service.js';
import Order from '../models/order.model.js';
import Payment from '../models/payment.model.js';
import constants from '../constants.js';
import ResponseUtils from '../utils/ResponseUtils.js';
import momoService from '../services/momo.service.js';
import orderService from '../services/order.service.js';


export const getVnpayResult = async (req, res, next) => {
  try {
    const result = await vnpayService.checkPaymentStatus(req.query);
    console.log('result: ', result);
    let message = '';

    if (result.isSuccess) {
      const paidDate = new Date(
        Number.parseInt(result.data.payDate.substring(0, 4)),
        Number.parseInt(result.data.payDate.substring(4, 6)),
        Number.parseInt(result.data.payDate.substring(6, 8)),
        Number.parseInt(result.data.payDate.substring(8, 10)),
        Number.parseInt(result.data.payDate.substring(10, 12)),
        Number.parseInt(result.data.payDate.substring(12, 14))
      );

      const order = await Order.findById(result.data.orderId);
      if (order.total === result.data.amount / 100) {
        // order.status = constants.ORDER.PAYMENT_STATUS.PAID;
        order.paymentStatus = constants.ORDER.PAYMENT_STATUS.PAID;
        await Order.updateOne({ _id: order._id }, order);
      }
      console.log('result: ', result);

      const payment = new Payment({
        _id: new mongoose.Types.ObjectId(),
        order: result.data.orderId,
        amount: result.data.amount,
        paidDate,
        desc: `
          Mã giao dịch VNPAY: ${result.data.transactionNo}
          Số tiền: ${result.data.amount}
          Mã Ngân hàng thanh toán: ${result.data.bankCode}
          Mã giao dịch tại Ngân hàng: ${result.data.bankTranNo}
          Loại tài khoản/thẻ khách hàng sử dụng: ${result.data.cardType}
        `
      });

      await payment.save();
      message = 'Thanh toán thành công';
    } else {
      message = 'Thanh toán thất bại';
    }
    if (result.isSuccess) {
      // close window
      res.send(`
      <script>
        alert('${message}');
        window.open('${result.data.clientUrl}/order/${result.data.orderId}', '_self', '')
      </script>
      `);
    } else {
      res.send(`
      <script>
        alert('${message}');
        window.open('${result.data.clientUrl}/', '_self', '')
      </script>
      `);
    }
  } catch (err) { next(err); }
};
export const getMomoResult = async (req, res, next) => {
  try {
    const result = await momoService.checkPaymentStatus(req.query);
    console.log('result: ', result);
    let message = '';

    if (result.isSuccess) {
      const paidDate = new Date(
        Number.parseInt(result.data.payDate.substring(0, 4)),
        Number.parseInt(result.data.payDate.substring(4, 6)),
        Number.parseInt(result.data.payDate.substring(6, 8)),
        Number.parseInt(result.data.payDate.substring(8, 10)),
        Number.parseInt(result.data.payDate.substring(10, 12)),
        Number.parseInt(result.data.payDate.substring(12, 14))
      );

      const order = await Order.findById(result.data.orderId);
      // if (order.total === result.data.amount / 100) {
      //   // order.status = constants.ORDER.PAYMENT_STATUS.PAID;
      //   order.paymentStatus = constants.ORDER.PAYMENT_STATUS.PAID;
      //   await Order.updateOne({ _id: order._id }, order);
      // }
      if (order) {
        // order.status = constants.ORDER.PAYMENT_STATUS.PAID;
        order.paymentStatus = constants.ORDER.PAYMENT_STATUS.PAID;
        await Order.updateOne({ _id: order._id }, order);
      }

      const payment = new Payment({
        _id: new mongoose.Types.ObjectId(),
        order: result.data.orderId,
        amount: result.data.amount,
        paidDate,
        desc: `
          Mã giao dịch MOMO: ${result.data.IdPayment}
          Số tiền: ${result.data.amount}
          Loại thanh toán: ${result.data.orderType || null}
          Mã giao dịch tại Ngân hàng: ${result.data.transId}
          Loại tài khoản/thẻ khách hàng sử dụng: ${result.data.cardType || result.data.orderType}
        `
      });

      await payment.save();
      message = 'Thanh toán thành công';
    } else {
      message = 'Thanh toán thất bại';
    }
    if (result.isSuccess) {
      // close window
      res.send(`
      <script>
        alert('${message}');
        window.open('${result.data.clientUrl}/order/${result.data.orderId}', '_self', '')
      </script>
      `);
    } else {
      res.send(`
      <script>
        alert('${message}');
        window.open('${result.data.clientUrl}/', '_self', '')
      </script>
      `);
    }

  } catch (err) { next(err); }
};


export const createByMomo = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;
    const language = req.headers['accept-language'];
    const clientUrl = req.body?.clientUrl || req.headers.origin;
    const order = await orderService.create(
      userId,
      req.body
    );
    let result;
    if (order) {
      if (req.body.paymentMethod === constants.ORDER.PAYMENT_METHOD.MOMO) {
        const apiUrl = `${req.protocol}://${req.get('host')}`
        result = await momoService.createPaymentUrl(
          req.ipv4,
          apiUrl,
          clientUrl,
          order._id.toString(),
          order.total,
          language
        );
      }
      console.log("result: ", result);
      ResponseUtils.status200(
        res,
        'Order created successfully',
        order,
        { paymentUrl: result.payUrl }
      )
    } else {
      ResponseUtils.status400(
        res,
        'Order created failed'
      )
    }
  } catch (error) { next(error); }

}

export const createByVnpay = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;
    const language = req.headers['accept-language'];
    const clientUrl = req.body?.clientUrl || req.headers.origin;
    const order = await orderService.create(
      userId,
      req.body
    );

    if (order) {
      let paymentUrl = '';
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
