
import { ConfigOption, FeatureItem, InfrastructureStat, NavLink, VPSPlan } from '@/types/types';
import { ShieldCheck, Cpu, Globe, Zap, Clock, HardDrive } from 'lucide-react';

export const APP_NAME = "Rackode";

export const NAV_LINKS: NavLink[] = [
  { label: 'Infrastructure', path: '/infrastructure' },
  { label: 'VPS Plans', path: '/plans' },
  { label: 'Custom Build', path: '/plans' },
  { label: 'Contact', path: '/contact' },
  { label: 'Client Portal', path: '#portal', isButton: true },
];

export const VPS_PLANS: VPSPlan[] = [
  {
    id: 'starter',
    name: 'Dev Sandbox',
    slug: 'dev-sandbox',
    priceMonthly: 500,
    vcpu: 1,
    ramGB: 1,
    storageGB: 25,
    storageType: 'NVMe',
    bandwidthTB: 2,
    networkSpeedGbps: 1,
  },
  {
    id: 'pro',
    name: 'Production Entry',
    slug: 'production-entry',
    priceMonthly: 850,
    vcpu: 2,
    ramGB: 2.5,
    storageGB: 45,
    storageType: 'NVMe',
    bandwidthTB: 3,
    networkSpeedGbps: 1,
    highlight: true,
  },
  {
    id: 'business',
    name: 'Scale Up',
    slug: 'scale-up',
    priceMonthly: 1170,
    vcpu: 3,
    ramGB: 4,
    storageGB: 65,
    storageType: 'NVMe',
    bandwidthTB: 6,
    networkSpeedGbps: 1, // Highlight faster speed
  },
  {
    id: 'enterprise',
    name: 'Powerhouse',
    slug: 'powerhouse',
    priceMonthly: 2170,
    vcpu: 5,
    ramGB: 6,
    storageGB: 100,
    storageType: 'NVMe',
    bandwidthTB: 10,
    networkSpeedGbps: 1,
  },
    {
    id: 'premium',
    name: 'Data Center Pro',
    slug: 'Data Center Pro',
    priceMonthly: 2170,
    vcpu: 6,
    ramGB: 8,
    storageGB: 150,
    storageType: 'NVMe',
    bandwidthTB: 20,
    networkSpeedGbps: 1,
  },
];

export const FEATURES: FeatureItem[] = [
  {
    icon: Zap,
    title: 'Pure NVMe Storage',
    description: 'Enterprise-grade NVMe drives in RAID-10 for maximum I/O performance and data redundancy.',
  },
  {
    icon: Cpu,
    title: 'High-Frequency Compute',
    description: 'Powered by the latest generation AMD EPYC processors for raw processing power.',
  },
  {
    icon: ShieldCheck,
    title: 'DDoS Protection',
    description: 'Always-on comprehensive layer 3/4 mitigation included with every instance.',
  },
  {
    icon: Globe,
    title: 'Global Low-Latency',
    description: 'Strategically located datacenters ensuring <20ms latency to major internet exchanges.',
  },
  {
    icon: Clock,
    title: '99.99% Uptime SLA',
    description: 'Financially backed service level agreement. We take reliability personally.',
  },
  {
    icon: HardDrive,
    title: 'Automated Snapshots',
    description: 'Set-and-forget backup policies. Restore your entire instance in seconds.',
  },
];

export const INFRA_STATS: InfrastructureStat[] = [
  { label: 'Network Capacity', value: '40 Tbps+', subtext: 'Global Backbone' },
  { label: 'Uptime', value: '99.99%', subtext: 'Guaranteed SLA' },
  { label: 'Deploy Time', value: '< 60s', subtext: 'Instant Provisioning' },
  { label: 'Locations', value: '12', subtext: 'Global Regions' },
];

// --- NEW CONFIGURATION CONSTANTS ---

export const OS_OPTIONS: ConfigOption[] = [
  { id: 'ubuntu-24', name: 'Ubuntu 24.04 64 Bit', priceMonthly: 0 },
  { id: 'ubuntu-22', name: 'Ubuntu 22.04 64 Bit', priceMonthly: 0 },
  { id: 'debian-12', name: 'Debian 12 64 Bit', priceMonthly: 0 },
  { id: 'almalinux-9', name: 'AlmaLinux 9 64 Bit', priceMonthly: 0 },
  { id: 'windows-2022', name: 'Windows Server 2022 Standard', priceMonthly: 15 },
];

export const LOCATION_OPTIONS: ConfigOption[] = [
  { id: 'nyc', name: 'New York (Test IP: 192.3.81.8)', priceMonthly: 0 },
  { id: 'la', name: 'Los Angeles', priceMonthly: 0 },
  { id: 'chi', name: 'Chicago', priceMonthly: 0 },
  { id: 'ams', name: 'Amsterdam', priceMonthly: 0 },
  { id: 'sgp', name: 'Singapore', priceMonthly: 5 },
];

export const IP_OPTIONS: ConfigOption[] = [
  { id: 'none', name: 'None', priceMonthly: 0 },
  { id: '1-ip', name: '+1 Extra IP', priceMonthly: 2.50 },
  { id: '2-ip', name: '+2 Extra IPs', priceMonthly: 5.00 },
  { id: '5-ip', name: '+5 Extra IPs', priceMonthly: 12.00 },
];

export const RAM_OPTIONS: ConfigOption[] = [
  { id: 'included', name: 'Included RAM', priceMonthly: 0 },
  { id: '1gb', name: '+1 GB RAM', priceMonthly: 4.00 },
  { id: '2gb', name: '+2 GB RAM', priceMonthly: 8.00 },
  { id: '4gb', name: '+4 GB RAM', priceMonthly: 15.00 },
];

export const CPU_OPTIONS: ConfigOption[] = [
  { id: 'included', name: 'Included CPU Cores', priceMonthly: 0 },
  { id: '1core', name: '+1 CPU Core', priceMonthly: 5.00 },
  { id: '2core', name: '+2 CPU Cores', priceMonthly: 10.00 },
];