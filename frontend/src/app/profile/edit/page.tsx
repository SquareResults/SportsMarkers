'use client';

import EditProfileForm from '@/components/auth/EditProfileForm';
import { useMemo } from 'react';

export default function EditProfilePage() {
  // Generate a unique key on mount to force fresh component instance
  // Using crypto.randomUUID() is acceptable as it's called once during initialization
  const key = useMemo(() => crypto.randomUUID(), []);

  return (
    <div>
      <EditProfileForm key={key} />
    </div>
  );
}
