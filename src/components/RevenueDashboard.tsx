'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Play,
  Eye,
  Calendar,
  Building2,
  Crown
} from 'lucide-react'
import { formatCurrency, generateRevenueReport, calculateMonthlyRevenue } from '@/lib/monetization'
import { AdRevenue } from '@/lib/types'

interface RevenueDashboardProps {
  isVisible: boolean
  onClose: () => void
}

export default function RevenueDashboard({ isVisible, onClose }: RevenueDashboardProps) {
  const [adPlays, setAdPlays] = useState<AdRevenue[]>([])
  const [totalUsers, setTotalUsers] = useState(15420)
  const [premiumUsers, setPremiumUsers] = useState(2340)
  const [dailyAdPlays, setDailyAdPlays] = useState(8750)

  // Simulação de dados de receita
  useEffect(() => {
    const mockAdPlays: AdRevenue[] = [
      {
        adId: 'ad1',
        company: 'Coca-Cola',
        playsCount: 1250,
        totalRevenue: 312.50,
        date: new Date()
      },
      {
        adId: 'ad2',
        company: 'Nike',
        playsCount: 980,
        totalRevenue: 343.00,
        date: new Date()
      },
      {
        adId: 'ad3',
        company: 'McDonald\'s',
        playsCount: 1100,
        totalRevenue: 330.00,
        date: new Date()
      },
      {
        adId: 'ad4',
        company: 'Samsung',
        playsCount: 750,
        totalRevenue: 300.00,
        date: new Date()
      },
      {
        adId: 'ad5',
        company: 'Spotify',
        playsCount: 890,
        totalRevenue: 249.20,
        date: new Date()
      }
    ]
    setAdPlays(mockAdPlays)
  }, [])

  if (!isVisible) return null

  const report = generateRevenueReport(adPlays)
  const monthlyAdRevenue = calculateMonthlyRevenue(dailyAdPlays)
  const monthlyPremiumRevenue = premiumUsers * 9.99
  const totalMonthlyRevenue = monthlyAdRevenue + monthlyPremiumRevenue

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/20 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <DollarSign className="w-7 h-7 text-green-500" />
                Dashboard de Receitas
              </h2>
              <p className="text-gray-400 mt-1">Acompanhe seus ganhos em tempo real</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-400 text-sm font-medium">Receita Mensal</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(totalMonthlyRevenue)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-400 text-sm font-medium">Usuários Totais</p>
                    <p className="text-2xl font-bold text-white">{totalUsers.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-400 text-sm font-medium">Premium</p>
                    <p className="text-2xl font-bold text-white">{premiumUsers.toLocaleString()}</p>
                  </div>
                  <Crown className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-400 text-sm font-medium">Anúncios/Dia</p>
                    <p className="text-2xl font-bold text-white">{dailyAdPlays.toLocaleString()}</p>
                  </div>
                  <Play className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown de Receitas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Receita por Fonte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-green-500" />
                    <span className="text-white">Anúncios</span>
                  </div>
                  <span className="text-green-400 font-semibold">{formatCurrency(monthlyAdRevenue)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    <span className="text-white">Premium</span>
                  </div>
                  <span className="text-yellow-400 font-semibold">{formatCurrency(monthlyPremiumRevenue)}</span>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total Mensal</span>
                    <span className="text-2xl font-bold text-green-400">{formatCurrency(totalMonthlyRevenue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  Top Anunciantes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(report.companiesRevenue)
                  .sort((a, b) => b[1].revenue - a[1].revenue)
                  .map(([company, data], index) => (
                    <div key={company} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="text-white">{company}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">{formatCurrency(data.revenue)}</p>
                        <p className="text-xs text-gray-400">{data.plays} reproduções</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>

          {/* Estatísticas Detalhadas */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-500" />
                Estatísticas Detalhadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-400">{formatCurrency(report.averageRevenuePerPlay)}</p>
                  <p className="text-gray-400 text-sm">Receita por Anúncio</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400">{((premiumUsers / totalUsers) * 100).toFixed(1)}%</p>
                  <p className="text-gray-400 text-sm">Taxa de Conversão Premium</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">{formatCurrency(totalMonthlyRevenue * 12)}</p>
                  <p className="text-gray-400 text-sm">Projeção Anual</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações para Anunciantes */}
          <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-500" />
                Para Empresas Interessadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Quer anunciar no What Music? Oferecemos excelente alcance para sua marca!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-orange-400">{totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Usuários Ativos</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-orange-400">{dailyAdPlays.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Reproduções Diárias</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-orange-400">R$ 0,25-0,40</p>
                  <p className="text-sm text-gray-400">Por Reprodução</p>
                </div>
              </div>
              <div className="text-center">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  Contato Comercial
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}