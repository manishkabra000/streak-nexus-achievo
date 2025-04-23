
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { GoalProvider } from "./contexts/GoalContext";
import { AchievementProvider } from "./contexts/AchievementContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import Index from "./pages/Index";
import GoalsPage from "./pages/GoalsPage";
import GoalDetailPage from "./pages/GoalDetailPage";
import NewGoalPage from "./pages/NewGoalPage";
import EditGoalPage from "./pages/EditGoalPage";
import AchievementsPage from "./pages/AchievementsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GoalProvider>
        <AchievementProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected Routes */}
                <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
                <Route path="/goals/:id" element={<ProtectedRoute><GoalDetailPage /></ProtectedRoute>} />
                <Route path="/goals/new" element={<ProtectedRoute><NewGoalPage /></ProtectedRoute>} />
                <Route path="/goals/:id/edit" element={<ProtectedRoute><EditGoalPage /></ProtectedRoute>} />
                <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AchievementProvider>
      </GoalProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
