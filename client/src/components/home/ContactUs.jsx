import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', phone: '', project: '', subject: '', message: '' });
    alert('Thank you for your message. We will get back to you soon!');
  };

  return (
    <section id="contact" className="h-auto w-full flex items-center justify-center ">
      <div className="h-full w-full lg:p-10 pt-28">
        <div className={` h-full w-full flex flex-col`}>
          <div className="text-center p-4 rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800">Contact Us</h2>
            <p className="text-gray-600">Get in touch with our procurement office</p>
          </div>
          <div className={`flex flex-wrap `}>
            <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
              <div className="bg-white rounded-lg shadow-lg p-2 lg:p-8 mb-8">
                <h4 className="text-2xl font-semibold text-primary mb-6">Get in Touch</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="text-primary text-2xl mr-4">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold mb-2">Address</h5>
                      <p className="text-gray-600">Lucban - Tayabas Rd, Lucban, 4328 Quezon</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-primary text-2xl mr-4">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold mb-2">Email Us</h5>
                      <p className="text-gray-600">slsulucban@edu.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-primary text-2xl mr-4">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold mb-2">Call Us</h5>
                      <p className="text-gray-600">(042) 540 4087</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-primary text-2xl mr-4">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold mb-2">Working Hours</h5>
                      <p className="text-gray-600">Mon - Fri: 9:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-2 lg:p-8">
                <h4 className="text-2xl font-semibold text-primary mb-6">Send Us a Message</h4>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your Phone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="project"
                        value={formData.project}
                        onChange={handleChange}
                        placeholder="Your Project"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Subject"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your Message"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      ></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-dark transition duration-300"
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <div className="bg-white rounded-lg shadow-lg lg:p-8 h-full">
                <iframe
                  title="University Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1963.4232003556315!2d121.56014274899937!3d14.112748522790167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd538ac62e0daf%3A0x8f0c8e2dcd66050d!2sSouthern%20Luzon%20State%20University!5e0!3m2!1sen!2sph!4v1736996767357!5m2!1sen!2sph"
                  className="w-full rounded-lg"
                  style={{ border: 0, minHeight: '100%' }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>

          </div>
          
        </div>

   
      </div>
    </section>
  );
};

export default ContactUs;

