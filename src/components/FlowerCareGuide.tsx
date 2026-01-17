import { Sun, Droplets, Thermometer, Heart } from 'lucide-react';

const guides = [
    {
        icon: Sun,
        title: 'Doğru Işık',
        description: 'Çiçeklerinizin yaprakları solgunsa daha aydınlık, yanıksa daha gölge bir yere ihtiyacı olabilir. Onları doğrudan güneşten sakının.',
        color: 'bg-yellow-50 text-yellow-600',
        borderColor: 'border-yellow-100'
    },
    {
        icon: Droplets,
        title: 'Şefkatli Sulama',
        description: 'Toprağı parmağınızla kontrol edin. Nemliyse bekleyin, kurumuşsa nazikçe su verin. Köklerin boğulmasına izin vermeyin.',
        color: 'bg-blue-50 text-blue-500',
        borderColor: 'border-blue-100'
    },
    {
        icon: Thermometer,
        title: 'İdeal Sıcaklık',
        description: 'Bitkiler de bizim gibi aşırı sıcağı ve soğuğu sevmez. Onları cereyandan ve klima önlerinden koruyarak mutlu edebilirsiniz.',
        color: 'bg-orange-50 text-orange-500',
        borderColor: 'border-orange-100'
    },
    {
        icon: Heart,
        title: 'Sevgi ve İlgi',
        description: 'Çiçeklerinizle konuşun, yapraklarını silin. Gösterdiğiniz sevgi ve ilgiyi hissederek size güzellikleriyle karşılık vereceklerdir.',
        color: 'bg-pink-50 text-pink-500',
        borderColor: 'border-pink-100'
    }
];

export default function FlowerCareGuide() {
    return (
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Çiçeklerinizi Yakından Tanıyın</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Onlar da canlı ve ilgi bekler. İşte küçük dostlarınızı mutlu etmenin basit sırları.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {guides.map((guide, index) => (
                        <div
                            key={index}
                            className={`p-8 rounded-2xl border ${guide.borderColor} bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
                        >
                            <div className={`w-14 h-14 rounded-2xl ${guide.color} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                                <guide.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary-600 transition-colors">
                                {guide.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                {guide.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
