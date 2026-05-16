// =============================================================================
// Role Type Definition
// =============================================================================

export interface Role {
  id: string;
  title: string;
  company_name: string;
  company_email: string;
  jd_text: string;
  requirements_text: string;
  assignment_brief: string;
  domain: string;
  google_form_link: string;
  google_sheet_id: string;
  status: 'active' | 'processing' | 'done';
  created_at: string;
}

export interface RoleFormData {
  title: string;
  company_name: string;
  company_email: string;
  jd_text: string;
  requirements_text: string;
  assignment_brief: string;
  domain: string;
  google_form_link: string;
  google_sheet_id: string;
}
