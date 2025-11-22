'use client';

import EditProfileForm from '@/components/auth/EditProfileForm';
import { useEffect, useState } from 'react';

export default function EditProfilePage() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Force remount when page loads
    setKey(Date.now());
  }, []);

  return (
    <div>
      <EditProfileForm key={key} />
    </div>
  );
}
