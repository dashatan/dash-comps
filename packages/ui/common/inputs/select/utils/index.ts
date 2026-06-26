import { FlatTreeSelectItem, SelectItem, TreeSelectItem } from "../types";

export function flattenData(data: TreeSelectItem[]) {
  const newData: (SelectItem & {
    parentId?: string | number;
    last?: boolean;
  })[] = [];
  for (const option of data) {
    const o = { ...option, last: !option.children?.length };
    delete o.children;
    newData.push(o);
    recursive(option);
  }
  function recursive(option: TreeSelectItem) {
    if (!option.children?.length) return;
    for (const child of option.children) {
      const c = {
        ...child,
        parentId: option.value,
        last: !child.children?.length,
      };
      delete c.children;
      newData.push(c);
      if (child.children?.length) recursive(child);
    }
  }
  return newData;
}

export function nested(data: FlatTreeSelectItem[], pid?: string | number) {
  return data.reduce((r: TreeSelectItem[], e) => {
    if (e.parentId == pid) {
      const children = nested(data, e.value);
      const obj: TreeSelectItem = {
        ...e,
        ...(children.length ? { children } : {}),
      };
      r.push(obj);
    }
    return r;
  }, []);
}
