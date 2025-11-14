import { useState } from 'react';
import { Plus, FileText, Check, AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Bill {
  id: string;
  citizen_email: string;
  amount: number;
  due_date: string;
  created_date: string;
  description: string;
  payment_status: 'pending' | 'paid' | 'overdue';
  supply_status: 'active' | 'limited' | 'suspended';
}

export function BillingManagementSection() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    citizenEmail: '',
    amount: '',
    dueDate: '',
    description: 'Monthly water bill',
  });

  const [bills] = useState<Bill[]>([
    {
      id: 'BILL-A1B2C3D4',
      citizen_email: 'user@example.com',
      amount: 1500,
      due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Monthly water bill - November 2025',
      payment_status: 'pending',
      supply_status: 'active',
    },
    {
      id: 'BILL-E5F6G7H8',
      citizen_email: 'citizen1@raipur.gov.in',
      amount: 2000,
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Monthly water bill - November 2025',
      payment_status: 'pending',
      supply_status: 'active',
    },
    {
      id: 'BILL-I9J0K1L2',
      citizen_email: 'citizen2@raipur.gov.in',
      amount: 1200,
      due_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_date: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Monthly water bill - October 2025',
      payment_status: 'overdue',
      supply_status: 'suspended',
    },
    {
      id: 'BILL-M3N4O5P6',
      citizen_email: 'user@example.com',
      amount: 1500,
      due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_date: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Monthly water bill - October 2025',
      payment_status: 'paid',
      supply_status: 'active',
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Bill created:', formData);
    setFormData({
      citizenEmail: '',
      amount: '',
      dueDate: '',
      description: 'Monthly water bill',
    });
    setShowForm(false);
  };

  const stats = {
    totalBills: bills.length,
    paidBills: bills.filter((b) => b.payment_status === 'paid').length,
    pendingBills: bills.filter((b) => b.payment_status === 'pending' || b.payment_status === 'overdue').length,
    totalAmount: bills.reduce((sum, b) => sum + b.amount, 0),
    totalPaid: bills.filter((b) => b.payment_status === 'paid').reduce((sum, b) => sum + b.amount, 0),
    collectionRate:
      (bills.filter((b) => b.payment_status === 'paid').reduce((sum, b) => sum + b.amount, 0) /
        bills.reduce((sum, b) => sum + b.amount, 0)) *
      100,
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Overdue</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getSupplyStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'limited':
        return <Badge className="bg-amber-600">Limited</Badge>;
      case 'suspended':
        return <Badge className="bg-red-600">Suspended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalBills}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Total Bills</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.paidBills}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Bills Paid</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{stats.pendingBills}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                ₹{stats.totalAmount.toLocaleString()}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Total Amount</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹{stats.totalPaid.toLocaleString()}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Amount Collected</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.collectionRate.toFixed(1)}%</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Collection Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Bill Section */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Generate New Bill</CardTitle>
              <CardDescription>Create a new water bill for a citizen</CardDescription>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              size="sm"
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              {showForm ? 'Cancel' : 'New Bill'}
            </Button>
          </div>
        </CardHeader>

        {showForm && (
          <CardContent className="space-y-4 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Citizen Email
                  </label>
                  <input
                    type="email"
                    name="citizenEmail"
                    value={formData.citizenEmail}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    placeholder="citizen@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Bill Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    placeholder="1500"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    placeholder="Monthly water bill"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="gap-2 bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4" />
                  Create Bill
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Bills List */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Active Bills</CardTitle>
          <CardDescription>All bills in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Bill ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Citizen Email</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Due Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    Payment Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Supply Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="py-3 px-4 text-slate-900 dark:text-white font-mono text-xs">{bill.id}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{bill.citizen_email}</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-white">
                      ₹{bill.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{bill.due_date}</td>
                    <td className="py-3 px-4">{getPaymentStatusBadge(bill.payment_status)}</td>
                    <td className="py-3 px-4">{getSupplyStatusBadge(bill.supply_status)}</td>
                    <td className="py-3 px-4">
                      <button
                        disabled={bill.payment_status === 'paid'}
                        className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-xs font-medium"
                      >
                        <Check className="h-3 w-3" />
                        {bill.payment_status === 'paid' ? 'Paid' : 'Mark Paid'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Generation */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-purple-600" />
            <div>
              <CardTitle>Invoice Generation</CardTitle>
              <CardDescription>Generate and manage payment invoices</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {bills
              .filter((b) => b.payment_status === 'paid')
              .slice(0, 2)
              .map((bill) => (
                <div
                  key={bill.id}
                  className="rounded-lg border border-slate-200 p-4 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-mono text-xs text-slate-500">{bill.id}</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{bill.citizen_email}</p>
                    </div>
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">₹{bill.amount.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mb-4">Paid on {bill.due_date}</p>
                  <Button size="sm" className="w-full gap-2 bg-purple-600 hover:bg-purple-700">
                    <FileText className="h-3 w-3" />
                    Download Invoice
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
