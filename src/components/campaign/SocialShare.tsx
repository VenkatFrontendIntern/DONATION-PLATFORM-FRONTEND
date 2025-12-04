import React from 'react';
import { Share2, MessageCircle, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { socialShare } from '../../utils/socialShare';
import toast from 'react-hot-toast';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({ url, title, description }) => {
  const shareText = `${title}${description ? ` - ${description}` : ''}`;

  const handleShare = async (platform: string) => {
    try {
      switch (platform) {
        case 'whatsapp':
          socialShare.whatsapp(url, shareText);
          break;
        case 'facebook':
          socialShare.facebook(url);
          break;
        case 'twitter':
          socialShare.twitter(url, shareText);
          break;
        case 'copy':
          const success = await socialShare.copyLink(url);
          if (success) {
            toast.success('Link copied to clipboard!');
          } else {
            toast.error('Failed to copy link');
          }
          break;
      }
    } catch (error) {
      toast.error('Failed to share');
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleShare('whatsapp')}
        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
        title="Share on WhatsApp"
      >
        <MessageCircle size={20} />
      </button>
      <button
        onClick={() => handleShare('facebook')}
        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        title="Share on Facebook"
      >
        <Facebook size={20} />
      </button>
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors"
        title="Share on Twitter"
      >
        <Twitter size={20} />
      </button>
      <button
        onClick={() => handleShare('copy')}
        className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        title="Copy link"
      >
        <LinkIcon size={20} />
      </button>
    </div>
  );
};

