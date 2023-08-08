// @see https://blog.logrocket.com/send-emails-nodejs-nodemailer/
import { createTransport } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import configs from '../configs.js';
import LogUtils from '../utils/LogUtils.js';

const mailerService = configs.mailer.service;
const mailerUsername = configs.mailer.user;
const mailerPassword = configs.mailer.pass;
// configure option
const option = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: mailerUsername,
    pass: mailerPassword,
  },
};

const transporter = createTransport(option);
const templateDir = path.resolve('public/mail-template');
const attachments = [
  {
    filename: 'facebook.png',
    path: `${templateDir}/img/facebook.png`,
    cid: 'facebook'
  },
  {
    filename: 'twitter.png',
    path: `${templateDir}/img/twitter.png`,
    cid: 'twitter'
  },
  {
    filename: 'instagram.png',
    path: `${templateDir}/img/instagram.png`,
    cid: 'instagram'
  },
  {
    filename: 'github.png',
    path: `${templateDir}/img/github.png`,
    cid: 'github'
  }
]
// point to the template folder
const handlebarOptions = {
  viewEngine: {
    partialsDir: templateDir,
    defaultLayout: false,
    helpers: {
      // Function to do basic mathematical operation in handlebar
      math: function (lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
          "*": lvalue * rvalue,
          "/": lvalue / rvalue,
          "%": lvalue % rvalue
        }[operator];
      }
    }
  },
  viewPath: templateDir,

};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions));

export const sendMailSync = async (receiver, subject, templateName, context, attachments) => {
  if (typeof receiver === 'string') {
    receiver = [receiver];
  }

  return transporter.sendMail({
    from: mailerUsername,
    to: receiver,
    subject,
    template: templateName,
    context,
    attachments
  });
};

// need to custom template
export const sendMail = (receiver, subject, title, content) => {
  if (typeof receiver === 'string') {
    receiver = [receiver];
  }

  const mailOptions = {
    from: configs.mailer.user, // sender address
    to: receiver,
    subject,
    template: 'verification', // public/mail-template/verification.hbs
    context: {
      logoHref: '/',
      description: 'Welcome to Loc Mobile',
      title,
      content
    },
    attachments: [
      {
        filename: 'facebook.png',
        path: `${templateDir}/img/facebook.png`,
        cid: 'facebook'
      },
      {
        filename: 'twitter.png',
        path: `${templateDir}/img/twitter.png`,
        cid: 'twitter'
      },
      {
        filename: 'instagram.png',
        path: `${templateDir}/img/instagram.png`,
        cid: 'instagram'
      },
      {
        filename: 'github.png',
        path: `${templateDir}/img/github.png`,
        cid: 'github'
      }
    ]
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      LogUtils.error('MAILER', 'Error sending mail', err);
    } else {
      LogUtils.info('MAILER', 'Mail sent', info);
    }
  });
};

export const sendWithOtpTemplate = async (receiver, otp, language = 'vi') => {
  let subject;
  let templateName = 'otp' + '.' + language;
  if (language === 'en') {
    subject = `Email verification code: ${otp}`;
  } else {
    subject = `Mã xác minh của bạn là: ${otp}`;
  }

  return sendMailSync(receiver, subject, templateName, {
    logoHref: '/',
    otpCode: otp,
  }, attachments);
}

export const sendWithOrderTemplate = async (receiver, orderSend, language = 'vi') => {
  if (typeof receiver === 'string') {
    receiver = [receiver];
  }
  let subject;
  let templateName = 'order' + '.' + language;
  if (language === 'en') {
    subject = `Ordor confirmation #${orderSend?.numericId} from Loc Mobile`;
  } else {
    subject = `Xác nhận đơn hàng #${orderSend?.numericId} từ Lộc Mobile`;
  }
  const createDate = new Date(orderSend.createdAt)
  const paymentMethod = orderSend.paymentMethod === 'cash' || 'cod' ? 'Trả tiền mặt' : 'Chuyển khoản';
  let address = '';
  if(orderSend.address) {
    address = orderSend.address.name + ", " + orderSend.address.street + ", " + orderSend.address.ward + ", " + orderSend.address.district + ", " + orderSend.address.province;
  }
  return sendMailSync(receiver, subject, templateName, {
    logoHref: '/',
    name: orderSend?.customer.name || orderSend?.address.name,
    address: orderSend.isReceiveAtStore === true ? 'Nhận tại cửa hàng' : address || '',
    paymentMethod,
    numericId: orderSend.numericId,
    status: orderSend.status,
    created: createDate.toDateString(),
    discount: orderSend.discount,
    subTotal: orderSend.subTotal,
    shippingFee: orderSend.shippingFee,
    total: orderSend.total,
    items: orderSend.items,
    note: orderSend.note,
    orderSend: orderSend,
  }, attachments);
}

