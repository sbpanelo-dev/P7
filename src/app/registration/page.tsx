'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { API_BASE } from '@/lib/config';
import { Briefcase, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      router.push('/login');
    } catch {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">
        {/* Branding Panel */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-cyan-300 to-blue-400 text-white">
          <Briefcase className="w-10 h-10 mb-4" />
          <h1 className="text-3xl font-bold mb-3 tracking-wide">Position Manager</h1>
          <p className="text-white text-sm leading-relaxed">
            Create your account to manage positions securely and efficiently.
          </p>
        </div>

        {/* Register Panel */}
        <Card className="bg-white border border-slate-200 rounded-none">
          <CardContent className="p-8 md:p-10">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-slate-900 flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" /> Register
              </h2>
              <p className="text-sm text-slate-500">Enter your details to create an account</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <Input
                className="bg-slate-100 border-slate-300 text-slate-900"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <Input
                type="password"
                className="bg-slate-100 border-slate-300 text-slate-900"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md p-3">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-white"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">Already have an account?</p>
              <Button
                variant="link"
                className="text-cyan-600"
                onClick={() => router.push('/login')}
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}