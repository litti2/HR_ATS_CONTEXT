'use client';

import { useState } from 'react';
import { Save, Play, Building2, Mail, Briefcase, FileText, ListChecks, Link2, ClipboardList } from 'lucide-react';
import DomainDropdown from './DomainDropdown';
import GoogleSheetInput from './GoogleSheetInput';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface RoleConfigFormProps {
  onRoleSaved: (roleId: string) => void;
  savedRoleId: string | null;
  onTriggerProcessing: () => void;
  isProcessing: boolean;
}

export default function RoleConfigForm({
  onRoleSaved, savedRoleId, onTriggerProcessing, isProcessing,
}: RoleConfigFormProps) {
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    company_name: '',
    company_email: '',
    jd_text: '',
    requirements_text: '',
    assignment_brief: '',
    domain: 'frontend',
    google_form_link: '',
    google_sheet_id: '',
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to save role');
        if (data.id) {
          onRoleSaved(data.id);
        } else {
          throw new Error('Role ID missing from response');
        }
      } else {
        throw new Error('Server error: Environment variables (like Supabase credentials) might be missing.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving the role.');
    } finally {
      setSaving(false);
    }
  };

  const isFormValid = form.title && form.company_name && form.jd_text;

  return (
    <>
      <div className="space-y-6">
        {/* Company Info Section */}
        <div className="glass-card-static p-7 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-vivid/20 to-transparent" />
          <h2 className="text-base font-display font-semibold text-on-surface mb-6 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-vivid/10 border border-primary-vivid/15 flex items-center justify-center">
              <Building2 size={15} className="text-primary-dim" strokeWidth={1.5} />
            </div>
            Company Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Acme Corp"
                value={form.company_name}
                onChange={(e) => updateField('company_name', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Mail size={13} className="text-[#52525b]" />
                Sender Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="e.g., hiring@acmecorp.com"
                value={form.company_email}
                onChange={(e) => updateField('company_email', e.target.value)}
              />
              <p className="text-[11px] text-[#52525b] mt-2 font-mono">Assignment emails will be sent from this address</p>
            </div>
          </div>
        </div>

        {/* Role Details Section */}
        <div className="glass-card-static p-7 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky/20 to-transparent" />
          <h2 className="text-base font-display font-semibold text-on-surface mb-6 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky/10 border border-sky/15 flex items-center justify-center">
              <Briefcase size={15} className="text-sky" strokeWidth={1.5} />
            </div>
            Role Details
          </h2>

          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="form-label">Role Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Software Engineer 1"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                />
              </div>
              <DomainDropdown
                value={form.domain}
                onChange={(val) => updateField('domain', val)}
              />
            </div>

            <div>
              <label className="form-label flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText size={13} className="text-[#52525b]" />
                  Job Description
                </span>
                <span className="text-[11px] text-[#52525b] font-mono">{form.jd_text.length} chars</span>
              </label>
              <textarea
                className="textarea-field min-h-[180px]"
                placeholder="Paste the full job description here..."
                value={form.jd_text}
                onChange={(e) => updateField('jd_text', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label flex items-center gap-1.5">
                <ListChecks size={13} className="text-[#52525b]" />
                Specific Requirements
              </label>
              <textarea
                className="textarea-field"
                placeholder="e.g., Must have experience with React, Node.js, REST APIs, PostgreSQL"
                value={form.requirements_text}
                onChange={(e) => updateField('requirements_text', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label flex items-center gap-1.5">
                <ClipboardList size={13} className="text-[#52525b]" />
                Assignment Brief
              </label>
              <textarea
                className="textarea-field"
                placeholder="The assignment text that will be included in the email to shortlisted candidates..."
                value={form.assignment_brief}
                onChange={(e) => updateField('assignment_brief', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Google Form Connection */}
        <div className="glass-card-static p-7 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-vivid/20 to-transparent" />
          <h2 className="text-base font-display font-semibold text-on-surface mb-6 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-vivid/10 border border-teal-vivid/15 flex items-center justify-center">
              <Link2 size={15} className="text-teal-dim" strokeWidth={1.5} />
            </div>
            Google Form Connection
          </h2>

          <GoogleSheetInput
            formLink={form.google_form_link}
            sheetId={form.google_sheet_id}
            onFormLinkChange={(val) => updateField('google_form_link', val)}
            onSheetIdChange={(val) => updateField('google_sheet_id', val)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={!isFormValid || saving}
            className="btn-primary flex-1 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
          >
            {saving ? <LoadingSpinner size="sm" /> : <Save size={17} strokeWidth={1.5} />}
            {saving ? 'Saving...' : savedRoleId ? 'Saved' : 'Save & Activate'}
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            disabled={!savedRoleId || isProcessing}
            className="btn-teal flex-1 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isProcessing ? <LoadingSpinner size="sm" /> : <Play size={17} strokeWidth={1.5} />}
            {isProcessing ? 'Processing...' : 'Trigger Processing'}
          </button>
        </div>

        {errorMsg && (
          <div className="glass-card-static p-4 text-center border-red-500/30">
            <p className="text-sm text-red-400 font-mono">
              Error: {errorMsg}
            </p>
          </div>
        )}

        {savedRoleId && !isProcessing && (
          <div className="glass-card-static p-4 text-center">
            <p className="text-sm text-teal-dim font-mono flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-vivid animate-pulse" />
              Role saved. Ready to process when your Google Form closes.
            </p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Start Processing"
        message="This will begin processing all candidate submissions from the connected Google Sheet. Make sure the form is closed and all responses are in. Continue?"
        confirmLabel="Start Processing"
        onConfirm={() => { setShowConfirm(false); onTriggerProcessing(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
