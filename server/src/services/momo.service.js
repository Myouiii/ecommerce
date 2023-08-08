import crypto from 'crypto';
import queryString from 'query-string';
import dateFormat from 'dateformat';
import configs from '../configs.js';
import https from 'https'
const tmnCode = configs.momo.tmnCode;
const accessKey = configs.momo.accessKey;
const secretKey = configs.momo.secret;
const vnpUrl = configs.momo.url;
const returnUrl = configs.momo.returnUrl;
const ipnUrl = configs.momo.ipnUrl;

export default {
    createPaymentUrl,
    checkPaymentStatus,
};

async function createPaymentUrl(ipAddress, apiUrl, clientUrl, orderID, orderPayAmount, language = 'vn', bankCode = '') {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
    var orderInfo = queryString.stringify({ orderId: orderID, clientUrl }, { encode: false });
    var partnerCode = tmnCode;
    var redirectUrl = returnUrl;
    var orderId = partnerCode + new Date().getTime();
    var amount = orderPayAmount;
    // var requestType = 'captureWallet';
    // var requestType = 'payWithATM';
    var requestType = 'payWithMethod';
    var requestId = orderId;
    var extraData = '';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';
    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    // const requestBody = JSON.stringify({
    //     partnerCode: partnerCode,
    //     accessKey: accessKey,
    //     requestId: requestId,
    //     amount: amount,
    //     orderId: orderId,
    //     orderInfo: orderInfo,
    //     redirectUrl: redirectUrl,
    //     ipnUrl: ipnUrl,
    //     extraData: extraData,
    //     requestType: requestType,
    //     signature: signature,
    //     lang: lang
    // });
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: 'ATM LOCMOBILE',
        storeId: 'LOCMOBILESTORE',
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature
    });
    //Create the HTTPS objects
    const options = {
        // hostname: 'test-payment.momo.vn',
        // port: 443,
        // path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    }
    let result;
    //Send the request and get the response
    return new Promise((resolve, reject) => {
        const req = https.request(vnpUrl, options, (res) => {
            console.log(`Status: ${res.statusCode}`);
            console.log(`Headers: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (body) => {
                console.log('Body: ');
                console.log(body);
                console.log('resultCode: ', JSON.parse(body).resultCode);

                result = JSON.parse(body);
            });
            res.on('end', () => {
                console.log('No more data in response.');
                resolve(result);
            });
        })

        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
            reject(e);
        });
        // write data to request body
        console.log("Sending....")
        req.write(requestBody);
        req.end();
    });
}

async function checkPaymentStatus(momoResponse) {
    let momo_Params = momoResponse;
    console.log('momoResponse: ', momoResponse);
    const { orderId, clientUrl } = queryString.parse(momo_Params['orderInfo']);
    let isSuccess = false, message = 'Payment failed';

    if (momoResponse.resultCode === '0') {
        const amount = momo_Params['amount'];
        const partnerCode = momo_Params['partnerCode'];
        const IdPayment = momo_Params['orderId'];
        const orderType = momo_Params['orderType'];
        const transId = momo_Params['transId'];
        const payType = momo_Params['payType'];
        const payDate = momo_Params['responseTime']; // yyyyMMddHHmmss

        isSuccess = true;
        message = momoResponse.message || 'Payment success';

        return {
            isSuccess,
            data: {
                clientUrl,
                amount, partnerCode, IdPayment, orderType, payType,
                orderId, transId, payDate
            },
            message
        }
    } else {
        return {
            isSuccess: false,
            data: { clientUrl, orderId },
            message: momoResponse.message,
        }
    }
}
