import { Router, type Request, type Response } from 'express'
import { supabase } from '../config/supabase.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, search, startDate, endDate, page = '1', limit = '20' } = req.query

    let query = supabase
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

    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`customers.name.ilike.%${search}%,customers.email.ilike.%${search}%`)
    }

    if (startDate) {
      query = query.gte('created_at', String(startDate))
    }

    if (endDate) {
      query = query.lte('created_at', String(endDate))
    }

    const pageNum = parseInt(String(page))
    const limitNum = parseInt(String(limit))
    const from = (pageNum - 1) * limitNum
    const to = from + limitNum - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error('Orders fetch error:', error)
      return res.status(500).json({ success: false, error: 'Failed to fetch orders' })
    }

    res.json({
      success: true,
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    })
  } catch (error) {
    console.error('Orders server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customers (
          id,
          name,
          email,
          phone
        )
      `)
      .eq('id', Number(req.params.id))
      .single()

    if (error) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Order fetch error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert(req.body)
      .select()
      .single()

    if (error) {
      console.error('Order create error:', error)
      return res.status(500).json({ success: false, error: 'Failed to create order' })
    }

    res.status(201).json({ success: true, data })
  } catch (error) {
    console.error('Order create server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body

    if (!status || !['pending', 'preparing', 'shipped', 'delivered', 'cancelled', 'returned'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' })
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', Number(req.params.id))
      .select()
      .single()

    if (error) {
      console.error('Order status update error:', error)
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Order status update server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.patch('/:id/tracking', async (req: Request, res: Response) => {
  try {
    const { tracking_number } = req.body

    if (!tracking_number || typeof tracking_number !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid tracking number' })
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ tracking_number, updated_at: new Date().toISOString() })
      .eq('id', Number(req.params.id))
      .select()
      .single()

    if (error) {
      console.error('Order tracking update error:', error)
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Order tracking update server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', Number(req.params.id))

    if (error) {
      console.error('Order delete error:', error)
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    res.json({ success: true, message: 'Order deleted' })
  } catch (error) {
    console.error('Order delete server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

export default router
