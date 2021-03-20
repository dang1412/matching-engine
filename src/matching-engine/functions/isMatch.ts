import { LimitOrder, MarketOrder, OrderSide, OrderType } from '../types/order'

export function isMatch(takeOrder: LimitOrder | MarketOrder, makeOrder: LimitOrder): boolean {
  if (takeOrder.remaining === 0) {
    return false
  }

  if (takeOrder.type === OrderType.Market) {
    return true
  }

  const takeLimitOrder = takeOrder as LimitOrder

  if (takeLimitOrder.side === OrderSide.BID && makeOrder.side === OrderSide.ASK && takeLimitOrder.price >= makeOrder.price) {
    return true
  }

  if (takeLimitOrder.side === OrderSide.ASK && makeOrder.side === OrderSide.BID && takeLimitOrder.price <= makeOrder.price) {
    return true
  }

  return false
}
