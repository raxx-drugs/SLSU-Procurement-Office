import React, { useState, useEffect } from 'react';
import { IoMenuOutline } from "react-icons/io5";
import logo from '../../assets/SLSU logo.png'


// Reusable component for links
const HeaderLink = ({ href, label, isScrolled }) => (
  <a
    href={href}
    className={`transition-colors duration-300 ${isScrolled ? 'text-primary' : 'text-gray-800'}`}
  >
    {label}
  </a>
);

// Reusable Top Info Links
const InfoLink = ({ href, iconClass, text }) => (
  <a href={href} className="text-sm text-gray-600 hover:text-primary flex items-center space-x-2">
    <i className={`${iconClass} text-primary`}></i>
    <span>{text}</span>
  </a>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = ['Home', 'About', 'Mission', 'Services', 'Resources', 'Contact'];

  return (
    <header className={`w-full fixed top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-200' : ' bg-white shadow-md'}`}>
      {/* Section 1: Contact Info */}
      <div className="bg-gray-100 py-2 hidden lg:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <InfoLink href="#" iconClass="fas fa-map-marker-alt" text="Find A Location" />
              <InfoLink href="tel:+15551234567" iconClass="fas fa-phone-alt" text="(042) 540 4087" />
              <InfoLink href="mailto:info@uniprocure.com" iconClass="fas fa-envelope" text="slsulucban@edu.ph" />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Logo and Navigation */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center ">
        {/* Logo */}
        <a href="/" className={`flex items-center gap-2 text-xl font-bold transition-colors duration-300 ${isScrolled ? 'text-primary' : 'text-gray-800'}`}>
          <img src={logo}alt="" className={`size-10 `}/>
          <span className={`lg:block xxs:hidden`}>Southern Luzon State University Procurement Office</span>
          <span className={`lg:hidden xxs:block xxs:text-sm`}>SLSU Procurement Office</span>
        </a>
        {/* Main Navigation */}
        <nav className="hidden md:flex space-x-4">
          {menuItems.map((item) => (
            <HeaderLink key={item} href={`#${item.toLowerCase()}`} label={item} isScrolled={isScrolled} />
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          <IoMenuOutline className={`${isScrolled ? 'text-primary' : 'text-gray-800'} size-6`} />
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-lg rounded-md mt-2 py-2 px-4 space-y-2">
          {menuItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="block py-2 px-4 text-sm text-gray-800 hover:bg-gray-200">
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
