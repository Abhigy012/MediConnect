import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../../assets/logo.jpg"

const Footer = () => {
  return (
    <footer className="px-4 py-12 mt-20 text-white bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo and Description */}
          <div>
            <img src={logo} alt="MediConnect Logo" className="w-40 mb-4" />
            <p className="text-gray-300">MediConnect is your trusted platform for booking doctor appointments and managing your healthcare online.</p>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Home</li>
              <li>About Us</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <p>Email: info@mediconnect.com</p>
              <p>Phone: +1 234 567 8900</p>
              <p>Address: 123 Health Street, Medical City</p>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="pt-8 mt-8 text-center border-t border-gray-700">
          <p className="text-gray-300">
            © 2024 MediConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 