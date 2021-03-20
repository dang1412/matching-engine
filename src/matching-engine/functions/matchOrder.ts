import { LimitOrder, MarketOrder, OrderMatch } from '../types/order'
import { isMatch } from './isMatch'

export function matchOrder(takeOrder: LimitOrder | MarketOrder, makeOrder: LimitOrder): OrderMatch | null {
  if (!isMatch(takeOrder, makeOrder)) {
    return null
  }

  const matched: OrderMatch = {
    amount: Math.min(takeOrder.remaining, makeOrder.remaining),
    maker: makeOrder.userId,
    taker: takeOrder.userId,
    price: makeOrder.price,
    ts: Date.now()
  }

  return matched
}
