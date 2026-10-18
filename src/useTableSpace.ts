import { useLayoutEffect, useState, type RefObject } from 'react';
import type { TableSpace } from './layout';
export function useTableSpace(ref: RefObject<HTMLElement>): TableSpace {
    const [space, setSpace] = useState<TableSpace>({ width: 0, height: 0, scale: 1 });
    useLayoutEffect(() => {
        const measure = () => {
            const element = ref.current;
            const rect = element?.getBoundingClientRect();
            const main = element?.closest('main');
            const padding = main ? parseFloat(getComputedStyle(main).paddingBottom) || 12 : 12;
            const next = { width: rect?.width || Math.min(window.innerWidth, 1120) - 24,
                height: window.innerHeight - Math.max(12, rect?.top || 12) - padding,
                scale: (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) / 16 };
            setSpace(current => Object.keys(next).every(key => current[key as keyof TableSpace] === next[key as keyof TableSpace]) ? current : next);
        };
        measure(); window.addEventListener('resize', measure);
        const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
        if (ref.current) observer?.observe(ref.current);
        observer?.observe(document.documentElement);
        return () => { window.removeEventListener('resize', measure); observer?.disconnect(); };
    }, [ref]);
    return space;
}
