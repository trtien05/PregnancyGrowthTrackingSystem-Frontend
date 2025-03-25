import { Navigate } from 'react-router-dom';
import config from '../config';
import useAuth from '../hooks/useAuth';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import BlogPostPage from '../pages/Admin/BlogPost/index';


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
    // { path: config.routes.admin.dashboard, element: <Dashboard /> },
    // { path: config.routes.admin.manageMember, element: <ManageMember /> },
    // { path: config.routes.admin.growthMatrics, element: <GrowthMetrics /> },
     { path: config.routes.admin.manageBlogPost, element: <BlogPostPage/> },
    // { path: config.routes.admin.manageBlogPost, element: <ManagePlans /> },
    //* Admin create routes
    // { path: config.routes.admin.formPlan, element: <FormPlan /> },
    // { path: config.routes.admin.formGrwothMatrics, element: <FormCreateGrowthMetrics /> },
    //* Admin edit routes
    // { path: config.routes.admin.formGrwothMatrics, element: <FormEditGrowthMetrics /> },
  ],
};

export default AdminRoutes;
