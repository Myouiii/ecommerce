# How to run

- Please set environment variables before run.
  |Name            |Require |Description                   |Default                              |
  |----------------|--------|------------------------------|-------------------------------------|
  |PORT            | ❌     | Port to running server       | 3001                                |
  |MONGO_URI       | ✔      | Connect string to MongoDb    |                                     |
  |MONGO_URI_ONLINE|: |mongodb+srv://abcdefghijklmnopqrstuvwxyz,
  |JWT_SECRET|: |S3cr3tK3y|,
  |JWT_EXPIRES_IN|: |1d|,
  |JWT_REFRESH_EXPIRES_IN|: |30d|,
  
  |VNPAY_SECRET|: |AEYSBINOKBQOGOKLVHCSWPLDWWCVHOLZ|,
  |VNPAY_TMN_CODE|: |ABCD|,
  |VNPAY_URL|: |https://sandbox.vnpayment.vn/paymentv2/vpcpay.html|,
  
  |MOMO_TMN_CODE|: |ABCD|,
  |MOMO_ACESSKEY|: |ABCD|,
  |MOMO_SECRET|: |ABCD|,
  |MOMO_URL|: |https://test-payment.momo.vn/v2/gateway/api/create|,
  |MOMO_RETURN_URL|: |http://localhost:3001/api/v1/payment/momo|,
  |MOMO_IPN_URL|: |http://localhost:3001/api/v1/payment/momo-ipn|,

  |FIREBASE_PROJECT_ID|: |ABCD|,
  |FIREBASE_PRIVATE_KEY|: |ABCD|,
  |FIREBASE_CLIENT_EMAIL|: |ABCD|,
  |GOOGLE_CLIENT_ID|: |ABCD|,
  |GOOGLE_CLIENT_ID_MOBILE|: |ABCD|,
  |GOOGLE_CLIENT_SECRET|: |ABCD|,
  |MAILER_AUTH_USER|: |ABCD|,
  |MAILER_AUTH_PASS|: |ABCD|
- Run server by command:
  ```bash
  npm i && npm run start
