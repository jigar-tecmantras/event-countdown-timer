import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the countdown hero section', () => {
  render(<App />);
  const heroHeading = screen.getByRole('heading', { name: /track every milestone at a glance/i });
  expect(heroHeading).toBeInTheDocument();
});
