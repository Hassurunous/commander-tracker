import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerRoster } from './PlayerRoster';
import { createTable } from '../table';
const meta = { title: 'Components/PlayerRoster', component: PlayerRoster, args: { players: [], selectedId: '', onSelect: () => {}, onAdjust: () => {} },
    render: function Roster() { const [players] = useState(() => createTable(12)); const [selectedId, onSelect] = useState(players[0].id); return <PlayerRoster players={players} selectedId={selectedId} onSelect={onSelect} onAdjust={() => {}} />; },
} satisfies Meta<typeof PlayerRoster>;
export default meta;
type Story = StoryObj<typeof meta>;
export const TwelveSeats: Story = {};
