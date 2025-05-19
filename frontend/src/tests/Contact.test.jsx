import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact from '../pages/Contact';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';

jest.mock('@emailjs/browser', () => ({
  sendForm: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

describe('Contact Page', () => {
  beforeEach(() => {
    render(<Contact />);
  });

  test('renders contact form', () => {
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  test('shows email validation error', () => {
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
  });

  test('prevents form submission with invalid email', () => {
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'wrong@' } });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(toast.error).toHaveBeenCalledWith('Please fix the email field before submitting.');
  });

  test('calls emailjs and shows success toast on valid submit', async () => {
    emailjs.sendForm.mockResolvedValueOnce({ text: 'OK' });

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello there!' } });

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(emailjs.sendForm).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Message sent!');
    });
  });

  test('shows error toast on emailjs failure', async () => {
    emailjs.sendForm.mockRejectedValueOnce(new Error('Mock fail'));

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello' } });

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to send message.');
    });
  });
});
