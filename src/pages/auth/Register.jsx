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
            // Cek apakah email sudah terdaftar
            const { data: existingUser, error: fetchError } = await supabase
                .from('users')
                .select('email')
                .eq('email', email)
                .single();

            if (existingUser) {
                message.error('Email sudah terdaftar. Silakan gunakan email lain.');
                setLoading(false);
                return;
            }

            // PERINGATAN: Menyimpan password teks biasa tidak aman!
            const { error: insertError } = await supabase
                .from('users')
                .insert([{ name, email, password, role: 'user' }]);

            if (insertError) {
                throw insertError;
            }

            message.success('Registrasi berhasil! Silakan masuk.');
            navigate('/login');

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
                        Daftar untuk mulai berbelanja
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
                        rules={[{ required: true, message: 'Mohon masukkan password Anda!' }]}
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
