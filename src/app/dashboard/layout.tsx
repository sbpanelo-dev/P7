'use client';

import React, { useEffect, useState } from 'react';
import { getToken, logoutUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/config';
import { Plus, LogOut, Pencil, Trash2, Briefcase } from 'lucide-react';

interface Position {
  position_id: number;
  position_code: string;
  position_name: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [positionCode, setPositionCode] = useState('');
  const [positionName, setPositionName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchPositions();
  }, []);

  function authHeaders() {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  }

  async function fetchPositions() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/positions`, { headers: authHeaders() });
      if (res.status === 401) {
        logoutUser();
        router.push('/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch positions');
      setPositions(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { position_code: positionCode, position_name: positionName };

    try {
      const res = await fetch(
        editingId ? `${API_BASE}/positions/${editingId}` : `${API_BASE}/positions`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error('Save failed');

      setPositionCode('');
      setPositionName('');
      setEditingId(null);
      fetchPositions();
    } catch (e: any) {
      setError(e.message);
    }
  }

  function startEdit(p: Position) {
    setEditingId(p.position_id);
    setPositionCode(p.position_code);
    setPositionName(p.position_name);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this position?')) return;
    await fetch(`${API_BASE}/positions/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    fetchPositions();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-cyan-500" />
          <h1 className="text-xl font-semibold tracking-wide">HR Position Manager</h1>
        </div>
        <Button variant="ghost" onClick={() => { logoutUser(); router.push('/login'); }}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </header>

      <main className="grid grid-cols-1 xl:grid-cols-4 gap-6 p-8">
        {/* Form Panel */}
        <Card className="bg-white border border-slate-200 xl:col-span-1">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" /> {editingId ? 'Update Position' : 'New Position'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                className="bg-slate-100 border-slate-300"
                placeholder="Code"
                value={positionCode}
                onChange={(e) => setPositionCode(e.target.value)}
                required
              />
              <Input
                className="bg-slate-100 border-slate-300"
                placeholder="Name"
                value={positionName}
                onChange={(e) => setPositionName(e.target.value)}
                required
              />
              <Button className="w-full bg-cyan-400 hover:bg-cyan-500 text-white">
                {editingId ? 'Save Changes' : 'Add Position'}
              </Button>
            </form>

            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
          </CardContent>
        </Card>

        {/* Cards View */}
        <section className="xl:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && <p className="text-slate-500">Loading...</p>}

          {!loading && positions.length === 0 && (
            <p className="text-slate-500">No positions available</p>
          )}

          {positions.map((p) => (
            <Card
              key={p.position_id}
              className="bg-gradient-to-br from-white to-slate-100 border-slate-200 hover:border-cyan-500 transition"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase text-slate-500">{p.position_code}</p>
                    <h3 className="text-lg font-semibold">{p.position_name}</h3>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(p)}>
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(p.position_id)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}