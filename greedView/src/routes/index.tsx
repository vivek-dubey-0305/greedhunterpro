import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';

// Public Pages
const Home = lazy(() => import('../pages/PublicPages/Home/Home'));
const About = lazy(() => import('../pages/PublicPages/About/About'));
const Contact = lazy(() => import('../pages/PublicPages/Contact/Contact'));
const FAQ = lazy(() => import('../pages/PublicPages/FAQ/FAQ'));
const PrivacyPolicy = lazy(() => import('../pages/PublicPages/PrivacyPolicy/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('../pages/PublicPages/TermsCondition/TermsAndConditions'));

// Auth Pages
const Login = lazy(() => import('../pages/AuthPages/Authentication/Login'));
const Register = lazy(() => import('../pages/AuthPages/Authentication/Register'));
const Otp = lazy(() => import('../pages/AuthPages/Authentication/Otp'));
const ForgotPassword = lazy(() => import('../pages/AuthPages/Authentication/ForgotPassword'));

// Dashboard Pages
const Dashboard = lazy(() => import('../pages/DashboardPages/Dashboard'));

// Admin Pages
const AdminLogin = lazy(() => import('../pages/AdminPages/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('../pages/AdminPages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: '/faq',
    element: <FAQ />
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />
  },
  {
    path: '/terms-and-conditions',
    element: <TermsAndConditions />
  },
  // Auth Routes
  {
    path: '/auth/login',
    element: <Login />
  },
  {
    path: '/auth/register',
    element: <Register />
  },
  {
    path: '/auth/otp',
    element: <Otp />
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password/:token',
    element: <ForgotPassword />
  },
  // Dashboard Routes
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  // Admin Routes
  {
    path: '/admin/login',
    element: <AdminLogin />
  },
  {
    path: '/admin',
    element: <AdminDashboard />
  },
  {
    path: '/admin/:page',
    element: <AdminDashboard />
  },
]);