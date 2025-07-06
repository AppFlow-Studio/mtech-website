'use client'
import {  signup } from '@/app/login/actions'
import { useAuthLogin } from '@/lib/hooks/useAuthLogin'
import { Lock, Mail, User, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginFormData, loginSchema } from '@/lib/validations/auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [isSignup, setIsSignup] = useState(false)
    const { isLoading, login } = useAuthLogin()

    const form = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    })
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-[#0B0119] dark:via-[#1a0b2e] dark:to-[#0B0119] px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-6">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {isSignup ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {isSignup
                            ? 'Sign up to access your MTech dashboard'
                            : 'Sign in to your MTech account'
                        }
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(login)} className="space-y-4">
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </Form>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Need help?{' '}
                        <a href="/contact" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}