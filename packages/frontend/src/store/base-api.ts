import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

// Define all possible tag types in the application
export type TagTypes = 'Todo' | 'Auth';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.PROD ? 'https://api.MY_APP_NAME.com' : '',
  credentials: 'include',
  prepareHeaders: headers => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  return result;
};

const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Todo', 'Auth'] as const,
  endpoints: () => ({}),
});

export default baseApi;
