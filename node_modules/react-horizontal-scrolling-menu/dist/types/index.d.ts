import React from 'react';
import './styles.css';
import { publicApiType } from './createApi';
import { observerOptions as defaultObserverOptions } from './settings';
import * as constants from './constants';
import { VisibilityContext } from './context';
import type { ItemType } from './types';
import slidingWindow from './slidingWindow';
import getItemsPos from './getItemsPos';
type ComponentType = React.ReactNode | JSX.Element | React.FC;
export interface Props {
    /**
     Header component on top, can contain Arrows
     */
    Header?: ComponentType;
    /**
     Footer component on bottom, can contain Arrows
     */
    Footer?: ComponentType;
    /**
     Component for left arrow
  
     e.g. LeftArrow={Arrow}
  
     or LeftArrow={<Arrow {...props />}}
     */
    LeftArrow?: ComponentType;
    /**
     Component for right arrow
  
     e.g. RightArrow={Arrow}
  
     or RightArrow={<Arrow {...props />}}
     */
    RightArrow?: ComponentType;
    /**
      Every child should has unique `itemId` prop
     */
    children: ItemType | ItemType[];
    /**
      Duration of transition
     */
    transitionDuration?: number;
    /**
      Ease function for transition
  
      Example -  t => t*(2-t)
  
      Full list at https://gist.github.com/gre/1650294#file-easing-js
     */
    transitionEase?: (t: number) => number;
    /**
      Transition behavior can be 'smooth', 'auto' or custom function
  
      Example:
  
      (instructions) => {
        const [{ el, left }] = instructions;
        const styler = Styler(el);
  
        animate({
          from: el.scrollLeft,
          to: left,
          type: 'spring',
          onUpdate: (left) => styler.set('scrollLeft', left),
        });
      }
     */
    transitionBehavior?: string | Function;
    /**
     Callback that fire once on init
     */
    onInit?: (api: publicApiType) => void;
    /**
     Callback that fire every time when visibility of items change
     */
    onUpdate?: (api: publicApiType) => void;
    /**
     Callback that fire on scroll event
     */
    onScroll?: (api: publicApiType, ev: React.UIEvent) => void;
    /**
     Handler for mouse wheel
     */
    onWheel?: (api: publicApiType, ev: React.WheelEvent) => void;
    /**
      Options for intersection observer
     */
    options?: Partial<typeof defaultObserverOptions>;
    onMouseDown?: (arg0: publicApiType) => React.MouseEventHandler;
    onMouseUp?: (arg0: publicApiType) => React.MouseEventHandler;
    onMouseMove?: (arg0: publicApiType) => React.MouseEventHandler;
    onTouchMove?: (arg0: publicApiType) => React.TouchEventHandler;
    onTouchStart?: (arg0: publicApiType) => React.TouchEventHandler;
    onTouchEnd?: (arg0: publicApiType) => React.TouchEventHandler;
    /**
      For add custom className for item
     */
    itemClassName?: string;
    /**
      For add custom className for item separator
     */
    separatorClassName?: string;
    /**
      For add custom className for scroll container
     */
    scrollContainerClassName?: string;
    /**
      For add custom className for wrapper
     */
    wrapperClassName?: string;
    /**
      Ref object for access VisibilityContextApi outside of context
  
      e.g. apiRef.current.scrollToItem(...)
     */
    apiRef?: React.MutableRefObject<publicApiType>;
    RTL?: boolean;
    /**
      Disable scrollIntoView polyfill
     */
    noPolyfill?: boolean;
}
/**
  See docs and examples at

  https://github.com/asmyshlyaev177/react-horizontal-scrolling-menu
 */
declare function ScrollMenu({ LeftArrow: _LeftArrow, RightArrow: _RightArrow, children, Header: _Header, Footer: _Footer, transitionDuration, transitionEase, transitionBehavior, onInit, onUpdate, onMouseDown, onMouseUp, onMouseMove, onScroll, onTouchMove, onTouchStart, onTouchEnd, onWheel, options, scrollContainerClassName, itemClassName, separatorClassName, wrapperClassName, apiRef, RTL, noPolyfill, }: Props): JSX.Element;
export { constants, getItemsPos, slidingWindow, ScrollMenu, VisibilityContext };
