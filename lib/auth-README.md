# Authentication System Documentation

This authentication system provides secure user management with Supabase integration and Zustand state management.

## Features

- 🔐 Secure authentication with Supabase
- 👤 User profile management from `public.profiles` table
- 🎭 Role-based access control (ADMIN/AGENT)
- 🌙 Dark mode support
- 📱 Responsive design
- 🔄 Real-time auth state updates
- 🛡️ Protected routes

## Quick Start

### 1. Basic Usage

```tsx
import { useAuth } from '@/lib/hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) return <div>Loading...</div>
  
  if (!isAuthenticated) return <div>Please log in</div>

  return (
    <div>
      <h1>Welcome, {user?.first_name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### 2. Role-Based Access

```tsx
import { useAdmin, useAgent } from '@/lib/hooks/useAuth'

function AdminPanel() {
  const isAdmin = useAdmin()
  const isAgent = useAgent()

  if (!isAdmin) return <div>Admin access required</div>

  return <div>Admin Panel Content</div>
}
```

### 3. Protected Routes

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Protect any route
<ProtectedRoute requiredRole="ADMIN">
  <AdminDashboard />
</ProtectedRoute>

// Protect with custom redirect
<ProtectedRoute requiredRole="AGENT" redirectTo="/unauthorized">
  <AgentDashboard />
</ProtectedRoute>
```

### 4. User Profile Component

```tsx
import { UserProfile } from '@/components/UserProfile'

function Header() {
  return (
    <header>
      <UserProfile />
    </header>
  )
}
```

## API Reference

### useAuth Hook

```tsx
const {
  // State
  user,              // UserProfile | null
  isLoading,         // boolean
  isAuthenticated,   // boolean
  error,             // string | null
  
  // Actions
  logout,            // () => Promise<void>
  initialize,        // () => Promise<void>
  
  // Convenience getters
  isAdmin,           // boolean
  isAgent,           // boolean
  fullName,          // string
  displayName,       // string
} = useAuth()
```

### UserProfile Interface

```tsx
interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  role: 'AGENT' | 'ADMIN'
  created_at: string
}
```

### ProtectedRoute Props

```tsx
interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'ADMIN' | 'AGENT'
  fallback?: React.ReactNode
  redirectTo?: string
}
```

## Database Schema

Make sure your Supabase `public.profiles` table has this structure:

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT,
  last_name TEXT,
  role TEXT CHECK (role IN ('AGENT', 'ADMIN')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Security Features

- ✅ Server-side session validation
- ✅ Client-side auth state management
- ✅ Role-based access control
- ✅ Secure logout functionality
- ✅ Error handling and loading states
- ✅ Type-safe authentication

## Error Handling

The auth store automatically handles common errors:

- Session validation errors
- Profile fetch errors
- Network connectivity issues
- Invalid user states

## Best Practices

1. **Always check loading state** before rendering auth-dependent content
2. **Use ProtectedRoute** for sensitive pages
3. **Handle errors gracefully** with user-friendly messages
4. **Test role-based access** thoroughly
5. **Keep auth state minimal** - only store necessary user data

## Troubleshooting

### Common Issues

1. **User not found**: Check if profile exists in `public.profiles` table
2. **Role not working**: Verify role is set to 'ADMIN' or 'AGENT'
3. **Auth not persisting**: Check Supabase session configuration
4. **Loading forever**: Check network connectivity and Supabase status

### Debug Mode

Enable debug logging by adding this to your component:

```tsx
const { user, error } = useAuth()
console.log('Auth state:', { user, error })
``` 