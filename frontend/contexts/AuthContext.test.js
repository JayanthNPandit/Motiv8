import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from './AuthContext';

describe('AuthProvider', () => {
  test('should render children', () => {
    render(
      <AuthProvider>
        <div>Child Component</div>
      </AuthProvider>
    );

    const childComponent = screen.getByText('Child Component');
    expect(childComponent).toBeInTheDocument();
  });

  test('should set user when login is called with valid credentials', () => {
    // Mock signInWithEmailAndPassword function
    const signInWithEmailAndPassword = jest.fn().mockResolvedValue({ user: { id: 1 } });

    render(
      <AuthProvider>
        <div>Child Component</div>
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password');
    // Assert that the user state is updated correctly
    expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument();
  });

  test('should set login error when login is called with invalid credentials', () => {
    // Mock signInWithEmailAndPassword function to throw an error
    const signInWithEmailAndPassword = jest.fn().mockRejectedValue({ message: 'Invalid credentials' });

    render(
      <AuthProvider>
        <div>Child Component</div>
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password');
    // Assert that the login error state is updated correctly
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  test('should clear user when logout is called', () => {
    // Mock signOut function
    const signOut = jest.fn().mockResolvedValue();

    render(
      <AuthProvider>
        <div>Child Component</div>
      </AuthProvider>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(signOut).toHaveBeenCalled();
    // Assert that the user state is cleared
    expect(screen.queryByText('Welcome, test@example.com')).toBeNull();
  });

  // Add more tests for the register function and other scenarios if needed
});