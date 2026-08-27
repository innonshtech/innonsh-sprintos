import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { 
  Eye, 
  EyeOff, 
  Pencil, 
  AlertCircle, 
  User, 
  Mail, 
  KeyRound, 
  Briefcase, 
  Building2, 
  Loader2, 
  Shield, 
  Code, 
  Kanban, 
  TrendingUp, 
  Users, 
  Bug 
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
}

interface EditEmployeeModalProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ROLES = [
  { value: 'DEVELOPER', label: 'Developer', icon: Code, badgeColor: 'text-sky-500 bg-sky-500/10' },
  { value: 'PRODUCT_MANAGER', label: 'Product Manager', icon: Kanban, badgeColor: 'text-indigo-500 bg-indigo-500/10' },
  { value: 'PRODUCT_OWNER', label: 'Product Owner', icon: Briefcase, badgeColor: 'text-purple-500 bg-purple-500/10' },
  { value: 'MARKETING', label: 'Marketing', icon: TrendingUp, badgeColor: 'text-emerald-500 bg-emerald-500/10' },
  { value: 'HR', label: 'HR', icon: Users, badgeColor: 'text-pink-500 bg-pink-500/10' },
  { value: 'QA', label: 'QA Engineer', icon: Bug, badgeColor: 'text-amber-500 bg-amber-500/10' },
  { value: 'ADMIN', label: 'Administrator', icon: Shield, badgeColor: 'text-rose-500 bg-rose-500/10' },
];

export default function EditEmployeeModal({ member, open, onOpenChange, onSuccess }: EditEmployeeModalProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'DEVELOPER',
    department: 'Engineering',
    password: ''
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        role: member.role || 'DEVELOPER',
        department: member.department || 'Engineering',
        password: ''
      });
      setErrorMessage(null);
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department
      };
      if (formData.password && formData.password.trim().length > 0) {
        payload.password = formData.password;
      }

      await api.put(`/team-members/${member.id}`, payload);
      toast.success(`Successfully updated ${formData.name}'s details!`);
      
      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to update member', error);
      const msg = error.response?.data?.message || error.response?.data?.error || 'Failed to update employee details';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border border-border/60 shadow-2xl rounded-2xl bg-card">
        {/* Header Banner */}
        <div className="relative px-6 pt-6 pb-4 border-b border-border/40 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent">
          <DialogHeader>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 ring-4 ring-indigo-500/10 shrink-0">
                <Pencil className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                  Edit Employee Details
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                  Update role, department, name, or password for <span className="font-semibold text-foreground">{member?.name}</span>.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-name" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              Full Name
            </Label>
            <Input 
              id="edit-name" 
              placeholder="Full Name"
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
              className="h-10 rounded-xl bg-muted/30 border-border/80 text-sm focus:bg-background focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-email" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              Email Address
            </Label>
            <Input 
              id="edit-email" 
              type="email" 
              placeholder="employee@company.com"
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
              className="h-10 rounded-xl bg-muted/30 border-border/80 text-sm focus:bg-background focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* New Password (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-password" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
              Reset Password <span className="text-[11px] font-normal text-muted-foreground">(Optional)</span>
            </Label>
            <div className="relative">
              <Input 
                id="edit-password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Leave blank to keep existing password"
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                className="h-10 pr-10 rounded-xl bg-muted/30 border-border/80 text-sm focus:bg-background focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-muted-foreground/50 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role & Department Row */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="edit-role" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                Role
              </Label>
              <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-border/80 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/80 shadow-xl">
                  {ROLES.map((r) => {
                    const RoleIcon = r.icon;
                    return (
                      <SelectItem key={r.value} value={r.value} className="rounded-lg text-xs font-medium my-0.5 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span className={`p-1 rounded-md ${r.badgeColor}`}>
                            <RoleIcon className="w-3.5 h-3.5" />
                          </span>
                          <span>{r.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-department" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                Department
              </Label>
              <Input 
                id="edit-department" 
                placeholder="Department"
                value={formData.department} 
                onChange={(e) => setFormData({...formData, department: e.target.value})} 
                required 
                className="h-10 rounded-xl bg-muted/30 border-border/80 text-sm focus:bg-background focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-border/40 flex items-center justify-end gap-2.5">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-10 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>

            <Button 
              type="submit" 
              disabled={loading}
              className="h-10 px-5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving Changes...
                </span>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
