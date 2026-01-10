import { Router, type Request, type Response } from 'express'
import { supabase } from '../config/supabase.js'
import rateLimit from 'express-rate-limit'

const router = Router()

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  next()
})

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'webintoshi@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '06122021Kam.'

router.post('/login', loginRateLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    console.log('[DEBUG] ADMIN_EMAIL env:', process.env.ADMIN_EMAIL)
    console.log('[DEBUG] ADMIN_PASSWORD env:', process.env.ADMIN_PASSWORD ? '***' : 'undefined')
    console.log('[DEBUG] ADMIN_EMAIL const:', ADMIN_EMAIL)
    console.log('[DEBUG] ADMIN_PASSWORD const:', ADMIN_PASSWORD ? '***' : 'undefined')
    console.log('[DEBUG] Received email:', email)
    console.log('[DEBUG] Received password:', password ? '***' : 'undefined')
    console.log('[DEBUG] Email match:', email === ADMIN_EMAIL)
    console.log('[DEBUG] Password match:', password === ADMIN_PASSWORD)

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'E-posta ve şifre gereklidir' })
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      console.log(`[LOGIN FAILED] Email: ${email}, IP: ${req.ip}, Time: ${new Date().toISOString()}`)
      return res.status(401).json({ success: false, error: 'Geçersiz e-posta veya şifre' })
    }

    const adminUser = {
      id: 1,
      email: ADMIN_EMAIL,
      role: 'admin',
      createdAt: '2024-01-01T00:00:00.000Z',
    }

    console.log(`[LOGIN SUCCESS] Email: ${email}, IP: ${req.ip}, Time: ${new Date().toISOString()}`)
    res.json({
      success: true,
      token: 'admin-token-' + Date.now(),
      user: adminUser,
    })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ success: false, error: 'Sunucu hatası' })
  }
})

router.post('/logout', (req: Request, res: Response) => {
  try {
    res.json({ success: true, message: 'Çıkış başarılı' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Sunucu hatası' })
  }
})

export default router
