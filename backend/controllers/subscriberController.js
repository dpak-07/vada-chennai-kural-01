import Subscriber from '../models/Subscriber.js';
import { sendWelcomeEmail, broadcastNewIssueEmail } from '../utils/mailer.js';

let localSubscribers = [];

/**
 * @desc    Subscribe to email updates
 * @route   POST /api/subscribers/subscribe
 * @access  Public
 */
export const subscribe = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your name (பெயர் தேவை).' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your email address (மின்னஞ்சல் தேவை).' });
    }

    const trimmedName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    let subscriber = null;
    let isNew = false;

    try {
      subscriber = await Subscriber.findOne({ email: cleanEmail });

      if (subscriber) {
        if (!subscriber.isActive) {
          subscriber.isActive = true;
          subscriber.name = trimmedName;
          await subscriber.save();
          isNew = true;
        } else {
          return res.status(200).json({
            success: true,
            alreadySubscribed: true,
            message: 'You are already subscribed to Vadachennai Kural! (தாங்கள் ஏற்கனவே சந்தா பெற்றுள்ளீர்கள்).',
            subscriber,
          });
        }
      } else {
        subscriber = await Subscriber.create({
          name: trimmedName,
          email: cleanEmail,
          isActive: true,
        });
        isNew = true;
      }
    } catch (dbError) {
      console.warn('[Subscriber] MongoDB fallback to memory store:', dbError.message);
      const existing = localSubscribers.find(s => s.email === cleanEmail);
      if (existing) {
        return res.status(200).json({
          success: true,
          alreadySubscribed: true,
          message: 'You are already subscribed to Vadachennai Kural!',
          subscriber: existing,
        });
      }
      subscriber = { name: trimmedName, email: cleanEmail, isActive: true, subscribedAt: new Date() };
      localSubscribers.push(subscriber);
      isNew = true;
    }

    // Send Welcome Email asynchronously
    sendWelcomeEmail(cleanEmail, trimmedName).catch(err => {
      console.error('[Subscriber] Error sending welcome email async:', err.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Subscription successful! A welcome email has been sent to your inbox. (சந்தா பதிவு வெற்றிகரமாக முடிந்தது).',
      subscriber,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error processing subscription' });
  }
};

/**
 * @desc    Get all active subscribers
 * @route   GET /api/subscribers
 * @access  Private / Admin
 */
export const getSubscribers = async (req, res) => {
  try {
    let subscribers = [];
    try {
      subscribers = await Subscriber.find({ isActive: true }).sort({ createdAt: -1 });
    } catch (err) {
      subscribers = localSubscribers;
    }

    return res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Broadcast a new issue manually
 * @route   POST /api/subscribers/broadcast
 * @access  Private / Admin
 */
export const broadcastIssue = async (req, res) => {
  try {
    const { issueId, title, titleEn, month, monthEn, description, coverImage } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Issue title is required for broadcasting' });
    }

    let subscribers = [];
    try {
      subscribers = await Subscriber.find({ isActive: true });
    } catch (err) {
      subscribers = localSubscribers;
    }

    const broadcastResult = await broadcastNewIssueEmail(subscribers, {
      issueId: issueId || 'v1-i1',
      title,
      titleEn,
      month: month || 'புதிய இதழ்',
      monthEn,
      description,
      coverImage,
    });

    return res.status(200).json({
      success: true,
      message: `Issue broadcast complete. Sent to ${broadcastResult.count} subscribers.`,
      result: broadcastResult,
    });
  } catch (error) {
    console.error('Broadcast error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};