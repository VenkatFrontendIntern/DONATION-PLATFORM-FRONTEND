import React, { memo } from 'react';
import { RejectionAlert } from './RejectionAlert';

interface CampaignInfoProps {
  title: string;
  description: string;
  category?: { _id: string; name: string; slug?: string };
  status: string;
  rejectionReason?: string | null;
  coverImage: string;
}

export const CampaignInfo: React.FC<CampaignInfoProps> = memo(({
  title,
  description,
  category,
  status,
  rejectionReason,
  coverImage,
}) => {
  return (
    <div className="bg-white md:rounded-2xl overflow-hidden shadow-sm">
      <img
        src={coverImage}
        alt={title}
        className="w-full h-[300px] md:h-[400px] object-cover"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        sizes="100vw"
      />

      <div className="p-6 hidden md:block">
        <div className="flex items-center gap-2 text-sm text-primary-600 font-medium mb-2">
          {category && (
            <span className="bg-primary-50 px-2 py-1 rounded">{category.name}</span>
          )}
          <span>• {status}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>

        {status === 'rejected' && rejectionReason && (
          <div className="mb-4">
            <RejectionAlert reason={rejectionReason} />
          </div>
        )}

        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
          {description}
        </p>
      </div>
    </div>
  );
});

CampaignInfo.displayName = 'CampaignInfo';

