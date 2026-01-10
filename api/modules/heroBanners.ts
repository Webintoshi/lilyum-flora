import { Router, type Request, type Response } from 'express'
import { supabase } from '../config/supabase.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const { status } = req.query

    let query = supabase
      .from('hero_banners')
      .select('*')

    if (status === 'active') {
      query = query.eq('is_active', true)
    } else if (status === 'inactive') {
      query = query.eq('is_active', false)
    }

    const { data, error } = await query

    if (error) {
      console.error('Hero banners fetch error:', error)
      return res.status(500).json({ success: false, error: 'Failed to fetch hero banners' })
    }

    res.json({ success: true, data: data || [] })
  } catch (error) {
    console.error('Hero banners server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.get('/active', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return res.json({ success: true, data: null })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Active hero banner error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .eq('id', Number(req.params.id))
      .single()

    if (error) {
      return res.status(404).json({ success: false, error: 'Hero banner not found' })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Hero banner fetch error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('hero_banners')
      .insert(req.body)
      .select()
      .single()

    if (error) {
      console.error('Hero banner create error:', error)
      return res.status(500).json({ success: false, error: 'Failed to create hero banner' })
    }

    res.status(201).json({ success: true, data })
  } catch (error) {
    console.error('Hero banner create server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('hero_banners')
      .update({
        ...req.body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', Number(req.params.id))
      .select()
      .single()

    if (error) {
      console.error('Hero banner update error:', error)
      return res.status(404).json({ success: false, error: 'Hero banner not found' })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Hero banner update server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('hero_banners')
      .delete()
      .eq('id', Number(req.params.id))

    if (error) {
      console.error('Hero banner delete error:', error)
      return res.status(404).json({ success: false, error: 'Hero banner not found' })
    }

    res.json({ success: true, message: 'Hero banner deleted' })
  } catch (error) {
    console.error('Hero banner delete server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

export default router
