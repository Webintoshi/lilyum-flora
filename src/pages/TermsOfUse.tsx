import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsOfUse() {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            <Header />
            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
                <h1 className="text-3xl font-bold text-dark-900 mb-8">Kullanım Şartları</h1>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 prose prose-green max-w-none">
                    <p className="text-gray-600 mb-6">Son Güncelleme: 01.01.2026</p>

                    <h3>1. Genel Hükümler</h3>
                    <p>
                        Bu internet sitesini kullanarak aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız.
                        Lilyum Flora, bu şartları dilediği zaman değiştirme hakkını saklı tutar.
                    </p>

                    <h3>2. Hizmet Kapsamı</h3>
                    <p>
                        Lilyum Flora, Ordu ili sınırları içerisinde çiçek ve hediye gönderimi hizmeti sunmaktadır.
                        Ürün görselleri mevsimsel şartlara göre küçük farklılıklar gösterebilir, ancak genel konsept korunur.
                    </p>

                    <h3>3. Sipariş ve Ödeme</h3>
                    <p>
                        Siparişleriniz, ödemenin onaylanmasının ardından işleme alınır.
                        Ödemeler kredi kartı veya havale/EFT yoluyla güvenli bir şekilde yapılabilir.
                    </p>

                    <h3>4. Teslimat</h3>
                    <p>
                        Teslimatlar, seçtiğiniz tarih ve saat aralığında gerçekleştirilmeye çalışılır.
                        Ancak trafik, hava durumu gibi mücbir sebeplerden dolayı gecikmeler yaşanabilir.
                        Alıcının adreste bulunamaması durumunda siparişiniz en yakın şubemize geri getirilir veya komşuya/guvenliğe teslim edilebilir.
                    </p>

                    <h3>5. İptal ve Değişiklik</h3>
                    <p>
                        Siparişiniz hazırlanmaya başlanmadan önce iptal veya değişiklik talebinde bulunabilirsiniz.
                        Yola çıkmış veya hazırlanmış ürünlerde iptal işlemi yapılamamaktadır.
                    </p>

                    <h3>6. Fikri Mülkiyet</h3>
                    <p>
                        Sitede yer alan tüm görseller, metinler ve tasarımlar Lilyum Flora'ya aittir. İzinsiz kullanılamaz.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
