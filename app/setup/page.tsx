'use client';

import { useState } from 'react';
import RoleConfigForm from '@/components/setup/RoleConfigForm';
import ProcessingStatusPanel from '@/components/setup/ProcessingStatusPanel';
import { Sparkles } from 'lucide-react';

export default function SetupPage() {
  const [savedRoleId, setSavedRoleId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRoleSaved = (roleId: string) => {
    setSavedRoleId(roleId);
  };

  const handleTriggerProcessing = async () => {
    if (!savedRoleId) return;
    setIsProcessing(true);

    try {
      // Fire and forget — the pipeline runs server-side
      // We stay on this page and poll for status updates
      fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId: savedRoleId }),
      }).catch(err => {
        console.error('Pipeline trigger failed:', err);
      });
    } catch (error) {
      console.error('Failed to trigger processing:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-12 sm:py-16">
      <div className="section-container max-w-3xl">
        {/* Page Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] mb-5">
            <Sparkles size={12} className="text-primary-dim" />
            <span className="text-[11px] font-mono font-medium text-[#a1a1aa] tracking-wide">Configuration</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-on-surface mb-3 tracking-tight">
            Setup Hiring Cycle
          </h1>
          <p className="text-[#a1a1aa] text-base max-w-lg">
            Configure your role, connect your Google Form, and trigger candidate processing.
          </p>
        </div>

        {/* Show processing panel when processing, otherwise show form */}
        {isProcessing && savedRoleId ? (
          <ProcessingStatusPanel roleId={savedRoleId} />
        ) : (
          <RoleConfigForm
            onRoleSaved={handleRoleSaved}
            savedRoleId={savedRoleId}
            onTriggerProcessing={handleTriggerProcessing}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </div>
  );
}
