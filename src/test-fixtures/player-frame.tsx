// Browser-only fixture; not imported by the application entry point.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { PlayerFrame } from '../components/PlayerFrame';
import { updatePoison } from '../poison';
import '../index.css';

function FrameFixture() {
    const query = new URLSearchParams(location.search);
    const [player, setPlayer] = useState({ name: query.get('name') || 'Player 1', life: Number(query.get('life') ?? 40), poison: 0 });
    return <main aria-label="Player frame fixture"><PlayerFrame {...player} seat={1}
        onLifeChange={delta => setPlayer(current => ({ ...current, life: current.life + delta }))}
        onPoisonChange={delta => setPlayer(current => updatePoison([current], 0, delta)[0])} /></main>;
}

createRoot(document.getElementById('root')!).render(<FrameFixture />);
