import { InvalidArgumentError } from '../value-object/InvalidArgumentError';
import { FilterField } from './FilterField';
import { FilterOperator, fromValueToFilterOperator } from './FilterOperator';
import { FilterValue } from './FilterValue';

export class Filter {
  readonly field: FilterField;
  readonly operator: FilterOperator;
  readonly value: FilterValue;

  constructor(field: FilterField, operator: FilterOperator, value: FilterValue) {
    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  static create(field: string, operator: string, value: string): Filter {
    return new Filter(new FilterField(field), fromValueToFilterOperator(operator.toUpperCase()), new FilterValue(value));
  }

  static fromValues(values: Map<string, string>): Filter {
    const field = values.get('field');
    if (!field) {
      throw new InvalidArgumentError('invalid filter field can not be null');
    }

    const operator = values.get('operator');
    if (!operator) {
      throw new InvalidArgumentError('invalid filter operator can not be null');
    }

    return new Filter(
      new FilterField(field),
      fromValueToFilterOperator(operator.toUpperCase()),
      new FilterValue(values.get('value') || '')
    );
  }
}
