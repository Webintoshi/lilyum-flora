import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderNumber = searchParams.get('order');

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl w-full space-y-8">

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Top Success Banner */}
            <div className="bg-primary-600 p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-white/20 backdrop-blur-md mb-4 shadow-lg">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Siparişiniz Alındı!
              </h1>
              <p className="text-primary-100 text-lg">
                Bizi tercih ettiğiniz için teşekkür ederiz.
              </p>
            </div>

            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <p className="text-gray-500 mb-2">Sipariş Numaranız</p>
                <div className="inline-block bg-gray-100 rounded-lg px-6 py-3 border border-gray-200 border-dashed">
                  <span className="text-2xl font-mono font-bold text-gray-800 tracking-wider select-all">
                    {orderNumber || '#------'}
                  </span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-8 text-center">
                <h3 className="text-green-800 font-bold mb-2">Teslimat Bilgilendirmesi</h3>
                <p className="text-green-700 text-sm">
                  Siparişiniz ekibimiz tarafından en taze çiçeklerle hazırlanıp, seçtiğiniz zaman diliminde teslim edilecektir.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/catalog')}
                  className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 md:text-lg md:px-10 transition-all shadow-lg shadow-primary-600/30"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Alışverişe Devam Et
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center px-8 py-4 border-2 border-gray-100 text-base font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-200 md:text-lg md:px-10 transition-all"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Ana Sayfa
                </button>
              </div>
            </div>

            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <p>Sipariş durumu hakkında SMS ve E-posta ile bilgilendirileceksiniz.</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}