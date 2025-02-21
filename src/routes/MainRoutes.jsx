import config from '../config'
import MainLayout from '../layouts/MainLayout'
import NotFound from '../pages/404'
import BlogDetail from '../pages/BlogDetail'
import BirthPlanWorksheet from '../pages/BlogDetail/ToolsPage/BirthPlanWorksheet'
import DueDateCalculator from '../pages/BlogDetail/ToolsPage/DueDateCalculator'
import OvulationCalculator from '../pages/BlogDetail/ToolsPage/OvulationCalculator'
import PregnancyWeight from '../pages/BlogDetail/ToolsPage/PregnancyWeight'
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
    { path: config.routes.public.blog, element: <BlogDetail /> },
    { path: config.routes.public.blogToolWorksheet, element: <BirthPlanWorksheet /> },
    { path: config.routes.public.blogToolDueDate, element: <DueDateCalculator /> },
    { path: config.routes.public.blogToolOvulation, element: <OvulationCalculator /> },
    { path: config.routes.public.blogToolPregWeight, element: <PregnancyWeight /> },

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
