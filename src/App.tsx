import { useState } from 'react';
import LifeTracker from './LifeTracker';
import { TableSetup } from './components/TableSetup';

export default function App() {
    const [playerCount, setPlayerCount] = useState<number | null>(null);
    return <main aria-label="Commander Life Tracker">
        {playerCount === null ? <TableSetup onStart={setPlayerCount} /> : <LifeTracker initialCount={playerCount} />}
    </main>;
}
