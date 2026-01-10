import { Router, type Request, type Response } from 'express'
import { supabase } from '../config/supabase.js'

const router = Router()

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [productsResult, ordersResult, customersResult, revenueResult] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('total', { count: 'exact', head: true }),
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('total').eq('status', 'delivered'),
    ])

    const totalRevenue = revenueResult.data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

    const stats = {
      totalProducts: productsResult.count || 0,
      totalOrders: ordersResult.count || 0,
      totalCustomers: customersResult.count || 0,
      totalRevenue,
    }

    res.json({ success: true, data: stats })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.get('/sales', async (req: Request, res: Response) => {
  try {
    const { days = '7' } = req.query
    const daysNum = Number(days)

    const { data, error } = await supabase
      .from('orders')
      .select('total, created_at')
      .gte('created_at', new Date(Date.now() - daysNum * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Dashboard sales error:', error)
      return res.status(500).json({ success: false, error: 'Failed to fetch sales data' })
    }

    const salesData = data?.map((order) => ({
      date: order.created_at,
      amount: order.total,
    })) || []

    res.json({ success: true, data: salesData })
  } catch (error) {
    console.error('Dashboard sales server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.get('/recent-orders', async (req: Request, res: Response) => {
  try {
    const { limit = '5' } = req.query
    const limitNum = Math.min(Number(limit), 50)

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customers (
          id,
          name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limitNum)

    if (error) {
      console.error('Dashboard recent orders error:', error)
      return res.status(500).json({ success: false, error: 'Failed to fetch recent orders' })
    }

    res.json({ success: true, data: data || [] })
  } catch (error) {
    console.error('Dashboard recent orders server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.get('/low-stock', async (req: Request, res: Response) => {
  try {
    const { threshold = '10' } = req.query
    const thresholdNum = Number(threshold)

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .lte('stock', thresholdNum)
      .eq('is_active', true)
      .order('stock', { ascending: true })

    if (error) {
      console.error('Dashboard low stock error:', error)
      return res.status(500).json({ success: false, error: 'Failed to fetch low stock products' })
    }

    res.json({ success: true, data: data || [] })
  } catch (error) {
    console.error('Dashboard low stock server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

export default router
