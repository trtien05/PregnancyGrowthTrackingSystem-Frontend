import perDay from "../../assets/images/per-day.svg";
import clients from "../../assets/images/client.svg";
import users from "../../assets/images/users.svg";
import countries from "../../assets/images/countries.svg";

const AchievementsSection = () => {
  const stats = [
    { img: perDay, value: "10,000+", label: "Downloads per day" },
    { img: clients, value: "500+", label: "Clients" },
    { img: users, value: "2 Million", label: "Users" },
    { img: countries, value: "140", label: "Countries" },
  ];

  return (
    <div className="bg-[#FDF8F6] pt-60 pb-20 px-[120px]">
      <div className="container mx-auto flex justify-between">
        {/* Header Section */}
        <div className="mb-12  w-1/2">
          <h2 className="text-[48px] font-[800] mb-4 leading-tight">
            Our 18 years of achievements
          </h2>
          <p className="text-[18px] ">
            With all our love, we have achieved this
          </p>
        </div>

        {/* Stats Grid */}
        <div className="flex flex-row gap-36 w-1/2">
          {stats.reduce((acc, stat, index) => {
            if (index % 2 === 0) acc.push([]);
            acc[acc.length - 1].push(stat);
            return acc;
          }, []).map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col justify-between">
              {column.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center">
                    <img src={stat.img} alt={stat.label} />
                    <p className="text-[36px] font-[800]">{stat.value}</p>
                  </div>
                  <span className="text-gray-600 ml-12">{stat.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>;

      </div>
    </div>
  );
};

export default AchievementsSection;