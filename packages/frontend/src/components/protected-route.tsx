import { Navigate, useLocation } from 'react-router';
import { PageLoader } from './page-loader';
import authClient from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return <PageLoader />;
  }

  if (error || (!session && !isPending)) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
