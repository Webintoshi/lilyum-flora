import { db } from './firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export interface TrackingInfo {
  status: string
  location?: string
  estimatedDelivery?: string
  history?: TrackingEvent[]
}

export interface TrackingEvent {
  date: string
  status: string
  location?: string
  description: string
}

export async function getTrackingInfo(trackingNumber: string): Promise<TrackingInfo> {
  try {
    const q = query(collection(db, 'orders'), where('trackingNumber', '==', trackingNumber))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return {
        status: 'not_found',
        history: []
      }
    }

    const data = querySnapshot.docs[0].data()

    const trackingHistory = generateMockTrackingHistory(data.status)

    return {
      status: data.status,
      location: 'Türkiye',
      estimatedDelivery: getEstimatedDeliveryDate(data.status),
      history: trackingHistory
    }
  } catch (error) {
    console.error('Tracking error:', error)
    return {
      status: 'error',
      history: []
    }
  }
}

function generateMockTrackingHistory(status: string): TrackingEvent[] {
  const now = new Date()
  const events: TrackingEvent[] = []

  events.push({
    date: now.toISOString(),
    status: 'order_placed',
    location: 'Ordu',
    description: 'Sipariş oluşturuldu'
  })

  if (status === 'processing') {
    events.push({
      date: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      status: 'preparing',
      location: 'Ordu',
      description: 'Sipariş hazırlanıyor'
    })
  }

  if (status === 'shipped' || status === 'processing') {
    events.push({
      date: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      status: 'picked_up',
      location: 'Ordu',
      description: 'Yola çıktı'
    })

    events.push({
      date: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(),
      status: 'in_transit',
      location: 'Dağıtım Merkezi',
      description: 'Dağıtıma çıktı'
    })
  }

  if (status === 'delivered') {
    events.push({
      date: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'delivered',
      location: 'Teslimat Adresi',
      description: 'Teslim edildi'
    })
  }

  return events
}

function getEstimatedDeliveryDate(status: string): string | undefined {
  if (status === 'delivered') return undefined

  const now = new Date()
  let hoursToAdd = 0

  switch (status) {
    case 'pending':
      hoursToAdd = 1
      break
    case 'processing':
      hoursToAdd = 6
      break
    case 'shipped':
      hoursToAdd = 24
      break
    default:
      hoursToAdd = 48
  }

  const estimatedDate = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000)
  return estimatedDate.toISOString()
}

export const CARRIERS = {
  ARAS: {
    name: 'Aras Kargo',
    trackingUrl: (number: string) => `https://www.araskargo.com/tracking/Detail/${number}`
  },
  YURTICI: {
    name: 'Yurtiçi Kargo',
    trackingUrl: (number: string) => `https://www.yurticikargo.com/bilgiservisi/KargoTakip.aspx?code=${number}`
  },
  SURAT: {
    name: 'Surat Kargo',
    trackingUrl: (number: string) => `https://www.suratkargo.com.tr/tracking/quickTrack/${number}`
  }
}
