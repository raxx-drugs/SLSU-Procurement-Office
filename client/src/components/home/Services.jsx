import React from 'react';

const ServiceItem = ({ title, description, icon, index }) => (
  <div className={`bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl animate-fade-in-up animation-delay-${index * 100}`}>
    <div className="p-6">
      <div className="text-primary text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-text">{title}</h3>
      <p className="text-text mb-4">{description}</p>
      <a href="#contact" className="text-primary font-semibold hover:underline">Learn More</a>
    </div>
  </div>
);

const Services = () => {
  const services = [
    {
      title: "E-Procurement Platform",
      description: "Streamline your university's procurement process with our intuitive e-procurement solution.",
      icon: "🖥️"
    },
    {
      title: "Vendor Management",
      description: "Efficiently manage and evaluate your supplier relationships for better outcomes.",
      icon: "🤝"
    },
    {
      title: "Contract Administration",
      description: "Centralize and automate your contract lifecycle for improved compliance and savings.",
      icon: "📄"
    },
    {
      title: "Spend Analytics",
      description: "Gain valuable insights into your institution's spending patterns to identify savings opportunities.",
      icon: "📊"
    }
  ];

  return (
    <section id="services" className="w-full h-full flex justify-center items-center">
      <div className="p-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4 text-text">Our Services</h2>
          <p className="max-w-2xl mx-auto text-text">We offer a comprehensive range of procurement services designed to meet the unique needs of higher education institutions.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceItem key={index} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

