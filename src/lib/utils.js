import { format } from 'date-fns';

export function formatPrice(val) {
  return `${Number(val).toFixed(0)} RSD`;
}

export function toDateString(date) {
  return format(date, 'yyyy-MM-dd');
}
