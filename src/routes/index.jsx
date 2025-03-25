// import AuthRoutes from './AuthRoutes';
import AdminRoutes from './AdminRoutes'
import AuthRoutes from './AuthRoutes'
import MainRoutes from './MainRoutes'
// import checkTokenInURL from '../utils/checkTokenInURL';
import { useRoutes } from 'react-router-dom'

const RoutesComponent = () => {
  // checkTokenInURL();

  return useRoutes([AuthRoutes, AdminRoutes, MainRoutes])
}

export default RoutesComponent
