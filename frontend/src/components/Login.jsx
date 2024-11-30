import { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/users/login', formData);
            sessionStorage.setItem('token', response.data.data.token); // Store token for authenticated requests
            navigate('/documents'); // Redirect to Document Editor
        } catch (err) {
            console.error('Login Error:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2>Login</h2>
            <input
                name="email"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                name="password"
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <button type="submit">Login</button>
            <a href="/register">Don t have an account? Register here</a>
        </form>
    );
};

export default Login;
