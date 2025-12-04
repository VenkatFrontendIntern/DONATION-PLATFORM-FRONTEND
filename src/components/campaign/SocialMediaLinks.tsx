import React from 'react';
import { Input } from '../ui/Input';

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

export const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Social Media Links (Optional)
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Add your social media profiles to help supporters connect with you
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Facebook"
          name="facebook"
          type="url"
          value={formData.facebook}
          onChange={onChange}
          placeholder="https://facebook.com/yourpage"
        />
        <Input
          label="Instagram"
          name="instagram"
          type="url"
          value={formData.instagram}
          onChange={onChange}
          placeholder="https://instagram.com/yourprofile"
        />
        <Input
          label="Twitter/X"
          name="twitter"
          type="url"
          value={formData.twitter}
          onChange={onChange}
          placeholder="https://twitter.com/yourhandle"
        />
        <Input
          label="LinkedIn"
          name="linkedin"
          type="url"
          value={formData.linkedin}
          onChange={onChange}
          placeholder="https://linkedin.com/in/yourprofile"
        />
        <Input
          label="WhatsApp"
          name="whatsapp"
          type="text"
          value={formData.whatsapp}
          onChange={onChange}
          placeholder="+91 9876543210"
        />
        <Input
          label="YouTube"
          name="youtube"
          type="url"
          value={formData.youtube}
          onChange={onChange}
          placeholder="https://youtube.com/@yourchannel"
        />
      </div>
    </div>
  );
};

