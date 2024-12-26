import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { protectedRoutes } from './routes/protectedRoutes';
import { authRoutes } from './routes/authRoutes';
import { publicRoutes } from './routes/publicRoutes';
import { initializeFirebaseService } from './utils/firebaseUtils';
import { LoadingProvider } from './components/Common/Loader/LoadingContext';
import Loader from './components/Common/Loader/Loader';
import { useToast } from './components/Common/ToastProvider';
import ProtectedRoute from './auth/ProtectedRoute';
import RedirectIfAuthenticated from './auth/RedirectIfAuthenticated';


function App() {
  const { showToast } = useToast();

  useEffect(() => {
    initializeFirebaseService(showToast);
  }, [showToast]);

  return (
    <LoadingProvider>
      <Loader />
      <Routes>
        {protectedRoutes.map(({ path, Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <Component />
              </ProtectedRoute>
            }
          />
        ))}
        {authRoutes.map(({ path, Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <RedirectIfAuthenticated>
                <Component />
              </RedirectIfAuthenticated>
            }
          />
        ))}
        {publicRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </LoadingProvider>
  );
}

export default App;
