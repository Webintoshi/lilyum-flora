import { Router, type Request, type Response } from 'express'
import { supabase } from '../config/supabase.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const { status } = req.query

    let query = supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (status === 'active') {
      query = query.eq('is_active', true)
    } else if (status === 'inactive') {
      query = query.eq('is_active', false)
    }

    const { data, error } = await query

    if (error) {
      console.error('Categories fetch error:', error)
      return res.status(500).json({ success: false, error: 'Failed to fetch categories' })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Categories server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', Number(req.params.id))
      .single()

    if (error) {
      return res.status(404).json({ success: false, error: 'Category not found' })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Category fetch error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(req.body)
      .select()
      .single()

    if (error) {
      console.error('Category create error:', error)
      return res.status(500).json({ success: false, error: 'Failed to create category' })
    }

    res.status(201).json({ success: true, data })
  } catch (error) {
    console.error('Category create server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({
        ...req.body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', Number(req.params.id))
      .select()
      .single()

    if (error) {
      console.error('Category update error:', error)
      return res.status(404).json({ success: false, error: 'Category not found' })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error('Category update server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', Number(req.params.id))

    if (error) {
      console.error('Category delete error:', error)
      return res.status(404).json({ success: false, error: 'Category not found' })
    }

    res.json({ success: true, message: 'Category deleted' })
  } catch (error) {
    console.error('Category delete server error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

export default router
