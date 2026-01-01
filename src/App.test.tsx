import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renderiza el título', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /generador de qr/i })).toBeInTheDocument();
  });

  test('permite cambiar el tipo de QR', () => {
    render(<App />);
    const select = screen.getByLabelText(/tipo de qr/i);
    fireEvent.change(select, { target: { value: 'text' } });
    expect(screen.getByPlaceholderText(/texto libre/i)).toBeInTheDocument();
  });

  test('botón accesible activa el modo accesible', () => {
    render(<App />);
    const btn = screen.getByLabelText(/accesible/i);
    fireEvent.click(btn);
    expect(screen.getByText(/accesible on/i)).toBeInTheDocument();
  });
});
