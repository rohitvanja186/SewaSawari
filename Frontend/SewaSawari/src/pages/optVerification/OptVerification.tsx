import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface OtpVerificationProps {
  userId: string;
  Purpose: string;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ userId, Purpose }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (values: { otp: string }) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/verifyOtp", {
        otp: values.otp,
        userId: userId,
        purpose: Purpose, 
      });

      if (response.status === 200) {
        message.success("OTP Verified Successfully!");
        navigate("/login"); // Redirect to login page after OTP verification
      } else {
        throw new Error("Verification failed");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>

        <Form name="otpVerify" layout="vertical" onFinish={handleVerify} autoComplete="off">
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: "Please enter OTP!" },
              { pattern: /^\d{4}$/, message: "OTP must be a 4-digit number!" },
            ]}
          >
            <Input size="large" placeholder="Enter OTP" maxLength={6} />
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
              Verify OTP
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default OtpVerification;
