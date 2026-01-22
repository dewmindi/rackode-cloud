"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Server, Mail, ExternalLink } from 'lucide-react';
import { Button, Card } from '@/components/UI';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const PaymentSuccess: React.FC = () => {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get order ID from URL params
    const orderId = searchParams.get('order_id');
    const checkoutId = searchParams.get('checkout_id');

    if (orderId) {
      // You can fetch order details from your backend if needed
      setOrderDetails({
        orderId,
        checkoutId,
      });
    }

    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="text-center py-12">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={48} className="text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-black mb-3">
              Payment Successful! 🎉
            </h1>
            <p className="text-lg text-gray-700 mb-2">
              Thank you for your purchase!
            </p>
            {orderDetails?.orderId && (
              <p className="text-sm text-gray-500 font-mono">
                Order ID: {orderDetails.orderId}
              </p>
            )}
          </motion.div>

          {/* Divider */}
          <div className="my-8 border-t border-gray-200"></div>

          {/* What's Next Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-left max-w-md mx-auto"
          >
            <h2 className="text-xl font-semibold text-black mb-4 text-center">
              What happens next?
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Server size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-1">VPS Provisioning</h3>
                  <p className="text-sm text-gray-600">
                    Your VPS instance(s) are being automatically provisioned. This usually takes 2-5 minutes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Mail size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-1">Email Confirmation</h3>
                  <p className="text-sm text-gray-600">
                    You'll receive an email with your VPS credentials, IP address, and login instructions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ExternalLink size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-1">Access Dashboard</h3>
                  <p className="text-sm text-gray-600">
                    Manage your VPS, check status, and perform actions from your dashboard.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 space-y-3"
          >
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Go to Dashboard
              </Button>
            </Link>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/portal">
                <Button variant="outline" className="w-full sm:w-auto">
                  View All VPS
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  Return Home
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Support Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <p className="text-sm text-blue-800">
              <strong>Need help?</strong> Contact our support team at{' '}
              <a href="mailto:support@rackode.com" className="font-semibold underline">
                support@rackode.com
              </a>
            </p>
          </motion.div>
        </Card>
      </div>
    </motion.div>
  );
};

export default PaymentSuccess;
