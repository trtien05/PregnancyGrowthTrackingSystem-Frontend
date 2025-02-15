import config from '../config'
import MainLayout from '../layouts/MainLayout'
import NotFound from '../pages/404'
import BlogPage from '../pages/Blogs/Blogs'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import VerifyEmail from '../pages/VerifyEmail'

//* ====================  Authorization for PUBLIC ==================== */
const MainRouter = () => {
  return <MainLayout />
}
//* ==================== Define children routes: PUBLIC, NOT FOUND ==================== */
const publicRoutes = {
  children: [
    { path: config.routes.public.home, element: <Home /> },
    { path: config.routes.public.login, element: <Login /> },
    { path: config.routes.public.verifyEmail, element: <VerifyEmail /> },
    { path: config.routes.public.register, element: <Register /> },
    { path: config.routes.public.register, element: <Register /> },
    { path: config.routes.public.blogs, element: <BlogPage /> },
  ]
}

const notFoundRoutes = { path: '*', element: <NotFound /> }

//* ==================== Define main routes ==================== */
const MainRoutes = {
  path: '/',
  element: <MainRouter />,
  children: [publicRoutes, notFoundRoutes]
}

export default MainRoutes
