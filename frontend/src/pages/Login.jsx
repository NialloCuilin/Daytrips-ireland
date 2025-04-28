import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      console.log(res.data); // Useful for debugging

      // Save user info and token
      localStorage.setItem('userInfo', JSON.stringify(res.data));

      alert('Login successful!');
      
      // Redirect if you want (later we can use navigate('/profile'))
      window.location.href = '/';

    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>
          Don't have an account? <a href="/Signup" className="text-blue-500">Register</a>
        </p>
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;