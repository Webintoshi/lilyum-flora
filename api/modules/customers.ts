import { Router, type Request, type Response } from 'express'
import { supabase } from '../config/supabase.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, status, sort, page = '1', limit = '20' } = req.query

    let query = supabase
      .from('customers')
      .select('*')

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    if (status === 'active') {
      query = query.eq('is_active', true)
    } else if (status === 'inactive') {
      query = query.eq('is_active', false)
    }

    if (sort === 'spent-desc') {
      query = query.order('total_spent', { ascending: false })
    } else if (sort === 'spent-asc') {
      query = query.order('total_spent', { ascending: true })
    } else if (sort === 'orders-desc') {
      query = query.order('order_count', { ascending: false })
    } else if (sort === 'newest') {
      query = query.order('created_at', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const pageNum = parseInt(String(page))
    const limitNum = parseInt(String(limit))
    const from = (pageNum - 1) * limitNum
    const to = from + limitNum - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error('Customers fetch error:', error)
      return res.status(500).json({ success: false, error: 'Failed to fetch customers' })
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
    console.error('Customers server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', Number(req.params.id))
      .single()

    if (error) {
      return res.status(404).json({ success: false, error: 'Customer not found' })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Customer fetch error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert(req.body)
      .select()
      .single()

    if (error) {
      console.error('Customer create error:', error)
      return res.status(500).json({ success: false, error: 'Failed to create customer' })
    }

    res.status(201).json({ success: true, data })
  } catch (error) {
    console.error('Customer create server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update({
        ...req.body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', Number(req.params.id))
      .select()
      .single()

    if (error) {
      console.error('Customer update error:', error)
      return res.status(404).json({ success: false, error: 'Customer not found' })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Customer update server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', Number(req.params.id))

    if (error) {
      console.error('Customer delete error:', error)
      return res.status(404).json({ success: false, error: 'Customer not found' })
    }

    res.json({ success: true, message: 'Customer deleted' })
  } catch (error) {
    console.error('Customer delete server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

export default router
