import { Suspense } from 'react';
import VerifyContent from './VerifyContent';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
