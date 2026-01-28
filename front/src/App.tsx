import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { MantineProviderWrapper } from './mantine-provider';
import { AuthProvider } from './contexts/AuthContext';
import { Login, Register } from './pages/Login';
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <MantineProviderWrapper>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Profile />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MantineProviderWrapper>
  );
}
export default App;