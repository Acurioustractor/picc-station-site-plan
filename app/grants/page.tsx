'use client';

import { useState, useEffect } from 'react';
import { MapPin, ArrowLeft, Plus, DollarSign, Calendar, FileText, Trash2, Edit, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import Footer from '@/components/Footer';

interface Grant {
  id: string;
  title: string;
  funder: string;
  amount: string;
  deadline: string;
  status: 'research' | 'drafting' | 'submitted' | 'awarded' | 'declined';
  notes?: string;
  url?: string;
}

const INITIAL_GRANTS: Grant[] = [
  {
    id: '1',
    title: 'Regional Precincts and Partnerships Program (rPPP) - Stream Two',
    funder: 'Federal Government',
    amount: 'TBD',
    deadline: '2027-03',
    status: 'research',
    notes: 'Aiming for investment-ready status by March 2027. Primary funding target for precinct development.',
  },
];

export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>(INITIAL_GRANTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGrant, setEditingGrant] = useState<Grant | null>(null);
  const [formData, setFormData] = useState<Partial<Grant>>({
    title: '',
    funder: '',
    amount: '',
    deadline: '',
    status: 'research',
    notes: '',
    url: '',
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('picc-grants');
    if (saved) {
      try {
        setGrants(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved grants', e);
      }
    }
  }, []);

  // Save to localStorage whenever grants change
  useEffect(() => {
    localStorage.setItem('picc-grants', JSON.stringify(grants));
  }, [grants]);

  const resetForm = () => {
    setFormData({
      title: '',
      funder: '',
      amount: '',
      deadline: '',
      status: 'research',
      notes: '',
      url: '',
    });
    setShowAddForm(false);
    setEditingGrant(null);
  };

  const addGrant = () => {
    if (!formData.title?.trim() || !formData.funder?.trim()) {
      toast.warning('Title and funder are required');
      return;
    }

    const newGrant: Grant = {
      id: `grant-${Date.now()}`,
      title: formData.title,
      funder: formData.funder,
      amount: formData.amount || '',
      deadline: formData.deadline || '',
      status: formData.status || 'research',
      notes: formData.notes,
      url: formData.url,
    };

    setGrants([...grants, newGrant]);
    toast.success('Grant added successfully');
    resetForm();
  };

  const updateGrant = () => {
    if (!editingGrant || !formData.title?.trim() || !formData.funder?.trim()) {
      toast.warning('Title and funder are required');
      return;
    }

    setGrants(grants.map(g =>
      g.id === editingGrant.id
        ? { ...g, ...formData as Grant }
        : g
    ));
    toast.success('Grant updated successfully');
    resetForm();
  };

  const deleteGrant = (id: string) => {
    if (confirm('Are you sure you want to delete this grant?')) {
      setGrants(grants.filter(g => g.id !== id));
      toast.success('Grant deleted');
    }
  };

  const startEdit = (grant: Grant) => {
    setFormData(grant);
    setEditingGrant(grant);
    setShowAddForm(false);
  };

  const moveGrant = (id: string, newStatus: Grant['status']) => {
    setGrants(grants.map(g =>
      g.id === id ? { ...g, status: newStatus } : g
    ));
    toast.success('Grant status updated');
  };

  const getStatusColor = (status: Grant['status']) => {
    switch (status) {
      case 'research':
        return 'bg-slate-100 border-slate-300 text-slate-700';
      case 'drafting':
        return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'submitted':
        return 'bg-orange-100 border-orange-300 text-orange-700';
      case 'awarded':
        return 'bg-green-100 border-green-300 text-green-700';
      case 'declined':
        return 'bg-red-100 border-red-300 text-red-700';
    }
  };

  const getStatusLabel = (status: Grant['status']) => {
    switch (status) {
      case 'research':
        return 'Research';
      case 'drafting':
        return 'Drafting';
      case 'submitted':
        return 'Submitted';
      case 'awarded':
        return 'Awarded';
      case 'declined':
        return 'Declined';
    }
  };

  const statuses: Grant['status'][] = ['research', 'drafting', 'submitted', 'awarded', 'declined'];

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-4 md:px-6 py-3 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-stone-600" />
              <span className="text-sm font-medium text-stone-600">Back to Map</span>
            </Link>
            <div className="hidden md:flex items-center gap-2 ml-4">
              <DollarSign className="text-orange-600" />
              <h1 className="text-lg font-serif font-bold text-stone-800">
                Grant Pipeline
              </h1>
            </div>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingGrant(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium text-sm"
          >
            <Plus size={18} />
            Add Grant
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Add/Edit Form */}
        {(showAddForm || editingGrant) && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-stone-900 mb-4">
              {editingGrant ? 'Edit Grant' : 'Add New Grant'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Grant Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Regional Precincts Program"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Funder *
                </label>
                <input
                  type="text"
                  value={formData.funder}
                  onChange={(e) => setFormData({ ...formData, funder: e.target.value })}
                  placeholder="e.g., Federal Government"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Amount
                </label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g., $500,000 or TBD"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Deadline
                </label>
                <input
                  type="text"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  placeholder="e.g., 2027-03 or March 2027"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Grant['status'] })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="research">Research</option>
                  <option value="drafting">Drafting</option>
                  <option value="submitted">Submitted</option>
                  <option value="awarded">Awarded</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about this grant opportunity..."
                rows={3}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={editingGrant ? updateGrant : addGrant}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                {editingGrant ? 'Save Changes' : 'Add Grant'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Pipeline Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statuses.map((status) => {
            const statusGrants = grants.filter(g => g.status === status);
            return (
              <div key={status} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className={`px-4 py-3 border-b font-bold text-sm uppercase tracking-wide ${getStatusColor(status)}`}>
                  {getStatusLabel(status)} ({statusGrants.length})
                </div>
                <div className="p-3 space-y-3 min-h-[300px]">
                  {statusGrants.map((grant) => (
                    <div
                      key={grant.id}
                      className="bg-stone-50 border border-stone-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-bold text-stone-900 leading-tight">
                          {grant.title}
                        </h3>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => startEdit(grant)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => deleteGrant(grant.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 mb-2">{grant.funder}</p>

                      {grant.amount && (
                        <div className="flex items-center gap-1 text-xs text-stone-600 mb-1">
                          <DollarSign size={12} />
                          <span>{grant.amount}</span>
                        </div>
                      )}

                      {grant.deadline && (
                        <div className="flex items-center gap-1 text-xs text-stone-600 mb-2">
                          <Calendar size={12} />
                          <span>{grant.deadline}</span>
                        </div>
                      )}

                      {grant.notes && (
                        <p className="text-xs text-stone-500 mb-2 line-clamp-2">{grant.notes}</p>
                      )}

                      {grant.url && (
                        <a
                          href={grant.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 mb-2"
                        >
                          <ExternalLink size={12} />
                          <span>View Details</span>
                        </a>
                      )}

                      {/* Move buttons */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {statuses.filter(s => s !== status).map(s => (
                          <button
                            key={s}
                            onClick={() => moveGrant(grant.id, s)}
                            className="text-[10px] px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded transition-colors"
                          >
                            → {getStatusLabel(s)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
