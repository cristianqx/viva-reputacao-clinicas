
import React from "react";
import { RouterProvider, createBrowserRouter, redirect, Outlet } from "react-router-dom";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        index: true,
        element: <Index />,
      },
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
        path: "404",
        element: <NotFound />,
      },
      {
        path: "*",
        loader: () => redirect("/404"),
      },
    ],
  },
  // Rota de callback do Google OAuth fora do layout principal
  {
    path: "/auth/callback",
    element: <GoogleAuthCallback />,
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
