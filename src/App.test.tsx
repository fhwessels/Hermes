import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

test('adds a todo', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/what needs to be done/i);
  fireEvent.change(input, { target: { value: 'Test todo' } });
  fireEvent.click(screen.getByText(/add/i));
  expect(screen.getByText('Test todo')).toBeInTheDocument();
});

test('toggles todo completion', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/what needs to be done/i);
  fireEvent.change(input, { target: { value: 'Toggle me' } });
  fireEvent.click(screen.getByText(/add/i));
  const checkbox = screen.getAllByRole('checkbox')[0];
  fireEvent.click(checkbox);
  expect(screen.getByText('Toggle me').closest('li')).toHaveClass('completed');
});

test('deletes a todo', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/what needs to be done/i);
  fireEvent.change(input, { target: { value: 'Delete me' } });
  fireEvent.click(screen.getByText(/add/i));
  expect(screen.getByText('Delete me')).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText(/delete "delete me"/i));
  expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
});

test('filters active todos', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/what needs to be done/i);
  fireEvent.change(input, { target: { value: 'First' } });
  fireEvent.click(screen.getByText(/add/i));
  fireEvent.change(input, { target: { value: 'Second' } });
  fireEvent.click(screen.getByText(/add/i));
  const checkboxes = screen.getAllByRole('checkbox');
  fireEvent.click(checkboxes[0]); // complete first
  fireEvent.click(screen.getByText('Active'));
  expect(screen.queryByText('First')).not.toBeInTheDocument();
  expect(screen.getByText('Second')).toBeInTheDocument();
});

test('clears completed todos', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/what needs to be done/i);
  fireEvent.change(input, { target: { value: 'Done' } });
  fireEvent.click(screen.getByText(/add/i));
  fireEvent.change(input, { target: { value: 'Not done' } });
  fireEvent.click(screen.getByText(/add/i));
  const checkboxes = screen.getAllByRole('checkbox');
  fireEvent.click(checkboxes[0]); // complete "Done"
  fireEvent.click(screen.getByText(/clear completed/i));
  expect(screen.queryByText('Done')).not.toBeInTheDocument();
  expect(screen.getByText('Not done')).toBeInTheDocument();
});
