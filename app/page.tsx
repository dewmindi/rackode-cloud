"use client";
import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Button, Section, Card, Badge } from '../components/UI';
import Link from 'next/link';
import { FEATURES, INFRA_STATS, VPS_PLANS } from '@/lib/constants';
import { DatacenterMap } from '@/components/DatacenterMap';
import { TimedNotification } from '@/components/TimedNotification';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const PricingCard: React.FC<{ plan: any }> = ({ plan }) => (
  <Card className="h-full flex flex-col relative overflow-hidden" hoverEffect={true}>
    {plan.highlight && (
      <div className="absolute top-0 inset-x-0 h-1 bg-primary-600"></div>
    )}
    <div className="mb-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-slate-900">{plan.name}</h3>
        {plan.highlight && (
          <Badge color="green">Best Value</Badge>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-900">${plan.priceMonthly}</span>
        <span className="text-slate-500 text-sm">/mo</span>
      </div>
      <p className="text-xs text-slate-400 mt-1">Billed monthly</p>
    </div>

    <div className="space-y-4 mb-8 flex-grow">
      <div className="flex justify-between py-2 border-b border-slate-50">
        <span className="text-slate-500 text-sm">vCPU Core</span>
        <span className="font-mono font-medium text-slate-700">{plan.vcpu} Core</span>
      </div>
      <div className="flex justify-between py-2 border-b border-slate-50">
        <span className="text-slate-500 text-sm">Memory</span>
        <span className="font-mono font-medium text-slate-700">{plan.ramGB} GB</span>
      </div>
      <div className="flex justify-between py-2 border-b border-slate-50">
        <span className="text-slate-500 text-sm">Storage</span>
        <span className="font-mono font-medium text-slate-700">{plan.storageGB} GB {plan.storageType}</span>
      </div>
      <div className="flex justify-between py-2 border-b border-slate-50">
        <span className="text-slate-500 text-sm">Bandwidth</span>
        <span className="font-mono font-medium text-slate-700">{plan.bandwidthTB} TB</span>
      </div>
    </div>

    <Link href={`/configure?plan=${plan.id}`}>
      <Button 
        variant={plan.highlight ? 'primary' : 'outline'} 
        className="w-full justify-center"
        icon
      >
        Deploy Now
      </Button>
    </Link>
  </Card>
);

const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(headlineRef.current, 
        { y: 50, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
        { y: 0, opacity: 1, duration: 1.2, clipPath: 'inset(0 0 0% 0)' }
      )
      .fromTo(subRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.8"
      )
      .fromTo(ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.6"
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TimedNotification/>
      {/* HERO SECTION */}
      <section ref={heroRef} className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-600px h-600px bg-linear-to-br from-blue-50 to-transparent rounded-full opacity-50 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <Badge color="green" className="mb-6">v2.0 Infrastructure Now Live</Badge>
            <h1 ref={headlineRef} className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Reliable VPS Hosting. <br />
              <span className="text-primary-600">Built for Performance.</span>
            </h1>
            <p ref={subRef} className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mb-10">
              Deploy high-frequency cloud compute instances in seconds. 
              Transparent pricing, NVMe storage, and a network built for production workloads.
            </p>
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
              <Link href="/plans">
                <Button size="lg" variant="primary" icon>View VPS Plans</Button>
              </Link>
              <Link href="/custom">
                <Button size="lg" variant="outline">Configure Custom Build</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200/50">
            {INFRA_STATS.map((stat, idx) => (
              <div key={idx} className="py-8 px-4 text-center md:text-left">
                <div className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wide mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <Section id="pricing">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-600">
            No hidden fees, no long-term contracts. Pay for what you need with our straightforward monthly pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VPS_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">Need a custom configuration? <Link href="/custom" className="text-primary-600 font-medium hover:underline">Build your own VPS</Link></p>
        </div>
      </Section>

            {/* Datacenter Map */}
      <section className="px-4 md:px-8 py-12 md:py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Global Datacenter Network</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Our strategically located datacenters ensure low latency and high availability for your applications worldwide.
          </p>
          <DatacenterMap />
        </div>
      </section>

      {/* FEATURES GRID */}
      <Section background="gray">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">Why developers choose Rackode</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              We focus on the hardware so you can focus on your code. Our infrastructure is designed from the ground up to minimize latency and maximize throughput.
            </p>
            <Button variant="secondary" icon>Explore Infrastructure</Button>
          </div>
          
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {FEATURES.map((feature, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                    <feature.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* CTA SECTION */}
      <Section>
        <div className="bg-slate-900 rounded-2xl p-8 md:p-16 text-center md:text-left relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to deploy your next project?</h2>
              <p className="text-slate-400 text-lg">
                Get started with $100 in free credits for your first month. 
                Experience the difference of premium hardware.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 border-white">
                Create Free Account
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </motion.div>
  );
};

export default Home;