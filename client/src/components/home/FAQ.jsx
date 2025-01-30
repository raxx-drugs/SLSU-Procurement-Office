import React, { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import hello from "../../assets/Hello.png"

const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-4 last:mb-0">
      <button
        className={`flex justify-between items-center w-full py-4 px-6 text-left focus:outline-none rounded-lg transition-all duration-300 ${
          isOpen ? "bg-emerald-600 text-white" : "bg-white text-gray-800 hover:bg-emerald-50"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold flex items-center">
          <span className={`mr-3 text-2xl font-bold ${isOpen ? "text-emerald-200" : "text-emerald-600"}`}>
            {index + 1}.
          </span>
          {question}
        </span>
        <span className="text-emerald-600 transition-transform duration-300">
          {isOpen ? (
            <ChevronUp className={`h-6 w-6 ${isOpen ? "text-white" : ""}`} />
          ) : (
            <ChevronDown className="h-6 w-6" />
          )}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-600 py-4 px-6 bg-white rounded-b-lg shadow-inner">{answer}</p>
      </div>
    </div>
  )
}

const FAQ = () => {
  const faqs = [
    {
      question: "What is university procurement?",
      answer:
        "University procurement is the process of acquiring goods, services, and works for higher education institutions. It involves identifying needs, sourcing suppliers, negotiating contracts, and managing the entire purchasing process to ensure efficiency, cost-effectiveness, and compliance with regulations.",
    },
    {
      question: "How can e-procurement benefit our university?",
      answer:
        "E-procurement can streamline your purchasing processes, reduce paperwork, increase transparency, and potentially lead to cost savings. It also provides better spend visibility, helps in supplier management, and can improve overall efficiency in the procurement department.",
    },
    {
      question: "What types of goods and services does university procurement typically handle?",
      answer:
        "University procurement typically handles a wide range of goods and services, including office supplies, laboratory equipment, IT hardware and software, facilities management services, catering services, research materials, textbooks, and more.",
    },
    {
      question: "How does sustainable procurement apply to universities?",
      answer:
        "Sustainable procurement in universities involves considering environmental, social, and economic factors in purchasing decisions. This can include buying energy-efficient equipment, sourcing from local suppliers, considering the lifecycle costs of products, and ensuring ethical labor practices in the supply chain.",
    },
    {
      question: "What are the key challenges in university procurement?",
      answer:
        "Key challenges in university procurement include managing diverse stakeholder needs, ensuring compliance with regulations, balancing cost-effectiveness with quality, keeping up with technological advancements, and maintaining transparency in the procurement process.",
    },
    {
      question: "How can we improve supplier relationships in university procurement?",
      answer:
        "Improving supplier relationships can be achieved through clear communication, fair and transparent processes, timely payments, and collaborative problem-solving. Regular performance reviews and feedback sessions can also help strengthen these relationships.",
    },
  ]

  return (
    <section id="faq" className="h-full w-full flex items-center justify-center ">
      <div className="p-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h4 className="font-semibold mb-2 uppercase tracking-wide">FAQs</h4>
          <h2 className="text-4xl font-bold mb-4 ">Frequently Asked Questions</h2>
          <p className=" max-w-2xl mx-auto text-lg">
            Find answers to common questions about university procurement and our services. If you can't find what
            you're looking for, please don't hesitate to contact us.
          </p>
        </div>

        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 animate-fade-in-left">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/2 px-4 flex items-center justify-center">
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in-right group">
              <img
                src={hello || "/placeholder.svg"}
                alt="University procurement"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-emerald-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-2xl font-bold text-center px-6">
                  Empowering Universities through Smart Procurement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ

