import transporter from "../config/mail.js";

const sendEmail = async (to, name) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: 'Welcome to DriveNow',
            html: `<h1>Welcome ${name}</h1>`,
        });
        console.log("MAIL RESPONSE:", info.response);

    } catch (error) {
        console.log("MAIL ERROR:", error);
        throw error;
    }
};

export default sendEmail;