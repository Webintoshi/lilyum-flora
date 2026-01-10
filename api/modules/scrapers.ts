import { Router, type Request, type Response } from 'express'
import { scraperService } from '../services/scraperService.js'
import { dataStore } from '../store/dataStore.js'

const router = Router()

router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { url } = req.body

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'Geçersiz URL' })
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return res.status(400).json({ success: false, error: 'URL http:// veya https:// ile başlamalı' })
    }

    const result = await scraperService.analyzeUrl(url)

    res.json({
      success: result.success,
      data: result,
    })
  } catch (error) {
    console.error('Scraper analyze error:', error)
    res.status(500).json({ success: false, error: 'Analiz sırasında hata oluştu' })
  }
})

router.post('/extract', async (req: Request, res: Response) => {
  try {
    const { url, targetCategoryId, priceMultiplier, currencyMultiplier } = req.body

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'Geçersiz URL' })
    }

    if (!targetCategoryId || typeof targetCategoryId !== 'number') {
      return res.status(400).json({ success: false, error: 'Geçersiz kategori ID' })
    }

    const category = dataStore.categories.getById(targetCategoryId)
    if (!category) {
      return res.status(400).json({ success: false, error: 'Kategori bulunamadı' })
    }

    const result = await scraperService.scrapeProducts(
      url,
      {
        targetCategoryId,
        priceMultiplier: priceMultiplier || 1,
        currencyMultiplier: currencyMultiplier || 1,
      }
    )

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Scraper extract error:', error)
    res.status(500).json({ success: false, error: 'Ürün çekerken hata oluştu' })
  }
})

router.get('/categories', (req: Request, res: Response) => {
  try {
    const categories = dataStore.categories.getAll().filter(c => c.isActive)

    res.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Categories fetch error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.get('/history', (req: Request, res: Response) => {
  try {
    const products = dataStore.products.getAll().filter(p => p.slug?.includes('-'))

    res.json({
      success: true,
      data: {
        total: products.length,
        products: products.slice(-10),
      },
    })
  } catch (error) {
    console.error('History fetch error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

export default router
