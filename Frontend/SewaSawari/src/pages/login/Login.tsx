import React, { useState, useEffect } from 'react';
import Navbar from './../../components/Navbar/navbar';
import loginRegister from '../../assets/image/loginRegister.jpg';
import { Form, Input, Button, Divider } from 'antd';
import { GoogleOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();

  useEffect(() => {
    // Check if user was redirected here after registration
    const registrationSuccess = sessionStorage.getItem('registrationSuccess');
    if (registrationSuccess) {
      toast.success('Registration successful! Please login with your credentials.');
      sessionStorage.removeItem('registrationSuccess'); // Clear the flag
    }
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    console.log('Form Submitted:', values);

    try {
      // Display toast notification for login attempt
      toast.info('Logging in...', { autoClose: 2000 });

      // API call to login
      const response = await axios.post('http://localhost:5000/login',
        {
          email: values.email,
          password: values.password
        }
      );
      console.log('Response:', response);

      Cookies.set('Token', response.data.token, { expires: 7 });

      const token = response.data.token;
      const decode = jwtDecode(token);
      const Role = decode.role;

      if (Role == "Renter") {
        toast.success("Login successful! Welcome back.");
        navigateTo("/"); // Redirecting to home page for renters
      }
      else if (Role == "Vehicle Owner") {
        toast.success("Login successful! Welcome to your owner dashboard.");
        navigateTo("/ownerPage");
      }
      else {
        toast.success("Login successful! Welcome to the admin dashboard.");
        navigateTo("/dashboard");
      }
    } catch (error) {
      console.error('Login failed:', error);

      if (error.response) {
        if (error.response.status === 403) {
          toast.error("Admin hasn't approved this account yet! Try again later.");
        } else if (error.response.status === 401) {
          toast.error("Invalid email or password. Please try again.");
        } else if (error.response.status === 404) {
          toast.error("Account not found. Please register first.");
        } else {
          toast.error("Login failed. Please try again later.");
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    toast.info("Google sign-in functionality is coming soon!");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    toast.info("Password reset functionality is coming soon!");
    // navigateTo("/forgot-password");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Include Navbar at the top */}
      <Navbar />

      {/* Main Content - Login Form */}
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-xl">
            <img
              src={loginRegister}
              alt="Car rental illustration"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Welcome back!</h2>
              <p className="mt-2 text-gray-600">Sign in to your account</p>
            </div>

            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
              className="w-full"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email address!' }
                ]}
              >
                <Input
                  size="large"
                  placeholder="Email"
                  className="py-2"
                />
              </Form.Item>

              <Form.Item
                name="password"
                className="mb-2"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Password"
                  className="py-2"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <div className="text-right mb-6">
                <a 
                  href="#" 
                  onClick={handleForgotPassword} 
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  Forget password?
                </a>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  className="h-12 bg-black hover:bg-gray-800"
                >
                  Continue
                </Button>
              </Form.Item>

              <div className="relative my-6">
                <Divider className="border-gray-300">
                  <span className="text-gray-500 bg-white px-2">OR</span>
                </Divider>
              </div>

              <Button
                block
                size="large"
                icon={<GoogleOutlined />}
                className="h-12 flex items-center justify-center"
                onClick={handleGoogleSignIn}
              >
                Sign in with Google
              </Button>

              <div className="text-center mt-6 text-sm text-gray-600">
                Don't have an account?{' '}
                <a 
                  href="/register" 
                  className="text-red-500 hover:text-red-600"
                  onClick={() => toast.info("Redirecting to registration page...")}
                >
                  Sign up
                </a>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;