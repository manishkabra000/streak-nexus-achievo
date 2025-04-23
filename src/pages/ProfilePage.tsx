
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Github, Code, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout, connectLeetCode, refetchIntegrations } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleConnectLeetCode = async () => {
    await connectLeetCode();
    await refetchIntegrations();
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Card>
        <CardHeader className="flex items-center gap-4">
          <img 
            src={user.avatar}
            alt="Profile avatar"
            className="h-20 w-20 rounded-full border border-border"
          />
          <div>
            <CardTitle className="flex items-center space-x-2">
              <UserRound size={20} />
              <span>{user.name}</span>
            </CardTitle>
            <CardDescription className="flex items-center space-x-2 mt-1">
              <Mail size={16} className="mr-1" />
              <span>{user.email}</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Github size={20} className="text-muted-foreground" />
              <span>GitHub:</span>
              <span className="ml-2 font-medium text-red-600">
                Not Connected
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Code size={20} className="text-muted-foreground" />
              <span>LeetCode:</span>
              {user.integrations.leetcode ? (
                <span className="ml-2 font-medium text-green-600">
                  Connected
                </span>
              ) : (
                <Button 
                  size="sm"
                  className="ml-2"
                  variant="outline"
                  onClick={handleConnectLeetCode}
                >
                  Connect
                </Button>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={logout}>
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
