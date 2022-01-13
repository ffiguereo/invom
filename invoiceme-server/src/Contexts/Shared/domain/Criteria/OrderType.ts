export enum OrderType {
  ASC = 'asc',
  DESC = 'desc',
  NONE = 'none'
}

export function fromValueToOrderType(value: string): OrderType {
  switch (value) {
    case OrderType.ASC:
      return OrderType.ASC;
    case OrderType.DESC:
      return OrderType.DESC;
    case OrderType.NONE:
    default:
      return OrderType.NONE;
  }
}

export function isNoneOrderType(orderType: OrderType): boolean {
  return orderType === OrderType.NONE;
}
