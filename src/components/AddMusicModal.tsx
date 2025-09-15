'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Plus,
  Music,
  Upload,
  X,
  Save,
  Crown
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AddMusicModalProps {
  isVisible: boolean
  onClose: () => void
  onMusicAdded: () => void
}

export default function AddMusicModal({ isVisible, onClose, onMusicAdded }: AddMusicModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    duration: '',
    genre: 'MPB',
    cover_url: '',
    audio_url: '',
    is_premium: false
  })
  const [loading, setLoading] = useState(false)

  const genres = [
    'MPB', 'Samba', 'Rock Nacional', 'Axé', 'Forró', 'Funk', 
    'Sertanejo', 'Tropicália', 'Pagode', 'Rap Nacional', 
    'Reggae', 'Pop Nacional', 'Bossa Nova', 'Eletrônica', 'Choro'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('tracks')
        .insert([formData])

      if (!error) {
        // Reset form
        setFormData({
          title: '',
          artist: '',
          album: '',
          duration: '',
          genre: 'MPB',
          cover_url: '',
          audio_url: '',
          is_premium: false
        })
        onMusicAdded()
        onClose()
        alert('Música adicionada com sucesso!')
      } else {
        alert('Erro ao adicionar música: ' + error.message)
      }
    } catch (error) {
      console.error('Erro ao adicionar música:', error)
      alert('Erro ao adicionar música')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-gray-900 border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="w-6 h-6 text-green-500" />
              Adicionar Nova Música
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título da Música *
                </label>
                <Input 
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Garota de Ipanema"
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Artista *
                </label>
                <Input 
                  value={formData.artist}
                  onChange={(e) => handleInputChange('artist', e.target.value)}
                  placeholder="Ex: Tom Jobim"
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Álbum *
                </label>
                <Input 
                  value={formData.album}
                  onChange={(e) => handleInputChange('album', e.target.value)}
                  placeholder="Ex: The Girl from Ipanema"
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duração *
                </label>
                <Input 
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="Ex: 3:45"
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gênero *
              </label>
              <div className="flex gap-2 flex-wrap">
                {genres.map(genre => (
                  <Button
                    key={genre}
                    type="button"
                    variant={formData.genre === genre ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('genre', genre)}
                    className={formData.genre === genre 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "border-white/20 text-white hover:bg-white/10"
                    }
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL da Capa *
              </label>
              <Input 
                value={formData.cover_url}
                onChange={(e) => handleInputChange('cover_url', e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="bg-white/10 border-white/20 text-white"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Use URLs do Unsplash, Pexels ou similar (300x300px recomendado)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL do Áudio *
              </label>
              <Input 
                value={formData.audio_url}
                onChange={(e) => handleInputChange('audio_url', e.target.value)}
                placeholder="/audio/sample.mp3"
                className="bg-white/10 border-white/20 text-white"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Caminho para o arquivo de áudio (MP3 recomendado)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant={formData.is_premium ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange('is_premium', !formData.is_premium)}
                className={formData.is_premium 
                  ? "bg-yellow-600 hover:bg-yellow-700" 
                  : "border-white/20 text-white hover:bg-white/10"
                }
              >
                <Crown className="w-4 h-4 mr-2" />
                {formData.is_premium ? 'Premium' : 'Gratuita'}
              </Button>
              <span className="text-sm text-gray-400">
                {formData.is_premium ? 'Apenas para usuários Premium' : 'Disponível para todos'}
              </span>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {loading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Adicionando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Adicionar Música
                  </>
                )}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}