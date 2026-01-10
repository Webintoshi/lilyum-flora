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
              <a href="#" className="text-dark-400 hover:text-primary-400 transition-colors">
                Instagram
              </a>
              <a href="#" className="text-dark-400 hover:text-primary-400 transition-colors">
                Facebook
              </a>
              <a href="#" className="text-dark-400 hover:text-primary-400 transition-colors">
                Twitter
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
                <span>0212 123 45 67</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-primary-400">📧</span>
                <span>info@lilyumflora.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-primary-400">📍</span>
                <span>Kadıköy, İstanbul</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-dark-400 text-sm mb-4 md:mb-0">
              &copy; 2024 Lilyum Flora. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 text-sm text-dark-400">
              <a href="#" className="hover:text-primary-400 transition-colors">
                Gizlilik Politikası
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                Kullanım Şartları
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                İade Politikası
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
