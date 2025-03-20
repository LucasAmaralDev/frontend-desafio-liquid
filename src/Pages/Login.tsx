import { useState } from 'react';
import { post } from '../Services/ApiUtils';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async(e:any) => {
        e.preventDefault();

        const response = await post('https://inr8qm2bj0.execute-api.us-east-1.amazonaws.com/dev/login', {
            email,
            password
        })

        if (response.status === 200) {
            localStorage.setItem('accessToken', (response.data as any).authToken);
            alert((response.data as any).message)
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="w-full max-w-md p-8 min-h-[650px] bg-white rounded-lg shadow-md flex flex-col justify-center gap-10">
                <h1 className="mb-8 text-3xl font-bold text-center text-black">Login</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-10">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 text-gray-700 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div className="mb-12">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 text-gray-700 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                            placeholder="Senha"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 text-white transition-colors duration-300 bg-gradient-to-r from-blue-500 to-purple-600 rounded hover:opacity-90"
                    >
                        Entrar
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        <a href="#" className="text-blue-600 hover:underline">
                            Esqueceu sua senha?
                        </a>
                    </p>
                    <p className="mt-4 text-gray-600">
                        Não possui uma conta?{' '}
                        <a href="/register" className="text-blue-600 hover:underline">
                            Registre-se
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
