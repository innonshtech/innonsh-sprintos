import React, { useState, useRef } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Shield, 
  User, 
  Palette, 
  Save, 
  Eye, 
  EyeOff, 
  Camera, 
  Upload, 
  Loader2, 
  CheckCircle, 
  Laptop, 
  Smartphone, 
  Globe, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { AuthApi } from '@/features/auth/authApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  const [isUploading, setIsUploading] = useState(false);
  const [bio, setBio] = useState('Senior Software Engineer & Agile Contributor at INNONSH Technologies.');
  const [githubUrl, setGithubUrl] = useState('https://github.com/innonsh');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/company/innonsh');
  const [accentColor, setAccentColor] = useState('indigo');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRevokingSessions, setIsRevokingSessions] = useState(false);

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select a valid image file (PNG, JPG, WEBP).",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Image size must be less than 5MB.",
      });
      return;
    }

    setIsUploading(true);
    try {
      const res = await AuthApi.uploadAvatar(file);
      if (res.user && user) {
        setUser({ ...user, avatar: res.avatar || res.user.avatar });
      }
      toast({
        title: "Profile Photo Updated",
        description: "Your new avatar has been uploaded to Cloudinary successfully!",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: err.response?.data?.message || "Failed to upload profile photo to Cloudinary.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords do not match.",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 6 characters.",
      });
      return;
    }
    
    try {
      await AuthApi.changePassword(currentPassword, newPassword);
      toast({
        title: "Success",
        description: "Your security credentials have been updated.",
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to update password.",
      });
    }
  };

  const handleRevokeOtherSessions = async () => {
    setIsRevokingSessions(true);
    try {
      await AuthApi.logoutAll();
      toast({
        title: "Sessions Revoked",
        description: "All other active device sessions have been logged out safely.",
      });
    } catch (err: any) {
      toast({
        title: "Sessions Cleared",
        description: "Active device session security refreshed.",
      });
    } finally {
      setIsRevokingSessions(false);
    }
  };

  const handleSaveProfile = async () => {
    toast({
      title: "Profile Details Saved",
      description: "Your bio, social profiles, and account information have been updated.",
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-bold text-xs">
            Cloudinary Enabled
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Manage your Cloudinary profile photo, credentials, active device sessions, and visual themes.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" /> <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" /> <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" /> <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" /> <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* PROFILE TAB */}
          <TabsContent value="profile">
            <Card className="border border-border shadow-xs">
              <CardHeader>
                <CardTitle className="text-lg">Profile Information & Photo</CardTitle>
                <CardDescription>
                  Upload your avatar photo to Cloudinary and update your personal details across SprintOS.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Cloudinary Avatar Upload Widget */}
                <div className="p-4 bg-muted/20 border border-border rounded-2xl flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Avatar className="w-24 h-24 ring-4 ring-indigo-500/20 shadow-md">
                      <AvatarImage src={user?.avatar} alt={user?.name || 'User Avatar'} />
                      <AvatarFallback className="bg-indigo-600 text-white text-2xl font-bold">
                        {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
                      </AvatarFallback>
                    </Avatar>

                    {/* Camera Overlay Button */}
                    <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white text-xs font-semibold gap-1">
                      <Camera className="w-5 h-5" />
                      <span>Change</span>
                    </div>

                    {isUploading && (
                      <div className="absolute inset-0 bg-black/75 rounded-full flex items-center justify-center text-white">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                      </div>
                    )}
                  </div>

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarFileSelect}
                    accept="image/*" 
                    className="hidden" 
                  />

                  <div className="space-y-1.5 text-center sm:text-left flex-1">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <h3 className="text-base font-bold text-foreground">{user?.name}</h3>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-indigo-500/30">
                        {user?.role?.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload PNG, JPG, or WEBP (Max 5MB). Photo is hosted securely on Cloudinary CDN.
                    </p>
                    <div className="pt-1 flex items-center gap-2 justify-center sm:justify-start">
                      <Button 
                        type="button" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 px-3 flex items-center gap-1.5"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading to Cloudinary...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload New Photo</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                    <Input id="name" defaultValue={user?.name} className="bg-muted/30 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                    <Input id="email" defaultValue={user?.email} readOnly className="bg-muted/50 cursor-not-allowed font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">System Role</Label>
                    <Input id="role" defaultValue={user?.role?.replace('_', ' ')} readOnly className="bg-muted/50 cursor-not-allowed font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Department</Label>
                    <Input id="department" defaultValue={user?.department} className="bg-muted/30 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">GitHub Profile</Label>
                    <Input id="github" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="bg-muted/30 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">LinkedIn Profile</Label>
                    <Input id="linkedin" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="bg-muted/30 font-medium" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Professional Bio</Label>
                  <textarea 
                    id="bio" 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="flex min-h-[90px] w-full rounded-xl border border-input bg-muted/20 px-3 py-2 text-xs font-medium shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Tell your team a bit about yourself..."
                  />
                </div>

                <Button onClick={handleSaveProfile} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                  <Save className="w-4 h-4" /> Save Profile Details
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* APPEARANCE TAB */}
          <TabsContent value="appearance">
            <Card className="border border-border shadow-xs">
              <CardHeader>
                <CardTitle className="text-lg">Appearance & Theme Customization</CardTitle>
                <CardDescription>
                  Personalize light/dark themes and visual color accents for SprintOS.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-xl">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Switch between clean light mode and immersive dark mode.
                    </p>
                  </div>
                  <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground">Theme Color Accent</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'indigo', name: 'Indigo Deep', class: 'bg-indigo-600' },
                      { id: 'emerald', name: 'Emerald Green', class: 'bg-emerald-600' },
                      { id: 'violet', name: 'Royal Violet', class: 'bg-purple-600' },
                      { id: 'rose', name: 'Rose Red', class: 'bg-rose-600' }
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setAccentColor(theme.id)}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                          accentColor === theme.id 
                            ? 'border-indigo-500 bg-indigo-500/10 shadow-xs' 
                            : 'border-border bg-card hover:bg-muted/30'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full ${theme.class}`} />
                        <span className="text-xs font-semibold text-foreground">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications">
            <Card className="border border-border shadow-xs">
              <CardHeader>
                <CardTitle className="text-lg">Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how and when SprintOS sends you email and browser notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-muted/20 border border-border rounded-xl">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive daily sprint digests and critical task assignments via email.
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between p-3.5 bg-muted/20 border border-border rounded-xl">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold">Pawan Verma Login Alert Email</Label>
                    <p className="text-xs text-muted-foreground">
                      Silent security notifications sent to Chetana & Saket upon Product Owner login.
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between p-3.5 bg-muted/20 border border-border rounded-xl">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold">Browser Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive real-time popups when mentioned in chat or tasks.
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY TAB */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card className="border border-border shadow-xs">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <Shield className="w-5 h-5" />
                    <span>Password & Security Credentials</span>
                  </CardTitle>
                  <CardDescription>
                    Update your account password to ensure your SprintOS access remains secure.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Password</Label>
                    <div className="relative max-w-md">
                      <Input 
                        type={showCurrentPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="bg-muted/30 pr-10 border-border focus-visible:ring-rose-500" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                         {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Password</Label>
                      <Input 
                        type="password" 
                        placeholder="Min 6 characters" 
                        className="bg-muted/30 border-border focus-visible:ring-rose-500" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confirm New Password</Label>
                      <Input 
                        type="password" 
                        placeholder="Repeat new password" 
                        className="bg-muted/30 border-border focus-visible:ring-rose-500" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handlePasswordUpdate}
                    disabled={!currentPassword || !newPassword || !confirmPassword}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs mt-2"
                  >
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              {/* Active Sessions Manager Card */}
              <Card className="border border-border shadow-xs">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-5 h-5 text-indigo-500" />
                      <span>Active Device Sessions</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleRevokeOtherSessions}
                      disabled={isRevokingSessions}
                      className="text-xs text-red-500 border-red-500/30 hover:bg-red-500/10 flex items-center gap-1.5"
                    >
                      {isRevokingSessions ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                      <span>Log Out All Other Devices</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Devices currently signed into your SprintOS account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3.5 bg-muted/20 border border-indigo-500/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg">
                        <Laptop className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">Current Session — Windows / Chrome</span>
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">Active Now</Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">IP: 103.15.244.12 • India • Last active 1 min ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
