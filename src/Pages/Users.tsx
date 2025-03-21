import { Bell, Menu, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SidebarMenu } from '../Components/Sidebar/SidebarMenu';
import { get } from '../Services/ApiUtils';
import { UserContactItem } from '../Components/UserContactItem';

const Users = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [users, setUsers] = useState([])

    const getUsers = async () => {

        const response: any = await get('users')
        console.log(response.data);
        setUsers(response.data.users);
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        getUsers();
    }, [])

    return (
        <div className="flex h-screen bg-gray-100">
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


            <div className="flex flex-col flex-1 overflow-hidden">
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
                        <h2 className="text-2xl font-bold text-gray-800">Usuários cadastrados</h2>
                        <p className="text-gray-600">Aqui está um resumo dos usuários cadastrados no sistema</p>
                    </div>


                    {/* Recent activity */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <div className="space-y-4">
                            {
                                users.length > 0
                                ? users.map((user: any) => {
                                    return <UserContactItem email={user.email} username={user.username} />
                                })
                                : null
                            }
                            
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};



export default Users;