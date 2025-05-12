import React, { useContext, useEffect } from "react";
import { RouterProvider, createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth, AuthContext } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { toast } from "sonner";

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
    path: "/landing",
    element: <Landing />,
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

function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <img src="/placeholder.svg" alt="Reputação Viva" className="w-32 h-32 animate-pulse mb-6" />
      <div className="w-10 h-10 border-4 border-[#0E927D] border-t-transparent rounded-full animate-spin" />
      <span className="mt-4 text-[#179C8A] font-semibold text-lg">Carregando...</span>
    </div>
  );
}

const AppContent = () => {
  const { isLoading, isAuthenticated, user, token } = useContext(AuthContext);
  const isLoginRoute = window.location.pathname === "/login" || window.location.pathname === "/";

  // Sessão expirada ou inválida
  useEffect(() => {
    if (
      !isLoading &&
      !isAuthenticated &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/"
    ) {
      toast.warning("Sua sessão expirou. Por favor, faça login novamente.");
      window.location.href = "/login";
    }
  }, [isLoading, isAuthenticated]);

  // Falha de rede ao validar sessão (simulação: se token existe mas não autenticado)
  useEffect(() => {
    if (
      !isLoading &&
      token &&
      !isAuthenticated &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/"
    ) {
      toast.warning("Problema de conexão. Não foi possível verificar sua sessão online.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 4000);
    }
  }, [isLoading, token, isAuthenticated]);

  // Logout explícito (detectado por ausência de user/token após já estar autenticado)
  useEffect(() => {
    if (
      !isLoading &&
      !user &&
      !token &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/"
    ) {
      toast.info("Sessão encerrada com sucesso.");
      window.location.href = "/login";
    }
  }, [isLoading, user, token]);

  if (isLoading && !isLoginRoute) {
    return <FullScreenLoader />;
  }

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
