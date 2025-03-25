import { Navigate, Outlet } from 'react-router-dom'
import Login from '../pages/Login'
import config from '../config'
import VerifyEmail from '../pages/VerifyEmail'
import Register from '../pages/Register'
import useAuth from '../hooks/useAuth'


// Authorization
const AuthRouter = () => {
  const { user } = useAuth();

  return !user ? <Outlet /> : <Navigate to="/" />;
}

// Define routes for student
const AuthRoutes = {
  element: <AuthRouter />,
  children: [
    { path: config.routes.public.login, element: <Login /> },
    { path: config.routes.public.login, element: <Login /> },
    { path: config.routes.public.verifyEmail, element: <VerifyEmail /> },
    { path: config.routes.public.register, element: <Register /> },
  ]
}

export default AuthRoutes
