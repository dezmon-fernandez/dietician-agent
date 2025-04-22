import { createAuthClient } from 'better-auth/react';
import { BASE_URL } from '@/common/constants';

const authClient = createAuthClient({
  baseURL: BASE_URL,
});

export default authClient;
