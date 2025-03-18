import { Navigate, Outlet } from 'react-router-dom'
import config from '../config'
import useAuth from '../hooks/useAuth'
import MainLayout from '../layouts/MainLayout'
import NotFound from '../pages/404'
import BlogDetail from '../pages/BlogDetail'
import BirthPlanWorksheet from '../pages/BlogDetail/ToolsPage/BirthPlanWorksheet'
import DueDateCalculator from '../pages/BlogDetail/ToolsPage/DueDateCalculator'
import OvulationCalculator from '../pages/BlogDetail/ToolsPage/OvulationCalculator'
import PregnancyWeight from '../pages/BlogDetail/ToolsPage/PregnancyWeight'
import BlogPage from '../pages/Blogs/Blogs'
import Checkout from '../pages/Checkout'
import Home from '../pages/Home'
import Pricing from '../pages/Pricing'
import DashboardFetus from '../pages/Dashboard/DashboardFetus'
import CustomerDashboard from '../pages/Dashboard'
import MomInfor from '../pages/Dashboard/MomInfor'
import PaymentResult from '../pages/PaymentResult'
import SettingsPage from '../pages/Member/Account'
import ForgotPasswod from '../pages/ForgotPassword'
import UpdateUserForm from '../pages/Member/Account/Profile/index'
import SubscriptionPage from '../pages/Member/Account/Subscription'
import OrderHistoryPage from '../pages/Member/Account/OrderHistory'
import PregnancyPage from '../pages/Member/Account/Pregnancy'

//* ====================  Authorization for PUBLIC ==================== */
const MainRouter = () => {
  // const { role } = useAuth();
  // if (user.role === 'admin') return <Navigate to={config.routes.admin.dashboard} />;
  return <MainLayout />
}

const DashboardRouter = () => {
  const { role } = useAuth();
  return role === 'ROLE_member' ? <CustomerDashboard />
  : <Navigate to={config.routes.public.home} />;
};

const AuthenticatedUserRouter = () => {
  const { role } = useAuth();
  return role ? <Outlet />
    : <Navigate to={config.routes.public.login} />;
};

//* ==================== Define children routes: PUBLIC, NOT FOUND ==================== */
const publicRoutes = {
  children: [
    { path: config.routes.public.home, element: <Home /> },
    { path: config.routes.public.blogs, element: <BlogPage /> },
    { path: config.routes.public.blog, element: <BlogDetail /> },
    { path: config.routes.public.pricing, element: <Pricing /> },
    { path: config.routes.public.checkout, element: <Checkout /> },
    { path: config.routes.public.blogToolWorksheet, element: <BirthPlanWorksheet /> },
    { path: config.routes.public.blogToolDueDate, element: <DueDateCalculator /> },
    { path: config.routes.public.blogToolOvulation, element: <OvulationCalculator /> },
    { path: config.routes.public.blogToolPregWeight, element: <PregnancyWeight /> },
    { path: config.routes.public.forgotPassword, element: <ForgotPasswod /> },

  ]
}

const dashboardRoutes = {
  path: config.routes.customer.dashboard,
  element: <DashboardRouter />,
  children: [
    { path: config.routes.customer.manageMomInfor, element: <MomInfor /> },
    { path: config.routes.customer.dashboardFetus, element: <DashboardFetus /> }
  ]
}


const customerRoutes = {
  element: <AuthenticatedUserRouter />,
  children: [
    dashboardRoutes,
    { path: config.routes.customer.paymentResult, element: <PaymentResult /> },
    { path: config.routes.customer.profile, element: <SettingsPage /> },
    { path: config.routes.customer.profileInformation, element: <UpdateUserForm /> },
    {path: config.routes.customer.subscription, element: <SubscriptionPage />},
    { path: config.routes.customer.oderHistory, element: <OrderHistoryPage /> },
    { path: config.routes.customer.pregnancy, element: <PregnancyPage /> },



  ]
};


const notFoundRoutes = { path: '*', element: <NotFound /> }

//* ==================== Define main routes ==================== */
const MainRoutes = {
  path: '/',
  element: <MainRouter />,
  children: [publicRoutes, customerRoutes, notFoundRoutes]
}

export default MainRoutes
