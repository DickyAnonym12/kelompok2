import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import '../../styles/Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        const { name, email, password } = values;

        try {
            // Gunakan Supabase Auth untuk registrasi pengguna baru
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    // Simpan nama dan role di metadata pengguna
                    data: {
                        full_name: name,
                        role: 'admin' // DAFTAR SEBAGAI ADMIN UNTUK TESTING
                    }
                }
            });

            if (error) {
                // Tangani error dari Supabase (misal: email sudah terdaftar, password lemah)
                message.error(error.message);
                setLoading(false);
                return;
            }

            if (data.user) {
                 // Jika pendaftaran berhasil, beri notifikasi.
                 // Jika Anda mengaktifkan konfirmasi email, pengguna harus verifikasi dulu.
                message.success('Registrasi berhasil! Silakan cek email Anda untuk verifikasi (jika aktif), lalu login.');
                navigate('/login');
            } else {
                message.error('Gagal membuat pengguna. Mohon coba lagi.');
            }

        } catch (err) {
            message.error('Gagal melakukan registrasi.');
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
                        Buat Akun Baru
                    </Typography.Title>
                    <Typography.Text type="secondary">
                        Daftar untuk mulai mengelola
                    </Typography.Text>
                </div>

                <Form
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark={false}
                    size="large"
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Mohon masukkan nama Anda!' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Nama Lengkap"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Mohon masukkan email Anda!' },
                            { type: 'email', message: 'Mohon masukkan email yang valid!' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email"
                            autoComplete="email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Mohon masukkan password minimal 6 karakter!' }, {min: 6, message: 'Password minimal 6 karakter!'}]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Daftar
                        </Button>
                    </Form.Item>

                    <div className="auth-footer">
                        <Typography.Text type="secondary">Sudah punya akun?</Typography.Text>
                        <Link to="/login" className="auth-link">
                            Masuk
                        </Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;
