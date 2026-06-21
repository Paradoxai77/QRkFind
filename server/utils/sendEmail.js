const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send a "Someone found your item" email to the owner.
 * @param {Object} params
 * @param {string} params.ownerEmail
 * @param {string} params.ownerName
 * @param {string} params.itemName
 * @param {string} params.finderName
 * @param {string} params.finderPhone
 * @param {string} params.finderEmail
 * @param {string} params.message
 * @param {Object|null} params.location — { lat, lng } or null
 * @param {string} params.timestamp
 * @param {string} params.dashboardUrl
 */
const sendFoundItemEmail = async ({
  ownerEmail,
  ownerName,
  itemName,
  finderName,
  finderPhone,
  finderEmail,
  message,
  location,
  timestamp,
  dashboardUrl,
}) => {
  const locationText =
    location && location.lat && location.lng
      ? `<a href="https://www.google.com/maps?q=${location.lat},${location.lng}" style="color:#2563EB;">View on Google Maps (${location.lat.toFixed(5)}, ${location.lng.toFixed(5)})</a>`
      : 'Not provided';

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Someone Found Your Item!</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563EB,#1D4ED8);padding:40px 40px 30px;text-align:center;">
              <div style="font-size:40px;margin-bottom:12px;">🔍</div>
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Someone Found Your Item!</h1>
              <p style="color:#BFDBFE;margin:8px 0 0;font-size:15px;">Great news — your item has been spotted.</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px;">
                Hi <strong>${ownerName}</strong>,
              </p>
              <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 28px;">
                Someone found your item: <strong style="color:#2563EB;">${itemName}</strong>. Here are their details:
              </p>

              <!-- Info Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;border-radius:12px;padding:24px;margin-bottom:28px;">
                <tr><td style="padding:8px 0;">
                  <span style="color:#64748B;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Finder's Name</span><br/>
                  <span style="color:#0F172A;font-size:16px;font-weight:500;">${finderName}</span>
                </td></tr>
                <tr><td style="padding:8px 0;border-top:1px solid #E2E8F0;">
                  <span style="color:#64748B;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Phone</span><br/>
                  <span style="color:#0F172A;font-size:16px;font-weight:500;">${finderPhone}</span>
                </td></tr>
                <tr><td style="padding:8px 0;border-top:1px solid #E2E8F0;">
                  <span style="color:#64748B;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Email</span><br/>
                  <span style="color:#0F172A;font-size:16px;font-weight:500;">${finderEmail || 'Not provided'}</span>
                </td></tr>
                <tr><td style="padding:8px 0;border-top:1px solid #E2E8F0;">
                  <span style="color:#64748B;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Message</span><br/>
                  <span style="color:#0F172A;font-size:16px;font-style:italic;">"${message || 'No message provided'}"</span>
                </td></tr>
                <tr><td style="padding:8px 0;border-top:1px solid #E2E8F0;">
                  <span style="color:#64748B;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Location</span><br/>
                  <span style="color:#0F172A;font-size:15px;">${locationText}</span>
                </td></tr>
                <tr><td style="padding:8px 0;border-top:1px solid #E2E8F0;">
                  <span style="color:#64748B;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Time Reported</span><br/>
                  <span style="color:#0F172A;font-size:16px;">${timestamp}</span>
                </td></tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${dashboardUrl}" style="display:inline-block;background:linear-gradient(135deg,#2563EB,#1D4ED8);color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:14px 36px;border-radius:10px;letter-spacing:0.2px;">View Dashboard →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC;padding:24px 40px;text-align:center;border-top:1px solid #E2E8F0;">
              <p style="color:#94A3B8;font-size:13px;margin:0;">— The FindIt Team · Never Lose Your Things Again</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"FindIt" <${process.env.EMAIL_USER}>`,
    to: ownerEmail,
    subject: `🔍 Someone Found Your ${itemName}!`,
    html: htmlBody,
  });
};

module.exports = { sendFoundItemEmail };
