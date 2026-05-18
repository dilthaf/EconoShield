"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Bot, User, Sparkles } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface FinancialContext {
  classification: string
  totalIncome: number
  totalExpenses: number
  debtToIncomeRatio: number
  emergencyFund: number
  monthlyCashFlow: number
}

interface AIAdvisorChatProps {
  financialContext: FinancialContext
}

const systemPrompt = `You are EconoShield, an AI financial advisor specializing in personal finance management for Indonesian users. You provide empathetic, practical, and actionable financial advice.

User Context:
- Classification: {{classification}}
- Monthly Income: IDR {{totalIncome.toLocaleString('id-ID')}}
- Monthly Expenses: IDR {{totalExpenses.toLocaleString('id-ID')}}
- Debt-to-Income Ratio: {{debtToIncomeRatio}}
- Emergency Fund: IDR {{emergencyFund.toLocaleString('id-ID')}}
- Monthly Cash Flow: IDR {{monthlyCashFlow.toLocaleString('id-ID')}}

Guidelines:
1. Be empathetic and understanding of financial challenges
2. Provide specific, actionable advice tailored to their situation
3. Use IDR currency format with proper thousand separators
4. Speak in Indonesian (Bahasa Indonesia) but include key English financial terms
5. Give practical, achievable steps rather than generic advice
6. Acknowledge their emotional state regarding finances
7. Suggest both immediate actions and long-term strategies
8. Be realistic about what's achievable given their financial situation`

export function AIAdvisorChat({ financialContext }: AIAdvisorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo! Saya adalah EconoShield, AI financial advisor Anda. Saya di sini untuk membantu Anda mengelola keuangan dengan lebih baik dan menghindari risiko kebangkrutan. Berdasarkan data keuangan Anda, saya melihat bahwa Anda berada di kategori *{{classification}}*. Mari kita diskusi langkah-langkah yang bisa Andaambil untuk meningkatkan situasi keuangan Anda.",
      timestamp: new Date(),
    }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response - in production, this would call the Google Gemini API
    const systemPromptFilled = systemPrompt
      .replace(/{{classification}}/g, financialContext.classification)
      .replace(/{{totalIncome}}/g, financialContext.totalIncome.toString())
      .replace(/{{totalExpenses}}/g, financialContext.totalExpenses.toString())
      .replace(/{{debtToIncomeRatio}}/g, (financialContext.debtToIncomeRatio * 100).toFixed(1) + "%")
      .replace(/{{emergencyFund}}/g, financialContext.emergencyFund.toString())
      .replace(/{{monthlyCashFlow}}/g, financialContext.monthlyCashFlow.toString())

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate context-aware response based on financial situation
    let response = ""
    
    if (financialContext.classification === "Resilient") {
      response = `Luar biasa! Dari analisis saya, Anda berada di posisi keuangan yang sangat sehat. 

**Analisis Situasi Anda:**
- Pendapatan bulanan: IDR ${financialContext.totalIncome.toLocaleString('id-ID')}
- Pengeluaran bulanan: IDR ${financialContext.totalExpenses.toLocaleString('id-ID')}
- Rasio utang terhadap pendapatan: ${(financialContext.debtToIncomeRatio * 100).toFixed(1)}%
- Dana darurat: IDR ${financialContext.emergencyFund.toLocaleString('id-ID')}
- Arus kas bulanan: +IDR ${financialContext.monthlyCashFlow.toLocaleString('id-ID')}

**Rekomendasi Strategi:**
1. **Pertahankan kebiasaan baik** - Lanjutkan alokasi 20% pendapatan untuk investasi
2. **Tingkatkan dana darurat** - Targetkan 6 bulan pengeluaran sebagai buffer keamanan
3. **Mulai investasi jangka panjang** - Pertimbaskan reksadana atau saham blue chip
4. **Diversifikasi pendapatan** - Cari sisi income pasif untuk proteksi inflasi

Pertanyaan spesifik yang ingin Anda diskusikan?`
    } else if (financialContext.classification === "Vulnerable Middle") {
      response = `Saya melihat Anda berada di posisi yang cukup stabil namun memerlukan perhatian ekstra.

**Analisis Situasi Anda:**
- Rasio utang terhadap pendapatan ${(financialContext.debtToIncomeRatio * 100).toFixed(1)}% (di atas ambang aman 30%)
- Dana darurat: ${Math.round(financialContext.emergencyFund / financialContext.totalExpenses * 10) / 10} bulan pengeluaran
- Arus kas bulanan: ${financialContext.monthlyCashFlow >= 0 ? '+' : ''}IDR ${Math.abs(financialContext.monthlyCashFlow).toLocaleString('id-ID')}

**Langkah Darurat:**
1. **Prioritaskan pembayaran utang** - Gunakan metode snowball untuk utang high-interest
2. **Tingkatkan dana darurat** - Target minimal 3 bulan pengeluaran dalam 6 bulan
3. **Kontrol pengeluaran konsumtif** - Audit pengeluaran dan kurangi 15-20%

**Aksi Konkret:**
- Buat anggaran 50/30/20 (kebutuhan/keinginan/investasi)
- Atur automatisasi transfer ke rekening simpanan
- Renegosiasikan suku bunga dengan pemberi pinjaman

Apa area yang ingin Anda fokuskan dulu?`
    } else if (financialContext.classification === "Near-Crisis") {
      response = `⚠️ **Situasi Darurat** - Saya sangat prihatin dengan situasi keuangan Anda saat ini.

**Analisis Kritis:**
- Rasio utang ${(financialContext.debtToIncomeRatio * 100).toFixed(1)}% - sangat berisiko
- Dana darurat hanya ${Math.round(financialContext.emergencyFund / financialContext.totalExpenses * 10) / 10} bulan pengeluaran
- Arus kas: ${financialContext.monthlyCashFlow >= 0 ? '+' : ''}IDR ${Math.abs(financialContext.monthlyCashFlow).toLocaleString('id-ID')} - ${financialContext.monthlyCashFlow >= 0 ? 'membantu' : 'tidak mencukupi'}

**Langkah Segera (30 hari):**
1. **Darurat: Potong pengeluaran non-esensial 50%**
2. **Hubungi semua kreditor** - minta penundaan atau perubahan skema pembayaran
3. **Cari sumber pendapatan tambahan** - freelance, jual barang tidak terpakai
4. **Hentikan semua kartu kredit** - gunakan hanya untuk kebutuhan hidup

**Strategi Bertahan:**
- Buat sistem cash envelope untuk kontrol pengeluaran
- Jual aset non-produktif
- Cari konseling keuangan profesional

**Penting:** Hubungi konsultan keuangan profesional dalam 7 hari jika situasi tidak membaik.

Bagaimana kondisi keuangan Anda saat ini?`
    } else {
      response = `🚨 **KRISIS KEUANGAN** - Saya sangat khawatir dengan situasi Anda.

**Analisis Krisis:**
- Pendapatan: IDR ${financialContext.totalIncome.toLocaleString('id-ID')}
- Pengeluaran: IDR ${financialContext.totalExpenses.toLocaleString('id-ID')}
- Kekurangan: IDR ${Math.abs(financialContext.monthlyCashFlow).toLocaleString('id-ID')} per bulan
- Rasio utang: ${(financialContext.debtToIncomeRatio * 100).toFixed(1)}%
- Dana darurat: IDR ${financialContext.emergencyFund.toLocaleString('id-ID')} - sangat tidak memadai

**Aksi Darurat (24 jam):**
1. **Hubungi keluarga/dekat** - Jelaskan situasi dan minta bantuan sementara
2. **Cari bantuan sosial** - Kementerian Sosial, BAZ, atau lembaga kemanusiaan
3. **Hentikan semua pembayaran tidak esensial** - Fokus pada makanan, tempat tinggal, kesehatan
4. **Cari pekerjaan apapun** - Sampingan, jasa, apa saja yang menghasilkan

**Langkah Kritis (1 minggu):**
- Kunjungi kantor BKPM atau koperasi untuk bantuan
- Hubungi pengacara untuk konsultasi tentang restrukturisasi utang
- Cari program bantuan pemerintah

**Penting SEKARANG:**
- Jangan menambah utang lagi
- Cari bantuan profesional
- Saya bisa membantu rencana keluar dari situasi ini

Apa yang sedang Anda hadapi sekarang? Saya di sini untuk membantu.`
    }

    // Add user context to the response
    if (userMessage.toLowerCase().includes("pinjol") || userMessage.toLowerCase().includes("online loan")) {
      response += `\n\n**Tentang Pinjol Online:**
- Hindari pinjol tambahan - cicilan tinggi dan bunga majemuk
- Pertimbangkan konsolidasi utang jika mungkin
- Cari bantuan lembaga keuangan resmi`
    }

    if (userMessage.toLowerCase().includes("investasi") || userMessage.toLowerCase().includes("investment")) {
      response += `\n\n**Tentang Investasi:**
- Fokuskan pada instrumen rendah risiko saat ini
- Reksadana pasar uang atau deposito sebagai awal
- Pelajari investasi jangka panjang setelah situasi stabil`
    }

    return response
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      const response = await generateAIResponse(inputMessage)
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Maaf, saya mengalami kesalahan saat memproses pesan Anda. Silakan coba lagi nanti.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    "Apa cara tercepat untuk mengurangi utang?",
    "Bagaimana cara membangun dana darurat?",
    "Investasi apa yang cocok untuk saya?",
    "Bagaimana mengatur pengeluaran bulanan?",
    "Apakah saya perlu mencari penghasilan tambahan?"
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto h-[700px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          AI Financial Advisor
          <Badge variant="outline" className="ml-auto">
            EconoShield AI
          </Badge>
        </CardTitle>
        <CardDescription>
          Diskusikan keuangan Anda dengan AI advisor untuk mendapatkan rekomendasi personal
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] lg:max-w-[70%] rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                
                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
                  <div className="flex gap-1">
                    <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                    <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                    <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Questions */}
        {!isTyping && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Pertanyaan cepat:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputMessage(question)
                    setTimeout(handleSendMessage, 100)
                  }}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tanyakan tentang keuangan Anda..."
              disabled={isTyping}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-6"
            >
              {isTyping ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Kirim"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}