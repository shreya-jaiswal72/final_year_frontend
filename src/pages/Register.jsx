import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import register from '../assets/register.webp';
import { registerUser, verifyUser } from '../redux/slices/authSlice';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, isVerified } = useSelector((state) => state.auth);
  const [registerAttempted, setRegisterAttempted] = useState(false);

  // Verify user on mount
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      dispatch(verifyUser());
    }
  }, [dispatch]);

  // Handle redirection after registration or verification
  useEffect(() => {
    if (user && isVerified && registerAttempted) {
      const redirectTo = user.role === 'admin' ? '/admin' : '/';
      navigate(redirectTo, { replace: true });
    }
  }, [user, isVerified, registerAttempted, navigate]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setRegisterAttempted(true);
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-md"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">InstantKart</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">Get Started! 👋</h2>
          <p className="text-center text-gray-600 mb-6">Create your account</p>
          {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email address"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <img
          src={register}
          alt="Register an Account"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Register;