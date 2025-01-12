import { format, isAfter, isThisWeek, isThisYear, isToday, isYesterday, subDays } from 'date-fns';
import { sk } from 'date-fns/locale';
import type { ChatHistoryItem } from '~/lib/persistence';

type Bin = { category: string; items: ChatHistoryItem[] };

export function binDates(_list: ChatHistoryItem[]) {
  const list = _list.toSorted((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

  const binLookup: Record<string, Bin> = {};
  const bins: Array<Bin> = [];

  list.forEach((item) => {
    const category = dateCategory(new Date(item.timestamp));

    if (!(category in binLookup)) {
      const bin = {
        category,
        items: [item],
      };

      binLookup[category] = bin;

      bins.push(bin);
    } else {
      binLookup[category].items.push(item);
    }
  });

  return bins;
}

function dateCategory(date: Date) {
  if (isToday(date)) {
    return 'Dnes';
  }

  if (isYesterday(date)) {
    return 'Včera';
  }

  if (isThisWeek(date)) {
    // e.g., "Pondelok"
    return format(date, 'eeee', { locale: sk });
  }

  const thirtyDaysAgo = subDays(new Date(), 30);

  if (isAfter(date, thirtyDaysAgo)) {
    return 'Posledných 30 dní';
  }

  if (isThisYear(date)) {
    // e.g., "Júl"
    return format(date, 'MMMM', { locale: sk });
  }

  // e.g., "Júl 2023"
  return format(date, 'MMMM yyyy', { locale: sk });
}
