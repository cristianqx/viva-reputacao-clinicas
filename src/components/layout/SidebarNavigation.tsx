
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Send,
  Star,
  LineChart,
  Settings,
  BarChart4,
  DollarSign,
  LogOut,
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  badge?: string;
  onClick?: () => void;
}

function NavItem({ href, icon, title, badge, onClick }: NavItemProps) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-all text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        {icon}
        <span>{title}</span>
        {badge && (
          <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {badge}
          </span>
        )}
      </button>
    );
  }

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
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold text-brand">Reputação Viva</h2>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
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
      </div>

      {/* User info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-medium text-primary">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                : "DR"}
            </span>
          </div>
          <div className="truncate">
            <div className="text-sm font-medium">
              {user?.name || "Dr. Ricardo Silva"}
            </div>
            <div className="text-xs text-muted-foreground">Plano Premium</div>
          </div>
        </div>
        <div className="mt-4">
          <NavItem
            href="#"
            icon={<LogOut className="h-5 w-5" />}
            title="Sair do Sistema"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
}
