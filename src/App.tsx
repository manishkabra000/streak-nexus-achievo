import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { GoalProvider } from "./contexts/GoalContext";
import { AchievementProvider } from "./contexts/AchievementContext";
import ProfilePage from "./pages/ProfilePage";

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
                <Route path="/goals" element={<GoalsPage />} />
                <Route path="/goals/:id" element={<GoalDetailPage />} />
                <Route path="/goals/new" element={<NewGoalPage />} />
                <Route path="/goals/:id/edit" element={<EditGoalPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
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
