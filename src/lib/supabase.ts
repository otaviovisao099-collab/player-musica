import { createClient } from '@supabase/supabase-js'

// Validação das variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Função para validar se a URL é válida
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

// Função para validar se a chave parece válida (JWT format)
const isValidKey = (key: string | undefined): boolean => {
  if (!key) return false
  // Verifica se não é um valor placeholder
  if (key.includes('sua_chave') || key.includes('example') || key === 'what music') return false
  // Verifica se tem formato básico de JWT (3 partes separadas por ponto)
  return key.split('.').length >= 2 && key.length > 20
}

// Função para criar cliente mock com métodos encadeáveis
const createMockClient = () => {
  const createQueryBuilder = () => ({
    select: (columns?: string, options?: any) => createQueryBuilder(),
    insert: (data: any) => createQueryBuilder(),
    update: (data: any) => createQueryBuilder(),
    delete: () => createQueryBuilder(),
    order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
    eq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
    single: () => Promise.resolve({ data: null, error: null }),
    then: (callback: any) => callback({ data: [], error: null })
  })

  return {
    from: (table: string) => createQueryBuilder(),
    auth: {
      signUp: (credentials: any) => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: (credentials: any) => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: (callback: any) => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  }
}

// Verificação e criação do cliente
let supabaseClient

// Verificar se as variáveis são válidas
const hasValidUrl = isValidUrl(supabaseUrl)
const hasValidKey = isValidKey(supabaseAnonKey)

if (!hasValidUrl || !hasValidKey) {
  console.warn('⚠️ Supabase não configurado corretamente - usando modo offline')
  
  if (!hasValidUrl) {
    console.log(`❌ URL inválida: "${supabaseUrl}"`)
    console.log('✅ URL deve ser algo como: https://seu-projeto.supabase.co')
  }
  
  if (!hasValidKey) {
    console.log(`❌ Chave inválida: "${supabaseAnonKey?.substring(0, 20)}..."`)
    console.log('✅ Chave deve ser um JWT válido do Supabase')
  }
  
  console.log('')
  console.log('🔧 Para conectar ao banco de dados:')
  console.log('1. Vá em Configurações do Projeto → Integrações')
  console.log('2. Na seção "Supabase", clique em SELECIONAR PROJETO')
  console.log('3. Escolha um projeto específico da sua conta Supabase')
  console.log('4. ✅ Pronto! As variáveis serão configuradas automaticamente')
  console.log('')
  console.log('🎵 App funcionando em modo offline - biblioteca local ativa!')
  
  supabaseClient = createMockClient()
} else {
  try {
    // Log de sucesso na configuração
    console.log('✅ Variáveis do Supabase carregadas corretamente!')
    console.log(`🔗 URL: ${supabaseUrl}`)
    console.log(`🔑 Chave: ${supabaseAnonKey.substring(0, 20)}...`)

    // Criar cliente Supabase
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

    // Verificar conexão e dar feedback claro
    supabaseClient.from('tracks').select('count', { count: 'exact', head: true })
      .then(({ error }) => {
        if (error) {
          console.warn('⚠️ Erro ao conectar com Supabase:', error.message)
          console.log('💡 POSSÍVEIS SOLUÇÕES:')
          console.log('1. Verifique se selecionou um projeto Supabase específico (não apenas conectou a conta)')
          console.log('2. Vá em Configurações → Integrações → Supabase e selecione um projeto')
          console.log('3. Execute o script database/init.sql no seu projeto Supabase')
          console.log('4. Verifique se as tabelas foram criadas corretamente')
          console.log('5. Certifique-se de que as políticas RLS estão configuradas')
        } else {
          console.log('✅ Supabase conectado com sucesso!')
          console.log('🎵 Banco de dados da plataforma musical está funcionando!')
        }
      })
      .catch((err) => {
        console.error('❌ Erro crítico na conexão Supabase:', err)
        console.log('💡 AÇÃO NECESSÁRIA:')
        console.log('1. Verifique se o projeto Supabase está ativo')
        console.log('2. Confirme se as variáveis de ambiente estão corretas')
        console.log('3. Execute o script database/init.sql para criar as tabelas')
      })
  } catch (error) {
    console.error('❌ Erro ao criar cliente Supabase:', error)
    console.log('🔄 Usando modo offline como fallback')
    supabaseClient = createMockClient()
  }
}

// Exportar o cliente
export const supabase = supabaseClient

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          is_premium: boolean
          subscription_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          is_premium?: boolean
          subscription_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          is_premium?: boolean
          subscription_date?: string | null
          updated_at?: string
        }
      }
      tracks: {
        Row: {
          id: string
          title: string
          artist: string
          album: string
          duration: string
          genre: string
          cover_url: string
          audio_url: string
          is_premium: boolean
          play_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          artist: string
          album: string
          duration: string
          genre: string
          cover_url: string
          audio_url: string
          is_premium?: boolean
          play_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          artist?: string
          album?: string
          duration?: string
          genre?: string
          cover_url?: string
          audio_url?: string
          is_premium?: boolean
          play_count?: number
          updated_at?: string
        }
      }
      advertisements: {
        Row: {
          id: string
          title: string
          company: string
          duration: number
          audio_url: string
          revenue_per_play: number
          total_plays: number
          total_revenue: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          company: string
          duration: number
          audio_url: string
          revenue_per_play: number
          total_plays?: number
          total_revenue?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company?: string
          duration?: number
          audio_url?: string
          revenue_per_play?: number
          total_plays?: number
          total_revenue?: number
          is_active?: boolean
          updated_at?: string
        }
      }
      ad_plays: {
        Row: {
          id: string
          ad_id: string
          user_id: string | null
          played_at: string
          revenue_earned: number
        }
        Insert: {
          id?: string
          ad_id: string
          user_id?: string | null
          played_at?: string
          revenue_earned: number
        }
        Update: {
          id?: string
          ad_id?: string
          user_id?: string | null
          played_at?: string
          revenue_earned?: number
        }
      }
      playlists: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          cover_url: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          cover_url?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          cover_url?: string | null
          is_public?: boolean
          updated_at?: string
        }
      }
      playlist_tracks: {
        Row: {
          id: string
          playlist_id: string
          track_id: string
          position: number
          added_at: string
        }
        Insert: {
          id?: string
          playlist_id: string
          track_id: string
          position: number
          added_at?: string
        }
        Update: {
          id?: string
          playlist_id?: string
          track_id?: string
          position?: number
          added_at?: string
        }
      }
      user_likes: {
        Row: {
          id: string
          user_id: string
          track_id: string
          liked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          track_id: string
          liked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          track_id?: string
          liked_at?: string
        }
      }
    }
  }
}