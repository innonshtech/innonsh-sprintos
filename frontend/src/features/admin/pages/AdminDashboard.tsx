import { ExecutiveOverviewCards } from '../components/ExecutiveOverviewCards';
import { OrganizationOverviewPanel } from '../components/OrganizationOverviewPanel';
import { SprintMonitoringBoard } from '../components/SprintMonitoringBoard';
import { TeamPerformanceMatrix } from '../components/TeamPerformanceMatrix';
import { BlockerMonitoringCenter } from '../components/BlockerMonitoringCenter';
import { ProductivityInsightsPanel } from '../components/ProductivityInsightsPanel';
import { ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[#020817] text-slate-200 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <ShieldAlert className="h-8 w-8 text-blue-500" />
              Executive Operations Center
            </h1>
            <p className="text-slate-400 mt-2">
              Enterprise Monitoring Layer. Read-only access to all organizational metrics.
            </p>
          </div>
        </div>

        {/* Global KPIs */}
        <ExecutiveOverviewCards />

        {/* Middle Section: Intelligence & Blockers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProductivityInsightsPanel />
          </div>
          <div>
            <BlockerMonitoringCenter />
          </div>
        </div>

        {/* Sprint & Projects */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <OrganizationOverviewPanel />
          <SprintMonitoringBoard />
        </div>

        {/* Team Performance */}
        <div>
          <TeamPerformanceMatrix />
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
