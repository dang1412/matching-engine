import { BPlusTree } from '../libs/bplustree'
import { matchOrder, updateOrderWithMatched } from './functions'
import { LimitOrder, MarketOrder, OrderMatch, OrderSide, OrderType } from './types/order'

const buyOrderComparator = (o1: LimitOrder, o2: LimitOrder): -1 | 0 | 1 => {
  if (o1.id === o2.id) {
    return 0
  }

  // o1 come first
  if (o1.price > o2.price) return -1
  // o2 come first
  if (o1.price < o2.price) return 1

  // sooner order come first
  return o1.ts < o2.ts ? -1 : 1
}

const sellOrderComparator = (o1: LimitOrder, o2: LimitOrder): -1 | 0 | 1 => {
  if (o1.id === o2.id) {
    return 0
  }

  // o1 come first
  if (o1.price < o2.price) return -1
  // o2 come first
  if (o1.price > o2.price) return 1

  // sooner order come first
  return o1.ts < o2.ts ? -1 : 1
}

export class MatchingEngine {
  private limitBuyOrders = new BPlusTree<LimitOrder>(4, buyOrderComparator)
  private limitSellOrders = new BPlusTree<LimitOrder>(4, sellOrderComparator)

  constructor(orders: LimitOrder[]) {
    for (const order of orders) {
      if (order.side === OrderSide.BID) {
        this.limitBuyOrders.replaceOrInsert(order)
      } else {
        this.limitSellOrders.replaceOrInsert(order)
      }
    }
  }

  processOrder(order: LimitOrder | MarketOrder) {
    const matchedList: OrderMatch[] = []
    const updatedOrders: LimitOrder[] = []

    const takeOrderbook = order.side === OrderSide.BID ? this.limitBuyOrders : this.limitSellOrders
    const makeOrderbook = order.side === OrderSide.BID ? this.limitSellOrders : this.limitBuyOrders

    let takeOrder = order
    for (const makeOrder of makeOrderbook) {
      const matched = matchOrder(order, makeOrder)
      if (!matched) {
        break
      }

      // push to matched list
      matchedList.push(matched)

      // push to updated orders list
      const updatedMakeOrder = updateOrderWithMatched(makeOrder, matched)
      updatedOrders.push(updatedMakeOrder)

      // update take order
      takeOrder = updateOrderWithMatched(takeOrder, matched)
    }

    // UPDATE Database before proceed

    // update take orderbook if the take order remains
    if (takeOrder.remaining > 0 && takeOrder.type === OrderType.Limit) {
      // updatedOrders.push(takeOrder)
      takeOrderbook.replaceOrInsert(takeOrder)
    }

    // update make orderbook
    for (const updatedOrder of updatedOrders) {
      if (updatedOrder.remaining > 0) {
        makeOrderbook.replaceOrInsert(updatedOrder)
      } else {
        makeOrderbook.remove(updatedOrder)
      }
    }
  }
}
