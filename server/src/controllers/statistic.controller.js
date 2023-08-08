import constants from "../constants.js";
import orderModel from "../models/order.model.js";
import productsService from "../services/products.service.js";
import ResponseUtils from "../utils/ResponseUtils.js";

// api: thống kê số lượng sản phẩm sản phẩm
export const getFullAllProducts = async (req, res, next) => {
  try {
    let products = await productsService.getFullAllProducts();
    if (products && products.length > 0) {
      ResponseUtils.status200(res, 'Gets all products sold successfully', products);
    } else {
      ResponseUtils.status200(res, 'No products sold found', products);
    }
  } catch (err) { next(err); }
}

// api: thống kê số lượng sản phẩm sản phẩm
export const getBestSellerProducts = async (req, res, next) => {
  try {
    let products = await productsService.getBestSellerProducts();
    if (products && products.length > 0) {
      ResponseUtils.status200(res, 'Gets all products best seller successfully', products);
    } else {
      ResponseUtils.status200(res, 'No products best seller found', products);
    }
  } catch (err) { next(err); }
}

// api: thống kê doanh thu theo tháng
export const getStaMonthlyRevenue = async (req, res, next) => {
  try {
    const { year } = req.query;
    // lấy danh sách đơn hàng trong năm thống kê (Chỉ lấy đơn hàng đã thanh toán)
    const thisYearOrder = await orderModel.find({
      createdAt: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
      paymentStatus: constants.ORDER.PAYMENT_STATUS.PAID,
    }).select('-_id createdAt updatedAt items shippingFee subTotal isReceiveAtStore');

    // lấy danh sách đơn hàng năm trước đó
    const lastYearOrder = await orderModel.find({
      createdAt: {
        $gte: new Date(`${parseInt(year) - 1}-01-01`),
        $lte: new Date(`${parseInt(year) - 1}-12-31`),
      },
      paymentStatus: constants.ORDER.PAYMENT_STATUS.PAID,
    }).select('-_id updateAt items shippingFee subTotal isReceiveAtStore');

    // kết quả sau thống kê
    let thisYear = [...Array(12).fill(0)],
      lastYear = [...Array(12).fill(0)];
    // thống kê
    if (thisYearOrder) {
      thisYearOrder.forEach((item) => {
        const month = new Date(item.updatedAt).getMonth();
        const totalMoney = item.subTotal;
        thisYear[month] += totalMoney;
      });
    }
    if (lastYearOrder) {
      lastYearOrder.forEach((item) => {
        const month = new Date(item.orderDate).getMonth();
        const totalMoney = item.subTotal;
        lastYear[month] += totalMoney;
      });
    }

    if (thisYearOrder && lastYearOrder)
      return res.status(200).json({ thisYear, lastYear });
  } catch (error) {
    console.error(error);
    return res.status(400).json({});
  }
};

// api: thống kê doanh thu theo năm
export const getStaAnnualRevenue = async (req, res, next) => {
  try {
    const { startYear, endYear } = req.query;
    // lấy danh sách đơn hàng trong năm thống kê (Chỉ lấy đơn hàng đã thanh toán)
    const orderList = await orderModel.find({
      orderDate: {
        $gte: new Date(`${startYear}-01-01`),
        $lte: new Date(`${endYear}-12-31`),
      },
      orderStatus: 6,
    }).select('-_id orderDate numOfProd transportFee orderProd.price');

    let result = [
      ...Array(parseInt(endYear) + 1 - parseInt(startYear)).fill(0),
    ];
    if (orderList) {
      orderList.forEach((item) => {
        const resIndex =
          parseInt(endYear) - new Date(item.orderDate).getFullYear();
        const totalMoney =
          item.orderProd.price * item.numOfProd + item.transportFee;
        result[resIndex] += totalMoney;
      });
    }
    if (orderList) return res.status(200).json({ data: result });
  } catch (error) {
    console.error(error);
    return res.status(400).json({});
  }
};
