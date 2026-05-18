import { NextRequest, NextResponse } from 'next/server'

interface FinancialContext {
  classification: string
  totalIncome: number
  totalExpenses: number
  debtToIncomeRatio: number
  emergencyFund: number
  monthlyCashFlow: number
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SYSTEM_PROMPT = `You are EconoShield, an AI financial advisor specializing in personal finance management for Indonesian users. You provide empathetic, practical, and actionable financial advice.

Guidelines:
1. Be empathetic and understanding of financial challenges
2. Provide specific, actionable advice tailored to their situation
3. Use IDR currency format with proper thousand separators
4. Speak in Indonesian (Bahasa Indonesia) but include key English financial terms
5. Give practical, achievable steps rather than generic advice
6. Acknowledge their emotional state regarding finances
7. Suggest both immediate actions and long-term strategies
8. Be realistic about what's achievable given their financial situation`

function generateSystemPrompt(context: FinancialContext): string {
  return `${SYSTEM_PROMPT}

User Context:
- Classification: ${context.classification}
- Monthly Income: IDR ${context.totalIncome.toLocaleString('id-ID')}
- Monthly Expenses: IDR ${context.totalExpenses.toLocaleString('id-ID')}
- Debt-to-Income Ratio: ${(context.debtToIncomeRatio * 100).toFixed(1)}%
- Emergency Fund: IDR ${context.emergencyFund.toLocaleString('id-ID')}
- Monthly Cash Flow: IDR ${context.monthlyCashFlow.toLocaleString('id-ID')}`
}

function generateContextualResponse(userMessage: string, context: FinancialContext): string {
  const systemPrompt = generateSystemPrompt(context)
  
  // Generate response based on classification and user query
  if (context.classification === "Resilient") {
    return `Luar biasa! Dari analisis saya, Anda berada di posisi keuangan yang sangat sehat.

**Analisis Situasi Anda:**
- Pendapatan bulanan: IDR ${context.totalIncome.toLocaleString('id-ID')}
- Pengeluaran bulanan: IDR ${context.totalExpenses.toLocaleString('id-ID')}
- Rasio utang terhadap pendapatan: ${(context.debtToIncomeRatio * 100).toFixed(1)}%
- Dana darurat: IDR ${context.emergencyFund.toLocaleString('id-ID')}
- Arus kas bulanan: +IDR ${context.monthlyCashFlow.toLocaleString('id-ID')}

**Rekomendasi Strategi:**
1. **Pertahankan kebiasaan baik** - Lanjutkan alokasi 20% pendapatan untuk investasi
2. **Tingkatkan dana darurat** - Targetkan 6 bulan pengeluaran sebagai buffer keamanan
3. **Mulai investasi jangka panjang** - Pertimbaskan reksadana atau saham blue chip
4. **Diversifikasi pendapatan** - Cari sisi income pasif untuk proteksi inflasi

${userMessage.toLowerCase().includes("investasi") ? `
**Tentang Investasi:**
- Reksadana pasar uang untuk likuiditas
- Saham blue chip untuk pertumbuhan jangka panjang
- Properti untuk proteksi inflasi
` : ''}

${userMessage.toLowerCase().includes("pinjol") ? `
**Tentang Pinjol Online:**
- Hindari pinjol tidak perlu - utang hanya untuk produktif
- Manfaatkan pinjol modal usah jika ada rencana bisnis
` : ''}

Pertanyaan spesifik yang ingin Anda diskusikan?`
  } 
  else if (context.classification === "Vulnerable Middle") {
    return `Saya melihat Anda berada di posisi yang cukup stabil namun memerlukan perhatian ekstra.

**Analisis Situasi Anda:**
- Rasio utang terhadap pendapatan ${(context.debtToIncomeRatio * 100).toFixed(1)}% (di atas ambang aman 30%)
- Dana darurat: ${Math.round(context.emergencyFund / context.totalExpenses * 10) / 10} bulan pengeluaran
- Arus kas bulanan: ${context.monthlyCashFlow >= 0 ? '+' : ''}IDR ${Math.abs(context.monthlyCashFlow).toLocaleString('id-ID')}

**Langkah Darurat:**
1. **Prioritaskan pembayaran utang** - Gunakan metode snowball untuk utang high-interest
2. **Tingkatkan dana darurat** - Target minimal 3 bulan pengeluaran dalam 6 bulan
3. **Kontrol pengeluaran konsumtif** - Audit pengeluaran dan kurangi 15-20%

**Aksi Konkret:**
- Buat anggaran 50/30/20 (kebutuhan/keinginan/investasi)
- Atur automatisasi transfer ke rekening simpanan
- Renegosiasikan suku bunga dengan pemberi pinjaman

${userMessage.toLowerCase().includes("utang") ? `
**Strategi Pengurangan Utang:**
- Bayut utang high-interest dulu (pinjol > kartu kredit)
- Renegosiasikan suku bunga dengan pemberi pinjaman
- Hindari menambah utang baru selama proses pengurangan
` : ''}

Apa area yang ingin Anda fokuskan dulu?`
  }
  else if (context.classification === "Near-Crisis") {
    return `⚠️ **Situasi Darurat** - Saya sangat prihatin dengan situasi keuangan Anda saat ini.

**Analisis Kritis:**
- Rasio utang ${(context.debtToIncomeRatio * 100).toFixed(1)}% - sangat berisiko
- Dana darurat hanya ${Math.round(context.emergencyFund / context.totalExpenses * 10) / 10} bulan pengeluaran
- Arus kas: ${context.monthlyCashFlow >= 0 ? '+' : ''}IDR ${Math.abs(context.monthlyCashFlow).toLocaleString('id-ID')} - ${context.monthlyCashFlow >= 0 ? 'membantu' : 'tidak mencukupi'}

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

${userMessage.toLowerCase().includes("pinjol") ? `
**Tentang Pinjol Online:**
- Segera hentikan pinjol baru - fokus pada yang ada
- Hubungi pemberi pinjol untuk negosiasi
- Cari bantuan lembaga resmi jika terjebak
` : ''}

${userMessage.toLowerCase().includes("pendapatan") ? `
**Meningkatkan Pendapatan:**
- Cari pekerjaan sampingan sesuai skill
- Jual barang tidak terpakai
- Tawarkan jasa berdasarkan keahlian
` : ''}

Bagaimana kondisi keuangan Anda saat ini?`
  }
  else { // In-Distress
    return `🚨 **KRISIS KEUANGAN** - Saya sangat khawatir dengan situasi Anda.

**Analisis Krisis:**
- Pendapatan: IDR ${context.totalIncome.toLocaleString('id-ID')}
- Pengeluaran: IDR ${context.totalExpenses.toLocaleString('id-ID')}
- Kekurangan: IDR ${Math.abs(context.monthlyCashFlow).toLocaleString('id-ID')} per bulan
- Rasio utang: ${(context.debtToIncomeRatio * 100).toFixed(1)}%
- Dana darurat: IDR ${context.emergencyFund.toLocaleString('id-ID')} - sangat tidak memadai

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

${userMessage.toLowerCase().includes("bantuan") ? `
**Bantuan Tersedia:**
- Kementerian Sosial: 1504377
- BAZ Nasional: 0812-1234-5678
- Koperasi simpanan pinjam
- Lembaga swadaya masyarakat
` : ''}

Apa yang sedang Anda hadapi sekarang? Saya di sini untuk membantu.`
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, financialContext } = await request.json()

    if (!message || !financialContext) {
      return NextResponse.json(
        { error: 'Message and financial context are required' },
        { status: 400 }
      )
    }

    // For now, return a simulated response
    // In production, this would call Google Gemini API
    const response = generateContextualResponse(message, financialContext)

    // In production, you would integrate with Google Gemini API like this:
    /*
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    )

    if (!geminiResponse.ok) {
      throw new Error('Failed to get response from Gemini API')
    }

    const geminiData = await geminiResponse.json()
    const response = geminiData.candidates[0].content.parts[0].text
    */

    return NextResponse.json({ response })
  } catch (error) {
    console.error('AI Advisor error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}