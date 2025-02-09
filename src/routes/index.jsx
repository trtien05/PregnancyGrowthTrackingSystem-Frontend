// import AuthRoutes from './AuthRoutes';
import MainRoutes from './MainRoutes'
// import checkTokenInURL from '../utils/checkTokenInURL';
import { useRoutes } from 'react-router-dom'
// import AdminRoutes from './AdminRoutes';

const RoutesComponent = () => {
  // checkTokenInURL();

  return useRoutes([MainRoutes])
}

export default RoutesComponent
