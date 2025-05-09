import React, { useState } from 'react';
import axios from 'axios';
import loginRegister from '../../assets/image/loginRegister.jpg';
import { Form, Input, Button, Divider } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import Navbar from '../../components/Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import OtpVerification from '../optVerification/OptVerification';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RenterRegister: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [otpsPage, setOtp] = useState(false);
  const [userId, setUserId] = useState("");
  const navigateTo = useNavigate();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Show toast when form is submitted
      toast.info("Creating your account...", { autoClose: 2000 });
      
      const response = await axios.post("http://localhost:5000/register", {
        full_name: values.fullName,
        email: values.email,
        phone_number: values.phoneNumber,
        password: values.password,
        role: 'Renter',
      });

      console.log("yesma k k aauxa herxam", response);
      console.log(response.data.userId);
      console.log(response.status);
      
      if(response.status === 201) {
        setUserId(response.data.userId);
        toast.success("Please check your email for the OTP to verify your account.");
        setOtp(true);
      }
    } catch (error: any) {
      console.error('Error during registration:', error);
      
      // Handle different error scenarios with specific toast messages
      if (error.response) {
        if (error.response.status === 409) {
          toast.error("Email or phone number already exists. Please use a different one.");
        } else if (error.response.status === 400) {
          toast.error("Invalid input. Please check your information and try again.");
        } else {
          toast.error("Registration failed. Please try again later.");
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

  const handleGoogleSignUp = () => {
    toast.info("Google sign-up functionality is coming soon!");
  };

  const navigateToLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    toast.info("Redirecting to login page...");
    setTimeout(() => navigateTo("/login"), 1000);
  };

  const navigateToOwnerRegister = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    toast.info("Redirecting to vehicle owner registration...");
    setTimeout(() => navigateTo("/owner-register"), 1000);
  };

  return (
    <>
      {otpsPage ? (
        <OtpVerification userId={userId} Purpose={"Registration"} />
      ) : (
        <div className="min-h-screen bg-white">
          <Navbar />

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

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold">Create your renter account</h2>
                  <p className="mt-2 text-gray-600">
                    Want to list vehicles for rent?{' '}
                    <a 
                      href="/owner-register" 
                      className="text-red-500 hover:text-red-600"
                      onClick={navigateToOwnerRegister}
                    >
                      Register here
                    </a>
                  </p>
                </div>

                <Form
                  name="register"
                  onFinish={handleSubmit}
                  layout="vertical"
                  className="w-full"
                  initialValues={{ role: 'Renter' }}
                >
                  <Form.Item
                    name="fullName"
                    rules={[
                      { required: true, message: 'Please input your full name!' },
                      { min: 3, message: 'Name must be at least 3 characters!' }
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Full Name"
                      className="py-2"
                      onChange={() => {
                        // Clear any previous toast errors when user starts typing
                        toast.dismiss();
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Please input your email!' },
                      { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Email"
                      className="py-2"
                      onChange={() => {
                        toast.dismiss();
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="phoneNumber"
                    rules={[
                      { required: true, message: 'Please input your phone number!' },
                      { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number!' }
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Phone Number (10 digits)"
                      className="py-2"
                      onChange={() => {
                        toast.dismiss();
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: 'Please input your password!' },
                      { min: 6, message: 'Password must be at least 6 characters!' }
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      size="large"
                      placeholder="Password"
                      className="py-2"
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Please confirm your password!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The two passwords do not match!'));
                        },
                      }),
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      size="large"
                      placeholder="Confirm Password"
                      className="py-2"
                    />
                  </Form.Item>

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
                    onClick={handleGoogleSignUp}
                  >
                    Sign up with Google
                  </Button>

                  <div className="text-center mt-6 text-sm text-gray-600">
                    Already have an account?{' '}
                    <a 
                      href="/login" 
                      className="text-red-500 hover:text-red-600"
                      onClick={navigateToLogin}
                    >
                      Log in
                    </a>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RenterRegister;