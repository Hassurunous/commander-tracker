import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrackerEntry } from './TrackerEntry';
const meta = { title: 'Components/TrackerEntry', component: TrackerEntry, args: { playerName: 'Player 1', onClick: () => {} } } satisfies Meta<typeof TrackerEntry>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const LongPlayerName: Story = { args: { playerName: 'Alexandria the Extraordinary Commander' } };
