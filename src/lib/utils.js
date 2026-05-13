import { format } from 'date-fns';

export function formatPrice(val) {
  return `£${Number(val).toFixed(2)}`;
}

export function toDateString(date) {
  return format(date, 'yyyy-MM-dd');
}
