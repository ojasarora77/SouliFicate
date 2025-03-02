// app/certificate/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import DemoCertificateView from '/Users/ojasarora/SouliFicate/app/pitch/page';

export default function CertificateView() {
  const params = useParams();
  
  // For demo purposes, always show the hardcoded demo certificate
  return <DemoCertificateView />;
}