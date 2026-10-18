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

export const FocusRoster: Story = { args: { initialCount: 12, initialMode: 'focus' } };
export const TwoSeatPaging: Story = { args: { initialCount: 12, initialDensity: 2 } };
export const TabletopFour: Story = { args: { initialCount: 4, initialMode: 'tabletop' } };
export const TabletopTwo: Story = { args: { initialCount: 2, initialMode: 'tabletop', initialDensity: 2 } };
export const TabletopPaging: Story = { args: { initialCount: 12, initialMode: 'tabletop' } };
