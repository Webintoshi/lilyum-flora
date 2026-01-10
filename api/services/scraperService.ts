import axios, { type AxiosRequestConfig } from 'axios'
import * as cheerio from 'cheerio'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { URL } from 'url'
import { type Product } from '../types/index.js'
import { dataStore } from '../store/dataStore.js'

export interface ScrapedProduct {
  name: string
  price: number
  description?: string
  image: string
  imageLocal?: string
  sourceUrl: string
  slug?: string
}

export interface AnalyzeResult {
  success: boolean
  url: string
  robotsTxtAllowed: boolean
  products: ScrapedProduct[]
  productCount: number
  detectedSelectors: {
    productContainer?: string
    productName?: string
    productPrice?: string
    productImage?: string
    productLink?: string
  }
  pagination?: {
    hasPagination: boolean
    nextPageSelector?: string
    totalPages?: number
  }
  errors: string[]
}

export interface ScrapingOptions {
  targetCategoryId: number
  priceMultiplier?: number
  currencyMultiplier?: number
  chunkSize?: number
  delay?: number
}

export interface ScrapingProgress {
  total: number
  processed: number
  success: number
  failed: number
  currentProduct?: string
}

class ScraperService {
  private readonly USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  ]

  private getRandomUserAgent(): string {
    return this.USER_AGENTS[Math.floor(Math.random() * this.USER_AGENTS.length)]
  }

  private createAxiosConfig(url: string): AxiosRequestConfig {
    const parsedUrl = new URL(url)
    return {
      headers: {
        'User-Agent': this.getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': `${parsedUrl.protocol}//${parsedUrl.host}/`,
      },
      timeout: 30000,
      responseType: 'text',
      decompress: true,
    }
  }

  private async checkRobotsTxt(url: string): Promise<{ allowed: boolean; message: string }> {
    try {
      const parsedUrl = new URL(url)
      const robotsUrl = `${parsedUrl.protocol}//${parsedUrl.host}/robots.txt`
      
      const response = await axios.get(robotsUrl, {
        ...this.createAxiosConfig(robotsUrl),
        timeout: 10000,
      })
      
      const content = response.data
      const lines = content.split('\n')
      
      for (const line of lines) {
        if (line.toLowerCase().startsWith('user-agent: *') || line.toLowerCase().startsWith('user-agent:*')) {
          for (let i = lines.indexOf(line) + 1; i < lines.length; i++) {
            const nextLine = lines[i].trim().toLowerCase()
            if (nextLine.startsWith('user-agent')) break
            if (nextLine.startsWith('disallow:')) {
              const disallowPath = nextLine.split(':')[1].trim()
              if (parsedUrl.pathname.startsWith(disallowPath) || disallowPath === '/') {
                return { allowed: false, message: `robots.txt bu yola scraping izni vermiyor: ${disallowPath}` }
              }
            }
          }
        }
      }
      
      return { allowed: true, message: 'robots.txt scraping\'e izin veriyor veya kısıtlama yok' }
    } catch (error) {
      return { allowed: true, message: 'robots.txt bulunamadı veya okunamadı, devam ediliyor' }
    }
  }

  private parsePrice(priceText: string): { price: number; currency?: string } {
    let cleaned = priceText.trim()
    
    const currencySymbols = ['₺', 'TL', '$', '€', '£']
    let currency: string | undefined
    
    for (const symbol of currencySymbols) {
      if (cleaned.includes(symbol)) {
        currency = symbol
        cleaned = cleaned.replace(new RegExp(`\\${symbol}`, 'g'), '')
        break
      }
    }
    
    cleaned = cleaned.replace(/[.,]/g, (match, offset) => {
      const before = cleaned.substring(0, offset)
      const after = cleaned.substring(offset + 1)
      const thousandsSeparators = (before.match(/[.,]/g) || []).length
      const decimalSeparators = (after.match(/[.,]/g) || []).length
      
      if (thousandsSeparators >= 1 && decimalSeparators >= 1) {
        return match === ',' ? '.' : ''
      }
      
      if (match === ',' && after.length <= 2) {
        return '.'
      }
      
      if (match === '.' && after.length <= 2) {
        return match
      }
      
      if (match === ',') {
        return ''
      }
      
      return match
    })
    
    cleaned = cleaned.replace(/[^0-9.]/g, '')
    const price = parseFloat(cleaned) || 0
    
    return { price, currency }
  }

  private detectProductStructure($: cheerio.CheerioAPI): {
    selectors: AnalyzeResult['detectedSelectors']
    products: ScrapedProduct[]
  } {
    const productContainerSelectors = [
      '.product-item',
      '.product',
      '.product-card',
      '.item',
      '.product-wrapper',
      '[class*="product"]',
      '[data-product]',
      'article.product',
    ]

    const productNameSelectors = [
      '.title',
      '.name',
      '.product-title',
      '.product-name',
      'h2',
      'h3',
      '[class*="title"]',
      '[class*="name"]',
    ]

    const productPriceSelectors = [
      '.price',
      '.product-price',
      '.amount',
      '.price-current',
      '[class*="price"]',
      '[data-price]',
    ]

    const productImageSelectors = [
      '.image img',
      '.product-image img',
      '.product-image',
      '.product-image img',
      'img[class*="product"]',
      'img[class*="image"]',
      'img',
    ]

    const productLinkSelectors = [
      'a',
      '[href]',
    ]

    let bestSelectors: AnalyzeResult['detectedSelectors'] = {}
    let maxProductCount = 0
    let bestProducts: ScrapedProduct[] = []

    for (const containerSelector of productContainerSelectors) {
      const $products = $(containerSelector)
      
      if ($products.length < 2) continue

      const testProduct = $products.first()
      
      const productName = testProduct.find(productNameSelectors.join(', ')).first().text().trim()
      const productPrice = testProduct.find(productPriceSelectors.join(', ')).first().text().trim()
      const productImage = testProduct.find(productImageSelectors.join(', ')).first()
      const productLink = testProduct.find(productLinkSelectors.join(', ')).first()

      const { price } = this.parsePrice(productPrice)
      const imageSrc = productImage.attr('src') || 
                        productImage.attr('data-src') || 
                        productImage.attr('data-lazy') || 
                        productImage.attr('data-original') || ''

      if (productName && price > 0 && imageSrc) {
        const selectors: AnalyzeResult['detectedSelectors'] = {
          productContainer: containerSelector,
          productName: productNameSelectors.join(', '),
          productPrice: productPriceSelectors.join(', '),
          productImage: productImageSelectors.join(', '),
          productLink: productLinkSelectors.join(', '),
        }

        if ($products.length > maxProductCount) {
          maxProductCount = $products.length
          bestSelectors = selectors
          bestProducts = this.extractProducts($, selectors, $('body').attr('base-url') || '')
        }
      }
    }

    return { selectors: bestSelectors, products: bestProducts }
  }

  private extractProducts(
    $: cheerio.CheerioAPI,
    selectors: AnalyzeResult['detectedSelectors'],
    baseUrl: string
  ): ScrapedProduct[] {
    const products: ScrapedProduct[] = []
    const $products = $(selectors.productContainer || '.product')

    $products.each((_, element) => {
      const $product = $(element)
      
      const name = $product.find(selectors.productName || '.title, .name').first().text().trim()
      const priceText = $product.find(selectors.productPrice || '.price').first().text().trim()
      const $image = $product.find(selectors.productImage || 'img').first()
      const link = $product.find(selectors.productLink || 'a').first().attr('href') || ''

      const { price } = this.parsePrice(priceText)
      const imageSrc = $image.attr('src') || 
                       $image.attr('data-src') || 
                       $image.attr('data-lazy') || 
                       $image.attr('data-original') || ''

      if (name && price > 0 && imageSrc) {
        const fullImageUrl = this.resolveUrl(imageSrc, baseUrl)
        const fullLinkUrl = this.resolveUrl(link, baseUrl)

        const slug = this.createSlug(name)

        products.push({
          name,
          price,
          description: '',
          image: fullImageUrl,
          sourceUrl: fullLinkUrl,
          slug,
        })
      }
    })

    return products
  }

  private resolveUrl(url: string, baseUrl: string): string {
    if (!url) return baseUrl
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    if (url.startsWith('//')) return `https:${url}`
    
    try {
      const base = new URL(baseUrl)
      return new URL(url, base.origin).href
    } catch {
      return url
    }
  }

  private detectPagination($: cheerio.CheerioAPI, baseUrl: string): AnalyzeResult['pagination'] {
    const paginationSelectors = [
      '.pagination',
      '[class*="pagination"]',
      '.pager',
      '[class*="pager"]',
    ]

    let hasPagination = false
    let nextPageSelector: string | undefined

    for (const selector of paginationSelectors) {
      const $pagination = $(selector)
      if ($pagination.length > 0) {
        hasPagination = true
        
        const $nextLink = $pagination.find('a').filter((_, el) => {
          const text = $(el).text().toLowerCase()
          return text.includes('sonraki') || 
                 text.includes('next') || 
                 $(el).attr('aria-label')?.toLowerCase().includes('next')
        })
        
        if ($nextLink.length > 0) {
          nextPageSelector = selector + ' a'
        }
        break
      }
    }

    return {
      hasPagination,
      nextPageSelector,
    }
  }

  private createSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9ğüşiçö\s-]/g, '')
      .replace(/[\s]+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100)
  }

  private async downloadImage(
    url: string,
    productId: number
  ): Promise<{ success: boolean; localPath?: string; error?: string }> {
    try {
      const config = this.createAxiosConfig(url)
      const response = await axios.get(url, {
        ...config,
        responseType: 'arraybuffer',
      })

      const contentType = response.headers['content-type']
      if (!contentType?.startsWith('image/')) {
        return { success: false, error: 'Görsel değil' }
      }

      const buffer = response.data
      const maxSize = 10 * 1024 * 1024
      if (buffer.length > maxSize) {
        return { success: false, error: 'Görsel çok büyük' }
      }

      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      const filename = `product-${productId}-${Date.now()}.webp`
      const localPath = `/uploads/products/${filename}`
      const fullPath = path.join(process.cwd(), 'public', localPath)

      await sharp(buffer)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(fullPath)

      return { success: true, localPath }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
      return { success: false, error: message }
    }
  }

  private async checkDuplicate(slug: string): Promise<boolean> {
    const existingProduct = dataStore.products.getAll().find(p => p.slug === slug)
    return !!existingProduct
  }

  private async makeSlugUnique(slug: string): Promise<string> {
    let uniqueSlug = slug
    let counter = 1

    while (await this.checkDuplicate(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    return uniqueSlug
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async analyzeUrl(url: string): Promise<AnalyzeResult> {
    const errors: string[] = []

    try {
      const robotsCheck = await this.checkRobotsTxt(url)
      if (!robotsCheck.allowed) {
        errors.push(robotsCheck.message)
      }

      const config = this.createAxiosConfig(url)
      const response = await axios.get(url, config)

      const $ = cheerio.load(response.data, { xmlMode: false })
      $('body').attr('base-url', url)

      const { selectors, products } = this.detectProductStructure($)
      const pagination = this.detectPagination($, url)

      if (products.length === 0) {
        errors.push('Ürün bulunamadı. Site yapısı otomatik tespit edilemedi.')
      }

      return {
        success: products.length > 0,
        url,
        robotsTxtAllowed: robotsCheck.allowed,
        products: products.slice(0, 10),
        productCount: products.length,
        detectedSelectors: selectors,
        pagination,
        errors,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
      errors.push(`Siteye erişilemedi: ${message}`)
      
      return {
        success: false,
        url,
        robotsTxtAllowed: true,
        products: [],
        productCount: 0,
        detectedSelectors: {},
        errors,
      }
    }
  }

  async scrapeProducts(
    url: string,
    options: ScrapingOptions,
    onProgress?: (progress: ScrapingProgress) => void
  ): Promise<{ success: number; failed: number; products: Product[] }> {
    const {
      targetCategoryId,
      priceMultiplier = 1,
      currencyMultiplier = 1,
      chunkSize = 10,
      delay = 1000,
    } = options

    const config = this.createAxiosConfig(url)
    const response = await axios.get(url, config)

    const $ = cheerio.load(response.data)
    $('body').attr('base-url', url)

    const { selectors, products: allProducts } = this.detectProductStructure($)

    const progress: ScrapingProgress = {
      total: allProducts.length,
      processed: 0,
      success: 0,
      failed: 0,
    }

    const successfulProducts: Product[] = []

    for (let i = 0; i < allProducts.length; i++) {
      const scrapedProduct = allProducts[i]
      progress.currentProduct = scrapedProduct.name

      try {
        let uniqueSlug = scrapedProduct.slug || this.createSlug(scrapedProduct.name)
        uniqueSlug = await this.makeSlugUnique(uniqueSlug)

        const newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
          name: scrapedProduct.name,
          description: scrapedProduct.description || scrapedProduct.name,
          price: Math.round(scrapedProduct.price * priceMultiplier * currencyMultiplier),
          image: scrapedProduct.image,
          category: dataStore.categories.getById(targetCategoryId)?.name || 'Diğer',
          categoryId: targetCategoryId,
          slug: uniqueSlug,
          stock: 10,
          rating: 4.5,
          reviews: 0,
          isActive: true,
          featured: false,
        }

        const createdProduct = dataStore.products.create(newProduct)

        if (createdProduct) {
          const imageResult = await this.downloadImage(scrapedProduct.image, createdProduct.id)
          
          if (imageResult.success && imageResult.localPath) {
            const updatedProduct = dataStore.products.update(createdProduct.id, {
              image: imageResult.localPath,
            })
            if (updatedProduct) {
              successfulProducts.push(updatedProduct)
            }
          } else {
            successfulProducts.push(createdProduct)
          }

          progress.success++
        } else {
          progress.failed++
        }
      } catch (error) {
        console.error(`Ürün eklenirken hata: ${scrapedProduct.name}`, error)
        progress.failed++
      }

      progress.processed++

      if (onProgress) {
        onProgress({ ...progress })
      }

      if ((i + 1) % chunkSize === 0) {
        await this.delay(delay)
      }
    }

    return {
      success: progress.success,
      failed: progress.failed,
      products: successfulProducts,
    }
  }
}

export const scraperService = new ScraperService()
