const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({   
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendemail=async(to,firstName,otp)=>{
    await transporter.sendMail({
        from: process.env.EMAIL_USER,      
        to: to,
        subject: "OTP for GrowwGym Account Verification",
        html: `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px;">
        <h2 style="color: #22c55e; margin-bottom: 8px;">Welcome to GrowwGym, ${firstName}!</h2>
        <p style="color: #cbd5e1;">Use the 6-digit verification code below to activate your account. This code expires in <strong>10 minutes</strong>.</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 16px; margin: 20px 0; background: #1e293b; color: #22c55e; border-radius: 8px;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #64748b;">If you didn't create a GrowwGym account, you can safely ignore this email.</p>
      </div></p>`
    });
};
module.exports = sendemail;