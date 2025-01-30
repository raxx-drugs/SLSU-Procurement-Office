import React from "react"
import pic from "../../assets/green1.jpg";

const Footer = () => {
  return (
    <footer className="relative text-white py-12">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${pic})`, // Use the imported image here
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/75" />
      </div>

      {/* Content with relative positioning to appear above the background */}
      <div className="px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">SLSU Procurement Office</h3>
            <p className="mb-4 text-gray-300">
              Empowering universities with efficient and transparent procurement solutions.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition duration-300">
                  <i className="fas fa-angle-right mr-2"></i>About Us
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-white transition duration-300">
                  <i className="fas fa-angle-right mr-2"></i>Services
                </a>
              </li>
              <li>
                <a href="#resources" className="text-gray-300 hover:text-white transition duration-300">
                  <i className="fas fa-angle-right mr-2"></i>Resources
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-300 hover:text-white transition duration-300">
                  <i className="fas fa-angle-right mr-2"></i>FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition duration-300">
                  <i className="fas fa-angle-right mr-2"></i>Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                  <i className="fas fa-angle-right mr-2"></i>E-Procurement Solutions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                  <i className="fas fa-angle-right mr-2"></i>Supplier Management
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                  <i className="fas fa-angle-right mr-2"></i>Contract Management
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                  <i className="fas fa-angle-right mr-2"></i>Spend Analytics
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300">
                <i className="fas fa-map-marker-alt mr-2"></i>Southern Luzon State University, Lucban, Quezon
              </li>
              <li className="flex items-center text-gray-300">
                <i className="fas fa-phone-alt mr-2"></i>(042) 540 4087
              </li>
              <li className="flex items-center text-gray-300">
                <i className="fas fa-envelope mr-2"></i>slsulucban@edu.ph
              </li>
              <li className="flex items-center text-gray-300">
                <i className="fas fa-globe mr-2"></i>www.slsu.edu.ph
              </li>
            </ul>
            <div className="mt-4 flex space-x-2">
              <a href="#" className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition duration-300">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition duration-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition duration-300">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition duration-300">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-300">© 2023 Southern Luzon State University | Lucban, Quezon, Philippines.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

