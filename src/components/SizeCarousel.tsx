import { ArrowRight } from "lucide-react";

interface SizeBanner {
  id: string;
  subtitle: string;
  title: string;
  videoUrl: string;
  posterUrl: string;
  link: string;
}

interface SizeCarouselProps {
  banners: SizeBanner[];
}

export default function SizeCarousel({ banners }: SizeCarouselProps) {

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex-1 h-px bg-neutral-300"></div>
            <h3 className="px-8 text-2xl font-bold text-dark-800">Büyüklüğe Göre Alışveriş</h3>
            <div className="flex-1 h-px bg-neutral-300"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <a
              key={banner.id}
              href={banner.link}
              className="block group"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg hover:shadow-xl transition-all duration-300 max-w-xs mx-auto">
                <div className="aspect-[9/16] relative">
                  <video
                    src={banner.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={banner.posterUrl}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark-900/60 to-transparent">
                  <div className="text-left">
                    <div className="text-white/90 text-sm font-medium mb-2">
                      {banner.subtitle}
                    </div>
                    <h4 className="text-white text-3xl font-bold mb-4">
                      {banner.title}
                    </h4>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => window.location.href = banner.link}
                        className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                      >
                        Alışverişe Başla
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
