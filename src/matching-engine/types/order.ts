export enum OrderSide {
  BID,
  ASK
}

export enum OrderType {
  Limit,
  Market,
  Stop
}

export enum OrderState {
  New,
  PartialFilled,
  Filled
}

export interface Order {
  id: string
  amount: number
  remaining: number
  state: OrderState
  side: OrderSide
  userId: string
  ts: number
}

export interface LimitOrder extends Order {
  price: number
  type: OrderType.Limit
}

export interface MarketOrder extends Order {
  type: OrderType.Market
}

export interface StopOrder extends Order {
  price: number
  type: OrderType.Stop
}

export interface OrderMatch {
  price: number
  maker: string
  taker: string
  amount: number
  ts: number
}
