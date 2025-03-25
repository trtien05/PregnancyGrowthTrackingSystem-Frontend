import { Navigate } from 'react-router-dom';
import config from '../config';
import useAuth from '../hooks/useAuth';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import BlogPostPage from '../pages/Admin/BlogPost/index';
import MembershipPlan from '../pages/Admin/MembershipPlan/MembershipPlan';
import GrowthMetric from '../pages/Admin/GrowthMetric/GrowthMetric';


// Authorization
const AdminRouter = () => {
  const { role } = useAuth();
  if (role !== 'ROLE_admin') {
    return <Navigate to={config.routes.home} />;
  }
  return <AdminLayout />;
};

// Define routes for admin
const AdminRoutes = {
  path: "/",
  element: <AdminRouter />,
  children: [
    //* Admin common routes
    { path: config.routes.admin.dashboard, element: <BlogPostPage /> },
    // { path: config.routes.admin.manageMember, element: <ManageMember /> },
    // { path: config.routes.admin.manageMember, element: <GrowthMetrics /> },
    { path: config.routes.admin.manageBlogPost, element: <BlogPostPage /> },
    { path: config.routes.admin.manageMembershipPlan, element: <MembershipPlan /> },
    { path: config.routes.admin.growthMetrics, element: <GrowthMetric /> },
  ],
};

export default AdminRoutes;
