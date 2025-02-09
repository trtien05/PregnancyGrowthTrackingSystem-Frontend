import avatar1 from '../../assets/images/avatar.png';
import avatar2 from '../../assets/images/avatar_1.png';
import avatar3 from '../../assets/images/avatar_2.png';
import elipse from '../../assets/images/elipse.png';

const TeamSection = () => {
  const teamMembers = [
    {
      title: 'Professor',
      imgSrc: avatar3
    },
    {
      title: 'Professor',
      imgSrc: avatar1
    },
    {
      title: 'Professor',
      imgSrc: avatar2
    }
  ];

  return (
    <div className="bg-primary py-16 px-4">
      <div className="container mx-auto relative ">
        {/* Section Header */}
        <div className="text-center mb-16 relative z-10 ">
          <div className="max-w-4xl mx-auto text-right">
            <h2 className="text-[60px] font-[700] ">
              Your pregnancy journey,
            </h2>
            <span className="text-[60px] font-[700] text-[#A4A29C]">
              guided with care and precision
            </span>
          </div>

        </div>

        {/* Elipse Image */}
        <div className="absolute top-[180px] right-[40px] z-0">
          <img src={elipse} alt="Elipse" width={693} height={693} />
        </div>
        {/* Team Cards */}
        <div className="flex items-center justify-center gap-8 relative z-10">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl w-[416px] h-[547px]  p-7 shadow-xl  transition-shadow duration-300"
            >
              {/* Image Container */}
              <div className="w-60 mx-auto mb-6 p-7 overflow-hidden ">
                <img
                  src={member.imgSrc}
                  alt="Medical Professional"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Content */}
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">John Doe</h3>
                <p className="text-gray-500">{member.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;