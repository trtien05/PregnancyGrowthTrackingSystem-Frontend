import banner from '../../assets/images/banner.png'

function HeroSection() {
  return (
    <div className=" bg-primary">
      <div className="container mx-auto px-[62px] py-[163px] flex flex-col md:flex-row items-center justify-between font-poppins">
        {/* Left Column - Text Content */}
        <div className=" mb-8 md:mb-0 max-w-[50%]">
          <h1 className="text-[60px] font-[700] mb-6 leading-tight">
            &quot;Together,
            <br />
            Every Step of the Way&quot;
          </h1>
          <p className="text-black text-lg mb-8 leading-relaxed w-[576px] ">
            At PregnaJoy, we&apos;re here to support you through your entire pregnancy journey. From tracking your baby&apos;s growth to gentle
            reminders, we walk beside you, ensuring you feel cared for and confident every step of the way.
          </p>
          <button className="bg-second text-white px-6 py-2 rounded-full hover:bg-pink-300 transition-colors">
            Embrace This Beautiful Journey
          </button>
        </div>

        {/* Right Column - Image */}
        <div className="flex justify-center">
          <div className="w-[536px] h-96 relative">
            <img src={banner} alt="Caring hands holding baby's hand illustration" className="object-contain" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
