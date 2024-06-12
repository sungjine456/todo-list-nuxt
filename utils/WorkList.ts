import { Dayjs } from "dayjs";

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

    return new Map(map);
  };

  const getMap = (): Map<number, WorkItem> => {
    return new Map(map);
  };

  const add = (work: WorkItem): Map<number, WorkItem> => {
    map.set(lastIndex++, work);

    syncData();

    return new Map(map);
  };

  const update = (index: number, work: WorkItem): Map<number, WorkItem> => {
    map.set(index, work);

    syncData();

    return new Map(map);
  };

  const remove = (index: number): Map<number, WorkItem> => {
    map.delete(index);

    syncData();

    return new Map(map);
  };

  const changeOrder = (target: number, next: number): Map<number, WorkItem> => {
    const temp = map.get(next) as WorkItem;
    map.set(next, map.get(target) as WorkItem);
    map.set(target, temp);

    syncData();

    return new Map(map);
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
