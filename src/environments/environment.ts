export const environment = {
  OPEN_AI: {
    API_KEY: import.meta.env['NG_APP_OPEN_AI_API_KEY'],
    ORGANIZATION: import.meta.env['NG_APP_OPEN_AI_ORGANIZATION'],
    PROJECT: import.meta.env['NG_APP_OPEN_AI_PROJECT'],
    MODEL: import.meta.env['NG_APP_OPEN_AI_MODEL'],
    ROLE: import.meta.env['NG_APP_OPEN_AI_ROLE'],
  },
  SUPABASE: {
    PROJECT_URL: import.meta.env['NG_APP_SUPABASE_PROJECT_URL'],
    API_KEY: import.meta.env['NG_APP_SUPABASE_API_KEY'],
  },
  TEMPLATE: {
    URL: import.meta.env['NG_APP_TEMPLATE_URL'],
  },
};
