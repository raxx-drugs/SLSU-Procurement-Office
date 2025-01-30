import React, { useState, useEffect } from "react"
import slsu from "../../assets/Slsu.jpg"
import Section2_img from "../../assets/Section2-img.png"
import Hello from "../../assets/Hello.png"
import SignIn from "./SignIn"



const slides = [
  {
    image: slsu,
    title: "Streamline University Procurement",
    description: "Efficient, transparent, cost-effective solutions for higher education.",
  },
  {
    image: Section2_img, 
    title: "Innovative Higher Education Solutions",
    description: "Optimize processes with cutting-edge procurement technology.",
  },
  {
    image: Hello,
    title: "Empower Educational Excellence",
    description: "Enhance capabilities, focus on education and research.",
  },
]

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (

    <div id="home" className="relative bg-gray-900 min-h-96 text-white w-full h-full flex items-center overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out  ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
          }`}
        >
          <img
            src={slide.image || "/placeholder.svg"}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover "
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>
      ))}
      <div className=" px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight animate-fade-in-down lg:max-w-3/4">
            {slides[currentSlide].title}
          </h1>
          <p className="text-base sm:text-lg mb-6 animate-fade-in-up max-w-xl">{slides[currentSlide].description}</p>
          <div className="flex flex-col sm:flex-row justify-start items-start space-y-3 sm:space-y-0 sm:space-x-3 animate-fade-in-up animation-delay-300">
            <a
              href="#contact"
              className="hover:scale-150 text-primary px-5 py-2 backdrop-blur-xl rounded-md font-semibold text-sm hover:bg-primary hover:text-white transition duration-300 shadow-xl hover:shadow-lg"
            >
              Explore Now  &gt; &gt; 
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white w-4" : "bg-gray-400 hover:bg-gray-300"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  )
}

export default Hero

