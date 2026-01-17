import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ReturnPolicy() {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            <Header />
            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
                <h1 className="text-3xl font-bold text-dark-900 mb-8">İade Politikası</h1>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 prose prose-green max-w-none">
                    <p className="text-gray-600 mb-6">Son Güncelleme: 01.01.2026</p>

                    <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8 text-center">
                        <h3 className="text-red-800 font-bold text-lg mb-2">İade Kabul Edilmemektedir</h3>
                        <p className="text-red-700">
                            Ürünlerimiz canlı çiçek ve kişiyse özel hazırlanan aranjmanlar olduğu için doğası gereği iade kabul edilmemektedir.
                        </p>
                    </div>

                    <h3>1. Cayma Hakkı İstisnası</h3>
                    <p>
                        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca;
                        "Çabuk bozulabilen veya son kullanma tarihi geçebilecek malların teslimine ilişkin sözleşmeler" cayma hakkı kapsamı dışındadır.
                        Canlı çiçekler bu kapsama girdiği için <strong>iade işlemi yapılmamaktadır.</strong>
                    </p>

                    <h3>2. Hatalı veya Hasarlı Ürünler</h3>
                    <p>
                        Siparişiniz size ulaştığında; çiçeklerde solma, kırılma veya siparişinizden farklı bir ürün gelmesi durumunda
                        lütfen teslimat anında kurye ile tutanak tutunuz veya aynı gün içinde fotoğraflı olarak bizimle iletişime geçiniz.
                        Bu gibi durumlarda telafi veya değişim sağlanacaktır.
                    </p>

                    <h3>3. Değişim Koşulları</h3>
                    <p>
                        Yalnızca bizim hatamızdan kaynaklanan (yanlış ürün, hasarlı ürün vb.) durumlarda değişim yapılmaktadır.
                        Keyfi değişim talepleri çiçeklerin tazeliğini koruması açısından mümkün değildir.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
