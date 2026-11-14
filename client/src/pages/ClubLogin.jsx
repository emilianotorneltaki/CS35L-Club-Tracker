import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth/AuthContext.js';
import { useState } from 'react';

export default function ClubLogin(){
    const { user, startSession } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password ,setPassword] = useState('');
    const [error ,setError] = useState('');
    const [loading ,setLoading] = useState(false);

    if (user) return <Navigate to="/dashboard" replace />;

    async function handleSubmit(e) {
        e.preventDefault(); //prevents reloading the page on submit
        setError('');
        setLoading(true);
        try {
            const { session } = await api('/auth/club/login', {
            method: 'POST',
            body: { email, password },
        });
        await startSession(session.access_token);
        navigate('/dashboard'); // TODO: point at the club dashboard once that story exists
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }
    ;

    return (<main className="auth-card">
        <h1>Club Login</h1>
            <form onSubmit={handleSubmit}>
                <label> 
                    Email
                    <input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} required />
                </label>
                <label> 
                    Password
                    <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} required />
                </label>
                {error && <p className="error" role="alert">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Log in"}
                </button>
            </form>
        <p>Don't have an account? <Link to="/club/signup">Sign up</Link></p>
    </main>);
}