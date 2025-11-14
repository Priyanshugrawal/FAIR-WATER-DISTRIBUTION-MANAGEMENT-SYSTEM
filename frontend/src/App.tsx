import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AppLayout } from '@/components/layout/app-layout';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { CitizenPortal } from '@/pages/citizen-portal';
import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { MunicipalDashboard } from '@/pages/municipal-dashboard';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="*"
          element={
            <AppLayout>
              <Routes>
                <Route path="/" element={<MunicipalDashboard />} />
                <Route
                  path="/citizen-portal"
                  element={
                    <ProtectedRoute>
                      <CitizenPortal />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
