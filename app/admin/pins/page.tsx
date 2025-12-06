'use client';

import { siteData } from '@/lib/siteData';
import PinPositionReview from '@/components/admin/PinPositionReview';

export default function PinReviewPage() {
  return (
    <div>
      <PinPositionReview locations={siteData.locations} />
    </div>
  );
}
