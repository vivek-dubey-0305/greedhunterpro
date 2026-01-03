// import nodemailer from "nodemailer";

// const sendEmail = async (options) => {
//     const transporter = nodemailer.createTransporter({
//         host: process.env.SMTP_HOST,
//         port: process.env.SMTP_PORT,
//         service: process.env.SMTP_SERVICE,
//         auth: {
//             user: process.env.SMTP_MAIL,
//             pass: process.env.SMTP_PASSWORD,
//         },
//     });

//     const mailOptions = {
//         from: process.env.SMTP_MAIL,
//         to: options.email,
//         subject: options.subject,
//         html: options.message,
//     };

//     await transporter.sendMail(mailOptions);
// };

// export { sendEmail };
import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
    // Create transporter manually (do NOT use `service:` for Gmail)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,       // smtp.gmail.com
        port: Number(process.env.SMTP_PORT), // 465
        secure: true, // MUST be true for port 465
        auth: {
            user: process.env.SMTP_MAIL,      // your gmail
            pass: process.env.SMTP_PASSWORD,  // app password
        },
        tls: {
            rejectUnauthorized: false, // important for Render/Vercel SSL handshake
        },
    });

    const mailOptions = {
        from: `"GNCIPL" <${process.env.SMTP_MAIL}>`,
        to: email,
        subject,
        html: message,
        headers: {
            "X-Priority": "3",
            "X-Mailer": "Nodemailer",
            "List-Unsubscribe": `<mailto:${process.env.SMTP_MAIL}>`,
        },
    };

    try {
        // verify SMTP connection before sending
        await transporter.verify();
        console.log("SMTP ready → connection successful");

        const result = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", result);
        return result;

    } catch (error) {
        console.error("EMAIL SEND FAILED =>", error);
        throw new Error(`Failed to send email → ${error.message}`);
    }
};