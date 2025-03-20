import { BarChart2, FileText, Home, LogOut, Settings, Users } from "lucide-react";
import { SidebarItem } from "./SidebarItem";

export const SidebarMenu = () => (
  <div className="space-y-1">
    <SidebarItem
     icon={<Home size={20} />} text="Início" active />
    <SidebarItem icon={<Users
     size={20} />} text="Usuários" />
    <SidebarItem icon={<FileText size={20} />} text="Relatórios" />
    <SidebarItem icon={<BarChart2 size={20} />} text="Análises" />
    <SidebarItem icon={<Settings size={20} />} text="Configurações" />
    <SidebarItem icon={<LogOut size={20} />} text="Sair" />
  </div>
);