import { Bell, Menu, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ActivityItem } from '../Components/ActicityItem';
import { SidebarMenu } from '../Components/Sidebar/SidebarMenu';
import { StatCard } from '../Components/StatCard';
import { get } from '../Services/ApiUtils';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activityItems, setActivityItems] = useState([])

    const getActivityItems = async () => {

        const response: any = await get('atividades')
        console.log(response.data);
        setActivityItems(response.data.atividades);
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        getActivityItems();
    }, [])

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar for mobile */}
            <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
                <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-gray-200">
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                        <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>
                    <nav className="flex-1 px-2 py-4 overflow-y-auto">
                        <SidebarMenu />
                    </nav>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
                    <div className="flex items-center h-16 px-6 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                    </div>
                    <nav className="flex-1 px-2 py-4 overflow-y-auto">
                        <SidebarMenu />
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top navigation */}
                <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 lg:px-6">
                    <div className="flex items-center">
                        <button onClick={toggleSidebar} className="text-gray-500 lg:hidden">
                            <Menu size={24} />
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100">
                            <Bell size={20} />
                        </button>
                        <div className="relative">
                            <button className="flex items-center p-1 text-gray-500 rounded-full hover:bg-gray-100">
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                    <User size={20} />
                                </div>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Bem-vindo ao Dashboard</h2>
                        <p className="text-gray-600">Aqui está um resumo dos seus dados</p>
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard title="Usuários" value="1,234" color="bg-blue-500" />
                        <StatCard title="Receita" value="R$ 12,345" color="bg-green-500" />
                        <StatCard title="Tarefas" value="24" color="bg-yellow-500" />
                        <StatCard title="Pendências" value="7" color="bg-red-500" />
                    </div>

                    {/* Recent activity */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">Atividade Recente</h3>
                        <div className="space-y-4">
                            {
                                activityItems.length > 0
                                    ? activityItems.map((item: any, index) => {

                                        if (index >= 10)
                                            return null;

                                        if (item.activity_type == 'login') {

                                            const timestampFormat = new Intl.DateTimeFormat('pt-BR', {
                                                day: 'numeric',
                                                month: 'long',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true
                                            }).format(new Date(item.timestamp));

                                            return <ActivityItem
                                                title='Novo login no sistema'
                                                description={`O usuário ${item.username} efetuou login no sistema`}
                                                time={timestampFormat}
                                            />
                                        }

                                        if (item.activity_type == 'cadastrou-se'){
                                            const timestampFormat = new Intl.DateTimeFormat('pt-BR', {
                                                day: 'numeric',
                                                month: 'long',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true
                                            }).format(new Date(item.timestamp));
                                            return <ActivityItem
                                                title='Novo cadastro realizado'
                                                description={`O usuário ${item.username} foi cadastrado no sistema`}
                                                time={timestampFormat}
                                            />
                                        }
                                        return null
                                    })
                                    : <p className="text-gray-700">Carregando...</p>
                            }
                            
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};



export default Dashboard;