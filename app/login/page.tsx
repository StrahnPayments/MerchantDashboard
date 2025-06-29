'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient' // Make sure this path is correct
import { useRouter } from 'next/navigation'
import { Mail, Lock, LogIn, Loader2, AlertTriangle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false) // State to toggle between Sign In and Sign Up views
  const router = useRouter()

  // This effect can sometimes cause a flicker.
  // A better approach is often handled by middleware or in a root layout.
  // But for a simple page, this is okay.
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router])

  // Inside your LoginPage component

const handleAuthAction = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  // --- Start of Fix ---
  
  let authResult;

  if (isSignUp) {
    // Call the signUp method directly on supabase.auth
    authResult = await supabase.auth.signUp({
      email,
      password,
    });
  } else {
    // Call the signInWithPassword method directly on supabase.auth
    authResult = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  const { error } = authResult;
  
  // --- End of Fix ---

  if (error) {
    setError(error.message);
  } else if (isSignUp) {
    setError('Check your email for the confirmation link!');
    setIsSignUp(false); // Switch back to sign-in view after successful sign-up
  } else {
    // Successful sign-in
    router.refresh(); 
  }
  setLoading(false);
};

  return (
    // A more engaging background
    <div className="relative min-h-screen w-full bg-gray-900 text-white">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950/50"></div>
      
      <div className="relative flex min-h-screen items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-gray-800/60 p-8 shadow-2xl backdrop-blur-sm border border-gray-700">
          
          {/* Header Section */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 border-2 border-indigo-500/50 shadow-lg">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {isSignUp ? 'Join us to access your dashboard' : 'Sign in to access your dashboard'}
            </p>
          </div>

          {/* Form Section */}
          <form className="space-y-6" onSubmit={handleAuthAction}>
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-lg border border-gray-600 bg-gray-700/50 py-3 pl-12 pr-4 text-white placeholder-gray-400 transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* Password Input */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-lg border border-gray-600 bg-gray-700/50 py-3 pl-12 pr-4 text-white placeholder-gray-400 transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 rounded-lg border border-red-800 bg-red-900/20 p-3 text-sm text-red-300">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg bg-indigo-600 py-3 px-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  isSignUp ? 'Sign Up' : 'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Toggle between Sign In / Sign Up */}
          <p className="text-center text-sm text-gray-400">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="font-medium text-indigo-400 transition-colors hover:text-indigo-300 focus:outline-none focus:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}