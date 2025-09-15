import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

const FormContainer = styled.section`
  padding: 6rem 2rem;
  background-color: #F0F2F5;
`;
const FormContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;
const SectionTitle = styled(motion.h2)`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #1A2B4C;
`;
const Form = styled(motion.form)`
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.07);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 2rem;
  }
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  &.full-width {
    grid-column: 1 / -1;
  }
`;
const Label = styled.label`
  color: #555;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
`;
const Input = styled.input`
  background: #F0F2F5;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #1A2B4C;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: #FFBF00;
    box-shadow: 0 0 0 3px rgba(255, 191, 0, 0.3);
  }
`;
const Select = styled.select`
  background: #F0F2F5;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #1A2B4C;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right .7em top 50%;
  background-size: .65em auto;
  &:focus {
    outline: none;
    border-color: #FFBF00;
    box-shadow: 0 0 0 3px rgba(255, 191, 0, 0.3);
  }
`;
const SubmitButton = styled(motion.button)`
  grid-column: 1 / -1;
  background: #1A2B4C;
  border: none;
  color: #FFFFFF;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 1rem;
`;
const Message = styled.p`
  grid-column: 1 / -1;
  text-align: center;
  color: #1A2B4C;
  min-height: 1.5rem;
  font-weight: 500;
`;

const RegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Submitting...');
    setTimeout(() => {
        setMessage('Registration successful! We will contact you soon.');
        setIsSubmitting(false);
        e.target.reset(); // Clears the form
    }, 1500);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <FormContainer id="register" ref={ref}>
      <FormContent>
        <SectionTitle initial={{ opacity: 0, y: -50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          Join Sairam NCC
        </SectionTitle>
        <Form variants={formVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'} onSubmit={handleSubmit}>
          <FormGroup className="full-width">
            <Label htmlFor="Name">Name</Label>
            <Input type="text" name="Name" id="Name" required />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="Year">Year</Label>
            <Select name="Year" id="Year" defaultValue="I" required>
              <option value="I">I</option>
              <option value="II">II</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="Department">Department</Label>
            <Input type="text" name="Department" id="Department" required />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="Phone Number">Phone Number</Label>
            <Input type="tel" name="Phone Number" id="Phone Number" required />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="Mail ID">Mail ID</Label>
            <Input type="email" name="Mail ID" id="Mail ID" required />
          </FormGroup>
          <Message>{message}</Message>
          <SubmitButton type="submit" disabled={isSubmitting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {isSubmitting ? 'Registering...' : 'Register Now'}
          </SubmitButton>
        </Form>
      </FormContent>
    </FormContainer>
  );
};
export default RegistrationForm;