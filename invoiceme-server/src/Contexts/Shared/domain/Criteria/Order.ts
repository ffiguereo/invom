import { Nullable } from '../Nullable';
import { OrderBy } from './OrderBy';
import { fromValueToOrderType, OrderType, isNoneOrderType } from './OrderType';

export class Order {
  readonly orderBy: OrderBy;
  readonly orderType: OrderType;

  constructor(orderBy: OrderBy, orderType: OrderType) {
    this.orderBy = orderBy;
    this.orderType = orderType;
  }

  static fromValues(orderBy: Nullable<string>, orderType: Nullable<string>): Order {
    if (!orderBy) {
      return Order.none();
    }

    return new Order(new OrderBy(orderBy), fromValueToOrderType((orderType || OrderType.ASC).toLowerCase()));
  }

  static none(): Order {
    return new Order(new OrderBy(''), OrderType.NONE);
  }

  static desc(orderBy: string): Order {
    return new Order(new OrderBy(orderBy), OrderType.DESC);
  }

  static asc(orderBy: string): Order {
    return new Order(new OrderBy(orderBy), OrderType.ASC);
  }

  hasOrder(): boolean {
    return !isNoneOrderType(this.orderType);
  }
}
