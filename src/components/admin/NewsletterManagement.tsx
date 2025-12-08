import React, { useState, useEffect } from 'react';
import { Send, Mail, AlertCircle } from 'lucide-react';
import { newsletterService } from '../../services/newsletterService';
import { campaignService } from '../../services/campaignService';
import toast from 'react-hot-toast';
import { Button } from '../ui/Button';
import { RichTextEditor } from '../ui/RichTextEditor';

interface NewsletterManagementProps {
  campaigns?: any[];
}

export const NewsletterManagement: React.FC<NewsletterManagementProps> = ({ campaigns: propCampaigns = [] }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [sending, setSending] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>(propCampaigns);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>('campaignUpdate');

  // Load approved campaigns for dropdown
  useEffect(() => {
    const loadCampaigns = async () => {
      if (propCampaigns.length > 0) {
        setCampaigns(propCampaigns);
        return;
      }
      
      setLoadingCampaigns(true);
      try {
        const response = await campaignService.getAll({ status: 'approved', limit: 100 });
        setCampaigns(response.campaigns || []);
      } catch (error) {
        // Silently fail - campaigns are optional
      } finally {
        setLoadingCampaigns(false);
      }
    };

    loadCampaigns();
  }, [propCampaigns]);

  // Set default template to Campaign Update on component mount
  useEffect(() => {
    insertTemplate('campaignUpdate');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendNewsletter = async () => {
    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter newsletter content');
      return;
    }

    setSending(true);

    try {
      await newsletterService.sendNewsletter({
        subject: subject.trim(),
        content: content.trim(),
        campaignId: selectedCampaignId || undefined,
      });

      toast.success('Newsletter sent successfully!');
      setSubject('');
      setContent('');
      setSelectedCampaignId('');
      setSelectedTemplate(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send newsletter';
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  const insertTemplate = (template: string) => {
    const templates: Record<string, string> = {
      campaignUpdate: `<h2>Exciting Campaign Update!</h2><p>We have some great news to share about our latest campaigns and the impact we're making together!</p>`,
      impactStory: `<h2>Impact Story: Making a Difference</h2><p>We're thrilled to share an inspiring story from our community about the positive change your support has created.</p>`,
      tips: `<h2>Tips: How You Can Help Create Change</h2><p>Here are some practical ways you can make a difference in your community and beyond.</p>`,
      exclusive: `<h2>Exclusive Update: Special Opportunity</h2><p>As a valued subscriber, we wanted to share an exclusive opportunity with you first.</p>`,
    };

    setContent(templates[template] || '');
    setSelectedTemplate(template);
  };


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary-600" />
            Newsletter Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Send updates to all newsletter subscribers
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject Line *
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Monthly Impact Update - December 2024"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={sending}
          />
        </div>

        {/* Campaign Selection (Optional) */}
        {campaigns.length > 0 && (
          <div>
            <label htmlFor="campaign" className="block text-sm font-medium text-gray-700 mb-2">
              Link Campaign (Optional)
            </label>
            <select
              id="campaign"
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={sending}
            >
              <option value="">No campaign link</option>
              {campaigns.map((campaign) => (
                <option key={campaign._id} value={campaign._id}>
                  {campaign.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Selecting a campaign will include campaign details in the newsletter
            </p>
          </div>
        )}

        {/* Content Templates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Templates
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => insertTemplate('campaignUpdate')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors font-medium ${
                selectedTemplate === 'campaignUpdate'
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              disabled={sending}
            >
              Campaign Update
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('impactStory')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors font-medium ${
                selectedTemplate === 'impactStory'
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              disabled={sending}
            >
              Impact Story
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('tips')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors font-medium ${
                selectedTemplate === 'tips'
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              disabled={sending}
            >
              Tips & Help
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('exclusive')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors font-medium ${
                selectedTemplate === 'exclusive'
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              disabled={sending}
            >
              Exclusive Update
            </button>
          </div>
          {selectedTemplate && (
            <p className="text-xs text-primary-600 mt-2 flex items-center gap-1">
              <span>✓</span>
              <span>Template "{selectedTemplate === 'campaignUpdate' ? 'Campaign Update' : selectedTemplate === 'impactStory' ? 'Impact Story' : selectedTemplate === 'tips' ? 'Tips & Help' : 'Exclusive Update'}" is selected. You can edit it below.</span>
            </p>
          )}
        </div>

        {/* Content Editor */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Newsletter Content *
          </label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Start writing your newsletter content here. Use the toolbar above to format your text..."
            disabled={sending}
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Use the formatting buttons above to style your content. No HTML knowledge needed!
          </p>
        </div>

        {/* Preview Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Before sending:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Newsletter will be sent to all active subscribers</li>
                <li>Emails are sent in batches to avoid overwhelming the server</li>
                <li>You'll receive a summary of successful and failed sends</li>
                <li>Make sure to proofread your content before sending</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Send Button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            onClick={handleSendNewsletter}
            disabled={sending || !subject.trim() || !content.trim()}
            className="flex items-center gap-2"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Newsletter
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

