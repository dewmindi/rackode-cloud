"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Section, Card, Button } from '@/components/UI';
import { Mail, MessageSquare, Phone } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Section background="gray" className="min-h-[60vh] flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-6">Get in touch</h1>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Whether you need help sizing an instance for your database or have questions about our BGP mix, our engineering team is here to help.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Email Support</h3>
                  <p className="text-slate-500">support@rackode.cloud</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Live Chat</h3>
                  <p className="text-slate-500">Available Mon-Fri, 9am - 5pm EST</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-8">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-4 py-2 border" placeholder="Jane" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-4 py-2 border" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-4 py-2 border" placeholder="jane@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <select className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-4 py-2 border">
                  <option>Sales Inquiry</option>
                  <option>Technical Support</option>
                  <option>Abuse Report</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea rows={4} className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-4 py-2 border" placeholder="How can we help?"></textarea>
              </div>
              <Button type="submit" className="w-full justify-center">Send Message</Button>
            </form>
          </Card>
        </div>
      </Section>
    </motion.div>
  );
};

export default Contact;