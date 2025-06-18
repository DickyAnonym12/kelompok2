import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

// Dummy credentials
const DUMMY_CREDENTIALS = {
  admin: {
    email: 'admin@umkm.com',
    password: 'admin123',
    role: 'admin'
  },
  user: {
    email: 'user@umkm.com',
    password: 'user123',
    role: 'user'
  }
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const { email, password } = values;
      
      // Check admin credentials
      if (email === DUMMY_CREDENTIALS.admin.email && password === DUMMY_CREDENTIALS.admin.password) {
        const userData = {
          email: DUMMY_CREDENTIALS.admin.email,
          role: DUMMY_CREDENTIALS.admin.role
        };
        login(userData);
        message.success('Login berhasil!');
        
        // Redirect to intended page or default admin page
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      }
      // Check user credentials
      else if (email === DUMMY_CREDENTIALS.user.email && password === DUMMY_CREDENTIALS.user.password) {
        const userData = {
          email: DUMMY_CREDENTIALS.user.email,
          role: DUMMY_CREDENTIALS.user.role
        };
        login(userData);
        message.success('Login berhasil!');
        
        // Redirect to intended page or default user page
        const from = location.state?.from?.pathname || '/guest';
        navigate(from);
      }
      else {
        message.error('Email atau password salah!');
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <Typography.Title level={2} className="auth-title">
            Selamat Datang
          </Typography.Title>
          <Typography.Text type="secondary">
            Silakan masuk ke akun Anda
          </Typography.Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Mohon masukkan email Anda!' },
              { type: 'email', message: 'Mohon masukkan email yang valid!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Mohon masukkan password Anda!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Masuk
            </Button>
          </Form.Item>

          <div className="auth-footer">
            <Typography.Text type="secondary">Belum punya akun?</Typography.Text>
            <Link to="/register" className="auth-link">
              Daftar
            </Link>
          </div>

          {/* Dummy credentials info */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <Typography.Text type="secondary" className="block mb-2">
              Akun Dummy:
            </Typography.Text>
            <div className="space-y-1 text-sm">
              <p><strong>Admin:</strong> admin@umkm.com / admin123</p>
              <p><strong>User:</strong> user@umkm.com / user123</p>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 