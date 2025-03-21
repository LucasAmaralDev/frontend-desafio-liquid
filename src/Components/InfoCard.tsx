export const InfoCard = ({ title, value, icon }:{
    title: string,
    value: string,
    icon: string,
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center">
    <div className="text-2xl mr-3">{icon}</div>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);
