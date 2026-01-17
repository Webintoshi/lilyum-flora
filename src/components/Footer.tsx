export default function Footer() {
  return (
    <footer className="bg-dark-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Hakkımızda</h3>
            <p className="text-dark-400 mb-4">
              Lilyum Flora, en taze ve kaliteli çiçekleri sevdiklerinize ulaştırmak için kurulmuş bir çiçekçidir.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/lilyumflora.ordu/" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-primary-400 transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                Instagram
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2 text-dark-400">
              <li>
                <a href="/" className="hover:text-primary-400 transition-colors">
                  Ana Sayfa
                </a>
              </li>
              <li>
                <a href="/catalog" className="hover:text-primary-400 transition-colors">
                  Katalog
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-primary-400 transition-colors">
                  İletişim
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Müşteri Hizmetleri</h3>
            <ul className="space-y-2 text-dark-400">
              <li>
                <a href="/profile/orders" className="hover:text-primary-400 transition-colors">
                  Sipariş Takibi
                </a>
              </li>
              <li>
                <a href="/profile/addresses" className="hover:text-primary-400 transition-colors">
                  Adres Yönetimi
                </a>
              </li>
              <li>
                <a href="/wishlist" className="hover:text-primary-400 transition-colors">
                  Favorilerim
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2 text-dark-400">
              <li className="flex items-center space-x-2">
                <span className="text-primary-400">📞</span>
                <span>0545 628 41 52</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-primary-400">📧</span>
                <span>info@lilyumflora.net</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-primary-400">📍</span>
                <span>Karşıyaka Mah. Kıbrıs Cd. No:49A Altınordu/Ordu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-dark-400 text-sm mb-4 md:mb-0">
              &copy; 2026 Lilyum Flora. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 text-sm text-dark-400">
              <a href="/privacy-policy" className="hover:text-primary-400 transition-colors">
                Gizlilik Politikası
              </a>
              <a href="/terms-of-use" className="hover:text-primary-400 transition-colors">
                Kullanım Şartları
              </a>
              <a href="/return-policy" className="hover:text-primary-400 transition-colors">
                İade Politikası
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Webintosh Signature - Micro Pill */}
      <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center justify-center pb-4">
        <a
          href="https://webintoshi.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
        >
          <div className="flex flex-col items-end">
            <span className="text-[6px] font-medium tracking-widest text-gray-500 uppercase leading-none mb-0.5">
              Designed by
            </span>
            <span className="text-[8px] font-bold tracking-[0.2em] text-white leading-none group-hover:text-gray-200 transition-colors">
              WEBINTOSH
            </span>
          </div>
          <div className="h-3 w-[1px] bg-white/10 mx-0.5"></div>
          <img
            src="/images/webintoshi-logo.png"
            alt="Webintosh"
            className="h-2.5 w-auto brightness-0 invert opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
          />
        </a>
      </div>
    </footer>
  );
}
