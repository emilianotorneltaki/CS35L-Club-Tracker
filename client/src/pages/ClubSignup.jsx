import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:4000';

export default function ClubSignup() {
    const [name ,setName] = useState('');
    const [email ,setEmail] = useState('');
    const [password ,setPassword] = useState('');
    const [error ,setError] = useState('');
    const [message ,setMessage] = useState('');
    const [loading ,setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault(); //prevents reloading the page on submit
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/clubs/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? 'Something went wrong.')
            } else {
                setMessage(data.message);
            }
        } catch {
            setError('Could not reach the server.');
        } finally {
            setLoading(false);
        }
    }

        return (
        <form onSubmit={handleSubmit}>
        <h1>Create a club account</h1>

        <label>
            Club name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
            Contact email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </label>

        <button type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Sign up'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p>{message}</p>}
        </form>

    );
}