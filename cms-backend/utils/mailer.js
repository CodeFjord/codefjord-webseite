import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // true für 465, false für andere Ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// E-Mail-Template für Admin-Benachrichtigung bei neuer Kontaktanfrage
export const createAdminNotificationEmail = (contactMessage) => ({
  from: `"CodeFjord Website" <${process.env.SMTP_USER}>`,
  to: process.env.ADMIN_EMAIL,
  subject: `Neue Kontaktanfrage von ${contactMessage.name}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Neue Kontaktanfrage erhalten</h2>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Von:</strong> ${contactMessage.name}</p>
        <p><strong>E-Mail:</strong> ${contactMessage.email}</p>
        <p><strong>Betreff:</strong> ${contactMessage.subject}</p>
        <p><strong>Nachricht:</strong></p>
        <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
          ${contactMessage.message.replace(/\n/g, '<br>')}
        </div>
      </div>
      <p style="color: #666; font-size: 14px;">
        Diese Nachricht wurde automatisch vom CodeFjord CMS generiert.
      </p>
    </div>
  `
});

// E-Mail-Template für Eingangsbestätigung an den Absender
export const createConfirmationEmail = (contactMessage) => ({
  from: `"CodeFjord" <${process.env.SMTP_USER}>`,
  to: contactMessage.email,
  subject: `Bestätigung Ihrer Nachricht: ${contactMessage.subject}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Vielen Dank für Ihre Nachricht!</h2>
      <p>Hallo ${contactMessage.name},</p>
      <p>wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Ihre Nachricht:</h3>
        <p><strong>Betreff:</strong> ${contactMessage.subject}</p>
        <p><strong>Nachricht:</strong></p>
        <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
          ${contactMessage.message.replace(/\n/g, '<br>')}
        </div>
      </div>
      
      <p>Mit freundlichen Grüßen,<br>Ihr CodeFjord Team</p>
    </div>
  `
});

// E-Mail-Template für Admin-Antwort an den Absender
export const createReplyEmail = (contactMessage, adminReply) => ({
  from: `"CodeFjord" <${process.env.SMTP_USER}>`,
  to: contactMessage.email,
  subject: `Re: ${contactMessage.subject}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Antwort auf Ihre Nachricht</h2>
      <p>Hallo ${contactMessage.name},</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Ihre ursprüngliche Nachricht:</h3>
        <p><strong>Betreff:</strong> ${contactMessage.subject}</p>
        <p><strong>Nachricht:</strong></p>
        <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
          ${contactMessage.message.replace(/\n/g, '<br>')}
        </div>
      </div>
      
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Unsere Antwort:</h3>
        <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
          ${adminReply.replace(/\n/g, '<br>')}
        </div>
      </div>
      
      <p>Mit freundlichen Grüßen,<br>Ihr CodeFjord Team</p>
    </div>
  `
});

// E-Mail-Template für Passwort-Reset
export const createPasswordResetEmail = (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  return {
    from: `"CodeFjord Admin" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: 'Passwort zurücksetzen - CodeFjord Admin',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Passwort zurücksetzen</h2>
        <p>Hallo ${user.name},</p>
        <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts für das CodeFjord Admin-Panel gestellt.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen:</strong></p>
          <a href="${resetUrl}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0;">
            Passwort zurücksetzen
          </a>
          <p style="margin-top: 15px; font-size: 14px; color: #666;">
            Oder kopieren Sie diesen Link in Ihren Browser:<br>
            <a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a>
          </p>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 0; font-size: 14px;">
            <strong>Wichtig:</strong> Dieser Link ist nur 1 Stunde gültig. Wenn Sie diese E-Mail nicht angefordert haben, können Sie sie ignorieren.
          </p>
        </div>
        
        <p>Mit freundlichen Grüßen,<br>Ihr CodeFjord Team</p>
      </div>
    `
  };
};

// E-Mail senden
export const sendEmail = async (emailOptions) => {
  try {
    const info = await transporter.sendMail(emailOptions);
    console.log('E-Mail erfolgreich gesendet:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Fehler beim E-Mail-Versand:', error);
    return { success: false, error: error.message };
  }
};

// SMTP-Verbindung testen
export const testConnection = async () => {
  try {
    await transporter.verify();
    console.log('SMTP-Verbindung erfolgreich getestet');
    return true;
  } catch (error) {
    console.error('SMTP-Verbindungstest fehlgeschlagen:', error);
    return false;
  }
}; 