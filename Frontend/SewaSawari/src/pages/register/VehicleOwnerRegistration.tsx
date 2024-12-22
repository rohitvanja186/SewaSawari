import React, { useState } from 'react';
import axios from 'axios';
import loginRegister from '../../assets/image/loginRegister.jpg';
import { Form, Input, Button, Select, Divider, TimePicker } from 'antd';
import { UserOutlined, ShopOutlined, MailOutlined, PhoneOutlined, LockOutlined, GoogleOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Navbar from './../../components/Navbar/navbar';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

const VehicleOwnerRegister: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/register", {
        full_name: values.fullName,
        business_name: values.businessName,
        email: values.email,
        phone_number: values.phoneNumber,
        address: values.address,
        city: values.city,
        operating_hours: {
          start: values.operatingHours?.[0]?.format('HH:mm'),
          end: values.operatingHours?.[1]?.format('HH:mm'),
        },
        password: values.password,
        role: 'Vehicle Owner',
      });

      console.log(response);
      console.log(response.data);
      console.log(response.status);
      if(response.status == 201) 
      {
        navigateTo('/login');

      };
    } catch (error) {
      console.error('Error during registration:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-xl">
            <img
              src={loginRegister}
              alt="Car rental business illustration"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Create your business account</h2>
              <p className="mt-2 text-gray-600">
                Looking to rent a vehicle?{' '}
                <a href="/register" className="text-red-500 hover:text-red-600">
                  Register here
                </a>
              </p>
            </div>

            <Form
              name="owner-register"
              onFinish={handleSubmit}
              layout="vertical"
              className="w-full"
              initialValues={{ role: 'Owner' }}
            >
              <Form.Item
                name="fullName"
                rules={[{ required: true, message: 'Please input your full name!' }]}
              >
                <Input
                  size="large"
                  placeholder="Full Name"
                  prefix={<UserOutlined />}
                  className="py-2"
                />
              </Form.Item>

              <Form.Item
                name="businessName"
                rules={[{ required: true, message: 'Please input your business name!' }]}
              >
                <Input
                  size="large"
                  placeholder="Business/Store Name"
                  prefix={<ShopOutlined />}
                  className="py-2"
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
                  placeholder="Email Address"
                  prefix={<MailOutlined />}
                  className="py-2"
                />
              </Form.Item>

              <Form.Item
                name="phoneNumber"
                rules={[{ required: true, message: 'Please input your phone number!' }]}
              >
                <Input
                  size="large"
                  placeholder="Phone Number"
                  prefix={<PhoneOutlined />}
                  className="py-2"
                />
              </Form.Item>

              <Form.Item
                name="address"
                rules={[{ required: true, message: 'Please input your business address!' }]}
              >
                <TextArea
                  placeholder="Business Address"
                  rows={3}
                  className="py-2"
                />
              </Form.Item>

              <Form.Item
                name="city"
                rules={[{ required: true, message: 'Please select your city!' }]}
              >
                <Select
                  size="large"
                  placeholder="Select City/Region"
                  prefix={<EnvironmentOutlined />}
                >
                  <Option value="kathmandu">Kathmandu</Option>
                  <Option value="pokhara">Pokhara</Option>
                  <Option value="lalitpur">Lalitpur</Option>
                  <Option value="bhaktapur">Bhaktapur</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="operatingHours"
                label="Operating Hours"
              >
                <TimePicker.RangePicker 
                  size="large"
                  format="HH:mm"
                  className="w-full"
                  placeholder={['Start Time', 'End Time']}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 8, message: 'Password must be at least 8 characters!' }
                ]}
                hasFeedback
              >
                <Input.Password
                  size="large"
                  placeholder="Password"
                  prefix={<LockOutlined />}
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
                  prefix={<LockOutlined />}
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
              >
                Sign up with Google
              </Button>

              <div className="text-center mt-6 text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-red-500 hover:text-red-600">
                  Log in
                </a>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleOwnerRegister;