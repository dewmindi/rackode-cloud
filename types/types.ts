import React from 'react';

export interface VPSPlan {
  id: string;
  name: string;
  slug: string;
  priceMonthly: number;
  vcpu: number;
  ramGB: number;
  storageGB: number;
  storageType: 'NVMe' | 'SSD';
  bandwidthTB: number;
  networkSpeedGbps: number;
  highlight?: boolean;
}

export interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  path: string;
  isButton?: boolean;
}

export interface InfrastructureStat {
  label: string;
  value: string;
  subtext: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface ConfigOption {
  id: string;
  name: string;
  priceMonthly: number;
}

export interface CartItem {
  id: string;
  planId: string;
  planName: string;
  billingCycle: 'monthly' | 'yearly';
  basePrice: number;
  config: {
    hostname: string;
    extraIp: string;
    ram: string;
    cpu: string;
    os: string;
    location: string;
  };
  totalPrice: number;
}