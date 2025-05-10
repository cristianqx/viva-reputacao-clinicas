import React from "react";
import { RouterProvider, createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
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
import GoogleAuthCallback from "@/pages/auth/GoogleAuthCallback";
import GoogleCalendarCallback from "@/pages/auth/GoogleCalendarCallback";
import Integracoes from "@/pages/Integracoes";

// Componente que verifica autenticação para rotas protegidas
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1CB65D]"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

// Definindo as rotas
const routes = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth/callback",
    element: <GoogleAuthCallback />,
  },
  {
    path: "/auth/google-calendar-callback",
    element: <GoogleCalendarCallback />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <Layout>
            <Outlet />
          </Layout>
        ),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "contatos",
            element: <Contatos />,
          },
          {
            path: "campanhas",
            element: <Campanhas />,
          },
          {
            path: "avaliacoes",
            element: <Avaliacoes />,
          },
          {
            path: "logs-faturamento",
            element: <LogsFaturamento />,
          },
          {
            path: "relatorios",
            element: <Relatorios />,
          },
          {
            path: "widgets",
            element: <Widgets />,
          },
          {
            path: "configuracoes",
            element: <Configuracoes />,
          },
          {
            path: "integracoes",
            element: <Integracoes />,
          },
          {
            path: "404",
            element: <NotFound />,
          },
          {
            path: "*",
            element: <Navigate to="/404" replace />,
          },
        ],
      },
    ],
  }
];

// Criando o router
const router = createBrowserRouter(routes);

// Componente principal da aplicação
const AppContent = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
};

// Wrapper com o provider de autenticação
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
