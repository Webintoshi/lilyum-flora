import { Router, type Request, type Response } from 'express'
import { supabase } from '../config/supabase.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, status, search, minPrice, maxPrice, sort, page = '1', limit = '20' } = req.query

    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          icon
        )
      `)

    if (category) {
      query = query.eq('category_id', Number(category))
    }

    if (status === 'active') {
      query = query.eq('is_active', true)
    } else if (status === 'inactive') {
      query = query.eq('is_active', false)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (minPrice) {
      query = query.gte('price', Number(minPrice))
    }

    if (maxPrice) {
      query = query.lte('price', Number(maxPrice))
    }

    const pageNum = parseInt(String(page))
    const limitNum = parseInt(String(limit))
    const from = (pageNum - 1) * limitNum
    const to = from + limitNum - 1

    if (sort === 'price-asc') {
      query = query.order('price', { ascending: true })
    } else if (sort === 'price-desc') {
      query = query.order('price', { ascending: false })
    } else if (sort === 'rating') {
      query = query.order('rating', { ascending: false })
    } else if (sort === 'newest') {
      query = query.order('created_at', { ascending: false })
    } else if (sort === 'bestseller') {
      query = query.order('reviews', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error('Products fetch error:', error)
      return res.status(500).json({ success: false, error: 'Failed to fetch products' })
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
    console.error('Products server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          icon
        )
      `)
      .eq('id', Number(req.params.id))
      .single()

    if (error) {
      return res.status(404).json({ success: false, error: 'Product not found' })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Product fetch error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(req.body)
      .select()
      .single()

    if (error) {
      console.error('Product create error:', error)
      return res.status(500).json({ success: false, error: 'Failed to create product' })
    }

    res.status(201).json({ success: true, data })
  } catch (error) {
    console.error('Product create server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...req.body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', Number(req.params.id))
      .select()
      .single()

    if (error) {
      console.error('Product update error:', error)
      return res.status(404).json({ success: false, error: 'Product not found' })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Product update server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', Number(req.params.id))

    if (error) {
      console.error('Product delete error:', error)
      return res.status(404).json({ success: false, error: 'Product not found' })
    }

    res.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    console.error('Product delete server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.patch('/:id/stock', async (req: Request, res: Response) => {
  try {
    const { stock } = req.body

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ success: false, error: 'Invalid stock value' })
    }

    const { data, error } = await supabase
      .from('products')
      .update({ stock, updated_at: new Date().toISOString() })
      .eq('id', Number(req.params.id))
      .select()
      .single()

    if (error) {
      console.error('Product stock update error:', error)
      return res.status(404).json({ success: false, error: 'Product not found' })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Product stock update server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

export default router
