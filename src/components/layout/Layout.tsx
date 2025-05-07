
import { ReactNode } from "react";
import { SidebarNavigation } from "./SidebarNavigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarNavigation />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
