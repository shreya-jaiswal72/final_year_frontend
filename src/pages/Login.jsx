import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import login from '../assets/login.webp';
import { loginUser, verifyUser } from '../redux/slices/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, isVerified } = useSelector((state) => state.auth);
  const [loginAttempted, setLoginAttempted] = useState(false);

  // Verify user on mount
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      dispatch(verifyUser());
    }
  }, [dispatch]);

  // Handle redirection after login or verification
  useEffect(() => {
    if (user && isVerified && loginAttempted) {
      const redirectTo = user.role === 'admin' ? '/admin' : '/';
      navigate(redirectTo, { replace: true });
    }
  }, [user, isVerified, loginAttempted, navigate]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginAttempted(true);
    dispatch(loginUser({ email, password }));
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
          <h2 className="text-2xl font-bold text-center mb-4">Welcome Back! 👋</h2>
          <p className="text-center text-gray-600 mb-6">Sign in to your account</p>
          {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <img
          src={login}
          alt="Login to Account"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;