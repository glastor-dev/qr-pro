import './setup.ts';

import React from 'react';
import { afterEach, describe, it } from 'jsr:@std/testing/bdd';
import { assert } from 'jsr:@std/assert';
import { cleanup, fireEvent, render, screen } from 'npm:@testing-library/react';

import App from '../src/App.tsx';

afterEach(() => {
  cleanup();
});

describe('App', () => {
  it('renderiza el título', () => {
    render(<App />);
    assert(screen.getByRole('heading', { name: /generador de qr/i }));
  });

  it('deshabilita acciones de descarga si no hay valor', () => {
    render(<App />);
    assert((screen.getByRole('button', { name: /descargar svg/i }) as HTMLButtonElement).disabled);
    assert((screen.getByRole('button', { name: /descargar png/i }) as HTMLButtonElement).disabled);
    assert((screen.getByRole('button', { name: /compartir/i }) as HTMLButtonElement).disabled);
  });

  it('permite cambiar el tipo de QR', () => {
    render(<App />);
    const select = screen.getAllByLabelText(/tipo de qr/i)[0];
    fireEvent.change(select, { target: { value: 'text' } });
    assert(screen.getByPlaceholderText(/texto libre/i));
  });

  it('muestra campos de WiFi al seleccionar WiFi', () => {
    render(<App />);
    const select = screen.getAllByLabelText(/tipo de qr/i)[0];
    fireEvent.change(select, { target: { value: 'wifi' } });
    assert(screen.getByPlaceholderText(/ssid/i));
    assert(screen.getByPlaceholderText(/contraseña/i));
  });

  it('botón accesible activa el modo accesible', () => {
    render(<App />);
    const btn = screen.getAllByLabelText(/accesible/i)[0];
    fireEvent.click(btn);
    assert(screen.getByText(/accesible on/i));
  });

  it('muestra error si URL parece http pero es inválida', () => {
    render(<App />);
    const urlInput = screen.getByPlaceholderText(/^url$/i) as HTMLInputElement;
    fireEvent.change(urlInput, { target: { value: 'http://' } });
    assert(screen.getByText(/la url no es válida/i));
  });
});
