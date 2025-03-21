export const ActivityItem = ({ title, time, description }: {
    title: string,
    time: string,
    description: string,
}) => (
    <div className="pb-4 border-b border-gray-200">
        <div className="flex justify-between">
            <p className="font-medium text-gray-900">{title}</p>
            <p className="text-sm text-gray-500">{time}</p>
        </div>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
);
