'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Mail, Lock, LogIn, Loader2, AlertTriangle, Shield, BarChart3 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router])

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    let authResult

    if (isSignUp) {
      authResult = await supabase.auth.signUp({
        email,
        password,
      })
    } else {
      authResult = await supabase.auth.signInWithPassword({
        email,
        password,
      })
    }

    const { error } = authResult

    if (error) {
      setError(error.message)
    } else if (isSignUp) {
      setError('Check your email for the confirmation link!')
      setIsSignUp(false)
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>
      
      <div className="relative flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              PaymentPro
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Professional payment analytics dashboard
            </p>
            
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-slate-300">Enterprise-grade security</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-300">Real-time analytics</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <LogIn className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-slate-300">Seamless integration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="card-dark p-8 shadow-2xl border border-slate-700/50">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">PaymentPro</h1>
              </div>

              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-slate-400">
                  {isSignUp ? 'Get started with your dashboard' : 'Sign in to your dashboard'}
                </p>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleAuthAction}>
                <div className="space-y-4">
                  {/* Email Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 hover:border-slate-600"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 hover:border-slate-600"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-start space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-red-300">{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      {isSignUp ? 'Create Account' : 'Sign In'}
                    </>
                  )}
                </button>
              </form>

              {/* Toggle Sign In/Up */}
              <div className="mt-8 text-center">
                <p className="text-slate-400">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setError('')
                    }}
                    className="font-semibold text-blue-400 hover:text-blue-300 transition-colors focus:outline-none focus:underline"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}