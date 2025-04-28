import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Hero from '../components/Layout/Hero';
import GenderCollectionSection from '../components/Products/GenderCollectionSection';
import NewArrivals from '../components/Products/NewArrivals';
import ProductDetails from '../components/Products/ProductDetails';
import ProductGrid from '../components/Products/ProductGrid';
import FeaturedCollection from '../components/Products/FeaturedCollection';
import FeaturesSection from '../components/Products/FeaturesSection';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';
import { logout } from '../redux/slices/authSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading: productsLoading, error: productsError } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);
  const [bestSellerLoading, setBestSellerLoading] = useState(true);
  const [bestSellerError, setBestSellerError] = useState(null);

  useEffect(() => {
    // Fetch products for a specific collection
    dispatch(
      fetchProductsByFilters({
        gender: 'Women',
        category: 'Bottom Wear',
        limit: 8,
      })
    );

    // Fetch best-seller product
    const fetchBestSeller = async () => {
      try {
        setBestSellerLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setBestSellerProduct(response.data);
        setBestSellerLoading(false);
      } catch (error) {
        setBestSellerError('Failed to load best-seller product.');
        setBestSellerLoading(false);
        console.error(error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <Hero />

      {/* User Section */}
      <div className="container mx-auto py-8 px-4 text-center">
        {user ? (
          // <div className="flex flex-col items-center space-y-4">
          //   <p className="text-lg text-gray-700">Welcome back, {user.name}!</p>
          //   <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          //     <Link
          //       to="/profile"
          //       className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
          //     >
          //       View Profile
          //     </Link>
          //     {user.role === 'admin' && (
          //       <Link
          //         to="/admin"
          //         className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition"
          //       >
          //         Admin Dashboard
          //       </Link>
          //     )}
          //     <button
          //       onClick={handleLogout}
          //       className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
          //     >
          //       Logout
          //     </button>
          //   </div>
          // </div>
          <></>

        ) : (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg text-gray-700">
              Sign in to unlock personalized offers!
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                Register
              </Link>
            </div>
            <Link
              to="/collections/all"
              className="text-blue-500 hover:underline"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>

      {/* Product Sections */}
      <div className="container mx-auto py-12 px-4">
        {/* Gender Collection */}
        <GenderCollectionSection />

        {/* New Arrivals */}
        <NewArrivals />

        {/* Best Seller */}
        <div className="my-12">
          <h2 className="text-3xl text-center font-bold mb-6">Best Seller</h2>
          {bestSellerLoading ? (
            <p className="text-center text-gray-600">Loading best seller product...</p>
          ) : bestSellerError ? (
            <p className="text-center text-red-500">{bestSellerError}</p>
          ) : bestSellerProduct ? (
            <div className="max-w-4xl mx-auto">
              <ProductDetails productId={bestSellerProduct._id} />
            </div>
          ) : (
            <p className="text-center text-gray-600">No best seller product available.</p>
          )}
        </div>

        {/* Top Wears for Women */}
        <div className="my-12">
          <h2 className="text-3xl text-center font-bold mb-6">Top Wears for Women</h2>
          {productsLoading ? (
            <p className="text-center text-gray-600">Loading products...</p>
          ) : productsError ? (
            <p className="text-center text-red-500">{productsError}</p>
          ) : (
            <ProductGrid products={products} loading={productsLoading} error={productsError} />
          )}
        </div>

        {/* Featured Collection */}
        <FeaturedCollection />

        {/* Features Section */}
        <FeaturesSection />
      </div>
    </div>
  );
};

export default Home;