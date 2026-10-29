import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Bus, GraduationCap, ShieldCheck, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState(null);

  const signIn = async (role) => {
    setLoadingRole(role);
    await base44.auth.login(role);
    navigate(createPageUrl(role === 'admin' ? 'AdminDashboard' : 'StudentDashboard'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
              <Bus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to UniShuttle</h1>
            <p className="text-gray-500 mt-1">Choose a demo account to continue</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => signIn('student')}
              disabled={!!loadingRole}
              className="w-full h-auto py-4 justify-start bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {loadingRole === 'student' ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <GraduationCap className="w-5 h-5 mr-3" />
              )}
              <span className="flex flex-col items-start">
                <span className="font-semibold">Continue as Student</span>
                <span className="text-xs font-normal text-indigo-100">Ayesha Khan</span>
              </span>
            </Button>

            <Button
              onClick={() => signIn('admin')}
              disabled={!!loadingRole}
              variant="outline"
              className="w-full h-auto py-4 justify-start border-2"
            >
              {loadingRole === 'admin' ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <ShieldCheck className="w-5 h-5 mr-3 text-indigo-600" />
              )}
              <span className="flex flex-col items-start">
                <span className="font-semibold">Continue as Admin</span>
                <span className="text-xs font-normal text-gray-500">Admin User</span>
              </span>
            </Button>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full text-sm text-gray-500 hover:text-indigo-600 mt-6"
          >
            Back to home
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
