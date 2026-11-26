/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_URL?: string
  readonly VITE_LINKEDIN_URL?: string
  readonly VITE_CONTACT_EMAIL?: string
  readonly VITE_RESUME_URL?: string
  readonly VITE_STATUS?: string
  readonly VITE_SITE_URL?: string
  readonly VITE_PHOTO_URL?: string
  readonly VITE_MUSIC_URL?: string
  readonly VITE_PLAUSIBLE_DOMAIN?: string
  readonly VITE_WEB3FORMS_KEY?: string
  readonly VITE_FORM_ENDPOINT?: string
  readonly VITE_REPO_NEXOPS?: string
  readonly VITE_REPO_PIPELINE?: string
  readonly VITE_REPO_INFRAWATCH?: string
  readonly VITE_DEMO_NEXOPS?: string
  readonly VITE_DEMO_PIPELINE?: string
  readonly VITE_DEMO_INFRAWATCH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
