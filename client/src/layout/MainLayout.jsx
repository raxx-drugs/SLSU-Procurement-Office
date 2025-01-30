import React from 'react'
import Header from '../components/home/Header'
import Hero from '../components/home/Hero'
import SignIn from '../components/home/SignIn'
import About from '../components/home/About'
import MissionVisionGoals from '../components/home/MissionVisionGoals'
import Services from '../components/home/Services'
import Resources from '../components/home/Resources'
import Team from '../components/home/Team'
import FAQ from '../components/home/FAQ'
import ContactUs from '../components/home/ContactUs'
import Footer from '../components/home/Footer'

export default function MainLayout() {
  return (
    <div className={`grid grid-col-[auto_1fr_auto] min-h-screen bg-[#fafafa] w-full `}>
        <div className={`fixed top-0 z-50`}>
          <Header/>
        </div>
        <div className={`grid-user-main h-full w-full min-h-screen`}>
          {/* Section 1 */}
          <div className={`xxs:h-auto lg:h-full lg:max-h-screen w-full relative flex flex-col`}>    
            <div className={`w-full h-full opacity-70`}> 
              <Hero/>
            </div>
            <div className={` lg:absolute lg:top-0 lg:right-0 lg:w-2/5 w-full h-full relative`}>
               <div className={`bg-gray-500 opacity-50 h-full w-full absolute hidden lg:block`}></div>
              <div className={`h-full w-full backdrop-blur-xl xxs:py-10`}>
                <SignIn/>
              </div>
            </div>
          </div>

           {/* Section 2 */}
           <div className={`xxs:h-auto lg:h-full lg:max-h-screen w-full relative`}>
              <About/>
           </div>
           {/* Section 3 */}
           <div className={`xxs:h-auto lg:h-full lg:max-h-screen w-full relative`}>
              <MissionVisionGoals/>
           </div>
           {/* Section 4 */}
           <div className={`xxs:h-auto lg:h-full lg:max-h-screen w-full relative`}>
              <Services/>
           </div>
           {/* Section 5 */}
           <div className={`xxs:h-auto lg:h-full lg:max-h-screen w-full relative`}>
              <Resources/>
           </div>
           {/* Section 6*/}
           <div className={`xxs:h-auto lg:h-full lg:max-h-screen w-full relative`}>
              <Team/>
           </div>
           {/* Section 7*/}
           <div className={`xxs:h-auto lg:h-full lg:max-h-screen w-full relative`}>
              <FAQ/>
           </div>
            {/* Section 8*/}
           <div className={`xxs:h-auto w-full relative`}>
              <ContactUs/>
           </div>
           <div className={`grid-user-footer h-32 bg-green-300`}>
               <Footer/>
           </div>
        </div>
    </div>
  )
}
