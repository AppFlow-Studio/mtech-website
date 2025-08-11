'use server'

const appid = process.env.VALORPAY_APPID;
const appkey = process.env.VALORPAY_APPKEY;
const epi = process.env.VALORPAY_EPI;

const TESTCARDINFO = {
    cardnumber: '4012000098765439',
    expirydate: '1226',
    cvv: 999,
    cardholdername: 'John Doe'
}
export async function captureSale(
    orderId: string,
    amount: number,
    orderName: string,
    cardInfo: {
        cardnumber: string,
        expirydate: string,
        cvv: number,
        cardholdername: string,
    }) {
    // Capture the sale on card -- If Valid -- Update the order status to store the transaction id
    if (!appid || !appkey || !epi) {
        throw new Error('ValorPay credentials are not set');
    }

    if (!cardInfo.cardnumber || !cardInfo.expirydate || !cardInfo.cvv || !cardInfo.cardholdername) {
        throw new Error('Card information is not complete');
    }

    console.log(appid, appkey, epi)
    const url = 'https://securelink-staging.valorpaytech.com:4430/?sale=';
    const options = {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json' },
        body: JSON.stringify({
            appid: appid,
            appkey: appkey,
            epi: epi,
            txn_type: 'auth',
            amount: amount,
            cardnumber: TESTCARDINFO.cardnumber,
            expirydate: TESTCARDINFO.expirydate,
            cvv: TESTCARDINFO.cvv,
            cardholdername: TESTCARDINFO.cardholdername,
            orderdescription: orderName,
            surchargeIndicator: 0,
            shipping_country: 'US',
            surchargeAmount: 10.2,
            address1: '2 Jericho Plz',
            city: 'Jericho',
            state: 'NY',
            billing_country: 'US',
            zip: '50001'

        })
    };

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.status === 200) {
        console.log(data)
        return data
    } else {
        console.log(data)
        return new Error(data.message)
    }

}               