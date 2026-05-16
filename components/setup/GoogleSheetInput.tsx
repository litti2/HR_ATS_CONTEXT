'use client';

import { useEffect } from 'react';
import { extractSheetId } from '@/utils/extractSheetId';
import { HelpCircle, Table2, Link2, CheckCircle2 } from 'lucide-react';

interface GoogleSheetInputProps {
  formLink: string;
  sheetId: string;
  onFormLinkChange: (value: string) => void;
  onSheetIdChange: (value: string) => void;
}

export default function GoogleSheetInput({
  formLink, sheetId, onFormLinkChange, onSheetIdChange,
}: GoogleSheetInputProps) {

  const handleSheetIdInput = (value: string) => {
    const extracted = extractSheetId(value);
    onSheetIdChange(extracted || value);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="form-label flex items-center gap-1.5">
          <Link2 size={13} className="text-[#52525b]" />
          Google Form URL
        </label>
        <input
          type="url"
          className="input-field"
          placeholder="https://docs.google.com/forms/d/e/..."
          value={formLink}
          onChange={(e) => onFormLinkChange(e.target.value)}
        />
        <p className="text-[11px] text-[#52525b] mt-2 font-mono">
          The public Google Form link shared with candidates
        </p>
      </div>

      <div>
        <label className="form-label flex items-center gap-2">
          <Table2 size={13} className="text-[#52525b]" />
          Google Sheet ID
          <div className="relative group">
            <HelpCircle size={12} className="text-[#52525b] cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-80 p-4 rounded-2xl bg-surface-high border border-[rgba(255,255,255,0.10)] text-[11px] text-[#a1a1aa] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 z-50 shadow-xl">
              <strong className="text-on-surface block mb-1.5">How to find your Sheet ID:</strong>
              Open the connected Google Sheet. The URL looks like:<br />
              <code className="text-primary-dim text-[10px] font-mono">docs.google.com/spreadsheets/d/<strong className="text-teal-dim">SHEET_ID</strong>/edit</code>
              <br /><br />
              You can paste the full URL — the ID will be extracted automatically.
            </div>
          </div>
        </label>
        <input
          type="text"
          className="input-field font-mono text-sm"
          placeholder="Paste full Sheets URL or just the Sheet ID"
          value={sheetId}
          onChange={(e) => handleSheetIdInput(e.target.value)}
        />
        {sheetId && (
          <p className="text-[11px] text-teal-dim/70 mt-2 font-mono flex items-center gap-1.5">
            <CheckCircle2 size={11} />
            Sheet ID: {sheetId}
          </p>
        )}
      </div>
    </div>
  );
}
