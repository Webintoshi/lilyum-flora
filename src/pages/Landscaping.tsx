import { Leaf, Droplets, TreePine, Sun, Layout, CheckCircle, Flower2, ArrowRight, Phone, MapPin } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Landscaping() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-dark-800 mb-4">Profesyonel Peyzaj Hizmetleri</h1>
          <p className="text-xl text-dark-600 max-w-3xl mx-auto leading-relaxed">
            Dış mekânlarınızı Lilyum Flora dokunuşuyla estetik ve işlevselliği bir araya getiriyoruz
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-dark-800 mb-6">Peyzaj Tasarımı</h2>
              <p className="text-dark-600 leading-relaxed mb-4">
                Peyzaj tasarımı: Lilyum Flora'nın dokunuşuyla estetik ve işlevselliği bir araya getirerek dış mekânları özenle dönüştüren bir sanat dönüşür. Alanın özelliklerine uygun, kişiye ve mekâna özel çözümlerle doğal unsurlar uyum içinde bir araya getirilir; yaşam alanlarınız göz alıcı, davetkâr ve dengeli bir görünüme kavuşur.
              </p>
              <p className="text-dark-600 leading-relaxed">
                Bahçenizin veya dış mekânınızın potansiyelini ortaya çıkarmak için Lilyum Flora olarak özgün peyzaj projeleri hazırlıyoruz. Renk uyumu, bitki dokuları, çizgiler, formlar ve ölçek gibi tasarım unsurlarını dikkate alarak mekânınıza özel, kimliği güçlü ve estetik bir dış alan tasarlıyoruz.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-dark-800 mb-6">Bitkilendirme Uygulamaları</h2>
              <p className="text-dark-600 leading-relaxed mb-4">
                Bitkilendirme uygulamaları: Farklı bitki türleri, çalılar, çiçekler ve isteğe bağlı yosun/yeşil duvar çözümleriyle bakımı kolay, uzun ömürlü ve estetik peyzaj alanları oluşturuyoruz. Her mevsim canlı kalacak kombinasyonlarla bahçenizin yıl boyunca taze, dinamik ve davetkâr görünmesini sağlıyoruz.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img 
                src="https://sadikahmetc3.sg-host.com/wp-content/uploads/2025/12/peysaj1-800x500.jpg" 
                alt="Peyzaj Tasarımı" 
                className="w-full h-64 object-cover"
              />
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-dark-800 mb-6">Profesyonel Peyzaj Hizmetleri</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-primary-700 mb-3">Daima Çözüm Odaklı Yaklaşım</h3>
                  <p className="text-dark-600 leading-relaxed">
                    Lilyum Flora olarak her projeye özgün, estetik ve uzun ömürlü çözümler üretiyoruz. Dış mekânlarınızın yalnızca görsel açıdan değil, işlevsel olarak da kusursuz çalışmasını hedefliyoruz.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-primary-700 mb-3">Hardscape Çözümleri</h3>
                  <p className="text-dark-600 leading-relaxed">
                    Doğal taş döşemeler, dekoratif çakıl yollar, su elemanları (süs havuzları, bahçe çeşmeleri), yapısal taş duvarlar ve dekoratif aksanlarla mekânınıza karakter kazandırıyoruz. Her detay, bahçenizin estetiğini güçlendirirken kullanım kolaylığını da ön planda tutar.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-primary-700 mb-3">Aydınlatma ve Sulama Sistemleri</h3>
                  <p className="text-dark-600 leading-relaxed">
                    Gece saatlerinde bahçenizi etkileyici bir atmosfere taşıyan peyzaj aydınlatma çözümleri ve bitkilerin her mevsim sağlıklı kalmasını destekleyen otomatik sulama sistemleri tasarlıyoruz. Enerji verimliliği ile estetik uyumu bir arada sunarak dış mekânlarınızı gündüz ve gece farklı deneyimlerle yaşatıyoruz.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-primary-700 mb-3">Özel Tasarım Uygulamaları</h3>
                  <p className="text-dark-600 leading-relaxed">
                    Japon bahçeleri, huzur veren Zen bahçeleri, akışkan su öğeleriyle zenginleşen peyzaj tasarımları ve kişiye özel dekoratif peyzaj elemanlarıyla benzersiz dış mekânlar oluşturuyoruz. Her tasarım, mekânın ruhunu kullanıcı beklentileriyle harmanlayarak özelleştirilmiş ve unutulmaz bir bahçe deneyimi sunar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-dark-800 mb-8 text-center">Neden Biz?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-full mb-3">
                <CheckCircle className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-dark-800 mb-3">Deneyimli Ekip</h3>
              <p className="text-dark-600 leading-relaxed">
                Lilyum Flora olarak, alanında uzman tasarımcılar ve sahada tecrübeli uygulama ekibimizle projelerinizi hem estetik hem de teknik açıdan eksiksiz şekilde hayata geçiriyoruz. Her ölçekteki dış mekân projesinde, planlamadan son rötuşlara kadar süreci profesyonelce yönetiyoruz.
              </p>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-full mb-3">
                <Layout className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-dark-800 mb-3">Müşteri Odaklı Yaklaşım</h3>
              <p className="text-dark-600 leading-relaxed">
                Her yaşam alanının ve her müşterinin beklentisinin farklı olduğunun bilinciyle, tamamen size özel çözümler üretiyoruz. İhtiyaçlarınızı dinleyip bütçenize, tarzınıza ve mekânın özelliklerine uygun, esnek ve sürdürülebilir peyzaj önerileri sunuyoruz.
              </p>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-full mb-3">
                <TreePine className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-dark-800 mb-3">Kaliteli Malzemeler</h3>
              <p className="text-dark-600 leading-relaxed">
                Bitkiden sert zemine, aydınlatma armatürlerinden sulama ekipmanlarına kadar uzun ömürlü ve estetik malzemeler tercih ediyoruz. Böylece hem görsel açıdan güçlü hem de yıllarca ilk günkü gibi kalabilen peyzaj alanları ortaya çıkıyoruz.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-dark-800 mb-4">Hayalinizdeki Peyzajı Birlikte Tasarlayalım</h2>
          <p className="text-xl text-dark-600 max-w-3xl mx-auto leading-relaxed">
            Hayalinizdeki peyzajı tasarlamak ve detaylı bilgi almak için Lilyum Flora ile iletişime geçebilirsiniz. Dış mekânlarınıza değer katacak profesyonel peyzaj ve bitkilendirme hizmetlerimizle yanınızda olmaktan memnuniyet duyarız.
          </p>
        </div>

        <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-dark-800 mb-8 text-center">Sık Sorulan Sorular</h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-bold text-dark-800 mb-3 flex items-center">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mr-3">
                  <Flower2 className="w-5 h-5 text-primary-600" />
                </span>
                Peyzaj Neden Önemlidir?
              </h3>
              <p className="text-dark-600 leading-relaxed">
                Peyzaj, yaşam alanlarını estetik açıdan güzelleştirir ve insanların doğayla daha yakın temas kurmasını sağlar. Estetik görünümün ötesinde, doğru şekilde tasarlanmış bir peyzaj, mekânın işlevselliğini artırabilir, stresi azaltabilir ve mülkün değerini yükseltebilir. Ayrıca, doğal yaşamı destekleyerek çevresel sürdürülebilirliği artırabilir.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-dark-800 mb-3 flex items-center">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mr-3">
                  <TreePine className="w-5 h-5 text-primary-600" />
                </span>
                Hangi Bitkiler Peyzaj İçin Uygun ve Nasıl Seçilir?
              </h3>
              <p className="text-dark-600 leading-relaxed">
                Peyzaj için uygun bitkiler, büyüme koşullarına (toprak tipi, iklim şartları, güneş veya gölge gereksinimi gibi) ve tasarım hedeflerine uygun olarak seçilmelidir. Örneğin, yerel bitki türleri genellikle iklim koşullarına daha uygun olabilir ve bakımı daha kolay olabilir.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-dark-800 mb-3 flex items-center">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mr-3">
                  <Droplets className="w-5 h-5 text-primary-600" />
                </span>
                Peyzaj Bakımı için Hangi İpuçları Önemlidir?
              </h3>
              <div className="text-dark-600 leading-relaxed space-y-2">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Düzenli sulama:</strong> Bitkilerin ihtiyaçlarına göre düzenli ve doğru sulama yapılmalıdır.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Gübreleme:</strong> Bitkilerin sağlıklı büyümesi için uygun dönemlerde gübreleme yapılmalıdır.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Budama:</strong> Bitkilerin şekil alması ve sağlıklı kalması için düzenli olarak budama yapılmalıdır.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Yabani ot kontrolü:</strong> Bahçede veya peyzaj alanında yabani otların kontrolü düzenli olarak yapılmalıdır.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p><strong>Hastalık ve zararlılarla mücadele:</strong> Bitkilerde görülen hastalıklar veya zararlılarla mücadele edilmelidir.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-lg p-12 mb-16 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Bizimle İletişime Geçin</h2>
              <p className="text-lg opacity-90 leading-relaxed mb-6">
                Hayalinizdeki peyzajı tasarlamak ve detaylı bilgi almak için Lilyum Flora ile iletişime geçebilirsiniz.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Telefon</p>
                    <p className="opacity-90">0545 628 41 52</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zM6.98 15.23c-.09-.16-.47-.86-.68-1.04-.23-.19-.55-.12-.74-.06-.29.12-1.36.81-1.55.95-.25.19-.44.08-.69-.17-.39-.24-1.28-.84-1.32-.88-.04-.04-.09-.07-.15-.07-.31 0-.61.32-.61.32-.37 0-.68-.02-.87-.08-.19-.06-.37-.16-.53-.28-.28-.77-.52-1.07-.84-.3-.32-.6-.75-1.18-1.39-.57-.62-.94-1.44-1.44-2.37-.5-.93-.86-1.78-1.07-2.57-.21-.79-.31-1.52-.31-2.19 0-1.76.46-3.45 1.31-4.94.85-1.49 2.08-2.31 3.44-2.31 1.35 0 2.59.82 3.44 2.31.85 1.49 1.31 3.18 1.31 4.94 0 .67-.1 1.4-.31 2.19-.21.79-.57 1.64-1.07 2.57-.5.93-.93 1.75-1.44 2.37-.62.57-1.44 1.07-2.37 1.39-.57.31-1.81.46-2.57.46z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    <p className="opacity-90">0545 628 41 52</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Adres</p>
                    <p className="opacity-90">Karşıyaka Mah. Kıbrıs Cd. No:49A Altınordu/Ordu</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl mb-4">🌸</div>
                <p className="text-2xl opacity-90">Doğayla Uyumlu Peyzaj</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
