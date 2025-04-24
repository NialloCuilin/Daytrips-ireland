import { useState } from 'react';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    // Simulate login success
    console.log("Logging in:", { email, password, confirmPassword });
    alert("Logged in!");
  };
XMLDocument
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          type="email"
          placeholder="Enter your Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="Confirm Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Signup;