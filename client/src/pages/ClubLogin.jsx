import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ClubLogin(){
    const [email, setEmail] = useState('');
    const [password ,setPassword] = useState('');
    const [error ,setError] = useState('');
    const [loading ,setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault(); //prevents reloading the page on submit
        setError('');
        setLoading(true);

        //TO-DO after MH1-MH2 merges, call club login API

        setLoading(false);

    }
    ;

    return (<>
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
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Log in"}
                </button>
            </form>
            {error && <p>{error}</p>}
            <p>Don't have an account? <Link to="/club/signup">Sign up</Link></p>
            
    

    
    
    
    
    
    
    </>);
}