import axios from 'axios';
import Razorpay from 'razorpay';

// 1. Setup Razorpay Credentials (Use .env in production!)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const syncRazorpayPayment = async (razorpayPaymentId: string) => {
    try {
        // 2. Fetch the "Raw" data from Razorpay's Servers
        const payment = await razorpay.payments.fetch(razorpayPaymentId);

        // 3. Translate Razorpay data to YOUR standard format
        const standardizedData = {
            paymentId: payment.id,
            orderId: payment.order_id,
            amount: Number(payment.amount) / 100, // Razorpay uses paise; we want INR
            currency: payment.currency,
            status: payment.status === 'captured' ? 'Succeeded' : 'Failed',
            method: payment.method, // 'upi', 'card', 'netbanking'
            platform: 'Razorpay',
            secret: 'your_super_secret_key' // MUST match the secret in payment.ts
        };

        // 4. THE CONNECTION: Send the translated data to payment.ts
        // We use 'localhost' because both scripts are running on your machine
        const response = await axios.post('http://localhost:5000/api/payments/record', standardizedData);

        console.log('Successfully synced to data.json:', response.data);
    } catch (error) {
        console.error('Razorpay Sync Error:', error);
    }
};