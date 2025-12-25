"use client";
import React from 'react';
import { motion } from 'framer-motion';


import { Trash2, ArrowLeft, ShoppingCart, Server } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Button, Card } from '@/components/UI';
import { OS_OPTIONS, LOCATION_OPTIONS } from '@/lib/constants';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, cartTotal } = useCart();


  // Helper to resolve name from ID
  const getName = (list: any[], id: string) => list.find(x => x.id === id)?.name || id;

  if (cartItems.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
          <ShoppingCart size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
        <p className="text-slate-500 mb-8">Looks like you haven't added any servers yet.</p>
        <Link href="/plans">
          <Button>Browse Plans</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 min-h-screen pb-20"
    >
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Review & Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="relative group overflow-hidden border-l-4 border-l-primary-500">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-slate-100 rounded-lg text-slate-600 hidden sm:block">
                       <Server size={24} />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-slate-900">{item.planName}</h3>
                       <div className="text-sm font-mono text-slate-500 mb-2">{item.config.hostname}</div>
                       
                       <div className="text-sm text-slate-600 space-y-1">
                         <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                           {getName(OS_OPTIONS, item.config.os)}
                         </div>
                          <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                           {getName(LOCATION_OPTIONS, item.config.location)}
                         </div>
                       </div>
                     </div>
                  </div>

                  <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end gap-4 mt-4 sm:mt-0">
                    <div className="text-right">
                       <div className="text-xl font-bold text-slate-900">${item.totalPrice.toFixed(2)}</div>
                       <div className="text-xs text-slate-500 uppercase">{item.billingCycle}</div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors flex items-center gap-1 text-sm"
                    >
                      <Trash2 size={16} /> <span className="sm:hidden">Remove</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}

            <div className="flex justify-between items-center pt-4">
               <Link href="/plans" className="text-primary-600 font-medium hover:underline flex items-center gap-2">
                 <ArrowLeft size={16} /> Continue Shopping
               </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
             <div className="sticky top-24">
               <Card className="shadow-lg">
                 <h3 className="text-lg font-bold text-slate-900 mb-4">Cart Summary</h3>
                 <div className="flex justify-between items-center py-2 border-b border-slate-100">
                   <span className="text-slate-600">Subtotal</span>
                   <span className="font-mono text-slate-900">${cartTotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-slate-100">
                   <span className="text-slate-600">Tax</span>
                   <span className="font-mono text-slate-900">$0.00</span>
                 </div>
                 <div className="flex justify-between items-center py-4">
                   <span className="text-xl font-bold text-slate-900">Total</span>
                   <span className="text-2xl font-bold text-primary-600">${cartTotal.toFixed(2)}</span>
                 </div>

                 <Link href="/checkout">
                    <Button size="lg" className="w-full justify-center">Checkout</Button>
                 </Link>
               </Card>
             </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Cart;