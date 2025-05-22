
import React, { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        {!isCollapsed ? (
          <h2 className="text-lg font-semibold text-[#10B981]">Reputação Viva</h2>
        ) : (
          <h2 className="text-lg font-semibold text-[#10B981]">RV</h2>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          <p className={cn("text-xs font-medium text-muted-foreground mb-2 px-3", 
            isCollapsed && "sr-only")}>Principal</p>
          <NavItem
            href="/dashboard"
            icon={<LayoutDashboard className="h-5 w-5" />}
            title={isCollapsed ? "" : "Dashboard"}
          />
          <NavItem 
            href="/contatos" 
            icon={<Users className="h-5 w-5" />} 
            title={isCollapsed ? "" : "Contatos"} 
          />
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-1">
          <p className={cn("text-xs font-medium text-muted-foreground mb-2 px-3", 
            isCollapsed && "sr-only")}>Marketing</p>
          <NavItem
            href="/campanhas"
            icon={<Send className="h-5 w-5" />}
            title={isCollapsed ? "" : "Campanhas"}
          />
          <NavItem
            href="/avaliacoes"
            icon={<Star className="h-5 w-5" />}
            title={isCollapsed ? "" : "Avaliações"}
          />
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-1">
          <p className={cn("text-xs font-medium text-muted-foreground mb-2 px-3", 
            isCollapsed && "sr-only")}>Relatórios</p>
          <NavItem
            href="/logs-faturamento"
            icon={<DollarSign className="h-5 w-5" />}
            title={isCollapsed ? "" : "Logs de Faturamento"}
          />
          <NavItem
            href="/relatorios"
            icon={<LineChart className="h-5 w-5" />}
            title={isCollapsed ? "" : "Relatórios"}
          />
          <NavItem
            href="/widgets"
            icon={<BarChart4 className="h-5 w-5" />}
            title={isCollapsed ? "" : "Widgets"}
          />
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-1">
          <p className={cn("text-xs font-medium text-muted-foreground mb-2 px-3", 
            isCollapsed && "sr-only")}>Sistema</p>
          <NavItem
            href="/configuracoes"
            icon={<Settings className="h-5 w-5" />}
            title={isCollapsed ? "" : "Configurações"}
          />
        </div>
      </div>

      {/* Toggle button */}
      <div className="border-t p-4 flex justify-center">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center h-8 w-8 rounded-full bg-muted hover:bg-[#10B981]/10 transition-all"
          aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* User info */}
      <div className="border-t p-4">
        <div className={cn("flex items-center gap-3", isCollapsed && "flex-col")}>
          <Avatar className={cn("h-9 w-9", isCollapsed && "h-8 w-8")}>
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                : "CC"}
            </AvatarFallback>
          </Avatar>
          <div className={cn("truncate flex-1", isCollapsed && "hidden")}>
            <div className="text-sm font-medium">
              {user?.name || "Cristian Coelho"}
            </div>
            <div className="text-xs text-muted-foreground">Plano Premium</div>
          </div>
        </div>
        <div className="mt-4">
          <NavItem
            href="#"
            icon={<LogOut className="h-5 w-5" />}
            title={isCollapsed ? "" : "Sair do Sistema"}
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
}
