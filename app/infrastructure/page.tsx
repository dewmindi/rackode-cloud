"use client";
import React from 'react';
import { motion } from 'framer-motion';

import { Server, Shield, Network, Zap } from 'lucide-react';
import { Card, Section, Badge } from '@/components/UI';

const TechSpec: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between border-b border-slate-100 py-3 last:border-0">
    <span className="text-slate-500 font-medium">{label}</span>
    <span className="text-slate-900 font-mono">{value}</span>
  </div>
);

const Infrastructure: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Section className="pb-8">
        <div className="max-w-3xl">
          <Badge color="gray">Infrastructure</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">Built on Enterprise Hardware</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            We don't cut corners. Every Rackode node is built with the latest generation components to ensure consistent, high-velocity performance for your workloads.
          </p>
        </div>
      </Section>

      <Section background="gray">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Server className="text-primary-600" />
              Compute Nodes
            </h2>
            <Card className="shadow-sm">
              <TechSpec label="Processor" value="AMD EPYC™ 7003 Series" />
              <TechSpec label="Base Clock" value="2.45 GHz" />
              <TechSpec label="Boost Clock" value="3.50 GHz" />
              <TechSpec label="Instruction Set" value="x86-64" />
              <TechSpec label="Virtualization" value="KVM" />
            </Card>
            <p className="text-sm text-slate-500 mt-4">
              Our hypervisors are tuned for low-latency operation, ensuring minimal steal time and maximum raw performance available to your guest OS.
            </p>
          </div>
          <div>
             <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Zap className="text-primary-600" />
              Storage Architecture
            </h2>
            <Card className="shadow-sm">
              <TechSpec label="Drive Type" value="Enterprise NVMe Gen4" />
              <TechSpec label="RAID Configuration" value="RAID 10" />
              <TechSpec label="IOPS (Random 4K)" value="100,000+" />
              <TechSpec label="Throughput" value="5 GB/s" />
              <TechSpec label="Redundancy" value="Dual Parity" />
            </Card>
             <p className="text-sm text-slate-500 mt-4">
              We use strictly NVMe storage. No spinning rust, no hybrid caching. Direct PCIe Gen4 attachment for blistering fast database queries and compilation times.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Global Network Map</h2>
          <p className="text-slate-600">
            Our premium tier-1 network blend ensures your data takes the shortest path to your users.
          </p>
        </div>
        
        <div className="relative bg-slate-900 rounded-xl p-8 overflow-hidden min-h-[400px] flex items-center justify-center">
           <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-10 bg-center"></div>
           
           <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
             {[
               { city: 'New York', code: 'NYC1' },
               { city: 'San Francisco', code: 'SFO2' },
               { city: 'London', code: 'LHR1' },
               { city: 'Frankfurt', code: 'FRA1' },
               { city: 'Singapore', code: 'SIN1' },
               { city: 'Tokyo', code: 'NRT1' },
             ].map((loc) => (
               <div key={loc.code} className="group cursor-default">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto mb-2 shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:scale-125 transition-transform"></div>
                  <div className="text-white font-medium">{loc.city}</div>
                  <div className="text-xs text-slate-500 font-mono">{loc.code}</div>
               </div>
             ))}
           </div>
        </div>
      </Section>
    </motion.div>
  );
};

export default Infrastructure;