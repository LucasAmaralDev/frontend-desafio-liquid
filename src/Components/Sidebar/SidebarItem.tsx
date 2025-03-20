export const SidebarItem = ({ icon, text, active = false }: {
    icon: React.ReactNode,
    text: string,
    active?: boolean,
}) => (
  <a
    href="#"
    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
      active
        ? 'bg-gray-100 text-gray-900'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <span className="mr-3 text-gray-500">{icon}</span>
    {text}
  </a>
);