"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Power, 
  RotateCw, 
  PowerOff, 
  Activity, 
  HardDrive, 
  Cpu, 
  RefreshCw,
  Globe,
  CheckCircle,
  AlertCircle,
  Clock,
  Gauge
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/UI';

interface VPSStatus {
  status: string;
  statusmsg: string;
  vmstat: string;
  hostname: string;
  ipaddress: string;
}

interface APIResponse {
  success: boolean;
  message: string;
  connected?: boolean;
  apiType?: string;
  note?: string;
  vpsStatus?: VPSStatus;
  availableActions?: string[];
  error?: string;
  details?: string;
}

const Dashboard: React.FC = () => {
  const [vpsStatus, setVpsStatus] = useState<VPSStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const VPS_ID = 'NYRN233KVM';

  useEffect(() => {
    loadVPSStatus();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadVPSStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadVPSStatus = async () => {
    try {
      setError(null);
      const response = await fetch('/api/solusvm/test-connection');
      const data: APIResponse = await response.json();

      if (data.success && data.vpsStatus) {
        setVpsStatus(data.vpsStatus);
        setLastUpdated(new Date());
      } else {
        setError(data.error || 'Failed to load VPS status');
      }
    } catch (err) {
      console.error('Error loading VPS status:', err);
      setError('Failed to connect to API');
    } finally {
      setLoading(false);
    }
  };

  const handleVPSAction = async (action: string) => {
    setActionLoading(action);
    setError(null);
    
    try {
      const response = await fetch('/api/solusvm/vps-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Action failed');
      }

      // Show success message
      alert(`✓ Action '${action}' completed successfully!`);
      
      // Refresh status after action
      setTimeout(() => loadVPSStatus(), 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Action failed';
      setError(errorMsg);
      alert(`✗ ${errorMsg}`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'online':
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
      case 'offline':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
          <p className="text-gray-600">Loading VPS dashboard...</p>
        </div>
      </div>
    );
  }

  const statusColors = vpsStatus ? getStatusColor(vpsStatus.statusmsg) : getStatusColor('unknown');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pb-20"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Server size={32} />
                <h1 className="text-3xl font-bold">VPS Dashboard</h1>
              </div>
              <p className="text-gray-400">Server ID: {VPS_ID}</p>
            </div>
            {vpsStatus && (
              <div className={`px-4 py-2 rounded-lg ${statusColors.bg} ${statusColors.border} border-2`}>
                <div className="flex items-center gap-2">
                  {vpsStatus.statusmsg === 'online' ? (
                    <CheckCircle size={24} className={statusColors.text} />
                  ) : (
                    <AlertCircle size={24} className={statusColors.text} />
                  )}
                  <div>
                    <p className={`text-xs ${statusColors.text} opacity-75`}>Status</p>
                    <p className={`text-lg font-bold ${statusColors.text} uppercase`}>
                      {vpsStatus.statusmsg}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Error Alert */}
        {error && (
          <Card className="mb-6 border-l-4 border-l-red-500 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main VPS Info Card */}
          <div className="lg:col-span-2">
            <Card className="border-l-4 border-l-blue-500">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-1">
                    {vpsStatus?.hostname || 'Loading...'}
                  </h2>
                  <p className="text-gray-600 text-sm">Primary VPS Instance</p>
                </div>
                <Badge color="blue">SolusVM Client API</Badge>
              </div>

              {vpsStatus && (
                <>
                  {/* VPS Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">IP Address</p>
                        <p className="font-mono font-bold text-black text-lg">{vpsStatus.ipaddress}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Activity size={24} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">VM Status</p>
                        <p className="font-bold text-black text-lg capitalize">{vpsStatus.vmstat}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Server size={24} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Hostname</p>
                        <p className="font-bold text-black text-lg">{vpsStatus.hostname}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock size={24} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Last Updated</p>
                        <p className="font-bold text-black text-sm">
                          {lastUpdated ? lastUpdated.toLocaleTimeString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Access Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Activity size={16} />
                      Quick Access Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">SSH Access:</span>
                        <code className="bg-white px-2 py-1 rounded text-black font-mono">
                          ssh root@{vpsStatus.ipaddress}
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Server ID:</span>
                        <span className="font-mono text-black">{VPS_ID}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Control Panel */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="font-bold text-black text-lg mb-4 flex items-center gap-2">
                <Gauge size={20} />
                Control Panel
              </h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleVPSAction('boot')}
                  disabled={actionLoading !== null || vpsStatus?.statusmsg === 'online'}
                >
                  <Power size={18} className="mr-2" />
                  {actionLoading === 'boot' ? 'Starting...' : 'Start VPS'}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleVPSAction('reboot')}
                  disabled={actionLoading !== null}
                >
                  <RotateCw size={18} className="mr-2" />
                  {actionLoading === 'reboot' ? 'Rebooting...' : 'Reboot VPS'}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleVPSAction('shutdown')}
                  disabled={actionLoading !== null || vpsStatus?.statusmsg === 'offline'}
                >
                  <PowerOff size={18} className="mr-2" />
                  {actionLoading === 'shutdown' ? 'Shutting down...' : 'Shutdown VPS'}
                </Button>

                <div className="border-t border-gray-200 my-4"></div>

                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => handleVPSAction('status')}
                  disabled={actionLoading !== null}
                >
                  <Activity size={18} className="mr-2" />
                  {actionLoading === 'status' ? 'Checking...' : 'Check Status'}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={loadVPSStatus}
                  disabled={loading}
                >
                  <RefreshCw size={18} className="mr-2" />
                  Refresh Dashboard
                </Button>
              </div>

              {/* API Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong>Note:</strong> This VPS is managed via SolusVM Client API. 
                  Available actions are limited to: boot, reboot, shutdown, and status checks.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Dashboard auto-refreshes every 30 seconds • Last refresh: {lastUpdated?.toLocaleString() || 'Never'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
