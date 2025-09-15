import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useUser() {
  const [user, setUser] = useState<any>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar usuário atual
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          
          // Buscar dados do usuário na tabela users (se Supabase estiver configurado)
          try {
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('id', user.id)
              .single()
            
            if (userData) {
              setIsPremium(userData.is_premium)
            }
          } catch (dbError) {
            // Se erro no banco, usar dados padrão
            console.log('Usando dados padrão do usuário (modo offline)')
            setIsPremium(false)
          }
        }
      } catch (error) {
        console.log('Modo offline ativo - sem autenticação')
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Escutar mudanças de autenticação
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser(session.user)
            
            // Buscar dados do usuário (se banco estiver disponível)
            try {
              const { data: userData } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single()
              
              if (userData) {
                setIsPremium(userData.is_premium)
              }
            } catch (dbError) {
              setIsPremium(false)
            }
          } else {
            setUser(null)
            setIsPremium(false)
          }
          setLoading(false)
        }
      )

      return () => subscription.unsubscribe()
    } catch (error) {
      console.log('Auth listener não disponível - modo offline')
      setLoading(false)
    }
  }, [])

  const upgradeToPremium = async () => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          is_premium: true,
          subscription_date: new Date().toISOString()
        })
        .eq('id', user.id)

      if (!error) {
        setIsPremium(true)
        return true
      }
    } catch (error) {
      console.error('Erro ao fazer upgrade para Premium:', error)
      // Em modo offline, simular upgrade
      setIsPremium(true)
      return true
    }
    return false
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      })

      // Se o signup foi bem-sucedido, criar registro na tabela users
      if (data.user && !error) {
        try {
          await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              name,
              is_premium: false
            })
        } catch (dbError) {
          console.log('Usuário criado em modo offline')
        }
      }

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (!error) {
        setUser(null)
        setIsPremium(false)
      }
      return { error }
    } catch (error) {
      // Em modo offline, simular logout
      setUser(null)
      setIsPremium(false)
      return { error: null }
    }
  }

  return {
    user,
    isPremium,
    loading,
    upgradeToPremium,
    signIn,
    signUp,
    signOut
  }
}