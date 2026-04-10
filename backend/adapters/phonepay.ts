import axios from 'axios';

// This function would be triggered by a cron job or a webhook
export const syncPhonePePayments = async () => {
    try {
        // 1. Fetch data from PhonePe API
        const response = await axios.get('https://api.phonepe.com/v3/payments', {
            headers: { 'Authorization': 'Bearer YOUR_PHONEPE_SDK_KEY' }
        });

        const rawData = response.data;

        // 2. Loop through and "Translate" to your format
        const formattedData = {
            paymentId: rawData.transactionId,
            amount: rawData.amount / 100, // Convert paise to INR
            status: rawData.state === 'COMPLETED' ? 'Succeeded' : 'Pending',
            platform: 'PhonePe',
            method: 'UPI',
            secret: process.env.PAYMENT_SECRET // The secret required by your payment.ts
        };

        // 3. SEND it to your payment.ts internal API
        await axios.post(`${process.env.API_URL}/api/payments/record`, formattedData);

        console.log('PhonePe data synced successfully!');
    } catch (error) {
        console.error('PhonePe Sync Failed:', error);
    }
};