
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Avaliacoes from "./pages/Avaliacoes";
import Campanhas from "./pages/Campanhas";
import Contatos from "./pages/Contatos";
import Widgets from "./pages/Widgets";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/avaliacoes" element={
            <Layout>
              <Avaliacoes />
            </Layout>
          } />
          <Route path="/campanhas" element={
            <Layout>
              <Campanhas />
            </Layout>
          } />
          <Route path="/contatos" element={
            <Layout>
              <Contatos />
            </Layout>
          } />
          <Route path="/widgets" element={
            <Layout>
              <Widgets />
            </Layout>
          } />
          <Route path="/relatorios" element={
            <Layout>
              <Relatorios />
            </Layout>
          } />
          <Route path="/configuracoes" element={
            <Layout>
              <Configuracoes />
            </Layout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
