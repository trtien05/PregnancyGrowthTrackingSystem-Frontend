import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import useAuth from '../../hooks/useAuth';

const HomeLayout = () => {
  const { user } = useAuth();

  return (
    <>
      <Header user={user} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default HomeLayout
