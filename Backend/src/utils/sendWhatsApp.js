import axios from "axios";

const sendWhatsApp = async ({ to, message }) => {
    const url = `https://graph.facebook.com/v18.0/${process.env.WA_PHONE_ID}/messages`;

    try {
        const res = await axios.post(
            url,
            {
                messaging_product: "whatsapp",
                to: to, // 91XXXXXXXXXX
                type: "text",
                text: {
                    body: message,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return res.data;
    } catch (error) {
        console.error(
            "WhatsApp Error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export default sendWhatsApp;
