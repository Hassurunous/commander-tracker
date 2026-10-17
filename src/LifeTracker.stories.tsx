import type { Meta, StoryObj } from '@storybook/react-vite';
import LifeTracker from './LifeTracker';

const meta = {
    title: 'Application/LifeTracker',
    component: LifeTracker,
} satisfies Meta<typeof LifeTracker>;

export default meta;
type Story = StoryObj<typeof meta>;
export const TwoPlayers: Story = {};

export const FourPlayers: Story = { args: { initialCount: 4 } };
export const TwelvePlayers: Story = { args: { initialCount: 12 } };
