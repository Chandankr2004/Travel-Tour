import api from '../lib/api'

export interface CouponValidation {
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  discount: number
  description?: string
}

export const couponService = {
  validateCoupon: async (code: string, amount: number, tourId?: string) => {
    const response = await api.post('/coupons/validate', { code, amount, tourId })
    return response.data
  },
}

