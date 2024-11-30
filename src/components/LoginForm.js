import React, { useState } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import axios from 'axios';

const LoginForm = ({ onLogin, closeModal }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e, { name, value }) => {
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const url = `https://localhost:44333/api/User/Login?Email=${encodeURIComponent(credentials.email)}&Password=${encodeURIComponent(credentials.password)}`;
      const response = await axios.get(url);
      console.log('Login Response:', response.data); // Log da resposta do login

      if (response.data && response.data.id) {
        const userResponse = await axios.get(`https://localhost:44333/api/User/GetUserById?id=${response.data.id}`);
        console.log('GetUserById Response:', userResponse.data); // Log da resposta do GetUserById
        const user = userResponse.data;

        if (user.status === false) {
          setError('O usuário está desativado.');
        } else {
          setError('');
          onLogin(true, user);
          closeModal();
        }
      } else {
        setError('Erro ao realizar login. Verifique suas credenciais.');
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      setError('Erro ao realizar login. Verifique suas credenciais.');
    }
  };

  return (
    <Form error={!!error} onSubmit={handleSubmit}>
      <Form.Input
        label="Email"
        placeholder="Seu email"
        name="email"
        type="email"
        value={credentials.email}
        onChange={handleChange}
      />
      <Form.Input
        label="Senha"
        placeholder="Sua senha"
        name="password"
        type="password"
        value={credentials.password}
        onChange={handleChange}
      />
      <Button primary type="submit">Entrar</Button>
      {error && <Message error content={error} />}
      <p style={{ color: 'gray', fontSize: '0.9rem', marginTop: '10px' }}>
        Necessita de Suporte? Entre em contato com: Admin@email.com
      </p>
    </Form>
  );
};

export default LoginForm;
