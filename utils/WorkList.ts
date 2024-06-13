import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

interface WorkItem {
  work: string;
  date: Dayjs | undefined;
}

const WorkItemList = () => {
  let lastIndex = 0;
  let map: Map<number, WorkItem>;

  const init = (): Map<number, WorkItem> => {
    lastIndex = parseInt(localStorage.getItem("last-work-index") ?? "0");
    map = new Map(JSON.parse(localStorage.getItem("work-list") ?? '""'));

    return getMap();
  };

  const getMap = (
    year: number = -1,
    month: number = -1
  ): Map<number, WorkItem> => {
    if (year < 0 || month < 0) return new Map(map);

    const first = dayjs(`${year}-${month + 1}-1`);
    const last = first.set("date", first.daysInMonth());
    const filteredMap = new Map<number, WorkItem>();

    map.forEach((v, k) => {
      const d: Dayjs | undefined = v.date && dayjs(v.date);

      if (d && d.isBetween(first, last)) filteredMap.set(k, v);
    });

    return filteredMap;
  };

  const add = (work: WorkItem): Map<number, WorkItem> => {
    map.set(lastIndex++, work);

    syncData();

    return getMap();
  };

  const update = (index: number, work: WorkItem): Map<number, WorkItem> => {
    map.set(index, work);

    syncData();

    return getMap();
  };

  const remove = (index: number): Map<number, WorkItem> => {
    map.delete(index);

    syncData();

    return getMap();
  };

  const changeOrder = (target: number, next: number): Map<number, WorkItem> => {
    const temp = map.get(next) as WorkItem;
    map.set(next, map.get(target) as WorkItem);
    map.set(target, temp);

    syncData();

    return getMap();
  };

  const syncData = () => {
    localStorage.setItem("last-work-index", lastIndex.toString());
    localStorage.setItem("work-list", JSON.stringify([...map.entries()]));
  };

  return {
    init,
    getMap,
    add,
    update,
    remove,
    changeOrder
  };
};

export { type WorkItem, WorkItemList };
