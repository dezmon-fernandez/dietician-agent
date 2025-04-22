export const BASE_URL = import.meta.env.PROD
  ? 'https://api.MY_APP_NAME.com'
  : '';

export const CALL_BACK_URL = import.meta.env.PROD
  ? 'https://MY_APP_NAME.com/dashboard'
  : 'http://localhost:5173/dashboard';
