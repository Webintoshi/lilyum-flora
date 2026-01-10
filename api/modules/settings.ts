import { Router, type Request, type Response } from 'express'
import { dataStore } from '../store/dataStore.js'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  try {
    const settings = dataStore.settings.get()
    res.json({ success: true, data: settings })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.put('/', (req: Request, res: Response) => {
  try {
    const settings = dataStore.settings.update(req.body)
    res.json({ success: true, data: settings })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.post('/upload-logo', async (req: Request, res: Response) => {
  try {
    const logoUrl = req.body.logo
    const settings = dataStore.settings.update({ logo: logoUrl })
    res.json({ success: true, data: settings })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

export default router
