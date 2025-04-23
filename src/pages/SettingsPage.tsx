
import React, { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Github, Code, Settings2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const SettingsPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  // For demo, these settings are static - add real logic as needed
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(() => {
    // Check if dark mode class is present on html element
    return document.documentElement.classList.contains("dark");
  });

  // Apply theme on component mount
  useEffect(() => {
    // Ensure the class matches the state on initial load
    document.documentElement.classList.toggle("dark", darkMode);
  }, []);

  // Toggle theme by toggling 'dark' class on html element
  const handleThemeToggle = () => {
    setDarkMode((prev) => {
      const next = !prev;
      
      // Update the DOM
      document.documentElement.classList.toggle("dark", next);
      
      // Save preference to localStorage
      localStorage.setItem('theme', next ? 'dark' : 'light');
      
      // Show toast notification
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
              {user?.integrations.github ? (
                <span className="text-green-600 font-semibold">Connected</span>
              ) : (
                <span className="text-red-600 font-medium">Not connected</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="text-muted-foreground" size={20} />
                <span>LeetCode</span>
              </div>
              {user?.integrations.leetcode ? (
                <span className="text-green-600 font-semibold">Connected</span>
              ) : (
                <span className="text-red-600 font-medium">Not connected</span>
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
