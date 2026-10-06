import { render, screen } from '@testing-library/react';
import Footer from './Footer';

test('render footer', () => {
  render(<Footer />);
  [
    'Contacto',
    'Soporte',
    'Politicas de Privacidad',
    'Términos y Condiciones',
    'Argentina',
    'Colombia',
    'México',
    'Perú',
  ].forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});
