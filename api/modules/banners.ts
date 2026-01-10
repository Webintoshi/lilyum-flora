import { Router, type Request, type Response } from 'express'
import { supabase } from '../config/supabase.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const { status } = req.query

    let query = supabase
      .from('size_banners')
      .select('*')
      .order('order_index', { ascending: true })

    if (status === 'active') {
      query = query.eq('is_active', true)
    } else if (status === 'inactive') {
      query = query.eq('is_active', false)
    }

    const { data, error } = await query

    if (error) {
      console.error('Size banners fetch error:', error)
      return res.status(500).json({ success: false, error: 'Failed to fetch size banners' })
    }

    res.json({ success: true, data: data || [] })
  } catch (error) {
    console.error('Size banners server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('size_banners')
      .select('*')
      .eq('id', Number(req.params.id))
      .single()

    if (error) {
      return res.status(404).json({ success: false, error: 'Banner not found' })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Size banner fetch error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('size_banners')
      .insert(req.body)
      .select()
      .single()

    if (error) {
      console.error('Size banner create error:', error)
      return res.status(500).json({ success: false, error: 'Failed to create size banner' })
    }

    res.status(201).json({ success: true, data })
  } catch (error) {
    console.error('Size banner create server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('size_banners')
      .update({
        ...req.body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', Number(req.params.id))
      .select()
      .single()

    if (error) {
      console.error('Size banner update error:', error)
      return res.status(404).json({ success: false, error: 'Banner not found' })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Size banner update server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('size_banners')
      .delete()
      .eq('id', Number(req.params.id))

    if (error) {
      console.error('Size banner delete error:', error)
      return res.status(404).json({ success: false, error: 'Banner not found' })
    }

    res.json({ success: true, message: 'Banner deleted' })
  } catch (error) {
    console.error('Size banner delete server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.post('/reorder', async (req: Request, res: Response) => {
  try {
    const { ids } = req.body

    if (!Array.isArray(ids)) {
      return res.status(400).json({ success: false, error: 'IDs must be an array' })
    }

    const updatePromises = ids.map((id: number, index: number) =>
      supabase
        .from('size_banners')
        .update({ order_index: index, updated_at: new Date().toISOString() })
        .eq('id', id)
    )

    await Promise.all(updatePromises)

    const { data, error } = await supabase
      .from('size_banners')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Size banners reorder error:', error)
      return res.status(500).json({ success: false, error: 'Failed to reorder size banners' })
    }

    res.json({ success: true, data: data || [] })
  } catch (error) {
    console.error('Size banners reorder server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

export default router
