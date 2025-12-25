'use client';
import { usePathname } from 'next/navigation';

import React, { useState, useEffect } from 'react';

import { Menu, X, Server, Shield, Activity, MapPin, ExternalLink, ShoppingCart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { APP_NAME, NAV_LINKS } from '@/lib/constants';
import { Button } from './UI';
import { useCart } from '../context/CartContext';
import Link from 'next/link';


// --- NAVBAR ---
const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const { cartItems } = useCart(); // Access cart items

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled || isMobileOpen ? 'bg-white/90 backdrop-blur-md border-slate-200 py-3 shadow-sm' : 'bg-transparent border-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white group-hover:bg-primary-700 transition-colors">
              <Server size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">{APP_NAME}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              link.isButton ? (
                <Button key={link.path} variant="outline" size="sm" onClick={() => console.log("External portal link")}>
                  {link.label}
                </Button>
              ) : (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary-600 ${pathname === link.path ? 'text-primary-600' : 'text-slate-600'
                    }`}
                >
                  {link.label}
                </Link>
              )
            ))}

            {/* Cart Icon */}
            <Link href="/cart" className="relative text-slate-600 hover:text-primary-600 transition-colors">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <Link href="/cart" className="relative text-slate-600">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button
              className="p-2 text-slate-600"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              {NAV_LINKS.map((link) => (
                link.isButton ? (
                  <Button key={link.path} variant="primary" className="w-full justify-center">
                    {link.label}
                  </Button>
                ) : (
                  <Link
                    key={link.path}
                    href={link.path}
                    className="text-base font-medium text-slate-700 py-2 block border-b border-slate-50"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default Navbar;