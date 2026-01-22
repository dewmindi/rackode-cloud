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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Order Confirmed!</h1>
          <p className="text-gray-700 mb-8">
            Thank you for your business. Your VPS instances are being provisioned and will be ready in a few minutes.
          </p>
          <div className="space-y-3">
            <Button onClick={() => window.location.href = '/portal'} className="w-full">
              Go to Portal
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full">
              Return Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get form data
      const formData = new FormData(e.target as HTMLFormElement);
      const customerEmail = formData.get('email') as string;
      const customerName = `${formData.get('firstName')} ${formData.get('lastName')}`;

      // Create Lemon Squeezy checkout session
      const response = await fetch('/api/lemonsqueezy/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          customerEmail,
          customerName,
          customPrice: Math.round(cartTotal * 100), // Convert to cents
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Lemon Squeezy checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
      
    } catch (error) {
      console.error('Error during checkout:', error);
      alert(error instanceof Error ? error.message : 'Failed to initiate checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-50 min-h-screen pt-8 pb-20"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-black mb-8 text-center">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Checkout Form */}
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <input required name="firstName" type="text" className="w-full rounded-md border-slate-300 border px-3 py-2" placeholder="John" />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <input required name="lastName" type="text" className="w-full rounded-md border-slate-300 border px-3 py-2" placeholder="Doe" />
                  </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input required name="email" type="email" className="w-full rounded-md border-slate-300 border px-3 py-2" placeholder="john@example.com" />
                </div>
              </div>

               <div>
                <h3 className="text-lg font-semibold text-black mb-4">Payment Method</h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <CreditCard className="text-blue-600" size={24} />
                    <span className="font-semibold text-black text-lg">Secure Payment via Lemon Squeezy</span>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    You'll be redirected to Lemon Squeezy's secure checkout page to complete your payment.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Lock size={12} />
                    <span>Accepts all major credit cards, PayPal, and more</span>
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full justify-center" disabled={loading}>
                {loading ? 'Processing...' : `Pay LKR${cartTotal.toFixed(2)}`}
              </Button>
            </form>
          </Card>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="bg-black text-white border-none">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              <div className="space-y-4 mb-8">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-4 border-b border-gray-800 last:border-0">
                    <div>
                      <div className="font-semibold">{item.planName}</div>
                      <div className="text-xs text-gray-400 mt-1">{item.config.hostname}</div>
                    </div>
                    <div className="text-right">
                      <div>LKR{item.totalPrice.toFixed(2)}</div>
                      <div className="text-xs text-gray-400">{item.billingCycle}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-gray-800">
                <span>Total</span>
                <span className="text-blue-400">LKR{cartTotal.toFixed(2)}</span>
              </div>
            </Card>
            
             <div className="mt-6 flex items-center gap-2 justify-center text-gray-600 text-sm">
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