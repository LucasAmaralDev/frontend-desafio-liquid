import { FileText, Home, LogOut, Users } from "lucide-react";
import { SidebarItem } from "./SidebarItem";

export const SidebarMenu = () => {

  const rotaAtiva = window.location.pathname.split('/')[1];
  return (
    <div className="space-y-1">
      <SidebarItem icon={<Home size={20} />} text="Inicio" active={rotaAtiva == "dashboard"} link='/dashboard' />
      <SidebarItem icon={<Users size={20} />} text="Usuários" active={rotaAtiva == "users"} link='/users' />
      <SidebarItem icon={<FileText size={20} />} text="Relatórios" link='/relatorios' />
      {/* <SidebarItem icon={<BarChart2 size={20} />} text="Análises" link='/users' /> */}
      {/* <SidebarItem icon={<Settings size={20} />} text="Configurações" link='/users' /> */}
      <SidebarItem icon={<LogOut size={20} />} text="Sair" logout />
    </div>
  )
};