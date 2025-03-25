import { Navigate } from 'react-router-dom';
import config from '../config';
import useAuth from '../hooks/useAuth';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';



// Authorization
const AdminRouter = () => {
  const { role } = useAuth();
  console.log("role", role);
  if (role !== 'admin') {
    return <Navigate to={config.routes.home} />;
  }
  return <AdminLayout />;
};

// Define routes for admin
const AdminRoutes = {
  path: config.routes.admin.dashboard,
  element: <AdminRouter />,
  children: [
    //* Admin common routes
    // { path: config.routes.admin.dashboard, element: <Dashboard /> },
    // { path: config.routes.admin.manageMember, element: <ManageMember /> },
    // { path: config.routes.admin.growthMatrics, element: <GrowthMetrics /> },
    // { path: config.routes.admin.managePlans, element: <ManagePlans /> },
    // { path: config.routes.admin.manageBlogPost, element: <ManagePlans /> },
    //* Admin create routes
    // { path: config.routes.admin.formPlan, element: <FormPlan /> },
    // { path: config.routes.admin.formGrwothMatrics, element: <FormCreateGrowthMetrics /> },
    //* Admin edit routes
    // { path: config.routes.admin.formGrwothMatrics, element: <FormEditGrowthMetrics /> },
  ],
};

export default AdminRoutes;
