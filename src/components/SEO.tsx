import { Helmet } from 'react-helmet-async'
import { useAdminStore } from '@/store/adminStore'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

interface SEOProps {
    title?: string
    description?: string
    keywords?: string
    image?: string
    canonical?: string
    type?: 'website' | 'article' | 'product'
    schema?: Record<string, any>
}

export default function SEO({
    title,
    description,
    keywords,
    image,
    canonical,
    type = 'website',
    schema
}: SEOProps) {
    const { seoSettings } = useAdminStore()
    const location = useLocation()

    // Base URL calculation (fallback to window.location.origin)
    // Remove trailing slash if present to avoid double slashes
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://lilyumflora.net'
    const settingsBase = seoSettings?.canonicalUrlPattern || origin
    const baseUrl = settingsBase.endsWith('/') ? settingsBase.slice(0, -1) : settingsBase

    // Computed values with fallbacks to global settings
    const siteTitle = seoSettings?.siteTitle || 'Lilyum Flora'
    const fullTitle = title
        ? `${title} | ${siteTitle}`
        : siteTitle

    const metaDescription = description || seoSettings?.siteDescription || ''
    const metaKeywords = keywords || seoSettings?.keywords || ''

    const ogImage = image
        ? (image.startsWith('http') ? image : `${baseUrl}${image}`)
        : (seoSettings?.ogImage || `${baseUrl}/logo.png`)

    // Canonical calculation
    let canonicalUrl = canonical

    // If canonical is not provided, default to current path
    if (!canonicalUrl) {
        canonicalUrl = location.pathname
    }

    // If it's a relative path (starts with /), prepend base URL
    if (canonicalUrl.startsWith('/')) {
        canonicalUrl = `${baseUrl}${canonicalUrl}`
    }
    // If it doesn't start with http (and not /), assume it's a clean relative path needing a slash or a full url issue
    // We assume explicit props are either full http(s) or start with /
    // For safety, if it doesn't start with http, ensure we make it absolute
    else if (!canonicalUrl.startsWith('http')) {
        canonicalUrl = `${baseUrl}/${canonicalUrl}`
    }

    // JSON-LD Schema Generation
    const jsonLd = schema ? JSON.stringify(schema) : null

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title || seoSettings?.ogTitle || siteTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content={seoSettings?.twitterCardType || 'summary_large_image'} />
            <meta name="twitter:title" content={title || seoSettings?.twitterTitle || siteTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={ogImage} />
            {seoSettings?.twitterHandle && (
                <meta name="twitter:site" content={seoSettings.twitterHandle} />
            )}

            {/* Favicon */}
            {seoSettings?.faviconUrl && (
                <link rel="icon" href={seoSettings.faviconUrl} />
            )}

            {/* Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {jsonLd}
                </script>
            )}
        </Helmet>
    )
}
