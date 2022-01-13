export enum FilterOperator {
  EQUAL = '=',
  NOT_EQUAL = '!=',
  GT = '>',
  LT = '<',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS'
}

export function fromValueToFilterOperator(value: string): FilterOperator {
  switch (value) {
    case '=':
      return FilterOperator.EQUAL;
    case '!=':
      return FilterOperator.NOT_EQUAL;
    case '>':
      return FilterOperator.GT;
    case '<':
      return FilterOperator.LT;
    case 'CONTAINS':
      return FilterOperator.CONTAINS;
    case 'NOT_CONTAINS':
      return FilterOperator.NOT_CONTAINS;
    default:
      throw new Error('Invalid filter operator');
  }
}

export function isPositiveFilterOperator(value: FilterOperator): boolean {
  return value != FilterOperator.NOT_EQUAL && value != FilterOperator.NOT_CONTAINS;
}
