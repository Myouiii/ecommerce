import * as dotenv from 'dotenv';
import { cleanEnv, str, email, json, port } from 'envalid';

dotenv.config();

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  PORT: port({ default: 3001 }),
  MONGO_URI: str({ example: 'mongodb://mongodb0.example.com:27017' }),
  MONGO_URI_ONLINE: str({ example: 'mongodb+srv://<account>:<password>@cluster0.xxxxx.mongodb.net/' }),

  JWT_EXPIRES_IN: str({}),
  JWT_SECRET: str({}),
  
  FIREBASE_CLIENT_EMAIL: str({}),
  FIREBASE_PRIVATE_KEY: str({}),
  FIREBASE_PROJECT_ID: str({}),
  
  GOOGLE_CLIENT_SECRET: str({}),
  GOOGLE_CLIENT_ID: str({}),
  GOOGLE_CLIENT_ID_MOBILE: str({}),
  
  MAILER_AUTH_PASS: str({}),
  MAILER_AUTH_USER: str({}),
  MAILER_SERVICE: str({ default: 'gmail' }),
  
  VNPAY_SECRET: str({}),
  VNPAY_TMN_CODE: str({}),
  VNPAY_URL: str({ default: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html' }),

  MOMO_TMN_CODE: str({}),
  MOMO_ACESSKEY: str({}),
  MOMO_SECRET: str({}),
  MOMO_URL: str({ default: 'https://test-payment.momo.vn/v2/gateway/api/create' }),
  MOMO_RETURN_URL: str({}),
  MOMO_IPN_URL: str({}),
})

const configs = {
  port: env.PORT,
  isDev: env.isDev || env.isDevelopment,
  isProd: env.isProd || env.isProduction,

  mongoUri: env.MONGO_URI,
  mongoUriOnline: env.MONGO_URI_ONLINE,

  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,

  firebaseServiceAccount: {
    projectId: env.FIREBASE_PROJECT_ID,
    privateKey: env.FIREBASE_PRIVATE_KEY
      ? env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
      : undefined,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
  },

  google: {
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    clientId: env.GOOGLE_CLIENT_ID,
    clientIdMobile: env.GOOGLE_CLIENT_ID_MOBILE,
  },

  mailer: {
    service: env.MAILER_SERVICE,
    user: env.MAILER_AUTH_USER,
    pass: env.MAILER_AUTH_PASS,
  },

  vnPay: {
    secret: env.VNPAY_SECRET,
    tmnCode: env.VNPAY_TMN_CODE,
    url: env.VNPAY_URL,
  },
  momo: {
    tmnCode: env.MOMO_TMN_CODE,
    accessKey: env.MOMO_ACESSKEY,
    secret: env.MOMO_SECRET,
    url: env.MOMO_URL,
    returnUrl: env.MOMO_RETURN_URL,
    ipnUrl: env.MOMO_IPN_URL,
  }

};

export default configs;
