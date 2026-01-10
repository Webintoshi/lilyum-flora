import { Heart, Flower2, Sparkles, Leaf } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mb-6">
            <Flower2 className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-5xl font-bold text-dark-800 mb-6">Hakkımızda</h1>
          <p className="text-xl text-dark-600 max-w-3xl mx-auto leading-relaxed">
            Tutkulu ve Huzurlu
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-lg p-12 relative overflow-hidden">
            <div className="absolute top-4 right-4 opacity-10">
              <Sparkles className="w-32 h-32 text-primary-400" />
            </div>
            <div className="absolute bottom-4 left-4 opacity-10">
              <Leaf className="w-24 h-24 text-primary-400" />
            </div>

            <div className="relative z-10 space-y-8">
              <p className="text-2xl text-dark-700 leading-relaxed font-light italic">
                Ruhumun tamamını saran o huzur, tıpkı Ordu'nun sabah serinliğinde açan çiçekler gibi Lilyum Flora'nın her köşesinde hissedilir.
              </p>

              <p className="text-2xl text-dark-700 leading-relaxed font-light italic">
                Burada, her buket ve her aranjman; sevdiklerinize uzanan zarif bir teşekkür, içten bir tebessüm ya da sessiz bir "iyi ki varsın" demenin en doğal yoluna dönüşür.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-md p-8 border border-primary-100 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full mb-4">
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-dark-800 mb-3">Sevgi ve Tutku</h3>
            <p className="text-dark-600 leading-relaxed">
              Her bir çiçek, özenle seçilir ve sevgiyle hazırlanır. Sevdiklerinize hislerinizi en zarif şekilde iletmenin yolu.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 border border-primary-100 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-4">
              <Flower2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-dark-800 mb-3">Tazelik ve Kalite</h3>
            <p className="text-dark-600 leading-relaxed">
              Her sabah taze çiçekler, sabahın erken saatlerinde özenle seçilir. Tazelikleri korunur ve kalite garantilidir.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 border border-primary-100 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-dark-800 mb-3">Zarif Tasarım</h3>
            <p className="text-dark-600 leading-relaxed">
              Her buket ve aranjman, uzman çiçekçilerimiz tarafından zarif bir şekilde tasarlanır ve paketlenir.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-lg p-12 mb-16 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Bizimle İletişime Geçin</h2>
              <p className="text-lg opacity-90 leading-relaxed mb-6">
                Sorularınız veya önerileriniz için bizimle iletişime geçebilirsiniz. En kısa sürede size dönüş yapacağım.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="flex items-center justify-center bg-white text-primary-700 px-8 py-3 rounded-lg hover:bg-neutral-50 transition-colors font-semibold"
                >
                  İletişim Sayfası
                </a>
                <a
                  href="https://wa.me/905321234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-[#25D366] text-white px-8 py-3 rounded-lg hover:bg-[#128C7E] transition-colors font-semibold"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zM6.98 15.23c-.09-.16-.47-.86-.68-1.04-.23-.19-.55-.12-.74-.06-.29.12-1.36.81-1.55.95-.25.19-.44.08-.69-.17-.39-.24-1.28-.84-1.32-.88-.04-.04-.09-.07-.15-.07-.31 0-.61.32-.61.32-.37 0-.68-.02-.87-.08-.19-.06-.37-.16-.53-.28-.28-.77-.52-1.07-.84-.3-.32-.6-.75-1.18-1.39-.57-.62-.94-1.44-1.44-2.37-.5-.93-.86-1.78-1.07-2.57-.21-.79-.31-1.52-.31-2.19 0-1.76.46-3.45 1.31-4.94.85-1.49 2.08-2.31 3.44-2.31 1.35 0 2.59.82 3.44 2.31.85 1.49 1.31 3.18 1.31 4.94 0 .67-.1 1.4-.31 2.19-.21.79-.57 1.64-1.07 2.57-.5.93-.93 1.75-1.44 2.37-.62.57-1.44 1.07-2.37 1.39-.57.31-1.81.46-2.57.46z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💐</div>
                <p className="text-xl opacity-90">Sevgiyle Hazırlanmış</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-neutral-50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
            <p className="text-dark-600">Mutlu Müşteri</p>
          </div>
          <div className="bg-neutral-50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
            <p className="text-dark-600">Teslim Edilen Buket</p>
          </div>
          <div className="bg-neutral-50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">4.9/5</div>
            <p className="text-dark-600">Müşteri Puanı</p>
          </div>
          <div className="bg-neutral-50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">60 dk</div>
            <p className="text-dark-600">Teslimat Süresi</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
