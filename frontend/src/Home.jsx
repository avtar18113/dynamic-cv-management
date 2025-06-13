import React from 'react'
import { useState } from 'react';
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">Logo</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
              <a href="#" className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Home</a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Features</a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Pricing</a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium">About</a>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-300">
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <a href="#" className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Home</a>
              <a href="#" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Features</a>
              <a href="#" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Pricing</a>
              <a href="#" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">About</a>
              <div className="px-5 py-3">
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition duration-300">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Build amazing digital experiences
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Our platform helps you create beautiful websites and applications with ease. Get started today and bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition duration-300 flex items-center justify-center">
                Get Started <FiArrowRight className="ml-2" />
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition duration-300">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="bg-gray-100 rounded-lg h-64 md:h-80 flex items-center justify-center">
                <span className="text-gray-400">Hero Image/Illustration</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to build modern web applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy to Use",
                description: "Intuitive interface that makes building applications a breeze.",
                icon: "🚀"
              },
              {
                title: "Fully Responsive",
                description: "Looks great on any device, from desktop to mobile.",
                icon: "📱"
              },
              {
                title: "Customizable",
                description: "Tailor every aspect to fit your brand and needs.",
                icon: "🎨"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who are already building amazing things with our platform.
          </p>
          <button className="bg-white text-indigo-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition duration-300">
            Sign Up for Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Tutorials</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaGithub size={24} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaTwitter size={24} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaLinkedin size={24} /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home