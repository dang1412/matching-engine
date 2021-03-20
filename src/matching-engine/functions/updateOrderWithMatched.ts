import { Order, OrderMatch, OrderState } from '../types/order'

export function updateOrderWithMatched<T extends Order>(order: T, matched: OrderMatch): T {
  const updated = {...order}
  updated.remaining -= matched.amount
  updated.state = updated.remaining > 0 ? OrderState.PartialFilled : OrderState.Filled

  return updated
}
