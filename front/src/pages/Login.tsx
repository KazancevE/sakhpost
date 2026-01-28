import { useForm } from '@mantine/form';
import { Button, TextInput, Anchor, Center, Title } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

export function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => value.length < 6 ? 'Password min 6 chars' : null,
    },
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', values);
      login(data.token);
      navigate('/');
    } catch {
      form.setFieldError('email', 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <Center style={{ height: '100vh' }}>
      <form onSubmit={form.onSubmit(handleSubmit)} style={{ width: 300 }}>
        <Title order={2}>Login</Title>
        <TextInput mt="md" label="Email" {...form.getInputProps('email')} />
        <TextInput mt="md" type="password" label="Password" {...form.getInputProps('password')} />
        <Button fullWidth mt="md" type="submit" loading={loading}>Login</Button>
        <Anchor mt="md" href="/register">Register</Anchor>
      </form>
    </Center>
  );
}

export function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => value.length < 6 ? 'Password min 6 chars' : null,
    },
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', values);
      login(data.token);
      navigate('/');
    } catch (error: any) {
      if (error.response?.status === 401) {
        form.setFieldError('email', 'Email already exists');
      } else {
        form.setFieldError('email', 'Registration failed');
      }
    }
    setLoading(false);
  };

  return (
    <Center style={{ height: '100vh' }}>
      <form onSubmit={form.onSubmit(handleSubmit)} style={{ width: 300 }}>
        <Title order={2}>Register</Title>
        <TextInput mt="md" label="Email" {...form.getInputProps('email')} />
        <TextInput mt="md" type="password" label="Password" {...form.getInputProps('password')} />
        <Button fullWidth mt="md" type="submit" loading={loading}>Register</Button>
        <Anchor mt="md" href="/login">Already have account? Login</Anchor>
      </form>
    </Center>
  );
}
