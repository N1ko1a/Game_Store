import { visibleElements } from './types';
export declare const omitEdgeSeparators: (items: visibleElements) => string[];
declare const getItemsPos: (items: visibleElements) => {
    first: string;
    center: string;
    last: string;
};
export default getItemsPos;
