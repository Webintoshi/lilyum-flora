import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            <Header />
            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
                <h1 className="text-3xl font-bold text-dark-900 mb-8">Gizlilik Politikası</h1>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 prose prose-green max-w-none">
                    <p className="text-gray-600 mb-6">Son Güncelleme: 01.01.2026</p>

                    <h3>1. Giriş</h3>
                    <p>
                        Lilyum Flora olarak, müşterilerimizin kişisel verilerinin gizliliğine ve güvenliğine büyük önem veriyoruz.
                        Bu Gizlilik Politikası, web sitemizi kullandığınızda verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
                    </p>

                    <h3>2. Toplanan Veriler</h3>
                    <p>
                        Hizmetlerimizi sunabilmek için aşağıdaki bilgileri toplayabiliriz:
                    </p>
                    <ul>
                        <li>Kimlik bilgileri (Ad, Soyad)</li>
                        <li>İletişim bilgileri (Telefon, E-posta, Adres)</li>
                        <li>İşlem ve sipariş detayları</li>
                    </ul>

                    <h3>3. Verilerin Kullanımı</h3>
                    <p>
                        Topladığımız veriler şu amaçlarla kullanılır:
                    </p>
                    <ul>
                        <li>Siparişlerinizi işlemek ve teslim etmek</li>
                        <li>Müşteri hizmetleri desteği sağlamak</li>
                        <li>Size özel kampanya ve duyurular iletmek (onayınız dahilinde)</li>
                        <li>Yasal yükümlülüklerimizi yerine getirmek</li>
                    </ul>

                    <h3>4. Veri Güvenliği</h3>
                    <p>
                        Kişisel verileriniz, yetkisiz erişime, kaybolmaya veya değiştirilmeye karşı modern güvenlik önlemleri ile korunmaktadır.
                        256-bit SSL şifreleme teknolojisi kullanılarak işlemleriniz güvence altına alınmaktadır.
                    </p>

                    <h3>5. Çerezler (Cookies)</h3>
                    <p>
                        Web sitemiz deneyiminizi iyileştirmek için çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz.
                    </p>

                    <h3>6. İletişim</h3>
                    <p>
                        Gizlilik politikamızla ilgili sorularınız için bizimle <a href="/contact" className="text-primary-600 hover:underline">iletişim</a> sayfasından irtibata geçebilirsiniz.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
