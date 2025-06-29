import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <img src="/logo.jpg" alt="MediConnect Logo" className="mb-4 w-40" />
            <p className="text-gray-300">MediConnect is your trusted platform for booking doctor appointments and managing your healthcare online.</p>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Home</li>
              <li>About Us</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <p>Email: info@mediconnect.com</p>
              <p>Phone: +1 234 567 8900</p>
              <p>Address: 123 Health Street, Medical City</p>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 MediConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 