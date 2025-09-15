'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Heart,
  Search,
  Crown,
  CreditCard,
  X,
  Music,
  Headphones,
  Star,
  Zap,
  BarChart3,
  DollarSign,
  Settings,
  Shuffle,
  Repeat,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Plus
} from 'lucide-react'
import RevenueDashboard from '@/components/RevenueDashboard'
import AddMusicModal from '@/components/AddMusicModal'
import { Track } from '@/lib/types'
import { getRandomAd, shouldShowAd, recordAdPlay } from '@/lib/monetization'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/useUser'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'

// Biblioteca de músicas brasileiras (fallback se banco não estiver disponível)
const musicLibrary: Track[] = [
  // MPB (Música Popular Brasileira)
  {
    id: '1',
    title: 'Garota de Ipanema',
    artist: 'Tom Jobim & Vinícius de Moraes',
    album: 'The Girl from Ipanema',
    duration: '5:05',
    genre: 'MPB',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: '/audio/sample1.mp3'
  },
  {
    id: '2',
    title: 'Águas de Março',
    artist: 'Elis Regina & Tom Jobim',
    album: 'Elis & Tom',
    duration: '3:15',
    genre: 'MPB',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    audioUrl: '/audio/sample2.mp3'
  },
  {
    id: '3',
    title: 'Como Nossos Pais',
    artist: 'Belchior',
    album: 'Alucinação',
    duration: '4:20',
    genre: 'MPB',
    cover: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=300&h=300&fit=crop',
    audioUrl: '/audio/sample3.mp3'
  },
  {
    id: '4',
    title: 'Construção',
    artist: 'Chico Buarque',
    album: 'Construção',
    duration: '6:15',
    genre: 'MPB',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    audioUrl: '/audio/sample4.mp3'
  },
  {
    id: '5',
    title: 'Corcovado',
    artist: 'Tom Jobim',
    album: 'Wave',
    duration: '3:45',
    genre: 'Bossa Nova',
    cover: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop',
    audioUrl: '/audio/sample5.mp3'
  },

  // Samba
  {
    id: '6',
    title: 'Aquarela do Brasil',
    artist: 'Ary Barroso',
    album: 'Clássicos do Samba',
    duration: '4:10',
    genre: 'Samba',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: '/audio/sample6.mp3'
  },
  {
    id: '7',
    title: 'Mas Que Nada',
    artist: 'Jorge Ben Jor',
    album: 'Samba Esquema Novo',
    duration: '2:45',
    genre: 'Samba',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    audioUrl: '/audio/sample7.mp3'
  },

  // Rock Nacional
  {
    id: '9',
    title: 'Faroeste Caboclo',
    artist: 'Legião Urbana',
    album: 'Que País É Este',
    duration: '9:03',
    genre: 'Rock Nacional',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    audioUrl: '/audio/sample9.mp3',
    premium: true
  },
  {
    id: '10',
    title: 'Pais e Filhos',
    artist: 'Legião Urbana',
    album: 'A Tempestade',
    duration: '5:05',
    genre: 'Rock Nacional',
    cover: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop',
    audioUrl: '/audio/sample10.mp3'
  },

  // Forró
  {
    id: '18',
    title: 'Asa Branca',
    artist: 'Luiz Gonzaga',
    album: 'O Rei do Baião',
    duration: '3:20',
    genre: 'Forró',
    cover: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=300&h=300&fit=crop',
    audioUrl: '/audio/sample18.mp3'
  },

  // Funk Carioca
  {
    id: '21',
    title: 'Rap da Felicidade',
    artist: 'Cidinho & Doca',
    album: 'Rap da Felicidade',
    duration: '4:25',
    genre: 'Funk',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: '/audio/sample21.mp3'
  },

  // Sertanejo
  {
    id: '23',
    title: 'Evidências',
    artist: 'Chitãozinho & Xororó',
    album: 'Cowboys do Asfalto',
    duration: '5:20',
    genre: 'Sertanejo',
    cover: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=300&h=300&fit=crop',
    audioUrl: '/audio/sample23.mp3'
  },

  // Rap Nacional
  {
    id: '31',
    title: 'Diário de um Detento',
    artist: 'Racionais MCs',
    album: 'Sobrevivendo no Inferno',
    duration: '7:18',
    genre: 'Rap Nacional',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: '/audio/sample31.mp3',
    premium: true
  },

  // Axé
  {
    id: '15',
    title: 'É o Tchan',
    artist: 'É o Tchan',
    album: 'Na Cabeça e na Cintura',
    duration: '3:30',
    genre: 'Axé',
    cover: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop',
    audioUrl: '/audio/sample15.mp3'
  }
]

export default function WhatMusicApp() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showRevenueDashboard, setShowRevenueDashboard] = useState(false)
  const [showAddMusicModal, setShowAddMusicModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [isPlayingAd, setIsPlayingAd] = useState(false)
  const [currentAd, setCurrentAd] = useState<any>(null)
  const [adCountdown, setAdCountdown] = useState(0)
  const [tracksPlayed, setTracksPlayed] = useState(0)
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set())
  const [tracks, setTracks] = useState<Track[]>(musicLibrary)
  const [loading, setLoading] = useState(true)
  
  // Auth form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  
  const adAudioRef = useRef<HTMLAudioElement>(null)
  
  // Custom hooks
  const { user, isPremium, loading: userLoading, upgradeToPremium, signIn, signUp, signOut } = useUser()
  const {
    currentTrack,
    isPlaying,
    volume,
    isShuffled,
    repeatMode,
    audioRef,
    playTrack: playTrackHook,
    togglePlayPause,
    skipTrack,
    setVolumeLevel,
    setIsShuffled,
    setRepeatMode
  } = useAudioPlayer()

  const genres = [
    'All', 
    'MPB', 
    'Samba', 
    'Rock Nacional', 
    'Axé', 
    'Forró', 
    'Funk', 
    'Sertanejo', 
    'Tropicália', 
    'Pagode', 
    'Rap Nacional', 
    'Reggae', 
    'Pop Nacional', 
    'Bossa Nova', 
    'Eletrônica',
    'Choro'
  ]

  // Carregar músicas do banco de dados
  useEffect(() => {
    loadTracks()
  }, [])

  const loadTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .order('created_at', { ascending: false })

      if (data && data.length > 0) {
        // Converter dados do banco para o formato Track
        const dbTracks: Track[] = data.map(track => ({
          id: track.id,
          title: track.title,
          artist: track.artist,
          album: track.album,
          duration: track.duration,
          genre: track.genre,
          cover: track.cover_url,
          audioUrl: track.audio_url,
          premium: track.is_premium,
          play_count: track.play_count
        }))
        setTracks(dbTracks)
      }
    } catch (error) {
      console.error('Erro ao carregar músicas:', error)
      // Usar biblioteca local como fallback
      setTracks(musicLibrary)
    } finally {
      setLoading(false)
    }
  }

  // Carregar curtidas do usuário
  useEffect(() => {
    const loadUserLikes = async () => {
      if (!user) return

      try {
        const { data } = await supabase
          .from('user_likes')
          .select('track_id')
          .eq('user_id', user.id)

        if (data) {
          setLikedTracks(new Set(data.map(like => like.track_id)))
        }
      } catch (error) {
        console.error('Erro ao carregar curtidas:', error)
      }
    }

    loadUserLikes()
  }, [user])

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.album.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === 'All' || track.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  const playTrack = (track: Track) => {
    // Verificar se é música premium e usuário não é premium
    if (track.premium && !isPremium) {
      setShowPremiumModal(true)
      return
    }

    // Verificar se deve tocar anúncio (a cada 3 músicas para usuários gratuitos)
    if (!isPremium && shouldShowAd(tracksPlayed, isPremium)) {
      playAdvertisement()
      // Salvar a música para tocar depois do anúncio
      setTimeout(() => {
        playTrackHook(track)
      }, 100)
      return
    }

    playTrackHook(track)
    setTracksPlayed(prev => prev + 1)
  }

  const playAdvertisement = () => {
    const randomAd = getRandomAd()
    setCurrentAd(randomAd)
    setIsPlayingAd(true)
    setAdCountdown(randomAd.duration)
    
    // Registrar reprodução do anúncio para receita
    recordAdPlay(randomAd.id)
    
    if (adAudioRef.current) {
      adAudioRef.current.play()
    }
  }

  const toggleLike = async (trackId: string) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    const newLikedTracks = new Set(likedTracks)
    
    try {
      if (newLikedTracks.has(trackId)) {
        // Remover curtida
        await supabase
          .from('user_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('track_id', trackId)
        
        newLikedTracks.delete(trackId)
      } else {
        // Adicionar curtida
        await supabase
          .from('user_likes')
          .insert({
            user_id: user.id,
            track_id: trackId
          })
        
        newLikedTracks.add(trackId)
      }
      
      setLikedTracks(newLikedTracks)
    } catch (error) {
      console.error('Erro ao curtir música:', error)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)

    try {
      if (authMode === 'login') {
        const { error } = await signIn(email, password)
        if (!error) {
          setShowAuthModal(false)
          setEmail('')
          setPassword('')
        }
      } else {
        const { error } = await signUp(email, password, name)
        if (!error) {
          setShowAuthModal(false)
          setEmail('')
          setPassword('')
          setName('')
        }
      }
    } catch (error) {
      console.error('Erro na autenticação:', error)
    } finally {
      setAuthLoading(false)
    }
  }

  const upgradeToPremiumHandler = async () => {
    const success = await upgradeToPremium()
    if (success) {
      setShowPaymentModal(false)
      setShowPremiumModal(false)
      alert('Parabéns! Você agora é um usuário Premium! 🎉')
    }
  }

  // Efeito para countdown do anúncio
  useEffect(() => {
    if (isPlayingAd && adCountdown > 0) {
      const timer = setTimeout(() => {
        setAdCountdown(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (isPlayingAd && adCountdown === 0) {
      // Anúncio terminou
      setIsPlayingAd(false)
      setCurrentAd(null)
    }
  }, [isPlayingAd, adCountdown])

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Music className="w-16 h-16 mx-auto mb-4 animate-pulse text-green-500" />
          <h2 className="text-2xl font-bold mb-2">Carregando What Music Brasil...</h2>
          <p className="text-gray-400">Preparando sua experiência musical</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-yellow-500 p-2 rounded-xl">
              <Music className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
              What Music Brasil
            </h1>
            <Badge className="bg-gradient-to-r from-green-500 to-yellow-500 text-black text-xs">
              🇧🇷 Música Brasileira
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Adicionar Música - Apenas para admin */}
            <Button 
              onClick={() => setShowAddMusicModal(true)}
              variant="outline"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Música
            </Button>
            
            {/* Dashboard de Receitas - Apenas para admin */}
            <Button 
              onClick={() => setShowRevenueDashboard(true)}
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Receitas
            </Button>
            
            {user ? (
              <div className="flex items-center gap-3">
                {!isPremium && (
                  <Button 
                    onClick={() => setShowPremiumModal(true)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Premium
                  </Button>
                )}
                {isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
                    <Crown className="w-4 h-4 mr-1" />
                    Premium
                  </Badge>
                )}
                <Button
                  onClick={signOut}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar músicas, artistas ou álbuns brasileiros..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {genres.map(genre => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGenre(genre)}
                className={selectedGenre === genre 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "border-white/20 text-white hover:bg-white/10"
                }
              >
                {genre}
              </Button>
            ))}
          </div>

          {/* Estatísticas da Biblioteca */}
          <div className="bg-gradient-to-r from-green-500/10 to-yellow-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-400">🎵 Biblioteca Musical Brasileira</h3>
                <p className="text-gray-300 text-sm">
                  {tracks.length} músicas • {genres.length - 1} gêneros • De todos os cantos do Brasil
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-400">{filteredTracks.length}</p>
                <p className="text-xs text-gray-400">músicas encontradas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Music Library */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredTracks.map(track => (
            <Card key={track.id} className="bg-white/10 border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <img 
                    src={track.cover} 
                    alt={track.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {track.premium && !isPremium && (
                    <div className="absolute top-2 right-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(track.id)
                      }}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-10 h-10 p-0 ${
                        likedTracks.has(track.id) 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-white/20 hover:bg-white/30'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedTracks.has(track.id) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      onClick={() => playTrack(track)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-green-600 hover:bg-green-700 rounded-full w-12 h-12 p-0"
                    >
                      <Play className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold text-white truncate">{track.title}</h3>
                <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                <p className="text-gray-500 text-xs truncate">{track.album}</p>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                    {track.genre}
                  </Badge>
                  <span className="text-xs text-gray-400">{track.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Player */}
        {(currentTrack || isPlayingAd) && (
          <Card className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/20 rounded-none">
            <CardContent className="p-4">
              {isPlayingAd && currentAd ? (
                // Anúncio Player
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-lg animate-pulse">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Anúncio - {currentAd.company}</h4>
                      <p className="text-gray-400 text-sm">{currentAd.title}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-yellow-400 font-semibold">Anúncio termina em {adCountdown}s</p>
                    <p className="text-xs text-gray-400">Upgrade para Premium para remover anúncios</p>
                  </div>
                  <Button 
                    onClick={() => setShowPremiumModal(true)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Sem Anúncios
                  </Button>
                </div>
              ) : currentTrack && (
                // Music Player
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src={currentTrack.cover} 
                      alt={currentTrack.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-white">{currentTrack.title}</h4>
                      <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
                      <p className="text-gray-500 text-xs">{currentTrack.album}</p>
                    </div>
                    <Button
                      onClick={() => toggleLike(currentTrack.id)}
                      variant="ghost"
                      size="sm"
                      className={`${
                        likedTracks.has(currentTrack.id) 
                          ? 'text-red-500 hover:text-red-400' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${likedTracks.has(currentTrack.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsShuffled(!isShuffled)}
                      className={`text-white hover:bg-white/10 ${isShuffled ? 'text-green-400' : ''}`}
                    >
                      <Shuffle className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => skipTrack('prev', filteredTracks)}
                      className="text-white hover:bg-white/10"
                    >
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button 
                      onClick={togglePlayPause}
                      className="bg-green-600 hover:bg-green-700 rounded-full w-12 h-12 p-0"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => skipTrack('next', filteredTracks)}
                      className="text-white hover:bg-white/10"
                    >
                      <SkipForward className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
                      className={`text-white hover:bg-white/10 ${repeatMode !== 'off' ? 'text-green-400' : ''}`}
                    >
                      <Repeat className="w-5 h-5" />
                      {repeatMode === 'one' && <span className="text-xs ml-1">1</span>}
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-gray-400" />
                    <Slider
                      value={volume}
                      onValueChange={setVolumeLevel}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Revenue Dashboard */}
      <RevenueDashboard 
        isVisible={showRevenueDashboard}
        onClose={() => setShowRevenueDashboard(false)}
      />

      {/* Add Music Modal */}
      <AddMusicModal 
        isVisible={showAddMusicModal}
        onClose={() => setShowAddMusicModal(false)}
        onMusicAdded={loadTracks}
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-900 border-white/20 max-w-md w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white flex items-center gap-2">
                  {authMode === 'login' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                  {authMode === 'login' ? 'Entrar' : 'Criar Conta'}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nome
                    </label>
                    <Input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="bg-white/10 border-white/20 text-white"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <Input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Senha
                  </label>
                  <Input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {authLoading ? 'Carregando...' : (authMode === 'login' ? 'Entrar' : 'Criar Conta')}
                </Button>
                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="text-gray-400 hover:text-white"
                  >
                    {authMode === 'login' ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-900 border-white/20 max-w-md w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  What Music Brasil Premium
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowPremiumModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-3xl font-bold py-2 px-4 rounded-lg inline-block mb-4">
                  R$ 9,99/mês
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Sem anúncios</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Headphones className="w-5 h-5 text-yellow-500" />
                  <span>Qualidade de áudio superior</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span>Acesso a músicas exclusivas</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Music className="w-5 h-5 text-yellow-500" />
                  <span>Downloads ilimitados</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-green-400">🇧🇷</span>
                  <span>Catálogo completo da música brasileira</span>
                </div>
              </div>
              
              <Button 
                onClick={() => {
                  if (user) {
                    setShowPremiumModal(false)
                    setShowPaymentModal(true)
                  } else {
                    setShowPremiumModal(false)
                    setShowAuthModal(true)
                  }
                }}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold"
              >
                {user ? 'Assinar Premium' : 'Entrar para Assinar'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-900 border-white/20 max-w-md w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-green-500" />
                  Finalizar Pagamento
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black p-4 rounded-lg text-center">
                <h3 className="font-bold text-lg">What Music Brasil Premium</h3>
                <p className="text-2xl font-bold">R$ 9,99/mês</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Número do Cartão
                  </label>
                  <Input 
                    placeholder="1234 5678 9012 3456"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Validade
                    </label>
                    <Input 
                      placeholder="MM/AA"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CVV
                    </label>
                    <Input 
                      placeholder="123"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome no Cartão
                  </label>
                  <Input 
                    placeholder="Seu Nome Completo"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              
              <Button 
                onClick={upgradeToPremiumHandler}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Confirmar Pagamento - R$ 9,99
              </Button>
              
              <p className="text-xs text-gray-400 text-center">
                Pagamento seguro. Cancele a qualquer momento.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hidden Audio Elements */}
      <audio ref={audioRef} />
      <audio ref={adAudioRef} />
    </div>
  )
}