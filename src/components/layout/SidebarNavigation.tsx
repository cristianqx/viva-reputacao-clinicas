
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Send,
  Star,
  LineChart,
  Settings,
  FileText,
  BarChart4,
  DollarSign,
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  badge?: string;
}

function NavItem({ href, icon, title, badge }: NavItemProps) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )
      }
    >
      {icon}
      <span>{title}</span>
      {badge && (
        <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export function SidebarNavigation() {
  return (
    <div className="space-y-1">
      <NavItem
        href="/dashboard"
        icon={<LayoutDashboard className="h-5 w-5" />}
        title="Dashboard"
      />
      <NavItem href="/contatos" icon={<Users className="h-5 w-5" />} title="Contatos" />
      <NavItem
        href="/campanhas"
        icon={<Send className="h-5 w-5" />}
        title="Campanhas"
      />
      <NavItem
        href="/avaliacoes"
        icon={<Star className="h-5 w-5" />}
        title="Avaliações"
      />
      <NavItem
        href="/logs-faturamento"
        icon={<DollarSign className="h-5 w-5" />}
        title="Logs de Faturamento"
      />
      <NavItem
        href="/relatorios"
        icon={<LineChart className="h-5 w-5" />}
        title="Relatórios"
      />
      <NavItem
        href="/widgets"
        icon={<BarChart4 className="h-5 w-5" />}
        title="Widgets"
      />
      <NavItem
        href="/configuracoes"
        icon={<Settings className="h-5 w-5" />}
        title="Configurações"
      />
    </div>
  );
}
