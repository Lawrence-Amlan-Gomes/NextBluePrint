'use client';

import { useState } from 'react';

export default function EmailValidator() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simulated email existence check
  const checkEmailExists = async (email) => {
    // Mock API call to simulate checking if email exists
    // In reality, you'd use a third-party service like ZeroBounce or NeverBounce
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

    // Mock logic: for demonstration, assume emails ending with @gmail.com are "checked"
    // This is NOT a real check; actual services would verify deliverability
    const isGmail = email.toLowerCase().endsWith('@gmail.com');
    
    // Simulate a response: 80% chance of "existing" for @gmail.com, 20% for others
    const randomCheck = Math.random() > (isGmail ? 0.2 : 0.8);
    return randomCheck;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    if (!email) {
      setMessage('Please enter an email address');
      setIsLoading(false);
      return;
    }

    try {
      const exists = await checkEmailExists(email);
      setMessage(exists ? 'Email appears to be valid and exists' : 'Email does not appear to exist');
    } catch (error) {
      setMessage('Error checking email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Google Email Existence Checker</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address (e.g., example@gmail.com)"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Checking...' : 'Check Email'}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes('valid') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}