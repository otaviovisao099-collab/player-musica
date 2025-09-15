export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  genre: string
  cover: string
  audioUrl: string
  premium?: boolean
}

export interface Advertisement {
  id: string
  title: string
  company: string
  duration: number
  audioUrl: string
  revenue: number // Valor que a empresa paga por reprodução
}

export interface User {
  id: string
  name: string
  email: string
  isPremium: boolean
  subscriptionDate?: Date
  paymentMethod?: PaymentMethod
}

export interface PaymentMethod {
  id: string
  cardNumber: string
  expiryDate: string
  holderName: string
  type: 'credit' | 'debit'
}

export interface Playlist {
  id: string
  name: string
  tracks: Track[]
  cover?: string
  isPublic: boolean
  createdAt: Date
}

export interface AdRevenue {
  adId: string
  company: string
  playsCount: number
  totalRevenue: number
  date: Date
}

export type MusicGenre = 
  | 'Pop' 
  | 'Rock' 
  | 'Hip Hop' 
  | 'Electronic' 
  | 'Jazz' 
  | 'Classical' 
  | 'Country' 
  | 'R&B' 
  | 'Reggae'
  | 'Blues'
  | 'Folk'
  | 'Funk'
  | 'Gospel'
  | 'Heavy Metal'
  | 'Indie'
  | 'Latin'
  | 'Punk'
  | 'Reggaeton'
  | 'Soul'