import { PropType, ExtractPropTypes, computed, shallowRef } from 'vue';
import {isNumber} from '../../utils/helpers';
import { getUseModelPropsDefinition, useModel } from '../model';

export const DEFAULT_ITEMS_PER_PAGE = shallowRef(25)

export const UsePaginationPropsDefinition = {
  ...getUseModelPropsDefinition<number>(),
  modelValue: {
    type: Number as PropType<number>,
    default: 0
  },
  total: {
    type: Number as PropType<number>,
    required: true
  },
  perPage: {
    type: Number as PropType<number>,
    default: () => DEFAULT_ITEMS_PER_PAGE.value,
    validator: (value: number) => isNumber(value) && value > 0
  }
};

export type UsePaginationProps = ExtractPropTypes<typeof UsePaginationPropsDefinition>;

export function usePagination(props: UsePaginationProps) {
  const model = useModel(props);
  const current = computed(() => Math.max(model.modelValue.value as number, 1));
  const itemsPerPage = computed(() => props.perPage <= 0 ? DEFAULT_ITEMS_PER_PAGE.value : props.perPage);
  const numberOfPages = computed(() => Math.ceil((props.total as number) / itemsPerPage.value));
  const after = computed(() => Math.max(((model.modelValue.value as number) - 1) * itemsPerPage.value, 0));
  const nextPage = computed(() => Math.min(numberOfPages.value, (model.modelValue.value as number) + 1));
  const hasNext = computed(() => {
    console.log(itemsPerPage.value + after.value < (props.total as number));
    return itemsPerPage.value + after.value < (props.total as number);
  });
  const previousPage = computed(() => Math.max(0, (model.modelValue.value as number) - 1));
  const hasPrevious = computed(() => after.value > 0 && (props.total as number) > 0);
  function next(e: Event) {
    e.preventDefault();
    if (hasNext.value) {
      model.modelValue.value = nextPage.value;
    }
  }
  function previous(e: Event) {
    e.preventDefault();
    if (hasPrevious.value) {
      model.modelValue.value = previousPage.value;
    }
  }
  function first() {
    model.modelValue.value = 1;
  }
  function last() {
    model.modelValue.value = numberOfPages.value;
  }
  function set(num: number) {
    if (num >= 1 && num <= numberOfPages.value) {
      model.modelValue.value = num;
    }
  }
  return {
    current,
    numberOfPages,
    after,
    nextPage,
    hasNext,
    previousPage,
    hasPrevious,
    next,
    previous,
    first,
    last,
    set
  };
}

export type Pagination = ReturnType<typeof usePagination>;

export function extractPaginationState(pagination: Pagination) {
  return {
    current: pagination.current.value,
    numberOfPages: pagination.numberOfPages.value,
    after: pagination.after.value,
    nextPage: pagination.nextPage.value,
    hasNext: pagination.hasNext.value,
    previousPage: pagination.previousPage.value,
    hasPrevious: pagination.hasPrevious.value,
    next: pagination.next,
    previous: pagination.previous,
    first: pagination.first,
    last: pagination.last,
    set: pagination.set
  };
}
