import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    issueId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an issue title'],
      trim: true,
    },
    titleEn: {
      type: String,
      trim: true,
    },
    month: {
      type: String,
      required: true,
    },
    monthEn: {
      type: String,
    },
    date: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    descriptionEn: {
      type: String,
    },
    features: [String],
    featuresEn: [String],
    pdfUrl: {
      type: String,
    },
    pages: {
      type: Number,
      default: 0,
    },
    comingSoon: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Issue || mongoose.model('Issue', issueSchema);
