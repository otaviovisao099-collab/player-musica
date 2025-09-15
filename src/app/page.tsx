"use client"

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, RotateCcw, Heart, MoreHorizontal, Search, Music, List, Clock, User, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock data para demonstração
const mockPlaylists = [
  { id: 1, name: "Minhas Favoritas", count: 47 },
  { id: 2, name: "Rock Clássico", count: 32 },
  { id: 3, name: "Chill Vibes", count: 28 },
  { id: 4, name: "Workout", count: 55 },
  { id: 5, name: "Descobertas", count: 12 }
]

const mockSongs = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: "5:55",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
  },
  {
    id: 2,
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    duration: "6:30",
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    album: "Led Zeppelin IV",
    duration: "8:02",
    cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop"
  },
  {
    id: 4,
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    album: "Appetite for Destruction",
    duration: "5:03",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop"
  },
  {
    id: 5,
    title: "Imagine",
    artist: "John Lennon",
    album: "Imagine",
    duration: "3:07",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
  }
]

export default function WhatMusic() {
  const [currentSong, setCurrentSong] = useState(mockSongs[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(355) // 5:55 em segundos
  const [volume, setVolume] = useState([75])
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [isRepeating, setIsRepeating] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState(mockPlaylists[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [identifiedSong, setIdentifiedSong] = useState<string | null>(null)
  
  const audioRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Simular progresso da música
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    const currentIndex = mockSongs.findIndex(song => song.id === currentSong.id)
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : mockSongs.length - 1
    setCurrentSong(mockSongs[previousIndex])
    setCurrentTime(0)
  }

  const handleNext = () => {
    const currentIndex = mockSongs.findIndex(song => song.id === currentSong.id)
    const nextIndex = currentIndex < mockSongs.length - 1 ? currentIndex + 1 : 0
    setCurrentSong(mockSongs[nextIndex])
    setCurrentTime(0)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    if (value[0] === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleProgressChange = (value: number[]) => {
    setCurrentTime(value[0])
  }

  const startListening = async () => {
    try {
      setIsListening(true)
      setIdentifiedSong(null)
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const mediaRecorder = new MediaRecorder(stream)
      audioRef.current = mediaRecorder
      
      const audioChunks: BlobPart[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        
        // Simular identificação de música (em produção, usaria API como ACRCloud ou Shazam)
        setTimeout(() => {
          const randomSong = mockSongs[Math.floor(Math.random() * mockSongs.length)]
          setIdentifiedSong(`${randomSong.title} - ${randomSong.artist}`)
          setIsListening(false)
        }, 3000)
      }
      
      mediaRecorder.start()
      
      // Parar gravação após 10 segundos
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop()
          stream.getTracks().forEach(track => track.stop())
        }
      }, 10000)
      
    } catch (error) {
      console.error('Erro ao acessar microfone:', error)
      setIsListening(false)
    }
  }

  const stopListening = () => {
    if (audioRef.current && audioRef.current.state === 'recording') {
      audioRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    setIsListening(false)
  }

  const filteredSongs = mockSongs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Music className="w-8 h-8 text-green-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            What Music
          </h1>
        </div>
        
        {/* Identificação de Música */}
        <div className="flex items-center gap-4">
          {identifiedSong && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              🎵 {identifiedSong}
            </Badge>
          )}
          
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={isListening}
            className={`${
              isListening 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                : 'bg-green-600 hover:bg-green-700'
            } transition-all duration-300`}
          >
            <Circle className="w-4 h-4 mr-2" />
            {isListening ? 'Ouvindo...' : 'Identificar Música'}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 p-4 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-300">Suas Playlists</h2>
            <div className="space-y-2">
              {mockPlaylists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => setSelectedPlaylist(playlist)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedPlaylist.id === playlist.id
                      ? 'bg-green-600 text-white'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{playlist.name}</span>
                    <span className="text-sm opacity-70">{playlist.count}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
              <User className="w-8 h-8 text-gray-400" />
              <div>
                <p className="font-medium">Usuário</p>
                <p className="text-sm text-gray-400">Conta Premium</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar músicas, artistas ou álbuns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Song List */}
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-xl font-semibold mb-4">{selectedPlaylist.name}</h2>
            <div className="space-y-2">
              {filteredSongs.map((song, index) => (
                <Card
                  key={song.id}
                  className={`bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer ${
                    currentSong.id === song.id ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => setCurrentSong(song)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-600 rounded-md flex items-center justify-center text-gray-400 font-bold">
                        {index + 1}
                      </div>
                      <img
                        src={song.cover}
                        alt={song.title}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{song.title}</h3>
                        <p className="text-sm text-gray-400">{song.artist}</p>
                      </div>
                      <div className="text-sm text-gray-400">{song.duration}</div>
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Now Playing Sidebar */}
        <div className="w-80 bg-gray-900 p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Tocando Agora</h2>
          
          <div className="text-center mb-6">
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className="w-48 h-48 mx-auto rounded-lg shadow-2xl mb-4"
            />
            <h3 className="text-xl font-bold text-white mb-1">{currentSong.title}</h3>
            <p className="text-gray-400 mb-1">{currentSong.artist}</p>
            <p className="text-sm text-gray-500">{currentSong.album}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleProgressChange}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsShuffled(!isShuffled)}
              className={isShuffled ? 'text-green-500' : 'text-gray-400'}
            >
              <Circle className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handlePrevious}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={handlePlayPause}
              className="bg-green-600 hover:bg-green-700 w-12 h-12 rounded-full"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleNext}>
              <ChevronRight className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRepeating(!isRepeating)}
              className={isRepeating ? 'text-green-500' : 'text-gray-400'}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleMute}>
              {isMuted || volume[0] === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Slider
              value={isMuted ? [0] : volume}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
            <span className="text-sm text-gray-400 w-8">
              {isMuted ? 0 : volume[0]}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}