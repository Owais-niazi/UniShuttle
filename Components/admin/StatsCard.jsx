import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon: Icon, color, trend, delay = 0 }) {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    pink: 'from-pink-500 to-pink-600',
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
  };

  const bgClasses = {
    indigo: 'bg-indigo-50',
    emerald: 'bg-emerald-50',
    amber: 'bg-amber-50',
    pink: 'bg-pink-50',
    purple: 'bg-purple-50',
    blue: 'bg-blue-50',
  };

  const iconClasses = {
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    pink: 'text-pink-600',
    purple: 'text-purple-600',
    blue: 'text-blue-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className={`h-1 bg-gradient-to-r ${colorClasses[color] || colorClasses.indigo}`} />
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
              {trend && (
                <p className={`text-sm mt-1 ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {trend > 0 ? '+' : ''}{trend}% from last week
                </p>
              )}
            </div>
            <div className={`p-4 rounded-2xl ${bgClasses[color] || bgClasses.indigo}`}>
              <Icon className={`w-6 h-6 ${iconClasses[color] || iconClasses.indigo}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}