import React from 'react';

const ResourceItem = ({ title, description, image, category, author, date, index }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl animate-fade-in-up animation-delay-${index * 100}`}>
    <div className="relative">
      <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
      <div className="absolute top-0 left-0 bg-primary text-white py-1 px-3 m-2 rounded">
        {category}
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center">
        <img src="/placeholder.svg?height=40&width=40" alt={author} className="w-10 h-10 rounded-full mr-4" />
        <div>
          <p className="font-semibold text-gray-800">{author}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
    </div>
  </div>
);

const Resources = () => {
  const resources = [
    {
      title: "Best Practices in University Procurement",
      description: "Learn about the latest trends and best practices in higher education procurement.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Guide",
      author: "Dr. Jane Smith",
      date: "May 15, 2023"
    },
    {
      title: "Sustainable Procurement in Higher Education",
      description: "Discover how universities can implement sustainable procurement strategies.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Whitepaper",
      author: "Prof. John Doe",
      date: "June 2, 2023"
    },
    {
      title: "Leveraging Technology in University Procurement",
      description: "Explore how technology is transforming procurement processes in higher education.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Webinar",
      author: "Sarah Johnson",
      date: "June 20, 2023"
    }
  ];

  return (
    <section id="resources" className="h-full w-full flex justify-center items-center">
      <div className=" p-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Resources</h2>
          <p className="max-w-2xl mx-auto text-gray-600">Stay informed with our latest insights, guides, and webinars on university procurement.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <ResourceItem key={index} {...resource} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resources;

