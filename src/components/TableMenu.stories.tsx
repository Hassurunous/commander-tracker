import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableMenu } from './TableMenu';
import type { Density, TableMode } from '../layout';
const meta = { title: 'Components/TableMenu', component: TableMenu, args: { mode: 'pass-around', density: 'auto', onMode: () => {}, onDensity: () => {} }, render: function Menu() {
    const [mode, onMode] = useState<TableMode>('pass-around'); const [density, onDensity] = useState<Density>('auto');
    return <TableMenu mode={mode} density={density} onMode={onMode} onDensity={onDensity} />;
} } satisfies Meta<typeof TableMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const OpenAndChoose: Story = { play: async ({ canvas, userEvent }) => { await userEvent.click(canvas.getByRole('button', { name: 'Table menu' })); } };
