import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import useAuth from '../../hooks/useAuth';

const HomeLayout = () => {
  const { user, role } = useAuth();

  return (
    <>
      <Header user={user} role={role} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default HomeLayout
