import mongoose, { Schema, Document } from 'mongoose';

// 1. Form Schema
const FieldSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['text', 'rating', 'select'], required: true },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  options: [{ type: String }]
});

const FormSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fields: [FieldSchema],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// 2. Feedback Submission Schema
const AnswerSchema = new Schema({
  fieldId: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true }
});

const AIAnalysisSchema = new Schema({
  sentiment: { type: String, enum: ['Positive', 'Neutral', 'Negative'], required: true },
  score: { type: Number, required: true }, // 1-100
  summary: { type: String, required: true },
  actionablePoints: [{ type: String }],
  urgency: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  category: { type: String, required: true }
});

const SubmissionSchema = new Schema({
  formId: { type: String, required: true },
  formTitle: { type: String, required: true },
  employeeName: { type: String, required: true },
  employeeDepartment: { type: String, required: true },
  answers: [AnswerSchema],
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  aiAnalysis: AIAnalysisSchema
});

// 3. Message Schema
const MessageSchema = new Schema({
  fromUser: { type: String, required: true },
  toUser: { type: String, required: true },
  text: { type: String, required: true },
  senderRole: { type: String, enum: ['admin', 'employee'], required: true },
  createdAt: { type: Date, default: Date.now }
});

// 4. User Schema (Admin + Employee accounts)
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }, // stored as plain text for demo simplicity
  role: { type: String, enum: ['admin', 'employee'], required: true },
  department: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Export Mongoose Models cleanly
export const Form = mongoose.model('Form', FormSchema);
export const Submission = mongoose.model('Submission', SubmissionSchema);
export const Message = mongoose.model('Message', MessageSchema);
export const User = mongoose.model('User', UserSchema);
