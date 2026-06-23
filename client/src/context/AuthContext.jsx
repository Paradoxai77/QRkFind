import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('qrkfind_token'))
  const [loading, setLoading] = useState(true)

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const { data } = await api.get('/api/auth/me')
        setUser(data.user)
      } catch {
        // Token invalid / expired
        localStorage.removeItem('qrkfind_token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [token])

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('qrkfind_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password })
    localStorage.setItem('qrkfind_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('qrkfind_token')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
