"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Section, Button, Card, Badge } from '@/components/UI';
import { VPS_PLANS, OS_OPTIONS, LOCATION_OPTIONS, IP_OPTIONS, RAM_OPTIONS, CPU_OPTIONS } from '@/lib/constants';

import { Check, Info, Server, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/types/types';


const Configure: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
   const planId = searchParams?.get('plan'); 
  const plan = VPS_PLANS.find(p => p.id === planId);

  // Default States
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [hostname, setHostname] = useState('');
  const [selectedOS, setSelectedOS] = useState(OS_OPTIONS[0].id);
  const [selectedLocation, setSelectedLocation] = useState(LOCATION_OPTIONS[0].id);
  const [selectedIP, setSelectedIP] = useState(IP_OPTIONS[0].id);
  const [selectedRAM, setSelectedRAM] = useState(RAM_OPTIONS[0].id);
  const [selectedCPU, setSelectedCPU] = useState(CPU_OPTIONS[0].id);

  // Redirect if invalid plan
  useEffect(() => {
    if (!plan) {
      router.push('/plans');
    } else {
      // Set default hostname prefix
      setHostname(`server-${Math.random().toString(36).substring(2, 8)}`);
    }
  }, [plan, router]);

  if (!plan) return null;

  // Helper to get option details
  const getOption = (options: any[], id: string) => options.find(o => o.id === id);

  // Calculate Totals
  const calculateTotal = () => {
    let base = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceMonthly * 12 * 0.90; // 10% discount yearly
    
    // Addons
    const osPrice = getOption(OS_OPTIONS, selectedOS)?.priceMonthly || 0;
    const locPrice = getOption(LOCATION_OPTIONS, selectedLocation)?.priceMonthly || 0;
    const ipPrice = getOption(IP_OPTIONS, selectedIP)?.priceMonthly || 0;
    const ramPrice = getOption(RAM_OPTIONS, selectedRAM)?.priceMonthly || 0;
    const cpuPrice = getOption(CPU_OPTIONS, selectedCPU)?.priceMonthly || 0;

    let monthlyAddons = osPrice + locPrice + ipPrice + ramPrice + cpuPrice;
    
    if (billingCycle === 'yearly') {
      return base + (monthlyAddons * 12);
    }
    return base + monthlyAddons;
  };

  const totalDue = calculateTotal();

  const handleCheckout = () => {
    if (!hostname) {
      alert("Please enter a hostname.");
      return;
    }

    const newItem: CartItem = {
      id: crypto.randomUUID(),
      planId: plan.id,
      planName: plan.name,
      billingCycle,
      basePrice: billingCycle === 'monthly' ? plan.priceMonthly : plan.priceMonthly * 12 * 0.90,
      config: {
        hostname,
        extraIp: selectedIP,
        ram: selectedRAM,
        cpu: selectedCPU,
        os: selectedOS,
        location: selectedLocation
      },
      totalPrice: totalDue
    };

    addToCart(newItem);
    router.push('/cart');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-50 min-h-screen pb-12"
    >
      <div className="bg-slate-900 text-white pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Configure Server</h1>
          <p className="text-slate-400">Customize your instance specs and location.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: CONFIGURATION */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Plan Details Header */}
            <Card className="border-l-4 border-l-primary-600">
              <div className="flex justify-between items-start">
                <div>
                   <h2 className="text-xl font-bold text-slate-900">{plan.name}</h2>
                   <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-slate-600">
                     <span>{plan.vcpu} vCPU Core</span>
                     <span>{plan.ramGB} GB RAM</span>
                     <span>{plan.storageGB} GB {plan.storageType} Storage</span>
                     <span>{plan.bandwidthTB} TB Bandwidth</span>
                   </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">${plan.priceMonthly.toFixed(2)}</div>
                  <div className="text-xs text-slate-500">Monthly</div>
                </div>
              </div>
            </Card>

            {/* 2. Billing Cycle */}
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Choose Billing Cycle</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setBillingCycle('monthly')}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${billingCycle === 'monthly' ? 'border-primary-600 bg-primary-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-900">Monthly</span>
                    {billingCycle === 'monthly' && <div className="w-4 h-4 rounded-full bg-primary-600 flex items-center justify-center"><Check size={10} className="text-white"/></div>}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">${plan.priceMonthly.toFixed(2)} USD</div>
                </div>
                <div 
                  onClick={() => setBillingCycle('yearly')}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${billingCycle === 'yearly' ? 'border-primary-600 bg-primary-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-900">Annually</span>
                    {billingCycle === 'yearly' && <div className="w-4 h-4 rounded-full bg-primary-600 flex items-center justify-center"><Check size={10} className="text-white"/></div>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-sm text-slate-500">${(plan.priceMonthly * 12 * 0.90).toFixed(2)} USD</span>
                     <Badge color="green">Save 10%</Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* 3. Configure Server */}
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Configure Server</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Server Label / Hostname</label>
                <input 
                  type="text" 
                  value={hostname}
                  onChange={(e) => setHostname(e.target.value)}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-4 py-2 border font-mono text-sm"
                  placeholder="server-01" 
                />
                <p className="text-xs text-slate-400 mt-1">Can be changed later in the control panel.</p>
              </div>

              <div className="space-y-4">
                <ConfigSelect 
                  label="Operating System" 
                  options={OS_OPTIONS} 
                  value={selectedOS} 
                  onChange={setSelectedOS} 
                  billingCycle={billingCycle}
                />
                 <ConfigSelect 
                  label="Location" 
                  options={LOCATION_OPTIONS} 
                  value={selectedLocation} 
                  onChange={setSelectedLocation} 
                  billingCycle={billingCycle}
                />
              </div>
            </Card>

            {/* 4. Configurable Options */}
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Configurable Options</h3>
              <div className="space-y-4">
                <ConfigSelect 
                  label="Extra IPv4" 
                  options={IP_OPTIONS} 
                  value={selectedIP} 
                  onChange={setSelectedIP} 
                  billingCycle={billingCycle}
                />
                <ConfigSelect 
                  label="RAM Allocation" 
                  options={RAM_OPTIONS} 
                  value={selectedRAM} 
                  onChange={setSelectedRAM} 
                  billingCycle={billingCycle}
                />
                 <ConfigSelect 
                  label="CPU Allocation" 
                  options={CPU_OPTIONS} 
                  value={selectedCPU} 
                  onChange={setSelectedCPU} 
                  billingCycle={billingCycle}
                />
              </div>
            </Card>

          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-white shadow-lg border-t-4 border-t-slate-900">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="font-semibold text-slate-800">{plan.name}</div>
                  <div className="text-sm text-slate-500 pb-4 border-b border-slate-100">{billingCycle === 'monthly' ? 'Monthly' : 'Annually'} Billing</div>

                  {/* Dynamic Lines */}
                  <SummaryLine label="Extra IPv4" option={getOption(IP_OPTIONS, selectedIP)} billingCycle={billingCycle} />
                  <SummaryLine label="RAM" option={getOption(RAM_OPTIONS, selectedRAM)} billingCycle={billingCycle} />
                  <SummaryLine label="CPU" option={getOption(CPU_OPTIONS, selectedCPU)} billingCycle={billingCycle} />
                  <SummaryLine label="OS" option={getOption(OS_OPTIONS, selectedOS)} billingCycle={billingCycle} />
                  <SummaryLine label="Location" option={getOption(LOCATION_OPTIONS, selectedLocation)} billingCycle={billingCycle} />
                </div>

                <div className="border-t border-slate-200 pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 text-sm">Setup Fees:</span>
                    <span className="text-slate-900 font-mono">$0.00 USD</span>
                  </div>
                   <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 text-sm">{billingCycle === 'monthly' ? 'Monthly' : 'Annually'}:</span>
                    <span className="text-slate-900 font-mono">${totalDue.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                    <span className="text-lg font-bold text-slate-900">Total Due Today</span>
                    <span className="text-2xl font-bold text-primary-600">${totalDue.toFixed(2)}</span>
                  </div>
                </div>

                <Button onClick={handleCheckout} size="lg" className="w-full justify-center shadow-lg shadow-primary-500/30">
                  Continue
                </Button>
              </Card>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-slate-400">
                  By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

// --- SUB-COMPONENTS ---

const ConfigSelect: React.FC<{
  label: string;
  options: any[];
  value: string;
  onChange: (val: string) => void;
  billingCycle: 'monthly' | 'yearly';
}> = ({ label, options, value, onChange, billingCycle }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-4 py-2 pr-8 border text-sm"
        >
          {options.map((opt) => {
             const price = billingCycle === 'monthly' ? opt.priceMonthly : opt.priceMonthly * 12;
             const priceText = price > 0 ? `(+$${price.toFixed(2)} USD)` : '(Included)';
             return (
               <option key={opt.id} value={opt.id}>
                 {opt.name} {priceText}
               </option>
             );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
};

const SummaryLine: React.FC<{ label: string; option: any; billingCycle: 'monthly' | 'yearly' }> = ({ label, option, billingCycle }) => {
  if (!option) return null;
  const price = billingCycle === 'monthly' ? option.priceMonthly : option.priceMonthly * 12;
  return (
    <div className="flex justify-between text-xs">
      <span className="text-slate-500">» {label}: {option.name}</span>
      <span className="text-slate-700 font-mono">{price > 0 ? `$${price.toFixed(2)}` : '$0.00'}</span>
    </div>
  );
};

export default Configure;