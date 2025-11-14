import { CheckCircle, AlertCircle, Calendar, User, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { maintenanceRecords } from '@/data/mockData';

export function LastMaintenanceSection() {
  const completedMaintenances = maintenanceRecords.filter((m) => m.status === 'Completed');
  const pendingMaintenances = maintenanceRecords.filter((m) => m.status === 'Pending');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateDaysUntilDue = (nextDueDate: string) => {
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Completed Maintenance Card */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 dark:bg-green-800 rounded-full opacity-20 -mr-16 -mt-16"></div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Completed This Month</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Maintenance tasks finished</CardDescription>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-green-700 dark:text-green-300">{completedMaintenances.length}</div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">All systems operational</p>
          </CardContent>
        </Card>

        {/* Pending Maintenance Card */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 dark:bg-amber-800 rounded-full opacity-20 -mr-16 -mt-16"></div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Pending Tasks</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Scheduled maintenance</CardDescription>
              </div>
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-amber-700 dark:text-amber-300">{pendingMaintenances.length}</div>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">Schedule upcoming work</p>
          </CardContent>
        </Card>
      </div>

      {/* Completed Maintenance Records */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Completed Maintenance
          </CardTitle>
          <CardDescription>Recent maintenance work finished</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedMaintenances.length > 0 ? (
              completedMaintenances.map((record) => (
                <div
                  key={record.id}
                  className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-900/20 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">{record.zone}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{record.type}</p>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span>Completed: {formatDate(record.completedDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Wrench className="h-4 w-4 text-green-600" />
                      <span>Next Due: {formatDate(record.nextDue)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <User className="h-4 w-4 text-green-600" />
                      <span>{record.performedBy}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400">No completed maintenance records</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Maintenance Records */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Pending Maintenance
          </CardTitle>
          <CardDescription>Scheduled work that needs to be done</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingMaintenances.length > 0 ? (
              pendingMaintenances.map((record) => {
                const daysUntilDue = calculateDaysUntilDue(record.nextDue);
                const isUrgent = daysUntilDue <= 3;

                return (
                  <div
                    key={record.id}
                    className={`border rounded-lg p-4 hover:shadow-md transition ${
                      isUrgent
                        ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                        : 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">{record.zone}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{record.type}</p>
                      </div>
                      <Badge variant={isUrgent ? 'danger' : 'warning'}>
                        {isUrgent ? 'Urgent' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="grid gap-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Calendar className="h-4 w-4 text-amber-600" />
                        <span>
                          Due: {formatDate(record.nextDue)} ({daysUntilDue} days)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <User className="h-4 w-4 text-amber-600" />
                        <span>{record.performedBy}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-500 dark:text-slate-400">No pending maintenance</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
