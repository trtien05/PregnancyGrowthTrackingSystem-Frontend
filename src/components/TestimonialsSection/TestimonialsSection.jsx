import quote from '../../assets/images/quote.png';
import quote_small from '../../assets/images/quote_small.png';


const TestimonialsSection = () => {

  return (
    <div className="bg-thrid py-24 px-20">
      <div className="container relative">

        {/* Image Container */}
        <div className="absolute top-[0px] left-[40px] z-0">
          <img src={quote} alt="Quote" />
        </div>

        <div className='flex gap-8'>
          {/* Left */}
          <div className='w-[50%]'>
            {/* Header Section */}
            <div className=" ml-32 my-12 max-w-[500px]">
              <h2 className="text-[48px] font-[800] mb-3 text-[#111827]">
                Real Stories from
                <br />
                Real Customers
              </h2>
              <p className="text-[#111827] text-lg">
                Get inspired by these stories.
              </p>
            </div>
            <div className='bg-white rounded-xl p-8 shadow-sm w-[384px] h-[276px] ml-auto flex gap-3' >
              <div>
                <img src={quote_small} alt="quote" width={60} height={60} />
              </div>
              <div className='flex flex-col gap-3'>
                <div >
                  <p className="text-gray-800 mb-6 text-[18px]">
                    This platform makes me feel so supported. It&apos;s like having a personal pregnancy assistant and a community of moms all in one place!
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">
                    Emma L.
                  </h4>
                  <p className="text-gray-500 text-sm">
                    28, First-time mom, California, USA
                  </p>
                </div>
              </div>

            </div>
          </div>
          {/* Right */}
          <div className="flex flex-col gap-8 mt-36 w-[50%]">
            <div className={`bg-white rounded-xl p-8 shadow-sm w-[488px] h-[304px] flex gap-3`} >
              <div>
                <img src={quote_small} alt="quote" width={60} height={60} />
              </div>
              <div className='flex flex-col gap-3'>
                <div >
                  <p className="text-gray-800 mb-6 text-lg">
                    PregnaJoy has been a lifesaver during my pregnancy! The growth tracking charts help me monitor my baby&apos;s progress, and the reminders ensure I never miss an important check-up. Highly recommend for any expecting parent!
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg">
                    Rachel K.
                  </h4>
                  <p className="text-gray-500 text-sm">
                    31, 7 months pregnant, Amsterdam, Netherlands
                  </p>
                </div>
              </div>

            </div>
            <div className={`bg-white rounded-xl p-8 shadow-sm w-[384px] h-[276px] flex gap-3`} >
              <div>
                <img src={quote_small} alt="quote" width={60} height={60} />
              </div>
              <div className='flex flex-col gap-3'>
                <div >
                  <p className="text-gray-800 mb-6 text-lg">
                    I love seeing my baby&apos;s weekly progress! The growth charts help me stay informed, and the system even alerts me if something seems off.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg">
                    Jessica P.
                  </h4>
                  <p className="text-gray-500 text-sm">
                    30, First-time mom, Toronto, Canada
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>



      </div>
    </div>
  );
};

export default TestimonialsSection;