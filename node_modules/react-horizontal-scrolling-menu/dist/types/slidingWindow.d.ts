import { visibleElements } from './types';
export declare function prevGroup(allItems: visibleElements, visibleElementsWithSeparators: visibleElements): visibleElements;
export declare function nextGroup(allItems: visibleElements, visibleElementsWithSeparators: visibleElements): visibleElements;
declare function slidingWindow(allItems: visibleElements, visibleElementsWithSeparators: visibleElements): {
    prev: () => visibleElements;
    next: () => visibleElements;
};
export default slidingWindow;
