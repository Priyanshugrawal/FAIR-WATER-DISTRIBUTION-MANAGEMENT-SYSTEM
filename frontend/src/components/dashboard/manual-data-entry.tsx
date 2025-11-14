import { useState } from 'react';
import { Plus, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { manualDataEntryReports } from '@/data/mockData';

export function ManualDataEntrySection() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    zone: '',
    flowRate: '',
    pressure: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (would be API call in production)
    console.log('Submitting:', formData);
    setShowForm(false);
    setFormData({ zone: '', flowRate: '', pressure: '', notes: '' });
  };

  return (
    <div className="space-y-6">
      {/* Data Entry Form */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Manual Data Entry</CardTitle>
              <CardDescription>Record flow rate, pressure, and maintenance notes</CardDescription>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-xl">📝</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Report
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Zone / Location</label>
                  <select
                    name="zone"
                    value={formData.zone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    required
                  >
                    <option value="">Select Zone</option>
                    <option value="Zone 1 - Telibandha">Zone 1 - Telibandha</option>
                    <option value="Zone 2 - Shankar Nagar">Zone 2 - Shankar Nagar</option>
                    <option value="Zone 3 - Kota Road">Zone 3 - Kota Road</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Flow Rate (L/min)</label>
                  <input
                    type="number"
                    name="flowRate"
                    value={formData.flowRate}
                    onChange={handleInputChange}
                    placeholder="2450"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Pressure (PSI)</label>
                  <input
                    type="number"
                    name="pressure"
                    value={formData.pressure}
                    onChange={handleInputChange}
                    placeholder="45.2"
                    step="0.1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Enter any relevant maintenance or observation notes..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-24 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Report
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Recent Reports Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Data Entries</CardTitle>
          <CardDescription>Last 3 manual reports submitted</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold">Zone</th>
                  <th className="text-left py-3 px-4 font-semibold">Flow Rate</th>
                  <th className="text-left py-3 px-4 font-semibold">Pressure</th>
                  <th className="text-left py-3 px-4 font-semibold">Entered By</th>
                  <th className="text-left py-3 px-4 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {manualDataEntryReports.map((report) => (
                  <tr key={report.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 dark:text-slate-100">{report.zone}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{report.notes}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="info">{report.flowRate} L/min</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="success">{report.pressure} PSI</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{report.enteredBy}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {new Date(report.timestamp).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
