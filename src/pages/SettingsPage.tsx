
import React, { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Github, Code, Settings2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const SettingsPage: React.FC = () => {
  const { user, isAuthenticated, logout, connectLeetCode, refetchIntegrations } = useAuth();
  const { toast } = useToast();

  // For demo, these settings are static - add real logic as needed
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, []);

  // Handle (mock) LeetCode connection
  const handleConnectLeetCode = async () => {
    await connectLeetCode();
    await refetchIntegrations();
    toast({
      title: "LeetCode Connected!",
      description: "Your LeetCode account has been linked.",
      duration: 2000,
    });
  };

  const handleThemeToggle = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
      toast({
        title: next ? "Dark mode enabled" : "Light mode enabled",
        description: "Your theme preference has been saved.",
        duration: 2000,
      });
      return next;
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-8 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings2 size={28} className="text-primary" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your Achievo experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Enable notifications</span>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <Switch checked={darkMode} onCheckedChange={handleThemeToggle} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>
              Connect your accounts to unlock features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="text-muted-foreground" size={20} />
                <span>GitHub</span>
              </div>
              <span className="text-red-600 font-medium">Not connected</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="text-muted-foreground" size={20} />
                <span>LeetCode</span>
              </div>
              {user?.integrations.leetcode ? (
                <span className="text-green-600 font-semibold">Connected</span>
              ) : (
                <Button size="sm" onClick={handleConnectLeetCode} variant="outline">Connect</Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <div className="text-base font-semibold">{user?.name}</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
            </div>
            <Button variant="destructive" className="w-fit" onClick={logout}>
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;
