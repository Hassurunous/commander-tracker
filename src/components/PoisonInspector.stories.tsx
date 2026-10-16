import { expect } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerFrame } from './PlayerFrame';
import FrameStory from './PlayerFrame.stories.tsx';
const meta = { title: 'Components/PoisonInspector', component: PlayerFrame, ...{ args: FrameStory.args }, render: FrameStory.render } satisfies Meta<typeof PlayerFrame>;
export default meta;
type Story = StoryObj<typeof meta>;
// Reuse the production frame workflow so open, close and return-focus are real.
export const OpenAndClose: Story = { args: { name: 'Player 1', seat: 1, life: 40, poison: 0, onLifeChange: () => {}, onPoisonChange: () => {} }, play: async ({ canvas, userEvent }) => { await userEvent.click(canvas.getByRole('button', { name: 'Trackers for Player 1' })); await expect(canvas.getByRole('dialog', { name: 'Trackers for Player 1' })).toBeVisible(); } };
export const PositivePoison: Story = { ...OpenAndClose, args: { ...OpenAndClose.args, poison: 3 } };
