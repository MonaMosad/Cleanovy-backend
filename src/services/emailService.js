  const nodemailer = require("nodemailer");
const logger = require("../config/logger");

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// ─── Email HTML Template ──────────────────────────────────────────────────────
const baseTemplate = (title, content) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Cairo',sans-serif; background:#f0f4f8; direction:rtl; }
    .wrapper { padding:40px 16px; }
    .container { max-width:580px; margin:0 auto; background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 8px 32px rgba(0,0,0,0.10); }
    .header { background:linear-gradient(135deg,#1a73e8 0%,#00c4a0 100%); padding:40px 32px; text-align:center; position:relative; }
    .header::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:24px; background:#fff; border-radius:24px 24px 0 0; }
    .logo { font-size:32px; font-weight:700; color:#fff; letter-spacing:1px; margin-bottom:4px; }
    .logo span { color:#ffffffcc; font-size:14px; font-weight:400; display:block; margin-top:4px; }
    .body { padding:36px 32px 28px; }
    .body h2 { color:#1a1a2e; font-size:22px; font-weight:700; margin-bottom:16px; }
    .body p { color:#555; font-size:15px; line-height:1.8; margin-bottom:12px; }
    .btn-wrapper { text-align:center; margin:28px 0; }
    .btn { display:inline-block; background:linear-gradient(135deg,#1a73e8,#00c4a0); color:#fff !important; padding:15px 40px; border-radius:50px; text-decoration:none; font-weight:700; font-size:16px; letter-spacing:0.5px; box-shadow:0 4px 16px rgba(26,115,232,0.3); }
    .divider { height:1px; background:#f0f0f0; margin:24px 0; }
    .note { background:#f8faff; border-right:4px solid #1a73e8; padding:12px 16px; border-radius:0 8px 8px 0; color:#666; font-size:13px; line-height:1.7; }
    .footer { background:#f8faff; padding:20px 32px; text-align:center; border-top:1px solid #f0f0f0; }
    .footer p { color:#999; font-size:13px; line-height:1.8; }
    .footer a { color:#1a73e8; text-decoration:none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">Cleanovy<span>خدمات الغسيل الذكية</span></div>
      </div>
      <div class="body">
        <h2>${title}</h2>
        ${content}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Cleanovy &mdash; جميع الحقوق محفوظة</p>
        <p>هل تواجه مشكلة؟ <a href="mailto:support@cleanovy.com">تواصل مع الدعم الفني</a></p>
      </div>
    </div>
  </div>
</body>
</html>
`;

// ─── Verification Success Page (HTML) ────────────────────────────────────────
const verificationSuccessPage = (name) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>تم تأكيد البريد الإلكتروني - Cleanovy</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Cairo',sans-serif; background:linear-gradient(135deg,#667eea 0%,#00c4a0 100%); min-height:100vh; display:flex; align-items:center; justify-content:center; direction:rtl; padding:20px; }
    .card { background:#fff; border-radius:24px; padding:48px 40px; max-width:480px; width:100%; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.15); }
    .icon-wrap { width:90px; height:90px; background:linear-gradient(135deg,#1a73e8,#00c4a0); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 28px; box-shadow:0 8px 24px rgba(26,115,232,0.35); }
    .icon-wrap svg { width:44px; height:44px; }
    .brand { font-size:26px; font-weight:800; background:linear-gradient(135deg,#1a73e8,#00c4a0); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:8px; }
    h1 { color:#1a1a2e; font-size:24px; font-weight:700; margin-bottom:12px; }
    .greeting { color:#444; font-size:16px; margin-bottom:8px; }
    p { color:#777; font-size:15px; line-height:1.8; margin-bottom:24px; }
    .badge { display:inline-flex; align-items:center; gap:6px; background:#e8f5e9; color:#2e7d32; padding:8px 20px; border-radius:50px; font-size:14px; font-weight:600; margin-bottom:28px; }
    .badge::before { content:'✓'; font-size:16px; }
    .btn { display:inline-block; background:linear-gradient(135deg,#1a73e8,#00c4a0); color:#fff; padding:14px 36px; border-radius:50px; text-decoration:none; font-weight:700; font-size:16px; box-shadow:0 4px 16px rgba(26,115,232,0.3); transition:transform 0.2s; }
    .btn:hover { transform:translateY(-2px); }
    .footer-note { margin-top:24px; color:#bbb; font-size:13px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-wrap">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="brand">Cleanovy</div>
    <h1>تم تأكيد بريدك الإلكتروني!</h1>
    ${name ? `<p class="greeting">أهلاً <strong>${name}</strong> 👋</p>` : ""}
    <p>حسابك مفعّل الآن بنجاح. يمكنك تسجيل الدخول والاستمتاع بخدمات الغسيل الذكية.</p>
    <div class="badge">تم التحقق بنجاح</div>
    <br/>
    <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/login" class="btn">
      تسجيل الدخول الآن
    </a>
    <p class="footer-note">© ${new Date().getFullYear()} Cleanovy &mdash; جميع الحقوق محفوظة</p>
  </div>
</body>
</html>
`;

// ─── Verification Error Page (HTML) ──────────────────────────────────────────
const verificationErrorPage = (message) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>خطأ في التحقق - Cleanovy</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Cairo',sans-serif; background:linear-gradient(135deg,#f5576c 0%,#f093fb 100%); min-height:100vh; display:flex; align-items:center; justify-content:center; direction:rtl; padding:20px; }
    .card { background:#fff; border-radius:24px; padding:48px 40px; max-width:480px; width:100%; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.15); }
    .icon-wrap { width:90px; height:90px; background:linear-gradient(135deg,#f5576c,#f093fb); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 28px; box-shadow:0 8px 24px rgba(245,87,108,0.35); }
    .icon-wrap svg { width:44px; height:44px; }
    .brand { font-size:26px; font-weight:800; background:linear-gradient(135deg,#1a73e8,#00c4a0); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:8px; }
    h1 { color:#1a1a2e; font-size:22px; font-weight:700; margin-bottom:12px; }
    p { color:#777; font-size:15px; line-height:1.8; margin-bottom:24px; }
    .btn { display:inline-block; background:linear-gradient(135deg,#1a73e8,#00c4a0); color:#fff; padding:14px 36px; border-radius:50px; text-decoration:none; font-weight:700; font-size:16px; }
    .footer-note { margin-top:24px; color:#bbb; font-size:13px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-wrap">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="brand">Cleanovy</div>
    <h1>رابط التحقق غير صالح</h1>
    <p>${message || "هذا الرابط منتهي الصلاحية أو غير صالح. يرجى طلب رابط تحقق جديد."}</p>
    <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/login" class="btn">
      العودة لتسجيل الدخول
    </a>
    <p class="footer-note">© ${new Date().getFullYear()} Cleanovy &mdash; جميع الحقوق محفوظة</p>
  </div>
</body>
</html>
`;

// ─── Core send function ───────────────────────────────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info("✅ SMTP connection verified");

    const info = await transporter.sendMail({
      from: `"Cleanovy" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    logger.info(`📧 Email sent to ${to} — ID: ${info.messageId}`);
    return info;
  } catch (err) {
    logger.error(`❌ Email send failed to ${to}: ${err.message}`);
    throw new Error("فشل في إرسال البريد الإلكتروني");
  }
};

// ─── Send Verification Email ──────────────────────────────────────────────────
const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${process.env.BASE_URL}/api/v1/auth/verify-email/${token}`;
  const content = `
    <p>مرحباً <strong>${user.fullName}</strong>،</p>
    <p>شكراً لتسجيلك في منصة <strong>Cleanovy</strong>. خطوة واحدة تفصلك عن تفعيل حسابك!</p>
    <div class="btn-wrapper">
      <a href="${verifyUrl}" class="btn">تأكيد البريد الإلكتروني</a>
    </div>
    <div class="divider"></div>
    <div class="note">⏱ هذا الرابط صالح لمدة <strong>24 ساعة</strong> فقط. إذا لم تقم بهذا الطلب، يمكنك تجاهل هذا البريد بأمان.</div>
  `;
  await sendEmail({
    to: user.email,
    subject: "✅ تأكيد البريد الإلكتروني - Cleanovy",
    html: baseTemplate("تأكيد بريدك الإلكتروني", content),
  });
};

// ─── Send Password Reset Email ────────────────────────────────────────────────
const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const content = `
    <p>مرحباً <strong>${user.fullName}</strong>،</p>
    <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك على <strong>Cleanovy</strong>.</p>
    <div class="btn-wrapper">
      <a href="${resetUrl}" class="btn">إعادة تعيين كلمة المرور</a>
    </div>
    <div class="divider"></div>
    <div class="note">⏱ هذا الرابط صالح لمدة <strong>ساعة واحدة</strong> فقط. إذا لم تطلب هذا، يرجى تجاهل هذا البريد وحسابك بأمان تام.</div>
  `;
  await sendEmail({
    to: user.email,
    subject: "🔑 إعادة تعيين كلمة المرور - Cleanovy",
    html: baseTemplate("إعادة تعيين كلمة المرور", content),
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  verificationSuccessPage,
  verificationErrorPage,
};