import ngrok from 'ngrok';
import QRCode from 'qrcode';
import dotenv from 'dotenv';

// Load environment variables for the Authtoken
dotenv.config();

interface RemoteAccessData {
    url: string;
    qrCode: string;
}

/**
 * Automates the Ngrok tunnel and generates a QR code for mobile connection.
 * @param port The local port your Express server is running on (e.g., 5000)
 */
export const initializeRemoteAccess = async (port: string | number): Promise<RemoteAccessData | null> => {
    try {
        // 1. Validate Authtoken (Essential for stable connections)
        const authtoken = process.env.NGROK_AUTHTOKEN;
        if (!authtoken) {
            console.warn('⚠️ [Tunnel] No NGROK_AUTHTOKEN found in .env. Tunnel may expire quickly.');
        }

        // 2. Start the Ngrok Tunnel
        const url = await ngrok.connect({
            addr: port,
            authtoken: authtoken,
            region: 'in', // Optimized for India (Chennai/Tamil Nadu area)
        });

        console.log(`🚀 [Tunnel] Public access established at: ${url}`);

        // 3. Generate QR Code from the Tunnel URL
        // We use a high error correction level (H) to ensure it scans even on low-res cameras
        const qrCode = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'H',
            margin: 2,
            scale: 10,
        });

        return { url, qrCode };

    } catch (error: any) {
        console.error('❌ [Tunnel] Failed to initialize remote access:', error.message);
        return null;
    }
};

/**
 * Gracefully shuts down the tunnel when the server stops
 */
export const stopRemoteAccess = async () => {
    await ngrok.kill();
    console.log('🛑 [Tunnel] Remote access tunnel closed.');
};