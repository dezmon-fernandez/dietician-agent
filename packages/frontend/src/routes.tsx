import { Route, Routes, Navigate } from 'react-router';
import { Suspense } from 'react';
import { ApplicationLayout } from '@/components/layouts/dashboard-layout';
import SignIn from '@/features/auth/sign-in/sign-in';
import { ProtectedRoute } from '@/components/protected-route';

const AppRoutes = () => {
  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/privacy" element={<div>Privacy</div>} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/payment/success" element={<div>PaymentSuccess</div>} />
        <Route
          path="/payment/cancel"
          element={<Navigate to="/dashboard/settings" />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ApplicationLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<div>Dashboard</div>} />
          <Route path="library" element={<div>Library</div>} />
          <Route path="clients" element={<div>Clients</div>} />
          <Route path="messages" element={<div>Messages</div>} />
          <Route path="programs" element={<div>Programs</div>} />
          <Route path="settings" element={<div>Settings</div>} />
          <Route path="account" element={<div>Account</div>} />
          <Route path="privacy-policy" element={<div>Privacy Policy</div>} />
          <Route path="feedback" element={<div>Feedback</div>} />
          <Route path="support" element={<div>Support</div>} />
          <Route path="changelog" element={<div>Changelog</div>} />
          <Route path="new-team" element={<div>New Team</div>} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
