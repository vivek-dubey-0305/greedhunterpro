import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === 'admin' && password === 'admin@123') {
      localStorage.setItem('adminAuthenticated', 'true');
      navigate('/admin');
    } else {
      setError('Invalid credentials. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-[#8b5cf6]/10 blur-[100px]"
          style={{ top: '20%', left: '10%' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-[#00ff88]/10 blur-[100px]"
          style={{ bottom: '20%', right: '10%' }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Card className="bg-[#141420]/80 border-[#2a2a3e] backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              className="mx-auto w-16 h-16 bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] rounded-2xl flex items-center justify-center mb-4"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl text-white">Admin Portal</CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="pl-10 bg-[#1a1a2e] border-[#2a2a3e] text-white placeholder:text-gray-500 focus:border-[#8b5cf6]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="pl-10 pr-10 bg-[#1a1a2e] border-[#2a2a3e] text-white placeholder:text-gray-500 focus:border-[#8b5cf6]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#00ff88] hover:opacity-90 text-white font-semibold h-11"
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <p className="text-center text-gray-500 text-xs mt-6">
              Protected area. Unauthorized access is prohibited.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
