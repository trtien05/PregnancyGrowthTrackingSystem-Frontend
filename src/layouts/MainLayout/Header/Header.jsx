import logo from '../../../assets/images/logo.svg'

function Header() {
  return (
    <nav className="py-3 px-7 flex items-center justify-between border-b bg-primary shadow-[0px_0px_5px_rgba(0,0,0,0.25)] mb-1">
      <div className="flex items-center gap-4">
        <img src={logo} alt="logo" width={30} height={24} />
        <span className='font-pacifico text-3xl'>PregnaJoy</span>
      </div>

      <div className="hidden md:flex w-1/2 gap-20 ">
        <a href="#" className="text-black hover:text-gray-900">
          About Us
        </a>
        <a href="#" className="text-black hover:text-gray-900">
          Pregnancy
        </a>
        <a href="#" className="text-black hover:text-gray-900">
          Blog
        </a>
        <a href="#" className="text-black hover:text-gray-900">
          FAQ
        </a>
        <a href="#" className="text-black hover:text-gray-900">
          Explore Plans
        </a>
      </div>

      <a href="/login">
        <button className="bg-second text-white px-6 py-2 rounded-full hover:bg-pink-300 transition-colors  shadow-md">Join us</button>
      </a>

    </nav>
  )
}

export default Header
