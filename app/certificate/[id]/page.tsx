// app/certificate/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import DemoCertificateView from './page';

export default function CertificateView() {
  const params = useParams();
  
  // For demo purposes, always show the hardcoded demo certificate
  return <DemoCertificateView />;
}