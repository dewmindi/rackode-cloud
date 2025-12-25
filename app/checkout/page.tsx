"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { Lock, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button, Card } from '@/components/UI';

const Checkout: React.FC = () => {
  const { cartTotal, cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
          <p className="text-slate-600 mb-8">
            Thank you for your business. Your receipt has been emailed to you and your server is provisioning.
          </p>
          <Button onClick={() => window.location.href = '/'}>Return Home</Button>
        </Card>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setCompleted(true);
      clearCart();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 min-h-screen pt-8 pb-20"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Checkout Form */}
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <input required type="text" className="w-full rounded-md border-slate-300 border px-3 py-2" placeholder="John" />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <input required type="text" className="w-full rounded-md border-slate-300 border px-3 py-2" placeholder="Doe" />
                  </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input required type="email" className="w-full rounded-md border-slate-300 border px-3 py-2" placeholder="john@example.com" />
                </div>
              </div>

               <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Method</h3>
                <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-between border border-slate-200 mb-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-slate-500" />
                    <span className="font-medium text-slate-700">Credit / Debit Card</span>
                  </div>
                  <input type="radio" checked readOnly className="h-4 w-4 text-primary-600 focus:ring-primary-500" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                    <input required type="text" className="w-full rounded-md border-slate-300 border px-3 py-2" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Expiry</label>
                      <input required type="text" className="w-full rounded-md border-slate-300 border px-3 py-2" placeholder="MM/YY" />
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                      <input required type="text" className="w-full rounded-md border-slate-300 border px-3 py-2" placeholder="123" />
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full justify-center" disabled={loading}>
                {loading ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
              </Button>
            </form>
          </Card>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="bg-slate-900 text-white border-none">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              <div className="space-y-4 mb-8">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-4 border-b border-slate-700/50 last:border-0">
                    <div>
                      <div className="font-semibold">{item.planName}</div>
                      <div className="text-xs text-slate-400 mt-1">{item.config.hostname}</div>
                    </div>
                    <div className="text-right">
                      <div>${item.totalPrice.toFixed(2)}</div>
                      <div className="text-xs text-slate-400">{item.billingCycle}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-slate-700">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </Card>
            
             <div className="mt-6 flex items-center gap-2 justify-center text-slate-500 text-sm">
               <Lock size={14} />
               <span>256-bit SSL Secure Encryption</span>
             </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;