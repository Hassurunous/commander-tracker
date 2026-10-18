import { forwardRef } from 'react';
import type { PlayerFrameProps } from './PlayerFrame';
import { PlayerFrame } from './PlayerFrame';
export const SelectedPlayerEditor = forwardRef<HTMLHeadingElement, PlayerFrameProps>(function SelectedPlayerEditor(props, ref) {
    return <section className="selected-player-editor" aria-labelledby="selected-player-editor">
        <h2 id="selected-player-editor" tabIndex={-1} ref={ref}>Editing {props.name}</h2>
        <PlayerFrame {...props} />
    </section>;
});
