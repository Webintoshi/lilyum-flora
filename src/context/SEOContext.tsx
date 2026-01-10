import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useAdminStore } from '@/store/adminStore'
import type { SEOSettings } from '@/types'

interface SEOContextType {
  seoSettings: SEOSettings | null
}

const SEOContext = createContext<SEOContextType | undefined>(undefined)

interface SEOProviderProps {
  children: ReactNode
}

export function SEOProvider({ children }: SEOProviderProps) {
  const seoSettings = useAdminStore((state) => state.seoSettings)

  useEffect(() => {
    if (seoSettings) {
      updateMetaTags(seoSettings)
      injectTrackingScripts(seoSettings)
    }
  }, [seoSettings])

  return (
    <SEOContext.Provider value={{ seoSettings }}>
      {children}
    </SEOContext.Provider>
  )
}

export function useSEO() {
  const context = useContext(SEOContext)
  if (context === undefined) {
    throw new Error('useSEO must be used within a SEOProvider')
  }
  return context
}

function updateMetaTags(settings: SEOSettings) {
  document.title = settings.siteTitle || 'Lilyum Flora'

  const description = document.querySelector('meta[name="description"]')
  if (description) {
    description.setAttribute('content', settings.siteDescription || '')
  } else {
    const meta = document.createElement('meta')
    meta.name = 'description'
    meta.content = settings.siteDescription || ''
    document.head.appendChild(meta)
  }

  const keywords = document.querySelector('meta[name="keywords"]')
  if (keywords) {
    keywords.setAttribute('content', settings.keywords || '')
  } else {
    const meta = document.createElement('meta')
    meta.name = 'keywords'
    meta.content = settings.keywords || ''
    document.head.appendChild(meta)
  }

  if (settings.faviconUrl) {
    const favicon = document.querySelector('link[rel="icon"]')
    if (favicon) {
      favicon.setAttribute('href', settings.faviconUrl)
    } else {
      const link = document.createElement('link')
      link.rel = 'icon'
      link.href = settings.faviconUrl
      document.head.appendChild(link)
    }
  }

  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) {
    ogTitle.setAttribute('content', settings.ogTitle || settings.siteTitle || '')
  } else {
    const meta = document.createElement('meta')
    meta.setAttribute('property', 'og:title')
    meta.content = settings.ogTitle || settings.siteTitle || ''
    document.head.appendChild(meta)
  }

  const ogDescription = document.querySelector('meta[property="og:description"]')
  if (ogDescription) {
    ogDescription.setAttribute('content', settings.ogDescription || settings.siteDescription || '')
  } else {
    const meta = document.createElement('meta')
    meta.setAttribute('property', 'og:description')
    meta.content = settings.ogDescription || settings.siteDescription || ''
    document.head.appendChild(meta)
  }

  if (settings.ogImage) {
    const ogImage = document.querySelector('meta[property="og:image"]')
    if (ogImage) {
      ogImage.setAttribute('content', settings.ogImage)
    } else {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:image')
      meta.content = settings.ogImage
      document.head.appendChild(meta)
    }
  }

  const ogUrl = document.querySelector('meta[property="og:url"]')
  if (ogUrl) {
    ogUrl.setAttribute('content', window.location.href)
  } else {
    const meta = document.createElement('meta')
    meta.setAttribute('property', 'og:url')
    meta.content = window.location.href
    document.head.appendChild(meta)
  }

  const ogType = document.querySelector('meta[property="og:type"]')
  if (ogType) {
    ogType.setAttribute('content', 'website')
  } else {
    const meta = document.createElement('meta')
    meta.setAttribute('property', 'og:type')
    meta.content = 'website'
    document.head.appendChild(meta)
  }

  const twitterCard = document.querySelector('meta[name="twitter:card"]')
  if (twitterCard) {
    twitterCard.setAttribute('content', settings.twitterCardType || 'summary_large_image')
  } else {
    const meta = document.createElement('meta')
    meta.name = 'twitter:card'
    meta.content = settings.twitterCardType || 'summary_large_image'
    document.head.appendChild(meta)
  }

  const twitterTitle = document.querySelector('meta[name="twitter:title"]')
  if (twitterTitle) {
    twitterTitle.setAttribute('content', settings.twitterTitle || settings.ogTitle || settings.siteTitle || '')
  } else {
    const meta = document.createElement('meta')
    meta.name = 'twitter:title'
    meta.content = settings.twitterTitle || settings.ogTitle || settings.siteTitle || ''
    document.head.appendChild(meta)
  }

  const twitterDescription = document.querySelector('meta[name="twitter:description"]')
  if (twitterDescription) {
    twitterDescription.setAttribute('content', settings.twitterDescription || settings.ogDescription || settings.siteDescription || '')
  } else {
    const meta = document.createElement('meta')
    meta.name = 'twitter:description'
    meta.content = settings.twitterDescription || settings.ogDescription || settings.siteDescription || ''
    document.head.appendChild(meta)
  }

  if (settings.twitterImage || settings.ogImage) {
    const twitterImage = document.querySelector('meta[name="twitter:image"]')
    if (twitterImage) {
      twitterImage.setAttribute('content', settings.twitterImage || settings.ogImage || '')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'twitter:image'
      meta.content = settings.twitterImage || settings.ogImage || ''
      document.head.appendChild(meta)
    }
  }

  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    canonical.setAttribute('href', `${settings.canonicalUrlPattern}${window.location.pathname}`)
  } else if (settings.canonicalUrlPattern) {
    const link = document.createElement('link')
    link.rel = 'canonical'
    link.href = `${settings.canonicalUrlPattern}${window.location.pathname}`
    document.head.appendChild(link)
  }
}

function injectTrackingScripts(settings: SEOSettings) {
  if (settings.gtmId) {
    injectGTM(settings.gtmId)
  }

  if (settings.gaId) {
    injectGA(settings.gaId)
  }

  if (settings.metaPixelId) {
    injectMetaPixel(settings.metaPixelId)
  }

  if (settings.hotjarId) {
    injectHotjar(settings.hotjarId)
  }

  if (settings.yandexMetricaId) {
    injectYandexMetrica(settings.yandexMetricaId)
  }

  if (settings.customHeadScripts) {
    injectCustomHeadScripts(settings.customHeadScripts)
  }

  if (settings.customBodyScripts) {
    injectCustomBodyScripts(settings.customBodyScripts)
  }
}

function injectGTM(gtmId: string) {
  const existingScript = document.querySelector(`script[src*="${gtmId}"]`)
  if (existingScript) return

  const script = document.createElement('script')
  script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `
  document.head.appendChild(script)

  const noscript = document.createElement('noscript')
  noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>`
  document.body.appendChild(noscript)
}

function injectGA(gaId: string) {
  const existingScript = document.querySelector(`script[src*="${gaId}"]`)
  if (existingScript) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(script)

  const configScript = document.createElement('script')
  configScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}');
  `
  document.head.appendChild(configScript)
}

function injectMetaPixel(pixelId: string) {
  const existingScript = document.querySelector(`script[data-pixel-id="${pixelId}"]`)
  if (existingScript) return

  const script = document.createElement('script')
  script.setAttribute('data-pixel-id', pixelId)
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}'); 
    fbq('track', 'PageView');
  `
  document.head.appendChild(script)

  const noscript = document.createElement('noscript')
  noscript.innerHTML = `<img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/>`
  document.body.appendChild(noscript)
}

function injectHotjar(hotjarId: string) {
  const existingScript = document.querySelector(`script[src*="${hotjarId}"]`)
  if (existingScript) return

  const script = document.createElement('script')
  script.innerHTML = `
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${hotjarId},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  `
  document.head.appendChild(script)
}

function injectYandexMetrica(yandexId: string) {
  const existingScript = document.querySelector(`script[src*="${yandexId}"]`)
  if (existingScript) return

  const script = document.createElement('script')
  script.innerHTML = `
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(${yandexId}, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
    });
  `
  document.head.appendChild(script)
}

function injectCustomHeadScripts(scripts: string) {
  const container = document.getElementById('custom-head-scripts')
  if (container) {
    container.innerHTML = scripts
  } else {
    const div = document.createElement('div')
    div.id = 'custom-head-scripts'
    div.style.display = 'none'
    div.innerHTML = scripts
    document.head.appendChild(div)
  }
}

function injectCustomBodyScripts(scripts: string) {
  const container = document.getElementById('custom-body-scripts')
  if (container) {
    container.innerHTML = scripts
  } else {
    const div = document.createElement('div')
    div.id = 'custom-body-scripts'
    div.style.display = 'none'
    div.innerHTML = scripts
    document.body.appendChild(div)
  }
}
