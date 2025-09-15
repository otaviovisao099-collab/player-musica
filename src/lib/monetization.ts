import { Advertisement, AdRevenue } from './types'

// Simulação de dados de anúncios com valores de receita
export const advertisementDatabase: Advertisement[] = [
  {
    id: 'ad1',
    title: 'Coca-Cola - Taste the Feeling',
    company: 'Coca-Cola',
    duration: 15,
    audioUrl: '/audio/ads/cocacola.mp3',
    revenue: 0.25 // R$ 0,25 por reprodução
  },
  {
    id: 'ad2',
    title: 'Nike - Just Do It',
    company: 'Nike',
    duration: 20,
    audioUrl: '/audio/ads/nike.mp3',
    revenue: 0.35 // R$ 0,35 por reprodução
  },
  {
    id: 'ad3',
    title: 'McDonald\'s - I\'m Lovin\' It',
    company: 'McDonald\'s',
    duration: 18,
    audioUrl: '/audio/ads/mcdonalds.mp3',
    revenue: 0.30 // R$ 0,30 por reprodução
  },
  {
    id: 'ad4',
    title: 'Samsung - Do What You Can\'t',
    company: 'Samsung',
    duration: 25,
    audioUrl: '/audio/ads/samsung.mp3',
    revenue: 0.40 // R$ 0,40 por reprodução
  },
  {
    id: 'ad5',
    title: 'Spotify - Music for Everyone',
    company: 'Spotify',
    duration: 22,
    audioUrl: '/audio/ads/spotify.mp3',
    revenue: 0.28 // R$ 0,28 por reprodução
  }
]

// Função para calcular receita de anúncios
export const calculateAdRevenue = (adPlays: AdRevenue[]): number => {
  return adPlays.reduce((total, play) => total + play.totalRevenue, 0)
}

// Função para determinar quando mostrar anúncio
export const shouldShowAd = (tracksPlayed: number, isPremium: boolean): boolean => {
  if (isPremium) return false
  return tracksPlayed > 0 && tracksPlayed % 3 === 0
}

// Função para selecionar anúncio aleatório
export const getRandomAd = (): Advertisement => {
  const randomIndex = Math.floor(Math.random() * advertisementDatabase.length)
  return advertisementDatabase[randomIndex]
}

// Função para registrar reprodução de anúncio (simulação)
export const recordAdPlay = (adId: string): AdRevenue => {
  const ad = advertisementDatabase.find(a => a.id === adId)
  if (!ad) throw new Error('Anúncio não encontrado')
  
  return {
    adId,
    company: ad.company,
    playsCount: 1,
    totalRevenue: ad.revenue,
    date: new Date()
  }
}

// Função para validar dados do cartão de crédito
export const validateCreditCard = (cardNumber: string, expiryDate: string, cvv: string): boolean => {
  // Validação básica do número do cartão (Luhn algorithm simplificado)
  const cleanCardNumber = cardNumber.replace(/\s/g, '')
  if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) return false
  
  // Validação da data de expiração
  const [month, year] = expiryDate.split('/')
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1
  
  if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12) return false
  if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) return false
  
  // Validação do CVV
  if (cvv.length < 3 || cvv.length > 4) return false
  
  return true
}

// Função para processar pagamento (simulação)
export const processPayment = async (
  cardNumber: string,
  expiryDate: string,
  cvv: string,
  holderName: string,
  amount: number
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  // Simulação de processamento de pagamento
  return new Promise((resolve) => {
    setTimeout(() => {
      if (validateCreditCard(cardNumber, expiryDate, cvv)) {
        resolve({
          success: true,
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })
      } else {
        resolve({
          success: false,
          error: 'Dados do cartão inválidos'
        })
      }
    }, 2000) // Simula delay de processamento
  })
}

// Função para formatar valor monetário
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Função para calcular receita mensal estimada
export const calculateMonthlyRevenue = (dailyAdPlays: number): number => {
  const averageRevenuePerAd = advertisementDatabase.reduce((sum, ad) => sum + ad.revenue, 0) / advertisementDatabase.length
  return dailyAdPlays * averageRevenuePerAd * 30 // 30 dias
}

// Função para gerar relatório de receita
export const generateRevenueReport = (adPlays: AdRevenue[]) => {
  const totalRevenue = calculateAdRevenue(adPlays)
  const totalPlays = adPlays.reduce((sum, play) => sum + play.playsCount, 0)
  const averageRevenuePerPlay = totalPlays > 0 ? totalRevenue / totalPlays : 0
  
  const companiesRevenue = adPlays.reduce((acc, play) => {
    if (!acc[play.company]) {
      acc[play.company] = { plays: 0, revenue: 0 }
    }
    acc[play.company].plays += play.playsCount
    acc[play.company].revenue += play.totalRevenue
    return acc
  }, {} as Record<string, { plays: number; revenue: number }>)
  
  return {
    totalRevenue,
    totalPlays,
    averageRevenuePerPlay,
    companiesRevenue,
    topCompany: Object.entries(companiesRevenue).sort((a, b) => b[1].revenue - a[1].revenue)[0]
  }
}