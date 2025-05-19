import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AccessControlProvider } from "@/contexts/AccessControlContext";
import { Toaster } from "sonner";

import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Contatos from "@/pages/Contatos";
import Campanhas from "@/pages/Campanhas";
import Avaliacoes from "@/pages/Avaliacoes";
import LogsFaturamento from "@/pages/LogsFaturamento";
import Relatorios from "@/pages/Relatorios";
import Widgets from "@/pages/Widgets";
import Configuracoes from "@/pages/Configuracoes";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import Landing from "@/pages/Landing";
import GoogleAuthCallback from "@/pages/auth/GoogleAuthCallback";
import GoogleCalendarCallback from "@/pages/auth/GoogleCalendarCallback";
import Integracoes from "@/pages/Integracoes";
import ReviewPage from "@/pages/ReviewPage";
import Login from "@/pages/Login";

// Componente que verifica autenticação para rotas protegidas
const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <FullScreenLoader />;
  }
  
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login from ProtectedRoutes");
    return <Navigate to="/login" replace />;
  }
  
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

// Componente para rotas que precisam de autenticação mas não de layout
const AuthRequiredRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login from AuthRequiredRoute");
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <img src="/placeholder.svg" alt="Reputação Viva" className="w-32 h-32 animate-pulse mb-6" />
      <div className="w-10 h-10 border-4 border-[#0E927D] border-t-transparent rounded-full animate-spin" />
      <span className="mt-4 text-[#179C8A] font-semibold text-lg">Carregando...</span>
    </div>
  );
}

// Main App component
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AccessControlProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth/callback" element={<GoogleAuthCallback />} />
            <Route path="/auth/google-calendar-callback" element={<GoogleCalendarCallback />} />
            
            <Route path="/avaliar/:campaignId" element={<ReviewPage />} />
            
            {/* Protected routes with layout */}
            <Route element={<ProtectedRoutes />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="contatos" element={<Contatos />} />
              <Route path="campanhas" element={<Campanhas />} />
              <Route path="avaliacoes" element={<Avaliacoes />} />
              <Route path="logs-faturamento" element={<LogsFaturamento />} />
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="widgets" element={<Widgets />} />
              <Route path="configuracoes" element={<Configuracoes />} />
              <Route path="integracoes" element={<Integracoes />} />
              <Route path="404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
          <Toaster position="top-right" richColors />
        </AccessControlProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
