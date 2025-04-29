import { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    county: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        county: formData.county,
      });
      
      console.log(res.data);
      alert('Registration successful!');
      // Optionally store token: localStorage.setItem('token', res.data.token);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          className="w-full border p-2 rounded"
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          className="w-full border p-2 rounded"
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <select
          name="county"
          value={formData.county}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select your home county</option>
          {[
            'Antrim', 'Armagh', 'Carlow', 'Cavan', 'Clare', 'Cork', 'Derry', 'Donegal',
            'Down', 'Dublin', 'Fermanagh', 'Galway', 'Kerry', 'Kildare', 'Kilkenny',
            'Laois', 'Leitrim', 'Limerick', 'Longford', 'Louth', 'Mayo', 'Meath',
            'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary', 'Tyrone',
            'Waterford', 'Westmeath', 'Wexford', 'Wicklow'
          ].map((county) => (
            <option key={county} value={county}>
              County {county}
            </option>
            ))}
        </select>
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