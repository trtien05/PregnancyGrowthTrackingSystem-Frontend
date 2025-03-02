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
import Profile from '../pages/Profile'
import DashboardFetus from '../pages/Dashboard/DashboardFetus'
import CustomerDashboard from '../pages/Dashboard'
import MomInfor from '../pages/Dashboard/MomInfor'
import PaymentResult from '../pages/PaymentResult'

//* ====================  Authorization for PUBLIC ==================== */
const MainRouter = () => {
  // const { role } = useAuth();
  // if (user.role === 'admin') return <Navigate to={config.routes.admin.dashboard} />;
  return <MainLayout />
}

const DashboardRouter = () => {
  const { role } = useAuth();
  // return role === 'ROLE_authenticatedUser' ? <CustomerDashboard />
  // : <Navigate to={config.routes.public.home} />;
  return <CustomerDashboard />
};

const CustomerRouter = () => {
  const { role } = useAuth();
  return role === 'ROLE_authenticatedUser' || role === 'ROLE_expert' ? <Outlet />
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
    { path: config.routes.public.blogToolPregWeight, element: <PregnancyWeight /> }
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
  element: <CustomerRouter />,
  children: [
    { path: config.routes.customer.profile, element: <Profile /> }, dashboardRoutes,
    { path: config.routes.customer.paymentResult, element: <PaymentResult /> }
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
