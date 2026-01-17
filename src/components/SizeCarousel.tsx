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
            <h3 className="px-8 text-2xl font-bold text-dark-800">İhtiyacınıza Göre Alışveriş</h3>
            <div className="flex-1 h-px bg-neutral-300"></div>
          </div>
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-6 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {banners.map((banner) => (
            <a
              key={banner.id}
              href={banner.link}
              className="block group flex-shrink-0 w-[85%] md:w-auto snap-center"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg hover:shadow-xl transition-all duration-300 w-full aspect-[9/16] group/card shadow-sm">
                <video
                  src={banner.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={banner.posterUrl}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />

                {/* Overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/10 group-hover/card:bg-black/20 transition-colors" />

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="text-left">
                    <div className="text-white/90 text-sm font-medium mb-1 md:mb-2 drop-shadow-md">
                      {banner.subtitle}
                    </div>
                    <h4 className="text-white text-2xl md:text-3xl font-bold mb-3 md:mb-4 drop-shadow-md">
                      {banner.title}
                    </h4>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = banner.link;
                        }}
                        className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/30 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-all font-semibold text-sm md:text-base group-hover/card:scale-105"
                      >
                        Alışverişe Başla
                        <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
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
