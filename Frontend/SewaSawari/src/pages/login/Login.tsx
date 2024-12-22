import React, { useState } from 'react';
import Navbar from './../../components/Navbar/navbar';
import loginRegister from '../../assets/image/loginRegister.jpg';
import { Form, Input, Button, Divider } from 'antd';
import { GoogleOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    console.log('Form Submitted:', values);

    try {
      // API call to login
      const response = await axios.post('http://localhost:3000/login',
        {
          email : values.email,
          password : values.password
        }
      );
      console.log('Response:', response);

      Cookies.set('Token', response.data.token, { expires: 7 });

    const token = response.data.token;
    const decode = jwtDecode(token);
    const Role = decode.role;

    if(Role == "Renter")
    {
      navigateTo("/home")
    }
    else if(Role == "Vehicle Owner")
    {
      navigateTo("/ownerPage")
    }
   else
    {
      navigateTo("/dashboard")
    }
      // // Handle success (e.g., save token, redirect user)
      // Example: localStorage.setItem('token', response.data.token);
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false);
    }
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
                rules={[{ required: true, message: 'Please input your email!' }]}
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
                rules={[{ required: true, message: 'Please input your password!' }]}
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
                <a href="/forgot-password" className="text-red-500 hover:text-red-600 text-sm">
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
              >
                Sign in with Google
              </Button>

              <div className="text-center mt-6 text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/register" className="text-red-500 hover:text-red-600">
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
