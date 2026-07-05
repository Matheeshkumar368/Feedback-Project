/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FeedbackField {
  id: string;
  type: 'text' | 'rating' | 'select';
  label: string;
  required: boolean;
  options?: string[]; // for 'select'
}

export interface FeedbackForm {
  _id?: string;
  id?: string; // fallback
  title: string;
  description: string;
  fields: FeedbackField[];
  isActive: boolean;
  createdAt?: string;
}

export interface FeedbackSubmission {
  _id?: string;
  formId: string;
  formTitle: string;
  employeeName: string;
  employeeDepartment: string;
  answers: Array<{
    fieldId: string;
    label: string;
    type: string;
    value: string | number;
  }>;
  rating: number; // overall rating
  createdAt?: string;
  aiAnalysis?: {
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    score: number; // 1-100
    summary: string;
    actionablePoints: string[];
    urgency: 'Low' | 'Medium' | 'High';
    category: string;
  };
}

export interface Message {
  _id?: string;
  fromUser: string;
  toUser: string;
  text: string;
  senderRole: 'admin' | 'employee';
  createdAt?: string;
}

export interface HRStats {
  totalFeedbacks: number;
  averageRating: number;
  sentimentBreakdown: {
    Positive: number;
    Neutral: number;
    Negative: number;
  };
  urgencyBreakdown: {
    Low: number;
    Medium: number;
    High: number;
  };
  feedbacksByDepartment: Record<string, number>;
  monthlyTrends: Array<{ month: string; count: number }>;
}
