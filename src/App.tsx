
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { MessageProvider } from "./context/MessageContext";
import PrivateRoute from "./components/PrivateRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ChatsPage from "./pages/ChatsPage";
import ChatDetailPage from "./pages/ChatDetailPage";
import HiddenMessagesPage from "./pages/HiddenMessagesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <MessageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/chats" element={
                <PrivateRoute>
                  <ChatsPage />
                </PrivateRoute>
              } />
              
              <Route path="/chat/:chatId" element={
                <PrivateRoute>
                  <ChatDetailPage />
                </PrivateRoute>
              } />
              
              <Route path="/hidden" element={
                <PrivateRoute>
                  <HiddenMessagesPage />
                </PrivateRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </MessageProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
