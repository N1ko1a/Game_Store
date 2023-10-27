import type { IOItem, Item, visibleElements } from './types';
declare class ItemsMap extends Map<Item[0], Item[1]> {
    toArr(): Item[];
    toItems(): visibleElements;
    toItemsWithoutSeparators(): visibleElements;
    toItemsKeys(): visibleElements;
    sort(arr: Item[]): Item[];
    set(key: Array<Item> | string, val?: IOItem): this;
    first(): IOItem | undefined;
    last(): IOItem | undefined;
    filter(predicate: (value: Item, index: number, array: Item[]) => boolean): Item[];
    find(predicate: (value: Item, index: number, obj: Item[]) => boolean): Item | undefined;
    findIndex(predicate: (value: Item, index: number, obj: Item[]) => unknown): number;
    getCurrentPos(item: string | IOItem, onlyItems: boolean): [Item[], number];
    prev(item: string | IOItem, onlyItems?: boolean): IOItem | undefined;
    next(item: IOItem | string, onlyItems?: boolean): IOItem | undefined;
    getVisible(): Item[];
    getVisibleElements(): Item[];
}
export default ItemsMap;
