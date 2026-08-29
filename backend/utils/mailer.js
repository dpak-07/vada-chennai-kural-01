import nodemailer from 'nodemailer';

let transporter = null;

/**
 * Initialize and get Nodemailer Transporter
 */
export const getTransporter = async () => {
  if (transporter) return transporter;

  const emailHost = process.env.EMAIL_HOST;
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailPort = parseInt(process.env.EMAIL_PORT || '587', 10);
  const emailSecure = process.env.EMAIL_SECURE === 'true';

  if (emailHost && emailUser && emailPass) {
    transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
    console.log('[Mailer] Initialized SMTP transporter with host:', emailHost);
  } else {
    // Fallback in development: Create test account with Ethereal
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('[Mailer] Initialized Ethereal Test Account:', testAccount.user);
    } catch (err) {
      console.warn('[Mailer] Ethereal fallback failed, using jsonTransport:', err.message);
      transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  }

  return transporter;
};

/**
 * Send Welcome Email to a newly subscribed reader
 * @param {string} email - Subscriber email
 * @param {string} name - Subscriber name
 */
export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailer = await getTransporter();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const fromAddress = process.env.EMAIL_FROM || '"Vadachennai Kural" <no-reply@vadachennaikural.com>';
    const recipientName = name || 'வாசகரே';

    const htmlContent = `
<!DOCTYPE html>
<html lang="ta">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Vadachennai Kural</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0d12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0d0d12; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #15151c; border-radius: 16px; border: 2px solid #800020; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
          
          <!-- Top Header Strip -->
          <tr>
            <td style="background-color: #4a020e; padding: 24px 30px; text-align: center; border-bottom: 2px solid #800020;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; font-weight: bold; color: #ffffff; letter-spacing: 1px;">
                வடசென்னை குரல்
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #d4af37; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">
                Vadachennai Kural Tamil Digital Journal
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 28px 32px; background-color: #15151c;">
              <p style="font-size: 18px; color: #d4af37; font-weight: bold; margin-top: 0; margin-bottom: 16px;">
                அன்புள்ள ${recipientName},
              </p>
              
              <p style="font-size: 15px; line-height: 1.7; color: #e0e0e0; margin-bottom: 20px;">
                <strong>வடசென்னை குரல்</strong> மாதாந்திர டிஜிட்டல் இதழுக்கு தங்களை அன்போடு வரவேற்கிறோம்!
              </p>

              <div style="background-color: #20040a; border-left: 4px solid #800020; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                <p style="font-size: 14px; font-style: italic; color: #f0d0d8; margin: 0; line-height: 1.6;">
                  “வடசென்னையின் பெருமைமிகு வரலாற்றையும், கானா இசை மரபு, பாரம்பரிய குத்துச்சண்டை மற்றும் உழைக்கும் மக்களின் நெகிழ்வான வாழ்வியலையும் ஆவணப்படுத்தும் புதிய முழக்கம்.”
                </p>
              </div>

              <p style="font-size: 14px; line-height: 1.7; color: #b0b0b8; margin-bottom: 28px;">
                எங்கள் புதிய இதழ்கள் வெளிவரும் போதெல்லாம், அதன் முழு தொகுப்பும், கட்டுரைகளும் தங்களின் மின்னஞ்சல் முகவரிக்கு உடனுக்குடன் வந்து சேரும்.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 28px auto;">
                <tr>
                  <td align="center" style="border-radius: 8px; background: linear-gradient(135deg, #800020, #a00028);">
                    <a href="${frontendUrl}" target="_blank" style="font-size: 14px; font-weight: bold; font-family: sans-serif; text-decoration: none; color: #ffffff; line-height: 48px; display: inline-block; padding: 0 32px; border-radius: 8px; border: 1px solid #c02040;">
                      டிஜிட்டல் தளத்தை காண்க &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #888892; text-align: center; margin: 0;">
                நன்றி மற்றும் வாழ்த்துகளுடன்,<br>
                <strong style="color: #d4af37;">ஆசிரியர் குழு | வடசென்னை குரல்</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0b0b0e; padding: 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08);">
              <p style="font-size: 11px; color: #666672; margin: 0; line-height: 1.5;">
                &copy; ${new Date().getFullYear()} Vadachennai Kural. All rights reserved.<br>
                சென்னை, தமிழ்நாடு | <a href="${frontendUrl}" style="color: #d4af37; text-decoration: none;">vadachennaikural.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const info = await mailer.sendMail({
      from: fromAddress,
      to: email,
      subject: 'வணக்கம்! வடசென்னை குரல் டிஜிட்டல் இதழுக்கு நல்வரவு | Welcome to Vadachennai Kural',
      text: `அன்புள்ள ${recipientName}, வடசென்னை குரல் டிஜிட்டல் இதழுக்கு தங்களை அன்போடு வரவேற்கிறோம்! புதிய இதழ்கள் வெளியாகும் போது உங்களை தொடர்புகொள்வோம். தளம்: ${frontendUrl}`,
      html: htmlContent,
    });

    console.log('[Mailer] Welcome email sent successfully to:', email, 'MessageId:', info.messageId);
    if (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info)) {
      console.log('[Mailer] Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Mailer] Error sending welcome email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Broadcast New Issue Announcement Email to all active subscribers
 * @param {Array<object>} subscribers - Array of { name, email }
 * @param {object} issue - Issue data { issueId, title, titleEn, month, monthEn, date, coverImage, description, features }
 */
export const broadcastNewIssueEmail = async (subscribers, issue) => {
  try {
    if (!subscribers || subscribers.length === 0) {
      console.log('[Mailer] No subscribers to broadcast to.');
      return { success: true, count: 0 };
    }

    const mailer = await getTransporter();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const fromAddress = process.env.EMAIL_FROM || '"Vadachennai Kural" <no-reply@vadachennaikural.com>';
    const issueLink = `${frontendUrl}/issues/${issue.issueId || issue.id || 'v1-i1'}`;

    console.log(`[Mailer] Broadcasting new issue "${issue.title}" to ${subscribers.length} subscribers...`);

    const results = [];
    for (const sub of subscribers) {
      const recipientName = sub.name || 'அன்பான வாசகரே';
      const recipientEmail = sub.email;

      const htmlContent = `
<!DOCTYPE html>
<html lang="ta">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Issue Release - Vadachennai Kural</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0d12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0d0d12; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #15151c; border-radius: 16px; border: 2px solid #800020; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
          
          <!-- Top Header Strip -->
          <tr>
            <td style="background-color: #4a020e; padding: 24px 30px; text-align: center; border-bottom: 2px solid #800020;">
              <span style="display: inline-block; background-color: #800020; color: #d4af37; font-size: 10px; font-weight: bold; padding: 4px 12px; border-radius: 50px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; border: 1px solid #d4af37;">
                புதிய இதழ் வெளியீடு • NEW ISSUE RELEASE
              </span>
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; font-weight: bold; color: #ffffff;">
                வடசென்னை குரல்
              </h1>
            </td>
          </tr>

          <!-- Issue Details -->
          <tr>
            <td style="padding: 32px 30px; background-color: #15151c;">
              <p style="font-size: 16px; color: #d4af37; font-weight: bold; margin-top: 0; margin-bottom: 12px;">
                அன்புள்ள ${recipientName},
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #e0e0e0; margin-bottom: 24px;">
                வடசென்னை குரலின் புதிய இதழ் தற்போது ஆன்லைனில் வாசிக்க தயாராக உள்ளது!
              </p>

              <!-- Issue Spotlight Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #20040a; border: 1px solid #800020; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <span style="font-size: 11px; color: #d4af37; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
                      ${issue.month || 'புதிய இதழ்'}
                    </span>
                    <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: bold; color: #ffffff; margin: 6px 0 12px 0;">
                      ${issue.title}
                    </h2>
                    ${issue.titleEn ? `<p style="font-size: 13px; color: #d4af37; margin: 0 0 12px 0; font-weight: 500;">${issue.titleEn}</p>` : ''}
                    <p style="font-size: 13px; color: #cccccc; line-height: 1.6; margin: 0;">
                      ${issue.description || 'வடசென்னையின் கலாச்சாரம், கலை மற்றும் மக்களின் உண்மை வரலாற்றை ஆவணப்படுத்தும் சிறப்புத் தொகுப்பு.'}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 28px auto 28px auto;">
                <tr>
                  <td align="center" style="border-radius: 8px; background: linear-gradient(135deg, #800020, #b31336); box-shadow: 0 4px 16px rgba(128,0,32,0.5);">
                    <a href="${issueLink}" target="_blank" style="font-size: 15px; font-weight: bold; font-family: sans-serif; text-decoration: none; color: #ffffff; line-height: 48px; display: inline-block; padding: 0 36px; border-radius: 8px; border: 1px solid #ff4d6d;">
                      இதழை முழுமையாக வாசிக்க &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: #888892; text-align: center; margin: 0;">
                நேரடி இணைப்பு: <a href="${issueLink}" style="color: #d4af37;">${issueLink}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0b0b0e; padding: 18px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08);">
              <p style="font-size: 11px; color: #666672; margin: 0;">
                &copy; ${new Date().getFullYear()} Vadachennai Kural Tamil Digital Journal.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

      try {
        const info = await mailer.sendMail({
          from: fromAddress,
          to: recipientEmail,
          subject: `புதிய இதழ் வெளியீடு: ${issue.title} | Vadachennai Kural`,
          text: `வணக்கம் ${recipientName}, வடசென்னை குரலின் புதிய இதழ் வெளியானது: ${issue.title}. இதழை வாசிக்க: ${issueLink}`,
          html: htmlContent,
        });
        results.push({ email: recipientEmail, status: 'sent', messageId: info.messageId });
      } catch (err) {
        console.error(`[Mailer] Failed sending to ${recipientEmail}:`, err.message);
        results.push({ email: recipientEmail, status: 'failed', error: err.message });
      }
    }

    return { success: true, count: results.filter(r => r.status === 'sent').length, details: results };
  } catch (error) {
    console.error('[Mailer] Error in broadcastNewIssueEmail:', error.message);
    return { success: false, error: error.message };
  }
};