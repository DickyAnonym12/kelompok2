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

        // Ambil profil dari tabel users
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          message.error('Gagal mengambil data profil.');
          setLoading(false);
          return;
        }

        // Redirect sesuai role dari tabel users
        if (profile.role === 'admin') {
          navigate('/admin');
        } else {
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
          <Typography.Title level={2} className="auth-title text-xl sm:text-2xl">
            Selamat Datang
          </Typography.Title>
          <Typography.Text type="secondary" className="text-sm sm:text-base">
            Silakan masuk ke akun Anda
          </Typography.Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          size="large"
          className="space-y-4 sm:space-y-5"
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
              className="text-sm sm:text-base"
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
              className="text-sm sm:text-base"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} className="text-sm sm:text-base">
              Masuk
            </Button>
          </Form.Item>

          <div className="auth-footer">
            <Typography.Text type="secondary" className="text-sm sm:text-base">Belum punya akun?</Typography.Text>
            <Link to="/register" className="auth-link text-sm sm:text-base">
              Daftar
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;