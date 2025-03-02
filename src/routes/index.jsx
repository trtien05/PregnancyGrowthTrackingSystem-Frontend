// import AuthRoutes from './AuthRoutes';
import AuthRoutes from './AuthRoutes'
import MainRoutes from './MainRoutes'
// import checkTokenInURL from '../utils/checkTokenInURL';
import { useRoutes } from 'react-router-dom'

const RoutesComponent = () => {
  // checkTokenInURL();

  return useRoutes([AuthRoutes, MainRoutes])
}

export default RoutesComponent
