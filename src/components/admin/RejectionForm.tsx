import React from 'react';
import { Button } from '../ui/Button';

interface RejectionFormProps {
  rejectionReason: string;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export const RejectionForm: React.FC<RejectionFormProps> = ({
  rejectionReason,
  onReasonChange,
  onConfirm,
  onCancel,
  loading,
}) => {
  return (
    <div className="space-y-3">
      <textarea
        value={rejectionReason}
        onChange={(e) => onReasonChange(e.target.value)}
        placeholder="Enter rejection reason..."
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        rows={3}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={onConfirm}
          loading={loading}
          disabled={!rejectionReason.trim()}
          className="flex-1"
        >
          Confirm Reject
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

