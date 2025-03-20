import { BarChart2, Bell, FileText, Users } from "lucide-react";

export const StatCard = ({ title, value, color }:{
    title: string,
    value: string,
    color: string,  // Example: "bg-blue-500"
 }
) => (
  <div className="p-6 bg-white rounded-lg shadow">
    <div className="flex items-center">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white`}>
        {title === "Usuários" && <Users size={20} />}
        {title === "Receita" && <BarChart2 size={20} />}
        {title === "Tarefas" && <FileText size={20} />}
        {title === "Pendências" && <Bell size={20} />}
      </div>
      <div className="ml-4">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);
