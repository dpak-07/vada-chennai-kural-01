import Issue from '../models/Issue.js';
import Subscriber from '../models/Subscriber.js';
import { broadcastNewIssueEmail } from '../utils/mailer.js';

export const createIssue = async (req, res) => {
  try {
    const {
      issueId,
      title,
      titleEn,
      month,
      monthEn,
      date,
      coverImage,
      description,
      descriptionEn,
      features,
      featuresEn,
      pdfUrl,
      pages,
      comingSoon,
      broadcast = true,
    } = req.body;

    if (!title || !month) {
      return res.status(400).json({ success: false, message: 'Title and Month are required' });
    }

    const generatedId = issueId || ('v1-i' + Date.now());

    let issue;
    try {
      issue = await Issue.findOneAndUpdate(
        { issueId: generatedId },
        {
          issueId: generatedId,
          title,
          titleEn,
          month,
          monthEn,
          date: date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          coverImage: coverImage || '/coming_soon_cover.jpg',
          description,
          descriptionEn,
          features: features || [],
          featuresEn: featuresEn || [],
          pdfUrl: pdfUrl || '',
          pages: pages || 0,
          comingSoon: comingSoon ?? false,
        },
        { new: true, upsert: true }
      );
    } catch (dbErr) {
      issue = {
        issueId: generatedId,
        title,
        titleEn,
        month,
        monthEn,
        description,
        coverImage,
      };
    }

    if (broadcast) {
      try {
        const subscribers = await Subscriber.find({ isActive: true });
        broadcastNewIssueEmail(subscribers, issue).catch(err => {
          console.error('[IssueController] Broadcast async error:', err.message);
        });
      } catch (subErr) {
        console.warn('[IssueController] Could not fetch subscribers for broadcast:', subErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'New issue posted successfully and broadcast initiated to subscribers!',
      issue,
    });
  } catch (error) {
    console.error('Create issue error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: issues.length, issues });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};