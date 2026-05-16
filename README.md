# CONTEXT-HIRE

**CONTEXT-HIRE** is a AI-driven Applicant Tracking System (ATS) designed to automate candidate screening with extreme precision. It parses resumes, analyzes the resumes to look for cohesivity, growth signals and domain expertise.

Deployed Link : https://hr-ats-context-r2cz.vercel.app/


---

## 🛠️ Tech Stack

-   **Framework:** Next.js 14 (App Router)
-   **Database:** Supabase (PostgreSQL)
-   **AI:** Google Gemini 1.5 Pro
-   **Styling:** Tailwind CSS + Framer Motion
-   **Integration:** Google Sheets API 

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/litti2/HR_ATS_CONTEXT.git
cd HR_ATS_CONTEXT
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
# AI
GEMINI_API_KEY=your_key_here

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Integration
GOOGLE_CREDENTIALS={"type":"service_account",...}
GOOGLE_TOKEN={"access_token":...}

# GitHub Intelligence
GITHUB_TOKEN=your_pat_token

```

---

## 🔑 How to get your API Keys

### 1. Google Gemini API
-   Go to [Google AI Studio](https://aistudio.google.com/).
-   Click **"Get API Key"**.
-   Create a new key in a new project.

### 2. Supabase (Database)
-   Create a project at [Supabase.com](https://supabase.com).
-   Go to **Project Settings > API**.
-   Copy the `URL`, `anon public` key, and `service_role` secret.
-   Run the SQL found in `supabase/schema.sql` in the Supabase SQL Editor.

### 3. GitHub Token (PAT)
Go to GitHub Settings > Developer Settings > Personal access tokens (classic).
Generate a new token with the repo scope.

### 4. Google Sheets (Advanced)
-   Go to [Google Cloud Console](https://console.cloud.google.com/).
-   Enable **Google Sheets API**.
-   Create a **Service Account** and download the `credentials.json`.
-   Run `node scripts/setup-auth.js` locally to generate your `token.json`.


