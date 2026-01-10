import { Router, type Request, type Response } from 'express'
import { dataStore } from '../store/dataStore.js'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  try {
    const seoSettings = dataStore.seo.get()
    res.json({ success: true, data: seoSettings })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.put('/', (req: Request, res: Response) => {
  try {
    const seoSettings = dataStore.seo.update(req.body)
    res.json({ success: true, data: seoSettings })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.post('/reset', (req: Request, res: Response) => {
  try {
    const seoSettings = dataStore.seo.reset()
    res.json({ success: true, data: seoSettings })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

export default router
