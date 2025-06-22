import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supabase'; // Hanya perlu supabase
import '../../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const { email, password } = values;

    try {
      // Gunakan Supabase Auth untuk login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Tangani error dari Supabase
        message.error(error.message || 'Email atau password salah.');
        setLoading(false);
        return;
      }

      if (data.user) {
        message.success('Login berhasil!');
        // AuthContext akan otomatis update dari onAuthStateChange

        // Arahkan berdasarkan peran dari metadata pengguna
        const userRole = data.user.user_metadata?.role;
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'user') {
          navigate('/');
        } else {
          // Jika role tidak diketahui, arahkan ke halaman utama
          navigate('/');
        }
      } else {
        message.error('Terjadi kesalahan, pengguna tidak ditemukan setelah login.');
      }
    } catch (err) {
      message.error('Terjadi kesalahan tak terduga saat login.');
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