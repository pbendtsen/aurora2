"use client"
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authenticateUser, setUser } from '../services/authService';

function Login() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {

        const isAuthenticated = authenticateUser(username, password);

        console.log('log in')
        if (isAuthenticated) {
            localStorage.setItem('isLoggedIn', 'true');
            setUser(username);
            console.log('logged in')
            router.push('/admin');
        } else {
            console.log('not logged in')
            setError('Invalid username or password');
        }
    }

    return (
        <div className='flex flex-row justify-center mt-10'>

            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <Image src="/logo3.png" alt="Logo" width={300} height={200} />


                    <label className="input input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                        <input onChange={(event) => setUsername(event.target.value)} className="grow" placeholder="Username" />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                        <input onChange={(event) => setPassword(event.target.value)} type="password" className="grow" placeholder="Password" />
                    </label>

                    <div className="card-actions justify-end">
                        <button onClick={handleLogin} className="btn btn-outline">Login</button>
                    </div>

                    {error && (
                        <div className='flex flex-row justify-center'>
                            <p className=' text-red-400 text-sm'>{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;