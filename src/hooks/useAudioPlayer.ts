import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Track } from '@/lib/types'

export function useAudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState([75])
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off')
  
  const audioRef = useRef<HTMLAudioElement>(null)

  const playTrack = async (track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    
    // Incrementar contador de reprodução no banco (se disponível)
    try {
      await supabase
        .from('tracks')
        .update({ play_count: track.play_count ? track.play_count + 1 : 1 })
        .eq('id', track.id)
    } catch (error) {
      console.log('Contador de reprodução não atualizado (modo offline)')
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(error => {
          console.log('Áudio não disponível - usando modo demo')
        })
      }
    }
  }

  const skipTrack = (direction: 'next' | 'prev', trackList: Track[]) => {
    if (!currentTrack) return
    
    const currentIndex = trackList.findIndex(track => track.id === currentTrack.id)
    let nextIndex
    
    if (direction === 'next') {
      if (isShuffled) {
        nextIndex = Math.floor(Math.random() * trackList.length)
      } else {
        nextIndex = currentIndex + 1 >= trackList.length ? 0 : currentIndex + 1
      }
    } else {
      nextIndex = currentIndex - 1 < 0 ? trackList.length - 1 : currentIndex - 1
    }
    
    playTrack(trackList[nextIndex])
  }

  const setVolumeLevel = (newVolume: number[]) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0] / 100
    }
  }

  // Efeito para sincronizar o áudio com o estado
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.audioUrl
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.log('Áudio não disponível - usando modo demo')
        })
      }
    }
  }, [currentTrack])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100
    }
  }, [volume])

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isShuffled,
    repeatMode,
    audioRef,
    playTrack,
    togglePlayPause,
    skipTrack,
    setVolumeLevel,
    setIsShuffled,
    setRepeatMode,
    setCurrentTime,
    setDuration
  }
}