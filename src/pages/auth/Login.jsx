import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase'; // Import Supabase
import '../../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const { email, password } = values;

    try {
      // Cari pengguna berdasarkan email di tabel 'users'
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        message.error('Email tidak ditemukan!');
        setLoading(false);
        return;
      }

      // PERINGATAN: Membandingkan password teks biasa adalah tidak aman!
      if (user.password !== password) {
        message.error('Password salah!');
        setLoading(false);
        return;
      }

      // Jika login berhasil
      const userData = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };
      login(userData);
      message.success('Login berhasil!');

      // Arahkan berdasarkan peran (role)
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      }

    } catch (err) {
      message.error('Terjadi kesalahan saat login.');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
        </Form>
      </Card>
    </div>
  );
};

export default Login; 