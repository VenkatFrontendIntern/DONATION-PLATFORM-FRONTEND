import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Youtube,
  Link as LinkIcon
} from 'lucide-react';

interface SocialMediaLinksProps {
  formData: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    whatsapp: string;
    youtube: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const socialMediaConfig = [
  {
    name: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    placeholder: 'https://facebook.com/yourpage',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    placeholder: 'https://instagram.com/yourprofile',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
  {
    name: 'twitter',
    label: 'Twitter/X',
    icon: Twitter,
    placeholder: 'https://twitter.com/yourhandle',
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
  },
  {
    name: 'linkedin',
    label: 'LinkedIn',
    icon: Linkedin,
    placeholder: 'https://linkedin.com/in/yourprofile',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    placeholder: '+91 9876543210',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    type: 'text' as const,
  },
  {
    name: 'youtube',
    label: 'YouTube',
    icon: Youtube,
    placeholder: 'https://youtube.com/@yourchannel',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
];

export const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {socialMediaConfig.map((config, index) => {
          const Icon = config.icon;
          const value = formData[config.name as keyof typeof formData];
          const hasValue = value && value.trim() !== '';
          
          return (
            <motion.div
              key={config.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
                hasValue 
                  ? `border-primary-300 ${config.bgColor}` 
                  : 'border-gray-200 active:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${hasValue ? config.bgColor : 'bg-gray-100'}`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${hasValue ? config.color : 'text-gray-600'}`} />
                </div>
                <label className="text-xs sm:text-sm font-semibold text-gray-700 flex-1 min-w-0">
                  {config.label}
                </label>
                {hasValue && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto flex-shrink-0"
                  >
                    <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
                  </motion.div>
                )}
              </div>
              <Input
                name={config.name}
                type={config.type || 'url'}
                value={value}
                onChange={onChange}
                placeholder={config.placeholder}
                className="bg-transparent border-0 p-0 focus:ring-0 text-xs sm:text-sm"
              />
            </motion.div>
          );
        })}
      </div>
      
      <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-[11px] sm:text-xs text-gray-600 flex items-start gap-2">
          <span className="text-primary-600 mt-0.5 flex-shrink-0">💡</span>
          <span>
            Adding your social media links helps supporters verify your campaign and share it with their networks. 
            This can significantly increase your reach and donations.
          </span>
        </p>
      </div>
    </div>
  );
};

