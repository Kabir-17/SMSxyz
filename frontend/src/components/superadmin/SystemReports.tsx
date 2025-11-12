import React, { useMemo, useState } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  Users,
  School,
  Activity,
  FileText,
  RefreshCcw,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { SuperadminStats } from "@/components/superadmin/types";

interface SystemReportsProps {
  stats: SuperadminStats | null;
  loading: boolean;
  onRefresh?: () => void | Promise<void>;
}

const formatNumber = (value?: number) =>
  typeof value === "number" ? value.toLocaleString() : "--";

const SystemReports: React.FC<SystemReportsProps> = ({
  stats,
  loading,
  onRefresh,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const reportTypes = useMemo(
    () => [
      {
        title: "User Analytics Report",
        description:
          "Comprehensive analysis of user engagement and activity patterns",
        icon: Users,
        color: "from-blue-500 to-blue-600",
        metrics: [
          "Active Users",
          "Login Frequency",
          "Role Distribution",
          "Geographic Spread",
        ],
      },
      {
        title: "School Performance Report",
        description:
          "Academic and operational performance metrics across all schools",
        icon: School,
        color: "from-green-500 to-green-600",
        metrics: [
          "Enrollment Rates",
          "Academic Results",
          "Resource Utilization",
          "Staff Performance",
        ],
      },
      {
        title: "System Health Report",
        description: "Technical infrastructure and system performance analysis",
        icon: Activity,
        color: "from-purple-500 to-purple-600",
        metrics: [
          "Uptime Statistics",
          "Response Times",
          "Error Rates",
          "Resource Usage",
        ],
      },
      {
        title: "Financial Overview Report",
        description: "Revenue, costs, and financial trends across the platform",
        icon: BarChart3,
        color: "from-orange-500 to-orange-600",
        metrics: [
          "Revenue Streams",
          "Expense Trends",
          "Collection Rates",
          "Outstanding Fees",
        ],
      },
    ],
    []
  );

  const primaryMetrics = useMemo(
    () => [
      {
        title: "Total Schools",
        value: stats?.totalSchools,
        icon: School,
        gradient: "from-blue-600 to-blue-700",
        detail:
          stats !== null
            ? `Active: ${formatNumber(
                stats?.activeSchools
              )} • Pending: ${formatNumber(stats?.pendingSchools)}`
            : undefined,
      },
      {
        title: "Total Students",
        value: stats?.totalStudents,
        icon: Users,
        gradient: "from-emerald-500 to-emerald-600",
        detail:
          typeof stats?.recentActivity?.studentsEnrolled === "number"
            ? `${formatNumber(
                stats.recentActivity.studentsEnrolled
              )} enrolled last 30 days`
            : undefined,
      },
      {
        title: "Total Teachers",
        value: stats?.totalTeachers,
        icon: UserCheck,
        gradient: "from-purple-500 to-purple-600",
        detail:
          typeof stats?.recentActivity?.teachersAdded === "number"
            ? `${formatNumber(
                stats.recentActivity.teachersAdded
              )} added last 30 days`
            : undefined,
      },
      {
        title: "Total Parents",
        value: stats?.totalParents,
        icon: UserPlus,
        gradient: "from-orange-500 to-orange-600",
        detail: "Active guardian accounts",
      },
    ],
    [stats]
  );

  const activitySummary = useMemo(
    () => [
      {
        label: "Schools created",
        value: stats?.recentActivity?.schoolsCreated,
        description: "New schools in the last 30 days",
        icon: School,
      },
      {
        label: "Students enrolled",
        value: stats?.recentActivity?.studentsEnrolled,
        description: "Student accounts created in the last 30 days",
        icon: Users,
      },
      {
        label: "Teachers added",
        value: stats?.recentActivity?.teachersAdded,
        description: "Teacher accounts created in the last 30 days",
        icon: UserCheck,
      },
    ],
    [stats]
  );

  const generateReport = (_reportType: string) => {
    // TODO: Implement actual report generation once export endpoints are available
  };

  const activityAvailable = activitySummary.some(
    (item) => typeof item.value === "number"
  );

  const periodMap: Record<string, string> = {
    weekly: "Last 7 Days",
    monthly: "Last 30 Days",
    quarterly: "Last 3 Months",
    yearly: "Last Year",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              System Reports
            </h1>
            <p className="text-gray-600">
              Comprehensive analytics and insights across all organizations
            </p>
          </div>
          <div className="flex items-center gap-3">
            {onRefresh && (
              <Button
                onClick={onRefresh}
                variant="outline"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                {loading ? "Loading..." : "Refresh"}
              </Button>
            )}
            <select
            aria-label="select"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="weekly">Last 7 Days</option>
              <option value="monthly">Last 30 Days</option>
              <option value="quarterly">Last 3 Months</option>
              <option value="yearly">Last Year</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {primaryMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card
                key={metric.title}
                className={`bg-gradient-to-br ${metric.gradient} text-white border-0`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm mb-1">
                        {metric.title}
                      </p>
                      <p className="text-3xl font-bold">
                        {loading ? "..." : formatNumber(metric.value)}
                      </p>
                      {metric.detail && (
                        <p className="text-sm text-white/80 mt-2">
                          {metric.detail}
                        </p>
                      )}
                    </div>
                    <Icon className="w-10 h-10 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Generate Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {reportTypes.map((report) => (
                    <div
                      key={report.title}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${report.color} rounded-lg flex items-center justify-center`}
                        >
                          <report.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {report.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {report.description}
                      </p>
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Includes:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {report.metrics.map((metric) => (
                            <span
                              key={metric}
                              className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                            >
                              {metric}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => generateReport(report.title)}
                        className="w-full"
                        variant="outline"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Visualizations will appear once analytics exports are
                      enabled.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Selected period:{" "}
                      {periodMap[selectedPeriod] ?? "Custom Range"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-600" />
                  Recent System Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activityAvailable ? (
                  <div className="space-y-4">
                    {activitySummary.map(
                      ({ label, value, description, icon: Icon }) => (
                        <div
                          key={label}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="mt-1">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {label}
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {loading ? "..." : formatNumber(value)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {description}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 text-sm text-gray-500">
                    {loading
                      ? "Loading recent activity..."
                      : "No activity data recorded for the selected period yet."}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Custom Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemReports;
