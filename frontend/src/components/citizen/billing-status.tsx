import { AlertCircle, CheckCircle, Clock, Droplet, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

export function BillingStatus() {
  // Mock bills for the logged-in citizen
  const bills: Bill[] = [
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
      id: 'BILL-M3N4O5P6',
      citizen_email: 'user@example.com',
      amount: 1500,
      due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_date: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Monthly water bill - October 2025',
      payment_status: 'paid',
      supply_status: 'active',
    },
  ];

  const totalPending = bills
    .filter((b) => b.payment_status === 'pending' || b.payment_status === 'overdue')
    .reduce((sum, b) => sum + b.amount, 0);

  const overdueBills = bills.filter((b) => b.payment_status === 'overdue');
  const supplyStatus = bills.some((b) => b.payment_status === 'overdue' && b.supply_status === 'suspended')
    ? 'suspended'
    : bills.some((b) => b.payment_status === 'overdue' && b.supply_status === 'limited')
      ? 'limited'
      : 'active';

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
      case 'pending':
        return 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800';
      case 'overdue':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
      default:
        return 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800';
    }
  };

  const getSupplyStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'limited':
        return <TrendingDown className="h-5 w-5 text-amber-600" />;
      case 'suspended':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getSupplyStatusMessage = (status: string) => {
    switch (status) {
      case 'active':
        return 'Your water supply is active and running normally';
      case 'limited':
        return 'Your water supply is limited due to overdue bills. Please pay immediately to restore full supply';
      case 'suspended':
        return 'Your water supply has been suspended. Please pay your bills immediately to restore supply';
      default:
        return 'Unknown supply status';
    }
  };

  return (
    <div className="space-y-6">
      {/* Supply Status Alert */}
      <Card
        className={`border-2 ${
          supplyStatus === 'active'
            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
            : supplyStatus === 'limited'
              ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950'
              : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
        }`}
      >
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {getSupplyStatusIcon(supplyStatus)}
            </div>
            <div>
              <h3
                className={`font-semibold mb-1 ${
                  supplyStatus === 'active'
                    ? 'text-green-900 dark:text-green-100'
                    : supplyStatus === 'limited'
                      ? 'text-amber-900 dark:text-amber-100'
                      : 'text-red-900 dark:text-red-100'
                }`}
              >
                Supply Status: <span className="uppercase">{supplyStatus}</span>
              </h3>
              <p
                className={`text-sm ${
                  supplyStatus === 'active'
                    ? 'text-green-800 dark:text-green-200'
                    : supplyStatus === 'limited'
                      ? 'text-amber-800 dark:text-amber-200'
                      : 'text-red-800 dark:text-red-200'
                }`}
              >
                {getSupplyStatusMessage(supplyStatus)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Pending Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">₹{totalPending.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">
              {bills.filter((b) => b.payment_status === 'pending' || b.payment_status === 'overdue').length} bill
              {bills.filter((b) => b.payment_status === 'pending' || b.payment_status === 'overdue').length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Overdue Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${overdueBills.length > 0 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
              {overdueBills.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {overdueBills.length > 0 ? 'Action required!' : 'No overdue bills'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Paid Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{bills.filter((b) => b.payment_status === 'paid').length}</div>
            <p className="text-xs text-slate-500 mt-1">Out of {bills.length} bills</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Bill */}
      {bills.length > 0 && (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Current Bill</CardTitle>
            <CardDescription>Your latest water bill details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`rounded-xl border-2 p-6 ${getPaymentStatusColor(bills[0].payment_status)}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Bill Amount</p>
                  <p className="text-4xl font-bold text-slate-900 dark:text-white">₹{bills[0].amount.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end">
                  {getPaymentStatusIcon(bills[0].payment_status)}
                  <Badge
                    className={`mt-2 ${
                      bills[0].payment_status === 'paid'
                        ? 'bg-green-600'
                        : bills[0].payment_status === 'pending'
                          ? 'bg-amber-600'
                          : 'bg-red-600'
                    }`}
                  >
                    {bills[0].payment_status.charAt(0).toUpperCase() + bills[0].payment_status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-current border-opacity-20 pt-4">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Bill Period</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{bills[0].description}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Due Date</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{bills[0].due_date}</p>
                </div>
              </div>

              {bills[0].payment_status !== 'paid' && (
                <button className="w-full mt-4 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                  Pay Now
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bill History */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Bill History</CardTitle>
          <CardDescription>Your payment history and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className={`rounded-lg border-2 p-4 flex items-start justify-between ${getPaymentStatusColor(bill.payment_status)}`}
              >
                <div className="flex items-start gap-3">
                  {getPaymentStatusIcon(bill.payment_status)}
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{bill.description}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Due: {bill.due_date} • Bill ID: <span className="font-mono text-xs">{bill.id}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">₹{bill.amount.toLocaleString()}</p>
                  {bill.payment_status === 'paid' && (
                    <button className="text-xs mt-2 px-3 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 font-medium">
                      View Invoice
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Available payment options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400 cursor-pointer transition-colors">
              <p className="font-semibold text-slate-900 dark:text-white mb-1">Online Payment</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Pay securely using UPI, Cards, or Net Banking</p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400 cursor-pointer transition-colors">
              <p className="font-semibold text-slate-900 dark:text-white mb-1">Walk-in Payment</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Visit your nearest municipal office</p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400 cursor-pointer transition-colors">
              <p className="font-semibold text-slate-900 dark:text-white mb-1">DD/Check</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Demand Draft or Cheque payment</p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400 cursor-pointer transition-colors">
              <p className="font-semibold text-slate-900 dark:text-white mb-1">Auto Payment</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Set up recurring automatic payments</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <CardHeader>
          <CardTitle className="text-amber-900 dark:text-amber-100 flex items-center gap-2">
            <Droplet className="h-5 w-5" />
            Important Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="text-amber-800 dark:text-amber-200 text-sm">
          <ul className="list-disc list-inside space-y-1">
            <li>Late payment may result in water supply limitations</li>
            <li>Persistent non-payment will lead to supply suspension</li>
            <li>Reconnection charges apply for suspended connections</li>
            <li>Payments should be made before the due date to avoid penalties</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
