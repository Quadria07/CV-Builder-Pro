import React, { useState } from 'react';
import { X, Send, Bug, Zap, Lightbulb, HelpCircle, Rocket } from 'lucide-react';
import { useToast } from './ToastProvider';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAutomatic?: boolean;
}

type FeedbackType = 'bug' | 'improvement' | 'feature' | 'other';
type RatingValue = '1' | '2' | '3' | '4' | '5';

interface FeedbackData {
  category: FeedbackType;
  rating: RatingValue;
  message: string;
  userEmail?: string;
  timestamp: string;
  userAgent: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, isAutomatic = false }) => {
  const [category, setCategory] = useState<FeedbackType>('feature');
  const [rating, setRating] = useState<RatingValue>('5');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      showToast('Please provide some feedback.', 'info');
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData: FeedbackData = {
        category,
        rating,
        message: message.trim(),
        userEmail: userEmail.trim() || undefined,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      showToast('Thank you for your feedback! We really appreciate it.', 'success');
      resetForm();
      onClose();
    } catch (error) {
      console.error('Feedback submission error:', error);
      showToast('Failed to send feedback. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCategory('feature');
    setRating('5');
    setMessage('');
    setUserEmail('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-teal-500 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">We'd Love Your Feedback!</h2>
            {isAutomatic && (
              <p className="text-sm text-teal-100 mt-1">Help us improve CV Builder Pro</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              What's your feedback about?
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { value: 'bug', label: 'Bug Found', icon: Bug, desc: 'Something broke' },
                { value: 'improvement', label: 'Improvement', icon: Zap, desc: 'Make it better' },
                { value: 'feature', label: 'Feature', icon: Lightbulb, desc: 'New idea' },
                { value: 'other', label: 'Other', icon: HelpCircle, desc: 'Something else' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setCategory(option.value as FeedbackType)}
                  className={`p-3 rounded-lg border-2 transition-all text-center text-sm font-medium ${
                    category === option.value
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 bg-white text-slate-600 hover:border-teal-300'
                  }`}
                >
                  <option.icon className="w-5 h-5 mx-auto mb-1" />
                  {option.label}
                  <div className="text-xs text-slate-500 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              How would you rate your experience?
            </label>
            <div className="flex gap-2">
              {['1', '2', '3', '4', '5'].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value as RatingValue)}
                  className={`w-12 h-12 rounded-lg font-semibold text-lg transition-all ${
                    rating === value
                      ? 'bg-teal-500 text-white shadow-lg scale-110'
                      : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tell us more (required)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="What would you like to tell us? Be as specific as possible..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 resize-none transition-colors"
            />
            <div className="text-sm text-slate-500 mt-1 flex justify-between">
              <span>Helpful details help us improve faster!</span>
              <span>{message.length}/500</span>
            </div>
          </div>

          {/* Email (optional) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Your email (optional)
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="So we can follow up with you"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1">We'll never spam you, promise!</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-200 text-slate-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="flex-1 px-4 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Feedback
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-2">
            Your feedback helps shape the future of CV Builder Pro
            <Rocket className="w-3.5 h-3.5" />
          </p>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
