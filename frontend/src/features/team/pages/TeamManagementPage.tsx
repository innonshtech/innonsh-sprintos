import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ROLE_COLORS } from '@/constants/teamMembers';
import api from '@/lib/api';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Button } from '@/components/ui/button';
import OnboardEmployeeModal from '../components/OnboardEmployeeModal';
import { 
  Users, 
  ShieldCheck, 
  Lock, 
  Check, 
  RefreshCw, 
  ShieldAlert, 
  SlidersHorizontal,
  LayoutDashboard,
  CheckSquare,
  Clock,
  Kanban,
  MessageSquare,
  FileText,
  Activity,
  BarChart,
  Calendar,
  Settings,
  FileSpreadsheet
} from 'lucide-react';
import { 
  useRolePermissions, 
  useUpdateRolePermissions, 
  DEFAULT_ROLE_PERMISSIONS
} from '../api/rolePermissionsApi';
import type { SidebarFeatureKey, RolePermissionMap } from '../api/rolePermissionsApi';
import type { UserRole } from '@/types/user';
import { toast } from 'react-hot-toast';

const SIDEBAR_FEATURE_LIST: { key: SidebarFeatureKey; label: string; desc: string; icon: any }[] = [
  { key: 'Projects', label: 'Projects Directory', desc: 'Access team projects directory and details', icon: CheckSquare },
  { key: 'Sprints', label: 'Sprint Planning', desc: 'Access active sprints and backlog planning', icon: Clock },
  { key: 'Tasks', label: 'All Tasks (Org)', desc: 'View all organizational tasks', icon: CheckSquare },
  { key: 'My Tasks', label: 'My Tasks', desc: 'View assigned personal tasks', icon: CheckSquare },
  { key: 'Campaign Tasks', label: 'Campaign Tasks', desc: 'View marketing campaign tasks', icon: CheckSquare },
  { key: 'User Stories', label: 'User Stories Grid', desc: 'Access interactive Google Sheets user story grid', icon: FileSpreadsheet },
  { key: 'Boards', label: 'Kanban Boards', desc: 'Access agile kanban boards', icon: Kanban },
  { key: 'Chat', label: 'Chat Messaging', desc: 'Access team channel messaging', icon: MessageSquare },
  { key: 'Standups', label: 'Daily Standups', desc: 'View and submit daily standups', icon: Users },
  { key: 'Timesheets', label: 'Timesheets', desc: 'Log and review daily timesheets', icon: FileText },
  { key: 'Activity Log', label: 'Activity Log', desc: 'View personal activity history', icon: Activity },
  { key: 'Analytics', label: 'Analytics Dashboard', desc: 'View high-level analytics & metrics', icon: BarChart },
  { key: 'Reports', label: 'Executive Reports', desc: 'Access summary reports', icon: BarChart },
  { key: 'Sprint Reports', label: 'Sprint Retrospectives', desc: 'View member sprint completion reports', icon: BarChart },
  { key: 'Audit Log', label: 'Organization Audit Log', desc: 'Access organization security & audit logs', icon: ShieldCheck },
  { key: 'Feedbacks', label: 'Sprint Feedback', desc: 'Submit and review sprint feedback', icon: MessageSquare },
  { key: 'Team Management', label: 'Team Control Center', desc: 'Access team directory and permissions', icon: Users },
  { key: 'Calendar', label: 'Calendar Timeline', desc: 'View team milestones & schedule', icon: Calendar },
  { key: 'Settings', label: 'Account Settings', desc: 'Access profile & account settings', icon: Settings },
];

const AVAILABLE_ROLES: { role: UserRole; label: string }[] = [
  { role: 'PRODUCT_MANAGER', label: 'PRODUCT MANAGER' },
  { role: 'PRODUCT_OWNER', label: 'PRODUCT OWNER' },
  { role: 'DEVELOPER', label: 'DEVELOPER' },
  { role: 'MARKETING', label: 'MARKETING' },
  { role: 'ADMIN', label: 'ADMINISTRATOR' },
];

export default function TeamManagementPage() {
  const [activeTab, setActiveTab] = useState<'directory' | 'permissions'>('directory');
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [onboardModalOpen, setOnboardModalOpen] = useState(false);

  // Selected Role for Permission Editing
  const [selectedRole, setSelectedRole] = useState<UserRole>('DEVELOPER');
  const [rolePermissionsState, setRolePermissionsState] = useState<RolePermissionMap>(DEFAULT_ROLE_PERMISSIONS.DEVELOPER);

  const { user } = useAuthStore();
  const isPM = user?.role === 'PRODUCT_MANAGER' || user?.role === 'ADMIN';

  // Saket Patil Exclusive Access Verification
  const isSaketPatil = user?.email === 'saket.innonsh@gmail.com' || user?.name?.toLowerCase().includes('saket') || isPM;

  const { data: dbPermissions = [], isLoading: isLoadingPermissions } = useRolePermissions();
  const updatePermissionsMutation = useUpdateRolePermissions();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/team');
        setTeam(res.data);
      } catch (error) {
        console.error('Failed to fetch team data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  // Update local state when selected role or DB permissions change
  useEffect(() => {
    const dbRecord = dbPermissions.find((p) => p.role === selectedRole);
    if (dbRecord && dbRecord.permissions) {
      setRolePermissionsState({
        ...DEFAULT_ROLE_PERMISSIONS[selectedRole],
        ...dbRecord.permissions,
      });
    } else {
      setRolePermissionsState(DEFAULT_ROLE_PERMISSIONS[selectedRole]);
    }
  }, [selectedRole, dbPermissions]);

  const handleTogglePermission = (key: SidebarFeatureKey) => {
    setRolePermissionsState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSavePermissions = async () => {
    try {
      await updatePermissionsMutation.mutateAsync({
        role: selectedRole,
        permissions: rolePermissionsState,
      });
      toast.success(`Updated access control permissions for ${selectedRole.replace('_', ' ')}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update access permissions');
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading team control center...</div>;

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Team Control Center</h1>
          <p className="text-muted-foreground mt-1 text-xs md:text-sm">
            Manage team workload, access privileges, and feature permissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tab Navigation */}
          <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'directory'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Team Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('permissions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'permissions'
                  ? 'bg-card text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Lock className="w-4 h-4 text-amber-500" />
              <span>Roles & Permissions</span>
            </button>
          </div>

          {isPM && activeTab === 'directory' && (
            <Button onClick={() => setOnboardModalOpen(true)}>
              Onboard Employee
            </Button>
          )}
        </div>
      </div>

      <OnboardEmployeeModal open={onboardModalOpen} onOpenChange={setOnboardModalOpen} />

      {/* TAB 1: TEAM DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.map((member) => (
            <Card key={member.id} className="relative overflow-hidden group hover:shadow-md transition-all border-border">
              {/* Online Status Indicator */}
              <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${member.isOnline ? 'bg-emerald-500' : 'bg-muted'} ring-2 ring-background`} />
              
              <CardHeader className="text-center pb-2 pt-6">
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription className="flex justify-center items-center gap-2 mt-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider border ${ROLE_COLORS[member.role as UserRole] || ''}`}>
                    {member.role?.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider">{member.department}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-center text-sm border-y border-border py-3">
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs">Tasks</p>
                    <p className="font-semibold">{member.assignedTasks}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs">Blockers</p>
                    <p className="font-semibold text-rose-600">{member.blockersCount}</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground text-xs font-medium">Utilization</span>
                    <span className="font-semibold text-xs">{member.utilizationPercent}%</span>
                  </div>
                  <Progress 
                    value={member.utilizationPercent} 
                    className="h-2" 
                    indicatorClassName={
                      member.utilizationPercent > 80 ? 'bg-rose-500' : 
                      member.utilizationPercent < 30 ? 'bg-emerald-500' : 'bg-indigo-500'
                    } 
                  />
                </div>

                {member.activeSprint && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1">Active Sprint</p>
                    <div className="bg-muted px-3 py-1.5 rounded-md text-xs font-medium truncate">
                      {member.activeSprint}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 2: ROLES & PERMISSIONS (FEATURE FLAGS & ACCESS CONTROL) */}
      {activeTab === 'permissions' && (
        <div>
          {!isSaketPatil ? (
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-8 text-center space-y-3">
                <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
                <h3 className="text-lg font-bold text-foreground">Exclusive Access Restricted</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Feature Flags & Access Control permissions can only be modified by <span className="font-semibold text-foreground">Saket Patil</span>. Please contact Saket to update sidebar navigation visibility for your role.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border shadow-sm">
              <CardHeader className="border-b border-border bg-muted/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-rose-500" />
                      <span className="text-xs font-mono uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider">
                        Feature Flags & Access Control
                      </span>
                    </div>
                    <CardTitle className="text-xl font-bold mt-1">Sidebar Navigation Access Toggles</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Configured exclusively by Saket Patil. Turn features on/off to control what appears in each role's sidebar.
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Role Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">Select Role:</span>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                        className="bg-background text-foreground border border-border rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {AVAILABLE_ROLES.map((r) => (
                          <option key={r.role} value={r.role}>{r.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Save Button */}
                    <Button
                      onClick={handleSavePermissions}
                      disabled={updatePermissionsMutation.isPending}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
                    >
                      {updatePermissionsMutation.isPending ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
                      ) : (
                        <Check className="w-4 h-4 mr-1.5" />
                      )}
                      Save Permissions
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {isLoadingPermissions ? (
                  <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">
                    Loading role access configurations...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SIDEBAR_FEATURE_LIST.map((feature) => {
                      const isEnabled = !!rolePermissionsState[feature.key];
                      const IconComponent = feature.icon;

                      return (
                        <div
                          key={feature.key}
                          onClick={() => handleTogglePermission(feature.key)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                            isEnabled
                              ? 'bg-indigo-500/5 border-indigo-500/30 hover:border-indigo-500/60'
                              : 'bg-card border-border hover:border-border/80 opacity-60'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${isEnabled ? 'bg-indigo-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground">{feature.label}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{feature.desc}</p>
                            </div>
                          </div>

                          {/* Toggle Switch */}
                          <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors flex-shrink-0 ${isEnabled ? 'bg-indigo-600 justify-end' : 'bg-zinc-300 dark:bg-zinc-700 justify-start'}`}>
                            <div className="w-4 h-4 rounded-full bg-white shadow-md transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
