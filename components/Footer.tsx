"use client";
import React, { useState, useEffect } from 'react';

import { Menu, X, Server, Shield, Activity, MapPin, ExternalLink, ShoppingCart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from './UI';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white">
                <Server size={14} />
              </div>
              <span className="text-lg font-bold text-white">{APP_NAME}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium infrastructure for serious developers. Built for performance, tailored for reliability.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white hover:shadow-sm transition-all cursor-pointer">
                <ExternalLink size={14} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/plans" className="hover:text-blue-400 transition-colors">VPS Plans</Link></li>
              <li><Link href="/custom" className="hover:text-blue-400 transition-colors">Custom Build</Link></li>
              <li><Link href="/infrastructure" className="hover:text-blue-400 transition-colors">Network Map</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">API Docs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="tel:0767931405" className="hover:text-blue-400 transition-colors">0767931405</Link></li>
              <li><Link href="https://wa.me/+94767931405" target="_blank" className="hover:text-blue-400 transition-colors">Whatsapp</Link></li>
              {/* <li><Link href="#" className="hover:text-blue-400 transition-colors"></Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors"></Link></li> */}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/legal" className="hover:text-blue-400 transition-colors">SLA</Link></li>
              <li><Link href="/legal" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Status</h4>
            <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-950 px-3 py-2 rounded-md border border-blue-900 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              All Systems Operational
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Last updated: Just now
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {APP_NAME} Cloud Services, LLC. All rights reserved.
          </p>
          <div className="flex gap-2">
            <Shield size={16} className="text-gray-600" />
            <Activity size={16} className="text-gray-600" />
            <MapPin size={16} className="text-gray-600" />
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;