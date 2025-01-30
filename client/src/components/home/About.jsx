import React from 'react';
import slsu from "../../assets/Slsu.jpg"; 


const About = () => {
  return (
    <section id="about" className="h-full w-full py-20 items-start lg:items-center justify-center flex">
      <div className=" px-4 sm:px-6 lg:px-8 ">
        <div className="flex flex-wrap items-center">
          <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0 animate-fade-in-left">
            <h2 className="text-3xl font-bold mb-4 text-primary">About University Procurement</h2>
            <h3 className="text-4xl font-bold mb-6 text-text">Transforming Educational Purchasing</h3>
            <p className="mb-6 text-text">Our University Procurement Office is dedicated to revolutionizing how educational institutions manage their purchasing processes. We combine innovative technology with deep industry expertise to deliver efficient, transparent, and cost-effective procurement solutions.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start">
                <div className="text-primary text-3xl mr-4">&#128200;</div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-text">Strategic Sourcing</h4>
                  <p className="text-text">Optimize spending through data-driven procurement strategies.</p>
                </div>
              </div>
              <div className="flex items-start ">
                <div className="text-primary text-3xl mr-4">&#128176;</div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-text">Budget Optimization</h4>
                  <p className="text-text">Maximize resource allocation and reduce unnecessary expenses.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap sm:justify-center ">
              <div className="flex items-center">
                <div className="text-primary text-3xl mr-4">&#128222;</div>
                <div>
                  <h4 className="font-semibold text-text">Contact Us</h4>
                  <p className="text-lg text-primary">(042) 540 4087</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 px-4 animate-fade-in-right">
            <div className="relative">
              <img src={slsu} alt="University procurement team" className="w-full rounded-lg shadow-xl" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary rounded-full opacity-50"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

