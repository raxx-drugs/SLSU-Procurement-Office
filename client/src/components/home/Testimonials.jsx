import React from 'react';

const TestimonialItem = ({ content, name, position, university, image, index }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 relative animate-fade-in-up animation-delay-${index * 100}`}>
    <div className="text-primary text-4xl absolute top-4 left-4 opacity-25">&#x201C;</div>
    <div className="text-primary text-4xl absolute bottom-4 right-4 opacity-25">&#x201D;</div>
    <div className="mb-4">
      <img src={image || "/placeholder.svg"} alt={name} className="w-20 h-20 rounded-full mx-auto mb-4" />
      <p className="text-gray-600 text-center">{content}</p>
    </div>
    <div className="text-center">
      <h4 className="font-semibold text-gray-800">{name}</h4>
      <p className="text-sm text-gray-500">{position}</p>
      <p className="text-sm text-primary">{university}</p>
    </div>
  </div>
);

const Testimonials = () => {
  const testimonials = [
    {
      content: "UniProcure has transformed our procurement process, making it more efficient and cost-effective. Their platform is user-friendly and has significantly reduced our administrative workload.",
      name: "Dr. Jennifer Lee",
      position: "Director of Procurement",
      university: "Westfield University",
      image: "/placeholder.svg?height=80&width=80"
    },
    {
      content: "The level of support and expertise provided by UniProcure is unmatched. They truly understand the unique challenges faced by universities in procurement.",
      name: "Prof. Robert Taylor",
      position: "Dean of Administration",
      university: "Greenwood College",
      image: "/placeholder.svg?height=80&width=80"
    },
    {
      content: "UniProcure's analytics tools have given us valuable insights into our spending patterns, helping us make data-driven decisions and achieve substantial cost savings.",
      name: "Lisa Martinez",
      position: "Chief Financial Officer",
      university: "Lakeside Institute of Technology",
      image: "/placeholder.svg?height=80&width=80"
    }
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Testimonials</h2>
          <p className="max-w-2xl mx-auto text-gray-600">Hear what our clients have to say about their experience with UniProcure.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialItem key={index} {...testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

