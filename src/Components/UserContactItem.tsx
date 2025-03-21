
export const UserContactItem = ({ username, email }: {
    username: string,
    email: string,
}) => (
    <div className="pb-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
            <div>
                <p className="font-medium text-gray-900">{username}</p>
                <p className="text-sm text-gray-500">{email}</p>
            </div>
            <a
                href={`mailto:${email}`}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
                Enviar E-mail
            </a>
        </div>
    </div>
);