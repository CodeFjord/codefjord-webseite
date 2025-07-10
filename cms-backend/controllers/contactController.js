import ContactMessage from '../models/ContactMessage.js';
import { 
  sendEmail, 
  createAdminNotificationEmail, 
  createConfirmationEmail, 
  createReplyEmail 
} from '../utils/mailer.js';
import { createNotification } from './notificationController.js';

export const getAll = async (req, res) => {
  try {
    const items = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden.' });
  }
};

export const getOne = async (req, res) => {
  try {
    const item = await ContactMessage.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Nicht gefunden.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden.' });
  }
};

export const remove = async (req, res) => {
  try {
    const item = await ContactMessage.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Nicht gefunden.' });
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Löschen.' });
  }
};

// PATCH /contact/:id
export const update = async (req, res) => {
  try {
    const item = await ContactMessage.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Nicht gefunden.' });
    const { status, adminReply } = req.body;
    if (status) item.status = status;
    if (adminReply !== undefined) item.adminReply = adminReply;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Aktualisieren.' });
  }
};

// POST /contact/reply/:id
export const reply = async (req, res) => {
  try {
    const item = await ContactMessage.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Nicht gefunden.' });
    const { replyText } = req.body;
    
    // E-Mail-Antwort an den Absender senden
    const replyEmail = createReplyEmail(item, replyText);
    const emailResult = await sendEmail(replyEmail);
    
    if (emailResult.success) {
      // Status und Antwort in der DB speichern
      item.adminReply = replyText;
      item.status = 'beantwortet';
      await item.save();
      
      res.json({ 
        success: true, 
        item,
        emailSent: true,
        messageId: emailResult.messageId
      });
    } else {
      res.status(500).json({ 
        error: 'E-Mail konnte nicht gesendet werden.',
        emailError: emailResult.error
      });
    }
  } catch (err) {
    console.error('Fehler beim Antworten:', err);
    res.status(500).json({ error: 'Fehler beim Antworten.' });
  }
};

export const create = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, E-Mail und Nachricht sind erforderlich.' });
    }
    
    // Kontaktanfrage in DB speichern
    const item = await ContactMessage.create({ 
      name, 
      email, 
      subject: subject || 'Kontaktanfrage', 
      message, 
      status: 'neu' 
    });
    
    // Admin-Benachrichtigung senden
    const adminEmail = createAdminNotificationEmail(item);
    const adminEmailResult = await sendEmail(adminEmail);
    
    // Eingangsbestätigung an Absender senden
    const confirmationEmail = createConfirmationEmail(item);
    const confirmationResult = await sendEmail(confirmationEmail);
    
    // Benachrichtigung im Admin-Panel erstellen
    try {
      await createNotification(
        'contact',
        'Neue Kontaktanfrage',
        `Eine neue Kontaktanfrage von ${name} (${email}) wurde eingegangen.`,
        { 
          contactId: item.id, 
          name: name,
          email: email,
          subject: item.subject 
        },
        'high',
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 Tage
      );
    } catch (notificationError) {
      console.error('Fehler beim Erstellen der Benachrichtigung:', notificationError);
    }
    
    res.status(201).json({ 
      success: true, 
      item,
      adminNotificationSent: adminEmailResult.success,
      confirmationSent: confirmationResult.success,
      emailErrors: {
        admin: adminEmailResult.success ? null : adminEmailResult.error,
        confirmation: confirmationResult.success ? null : confirmationResult.error
      }
    });
  } catch (err) {
    console.error('Fehler beim Erstellen der Kontaktanfrage:', err);
    res.status(500).json({ error: 'Fehler beim Absenden.' });
  }
}; 