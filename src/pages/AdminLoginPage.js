import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// --- (Styled components are unchanged) ---
const LoginPageContainer = styled.div` display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 2rem; `;
const LoginForm = styled(motion.form)` width: 100%; max-width: 400px; background: #FFFFFF; padding: 2.5rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; gap: 1.5rem; `;
const Title = styled.h1` text-align: center; color: #1A2B4C; margin-bottom: 1rem; `;
const Input = styled.input` width: 100%; padding: 0.8rem 1rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; box-sizing: border-box; &:focus { outline: none; border-color: #FFBF00; } `;
const Button = styled.button` padding: 0.8rem 1rem; background: #1A2B4C; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; `;
const ErrorMessage = styled.p` color: #D22B2B; text-align: center; font-size: 0.9rem; min-height: 1.2rem; `;


const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // The logic is now handled by the login function itself
      await login(email, password);
      navigate('/'); 
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <LoginPageContainer>
      <LoginForm
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Admin Login</Title>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <ErrorMessage>{error}</ErrorMessage>
        <Button type="submit">Log In</Button>
      </LoginForm>
    </LoginPageContainer>
  );
};

export default AdminLoginPage;