/// <reference types="react" />
import ItemsMap from './ItemsMap';
import type { CustomScrollBehavior, ItemOrElement, scrollToItemOptions, visibleElements } from './types';
export default function createApi(items: ItemsMap, visibleElementsWithSeparators?: visibleElements, boundaryElement?: React.MutableRefObject<HTMLElement | null>, transitionOptions?: {
    duration?: number;
    ease?: (t: number) => number;
    behavior: string | Function;
}, RTL?: boolean, noPolyfill?: boolean): {
    getItemById: (id: string) => import("./types").IOItem | undefined;
    getItemElementById: (id: string | number) => Element | null;
    getItemByIndex: (index: number | string) => import("./types").IOItem | undefined;
    getItemElementByIndex: (id: string | number) => Element | null;
    getNextItem: () => import("./types").IOItem | undefined;
    getNextElement: () => import("./types").IOItem | undefined;
    getPrevItem: () => import("./types").IOItem | undefined;
    getPrevElement: () => import("./types").IOItem | undefined;
    isFirstItemVisible: boolean;
    isItemVisible: (id: string) => boolean;
    isLastItem: (id: string) => boolean;
    isLastItemVisible: boolean;
    scrollNext: <T>(behavior?: CustomScrollBehavior<T> | undefined, inline?: ScrollLogicalPosition, block?: ScrollLogicalPosition, { duration, ease, boundary, }?: scrollToItemOptions) => unknown;
    scrollPrev: <T_1>(behavior?: CustomScrollBehavior<T_1> | undefined, inline?: ScrollLogicalPosition, block?: ScrollLogicalPosition, { duration, ease, boundary, }?: scrollToItemOptions) => unknown;
    scrollToItem: <T_2>(target?: ItemOrElement, behavior?: CustomScrollBehavior<T_2> | undefined, inline?: ScrollLogicalPosition, block?: ScrollLogicalPosition, options?: scrollToItemOptions) => unknown;
    visibleElements: visibleElements;
    visibleElementsWithSeparators: visibleElements;
    visibleItems: visibleElements;
    visibleItemsWithoutSeparators: visibleElements;
};
export interface publicApiType extends ReturnType<typeof createApi> {
    initComplete: boolean;
    items: ItemsMap;
    scrollContainer: React.RefObject<HTMLElement | null>;
    visibleElements: visibleElements;
    visibleElementsWithSeparators: visibleElements;
    /**
      Deprecated, use visibleElementsWithSeparators
     */
    visibleItems: visibleElements;
    /**
      Deprecated, use visibleElements
     */
    visibleItemsWithoutSeparators: visibleElements;
}
