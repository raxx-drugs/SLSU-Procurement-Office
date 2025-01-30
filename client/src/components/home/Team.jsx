import React from 'react';

const TeamMember = ({ name, position, image, index }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl animate-fade-in-up animation-delay-${index * 100}`}>
    <img src={image || "/placeholder.svg"} alt={name} className="w-full h-64 object-cover" />
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-1 text-gray-800">{name}</h3>
      <p className="text-gray-600 mb-4">{position}</p>
      <div className="flex justify-center space-x-4">
        <a href="#" className="text-primary hover:text-primary-dark transition duration-300">&#xf09a;</a>
        <a href="#" className="text-primary hover:text-primary-dark transition duration-300">&#xf099;</a>
        <a href="#" className="text-primary hover:text-primary-dark transition duration-300">&#xf0e1;</a>
      </div>
    </div>
  </div>
);

const Team = () => {
  const teamMembers = [
    {
      name: "Dr. Emily Carter",
      position: "Chief Procurement Officer",
      image: "/placeholder.svg?height=400&width=300"
    },
    {
      name: "Michael Chen",
      position: "Director of E-Procurement",
      image: "/placeholder.svg?height=400&width=300"
    },
    {
      name: "Sarah Thompson",
      position: "Supplier Relations Manager",
      image: "/placeholder.svg?height=400&width=300"
    },
    {
      name: "David Rodriguez",
      position: "Data Analytics Specialist",
      image: "/placeholder.svg?height=400&width=300"
    }
  ];

  return (
    <section className="h-full w-full flex justify-center items-center bg-white" id="team">
      <div className=" p-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Team</h2>
          <p className="max-w-2xl mx-auto text-gray-600">Meet our expert team dedicated to revolutionizing university procurement.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember key={index} {...member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;

