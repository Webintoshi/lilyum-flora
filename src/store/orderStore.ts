import { create } from 'zustand'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy, doc, getDoc, addDoc, updateDoc, setDoc } from 'firebase/firestore'

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  productId: number
}

interface LocalOrder {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'processing' | 'returned'
  totalAmount: number
  items: OrderItem[]
  shippingAddress: {
    name: string
    phone: string
    address: string
    district: string
    city: string
  }
  // New fields for gifting
  sender?: {
    name: string
    phone: string
  }
  cardNote?: string
  isAnonymous?: boolean

  estimatedDelivery?: string
  userId?: number
  trackingNumber?: string
  carrier?: string
}

interface OrderStore {
  orders: LocalOrder[]
  currentOrder: LocalOrder | null
  isLoading: boolean
  error: string | null

  fetchOrders: (userId?: string) => Promise<void>
  fetchOrderById: (id: string) => Promise<void>
  createOrder: (orderData: any) => Promise<LocalOrder | null>
  updateOrderStatus: (id: string, status: string) => Promise<void>
  clearCurrentOrder: () => void
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async (userId) => {
    set({ isLoading: true, error: null })
    try {
      let q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))

      if (userId) {
        q = query(q, where('customerId', '==', userId))
      }

      const querySnapshot = await getDocs(q)

      const orders: LocalOrder[] = []

      querySnapshot.forEach(doc => {
        const data = doc.data()
        orders.push({
          id: doc.id,
          orderNumber: data.orderNumber || `ORD-${doc.id}`,
          date: data.createdAt,
          status: data.status,
          totalAmount: data.total || 0,
          shippingAddress: {
            name: data.shipping?.name || '',
            phone: data.shipping?.phone || '',
            address: data.shipping?.address || '',
            district: data.shipping?.district || '',
            city: data.shipping?.city || '',
          },
          items: data.items || [],
          // Map new fields
          sender: data.sender || undefined,
          cardNote: data.cardNote || undefined,
          isAnonymous: data.isAnonymous || false,
        } as LocalOrder)
      })

      set({ orders, isLoading: false })
    } catch (error) {
      console.error('Fetch orders error:', error)
      set({ error: 'Siparişler yüklenemedi', isLoading: false })
    }
  },


  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const docRef = doc(db, 'orders', String(id))
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        set({ currentOrder: null, isLoading: false })
        return
      }

      const data = docSnap.data()
      // Map Firestore data to LocalOrder
      const order: LocalOrder = {
        id: docSnap.id,
        orderNumber: data.orderNumber || `ORD-${docSnap.id}`,
        date: data.createdAt,
        status: data.status,
        totalAmount: data.total || 0,
        shippingAddress: {
          name: data.shipping?.name || '',
          phone: data.shipping?.phone || '',
          address: data.shipping?.address || '',
          district: data.shipping?.district || '',
          city: data.shipping?.city || '',
        },
        items: data.items || [],
        trackingNumber: data.trackingNumber,
        carrier: data.carrier,
        userId: data.customerId,
        // Map new fields
        sender: data.sender || undefined,
        cardNote: data.cardNote || undefined,
        isAnonymous: data.isAnonymous || false,
      } as unknown as LocalOrder

      set({ currentOrder: order, isLoading: false })
    } catch (error) {
      console.error('Fetch order error:', error)
      set({ error: 'Sipariş yüklenemedi', isLoading: false })
    }
  },

  createOrder: async (orderData) => {
    set({ isLoading: true, error: null })
    try {
      const orderNumber = `ORD-${Date.now()}`

      // 1. Handle Customer Data
      const { collection, query, where, getDocs, addDoc, updateDoc, doc, limit } = await import('firebase/firestore');
      const customersRef = collection(db, 'customers');

      let customerId = orderData.userId;
      let customerRef;

      // Identify customer
      if (customerId) {
        const userDoc = await getDoc(doc(db, 'customers', customerId));
        if (userDoc.exists()) {
          customerRef = userDoc.ref;
        }
      }

      if (!customerRef) {
        // Use SENDER phone for customer identification if available, otherwise shipping phone (if self-gift)
        // But logic says: Sender is the customer.
        const customerPhone = orderData.sender?.phone || orderData.shipping.phone;
        const customerName = orderData.sender?.name || orderData.shipping.name;

        // Search by Phone
        const qPhone = query(customersRef, where('phone', '==', customerPhone), limit(1));
        const snapPhone = await getDocs(qPhone);

        if (!snapPhone.empty) {
          customerRef = snapPhone.docs[0].ref;
          customerId = snapPhone.docs[0].id;
        } else {
          // Create New Customer
          const newCustomerData = {
            name: customerName,
            email: (orderData as any).email || (orderData.userId ? 'registered@lilyumflora.net' : ''),
            phone: customerPhone,
            role: 'customer',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            totalSpent: 0,
            orderCount: 0,
            lastOrderDate: null
          };
          if (orderData.userId) {
            await setDoc(doc(db, 'customers', orderData.userId), newCustomerData);
            customerRef = doc(db, 'customers', orderData.userId);
            customerId = orderData.userId;
          } else {
            const newDoc = await addDoc(customersRef, newCustomerData);
            customerRef = newDoc;
            customerId = newDoc.id;
          }
        }
      }

      // Update Customer Stats
      if (customerRef) {
        const currentSnap = await getDoc(customerRef);
        const currentData = currentSnap.data() as any;
        await updateDoc(customerRef, {
          totalSpent: (currentData?.totalSpent || 0) + Number(orderData.totalAmount),
          orderCount: (currentData?.orderCount || 0) + 1,
          lastOrderDate: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Don't necessarily update address from shipping if it's a gift to someone else
          // But maybe we keep it as 'last used address' logic? Let's leave it as is or maybe check?
          // Keeping it simple for now.
          address: orderData.shipping.address,
          city: orderData.shipping.city,
          district: orderData.shipping.district
        });
      }

      // 2. Create Order
      const newOrderData = {
        orderNumber,
        customerId: customerId || null,
        status: 'pending',
        total: orderData.totalAmount,
        shipping: {
          name: orderData.shipping.name,
          phone: orderData.shipping.phone,
          address: orderData.shipping.address,
          district: orderData.shipping.district,
          city: orderData.shipping.city,
          deliveryDate: orderData.shipping.deliveryDate,
          deliveryTime: orderData.shipping.deliveryTime,
        },
        // Save Gift Info
        sender: orderData.sender ? {
          name: orderData.sender.name,
          phone: orderData.sender.phone
        } : null,
        cardNote: orderData.cardNote || null,
        isAnonymous: orderData.isAnonymous || false,

        paymentMethod: orderData.paymentMethod,
        mediaMessage: orderData.mediaMessage || null,
        items: orderData.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '',
          productId: item.id
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const docRef = await addDoc(collection(db, 'orders'), newOrderData)

      const order: LocalOrder = {
        id: docRef.id,
        date: newOrderData.createdAt,
        status: 'pending',
        totalAmount: newOrderData.total,
        shippingAddress: newOrderData.shipping,
        items: newOrderData.items as unknown as OrderItem[],
        orderNumber,
        sender: newOrderData.sender || undefined,
        cardNote: newOrderData.cardNote || undefined,
        isAnonymous: newOrderData.isAnonymous || undefined
      } as unknown as LocalOrder

      set({ currentOrder: order, isLoading: false })
      return order
    } catch (error) {
      console.error('Create order error:', error)
      set({ error: 'Sipariş oluşturulamadı', isLoading: false })
      return null
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const orderRef = doc(db, 'orders', String(id))
      await updateDoc(orderRef, { status, updatedAt: new Date().toISOString() })

      set({
        orders: get().orders.map(o => o.id === id ? { ...o, status: status as LocalOrder['status'] } : o)
      })
    } catch (error) {
      console.error('Update order status error:', error)
    }
  },

  clearCurrentOrder: () => {
    set({ currentOrder: null })
  },
}))
