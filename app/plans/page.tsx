"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';


import { Check, X } from 'lucide-react';
import { Button, Section } from '@/components/UI';
import { VPS_PLANS } from '@/lib/constants';
import Link from 'next/link';


const Plans: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Section className="text-center">
        <h1 className="text-4xl font-bold text-black mb-4">Select your configuration</h1>
        <p className="text-gray-700 mb-8">Scale resources up or down at any time.</p>
        
        <div className="inline-flex bg-gray-100 p-1 rounded-lg mb-12">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-white text-black shadow-sm' : 'text-gray-600 hover:text-black'}`}
          >
            Monthly
          </button>
           <button 
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${billingCycle === 'yearly' ? 'bg-white text-black shadow-sm' : 'text-gray-600 hover:text-black'}`}
          >
            Yearly <span className="text-blue-600 text-xs ml-1 font-bold">-10%</span>
          </button>
        </div>
      </Section>

      <Section background="white" className="pt-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b-2 border-gray-200 min-w-[200px]">Features</th>
                {VPS_PLANS.map(plan => (
                  <th key={plan.id} className="p-4 border-b-2 border-gray-200 min-w-[200px]">
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-bold text-black">{plan.name}</span>
                      <span className="text-2xl font-bold text-blue-500">
                        LKR {billingCycle === 'monthly' ? plan.priceMonthly : (plan.priceMonthly * 0.9).toFixed(2)}
                        <span className="text-sm text-gray-500 font-normal">/mo</span>
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-4 font-medium text-gray-700">vCPU Cores</td>
                {VPS_PLANS.map(plan => <td key={plan.id} className="p-4 font-mono text-black">{plan.vcpu}</td>)}
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-700">RAM</td>
                {VPS_PLANS.map(plan => <td key={plan.id} className="p-4 font-mono text-black">{plan.ramGB} GB</td>)}
              </tr>
               <tr>
                <td className="p-4 font-medium text-gray-700">Storage (NVMe)</td>
                {VPS_PLANS.map(plan => <td key={plan.id} className="p-4 font-mono text-black">{plan.storageGB} GB</td>)}
              </tr>
               <tr>
                <td className="p-4 font-medium text-gray-700">Bandwidth</td>
                {VPS_PLANS.map(plan => <td key={plan.id} className="p-4 font-mono text-black">{plan.bandwidthTB} TB</td>)}
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-700">Port Speed</td>
                {VPS_PLANS.map(plan => <td key={plan.id} className="p-4 font-mono text-black">{plan.networkSpeedGbps} Gbps</td>)}
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-700">IPv4 Address</td>
                {VPS_PLANS.map(plan => <td key={plan.id} className="p-4"><Check size={18} className="text-blue-500"/></td>)}
              </tr>
               <tr>
                <td className="p-4 font-medium text-gray-700">DDoS Protection</td>
                {VPS_PLANS.map(plan => <td key={plan.id} className="p-4"><Check size={18} className="text-blue-500"/></td>)}
              </tr>
              <tr>
                <td className="p-4"></td>
                {VPS_PLANS.map(plan => (
                  <td key={plan.id} className="p-4">
                    <Link href={`/configure?plan=${plan.id}`}>
                      <Button variant={plan.highlight ? 'primary' : 'outline'} size="sm" className="w-full">Select</Button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </motion.div>
  );
};

export default Plans;