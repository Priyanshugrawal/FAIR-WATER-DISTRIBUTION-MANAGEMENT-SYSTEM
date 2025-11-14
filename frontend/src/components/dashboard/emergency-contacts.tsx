import { useState } from 'react';
import { Phone, MapPin, Star, Clock, Plus, AlertCircle, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EmergencyContact {
  id: string;
  name: string;
  type: string;
  phone: string;
  email: string;
  location: string;
  availability: string;
  experience_years: number;
  rating: number;
  verified: boolean;
}

export function EmergencyContactsManagement() {
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  // Mock emergency contacts data
  const emergencyContacts: EmergencyContact[] = [
    {
      id: 'CONT-001',
      name: 'Raj\'s Plumbing Services',
      type: 'plumber',
      phone: '+919876543210',
      email: 'raj.plumber@rmc.gov.in',
      location: 'Ward 5, Market Street',
      availability: '24/7',
      experience_years: 15,
      rating: 4.8,
      verified: true,
    },
    {
      id: 'CONT-002',
      name: 'Sharma Emergency Plumber',
      type: 'plumber',
      phone: '+919765432109',
      email: 'sharma.plumber@rmc.gov.in',
      location: 'Ward 10, Main Road',
      availability: '24/7',
      experience_years: 12,
      rating: 4.6,
      verified: true,
    },
    {
      id: 'CONT-003',
      name: 'Expert Plumbing Hub',
      type: 'plumber',
      phone: '+919654321098',
      email: 'expert.plumbing@rmc.gov.in',
      location: 'Ward 15, Industrial Area',
      availability: '9 AM - 6 PM',
      experience_years: 10,
      rating: 4.5,
      verified: true,
    },
    {
      id: 'CONT-004',
      name: 'RMC Emergency Response',
      type: 'rmc_office',
      phone: '+917554436611',
      email: 'emergency@rmc.raipur.gov.in',
      location: 'RMC Headquarters, Raipur',
      availability: '24/7',
      experience_years: 0,
      rating: 4.9,
      verified: true,
    },
    {
      id: 'CONT-005',
      name: 'Municipal Maintenance Division',
      type: 'civil_engineer',
      phone: '+917554436612',
      email: 'maintenance@rmc.raipur.gov.in',
      location: 'RMC Technical Wing',
      availability: 'Office hours',
      experience_years: 0,
      rating: 4.7,
      verified: true,
    },
    {
      id: 'CONT-006',
      name: 'Quick Fix Electrician',
      type: 'electrician',
      phone: '+919543210987',
      email: 'quickfix.electric@rmc.gov.in',
      location: 'Ward 20, Commercial Zone',
      availability: '24/7',
      experience_years: 8,
      rating: 4.4,
      verified: true,
    },
  ];

  const filteredContacts =
    selectedType === 'all'
      ? emergencyContacts
      : emergencyContacts.filter((c) => c.type === selectedType);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'plumber':
        return <Wrench className="h-5 w-5" />;
      case 'electrician':
        return '⚡';
      case 'civil_engineer':
        return '🏗️';
      case 'rmc_office':
        return '🏛️';
      default:
        return '👤';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'plumber':
        return 'Plumber';
      case 'electrician':
        return 'Electrician';
      case 'civil_engineer':
        return 'Civil Engineer';
      case 'rmc_office':
        return 'RMC Office';
      default:
        return type;
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.7) return 'text-green-600';
    if (rating >= 4.3) return 'text-blue-600';
    if (rating >= 4) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="space-y-6">
      {/* Emergency Header */}
      <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100">Quick Emergency Access</h3>
            <p className="text-sm text-red-800 dark:text-red-200 mt-1">
              All listed professionals are verified and available for immediate assistance with water supply emergencies.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Emergency Contacts */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-orange-50 dark:border-red-800 dark:from-red-950 dark:to-orange-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-full bg-red-600 p-3">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">RMC Emergency Hotline</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">+91-7554-436-611</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Available 24/7 for water emergencies</p>
                <Button size="sm" className="mt-3 gap-2 bg-red-600 hover:bg-red-700 w-full">
                  <Phone className="h-4 w-4" />
                  Call Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-800 dark:from-blue-950 dark:to-indigo-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-full bg-blue-600 p-3">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Municipal Office</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">RMC Headquarters</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Main office: Email for detailed requests</p>
                <Button size="sm" className="mt-3 gap-2 bg-blue-600 hover:bg-blue-700 w-full">
                  <MapPin className="h-4 w-4" />
                  Visit Office
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Management */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Emergency Service Providers</CardTitle>
            <CardDescription>Verified plumbers, electricians, and maintenance professionals</CardDescription>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </CardHeader>

        {showForm && (
          <CardContent className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Professional Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Service Type
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                    <option>Plumber</option>
                    <option>Electrician</option>
                    <option>Civil Engineer</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    placeholder="Ward and area"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="gap-2 bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4" />
                  Add to Directory
                </Button>
                <Button type="button" onClick={() => setShowForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}

        <CardContent className="pt-6">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {[
              { value: 'all', label: 'All Services' },
              { value: 'plumber', label: 'Plumbers' },
              { value: 'electrician', label: 'Electricians' },
              { value: 'civil_engineer', label: 'Engineers' },
              { value: 'rmc_office', label: 'RMC Offices' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedType(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedType === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Contacts Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="rounded-lg border border-slate-200 p-4 hover:shadow-lg transition-shadow dark:border-slate-700"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 text-2xl">{getTypeIcon(contact.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">{contact.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{getTypeLabel(contact.type)}</p>
                  </div>
                  {contact.verified && (
                    <Badge className="bg-green-600 flex-shrink-0">✓ Verified</Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <a href={`tel:${contact.phone}`} className="hover:underline break-all">
                      {contact.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{contact.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>{contact.availability}</span>
                  </div>

                  {contact.experience_years > 0 && (
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      📅 {contact.experience_years} years experience
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(contact.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                    <span className={`font-semibold ${getRatingColor(contact.rating)}`}>{contact.rating.toFixed(1)}</span>
                  </div>
                </div>

                <Button size="sm" className="w-full mt-4 gap-2 bg-blue-600 hover:bg-blue-700">
                  <Phone className="h-4 w-4" />
                  Contact Now
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
