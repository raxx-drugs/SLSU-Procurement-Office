import React from "react"
import { Target, Eye, Flag, ChevronRight } from "lucide-react"

const MissionVisionGoals = () => {
  return (
    <section id="mission" className="h-full w-full relative">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/green2.jpg-8ITv9Ijjz56ZYsnI06ROCl2dpEY2Rk.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>
      <div className=" h-full w-full">
        <div className="text-center mb-10 sm:mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white leading-tight">
            Our Mission, Vision, and Goals
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg px-4">
            Driving excellence in university procurement through innovation, collaboration, and sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto p-2">
          {/* Mission Card */}
          <div className="group transform transition duration-300 hover:scale-105">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 sm:p-8 h-full border border-white/10 hover:bg-white/15 transition-all duration-300">
              <div className="text-emerald-400 mb-4 sm:mb-6 flex justify-center">
                <Target className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white text-center">Our Mission</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                To revolutionize university procurement by providing cutting-edge solutions that streamline processes,
                reduce costs, and foster sustainable practices across higher education institutions.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="group transform transition duration-300 hover:scale-105">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 sm:p-8 h-full border border-white/10 hover:bg-white/15 transition-all duration-300">
              <div className="text-emerald-400 mb-4 sm:mb-6 flex justify-center">
                <Eye className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white text-center">Our Vision</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                To be the global leader in university procurement solutions, empowering educational institutions to
                achieve operational excellence and focus on their core mission of education and research.
              </p>
            </div>
          </div>

          {/* Goals Card */}
          <div className="group transform transition duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 sm:p-8 h-full border border-white/10 hover:bg-white/15 transition-all duration-300">
              <div className="text-emerald-400 mb-4 sm:mb-6 flex justify-center">
                <Flag className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white text-center">Our Goals</h3>
              <ul className="text-gray-300 space-y-2 sm:space-y-3 text-sm sm:text-base">
                {[
                  "Optimize procurement processes for 1000+ universities by 2025",
                  "Reduce procurement costs for our clients by an average of 20%",
                  "Achieve 100% compliance with sustainability standards",
                  "Foster innovation through collaborative partnerships",
                ].map((goal, index) => (
                  <li key={index} className="flex items-start">
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-1 flex-shrink-0 text-emerald-400" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>


    </section>
  )
}

export default MissionVisionGoals

