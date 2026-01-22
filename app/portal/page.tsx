"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, Power, RotateCw, PowerOff, Monitor, Activity, HardDrive, Cpu, RefreshCw } from 'lucide-react';
import { Button, Card } from '@/components/UI';

interface VPSInstance {
  vpsId: string;
  ipAddress: string;
  rootPassword: string;
  createdAt: string;
  status?: string;
  hostname?: string;
  node?: string;
  mem?: string;
  hdd?: string;
}

const Portal: React.FC = () => {
  const [vpsInstances, setVPSInstances] = useState<VPSInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadVPSInstances();
  }, []);

  const loadVPSInstances = async () => {
    try {
      // Load from localStorage (in production, fetch from your database)
      const storedVPS = JSON.parse(localStorage.getItem('userVPS') || '[]');
      
      // Fetch latest status for each VPS
      const vpsWithStatus = await Promise.all(
        storedVPS.map(async (vps: VPSInstance) => {
          try {
            const response = await fetch(`/api/solusvm/vps-info?vpsId=${vps.vpsId}`);
            const data = await response.json();
            
            if (data.success) {
              return {
                ...vps,
                ...data.data,
              };
            }
          } catch (error) {
            console.error('Error fetching VPS status:', error);
          }
          return vps;
        })
      );

      setVPSInstances(vpsWithStatus);
    } catch (error) {
      console.error('Error loading VPS instances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVPSAction = async (vpsId: string, action: string) => {
    setActionLoading(vpsId);
    try {
      const response = await fetch('/api/solusvm/vps-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vpsId, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Action failed');
      }

      alert(`Action '${action}' completed successfully!`);
      
      // Refresh VPS list after action
      setTimeout(() => loadVPSInstances(), 2000);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'online':
        return 'text-green-600 bg-green-50';
      case 'offline':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
          <p className="text-gray-600">Loading your VPS instances...</p>
        </div>
      </div>
    );
  }

  if (vpsInstances.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Server size={40} className="text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">No VPS Instances</h1>
          <p className="text-gray-600 mb-6">You don't have any VPS instances yet.</p>
          <Button onClick={() => window.location.href = '/plans'}>
            Browse Plans
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pb-20"
    >
      {/* Header */}
      <div className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">VPS Management Portal</h1>
          <p className="text-gray-400">Manage and control your virtual servers</p>
        </div>
      </div>

      {/* VPS List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 gap-6">
          {vpsInstances.map((vps) => (
            <Card key={vps.vpsId} className="border-l-4 border-l-blue-500">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                {/* VPS Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-black flex items-center gap-2">
                        <Server size={24} />
                        {vps.hostname || `VPS-${vps.vpsId}`}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">ID: {vps.vpsId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vps.status || 'unknown')}`}>
                      {vps.status || 'Unknown'}
                    </span>
                  </div>

                  {/* VPS Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Activity size={16} className="text-blue-500" />
                      <div>
                        <p className="text-gray-500 text-xs">IP Address</p>
                        <p className="font-mono font-medium text-black">{vps.ipAddress}</p>
                      </div>
                    </div>
                    
                    {vps.node && (
                      <div className="flex items-center gap-2 text-sm">
                        <Server size={16} className="text-blue-500" />
                        <div>
                          <p className="text-gray-500 text-xs">Node</p>
                          <p className="font-medium text-black">{vps.node}</p>
                        </div>
                      </div>
                    )}

                    {vps.mem && (
                      <div className="flex items-center gap-2 text-sm">
                        <Cpu size={16} className="text-blue-500" />
                        <div>
                          <p className="text-gray-500 text-xs">Memory</p>
                          <p className="font-medium text-black">{vps.mem}</p>
                        </div>
                      </div>
                    )}

                    {vps.hdd && (
                      <div className="flex items-center gap-2 text-sm">
                        <HardDrive size={16} className="text-blue-500" />
                        <div>
                          <p className="text-gray-500 text-xs">Storage</p>
                          <p className="font-medium text-black">{vps.hdd}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Root Password */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <p className="text-xs text-blue-700 font-medium mb-1">Root Password:</p>
                    <p className="font-mono text-sm text-black break-all">{vps.rootPassword}</p>
                  </div>
                </div>

                {/* Control Panel */}
                <div className="lg:border-l lg:pl-6 border-gray-200">
                  <h4 className="font-semibold text-black mb-4">Quick Actions</h4>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVPSAction(vps.vpsId, 'boot')}
                      disabled={actionLoading === vps.vpsId}
                      className="justify-start"
                    >
                      <Power size={16} className="mr-2" />
                      Start
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVPSAction(vps.vpsId, 'reboot')}
                      disabled={actionLoading === vps.vpsId}
                      className="justify-start"
                    >
                      <RotateCw size={16} className="mr-2" />
                      Reboot
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVPSAction(vps.vpsId, 'shutdown')}
                      disabled={actionLoading === vps.vpsId}
                      className="justify-start"
                    >
                      <PowerOff size={16} className="mr-2" />
                      Shutdown
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleVPSAction(vps.vpsId, 'console')}
                      disabled={actionLoading === vps.vpsId}
                      className="justify-start"
                    >
                      <Monitor size={16} className="mr-2" />
                      Console
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={loadVPSInstances}
            disabled={loading}
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh Status
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Portal;
