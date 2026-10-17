import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { TableSetup } from './TableSetup';
const meta = { title: 'Components/TableSetup', component: TableSetup, args: { onStart: () => {} } } satisfies Meta<typeof TableSetup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const InvalidCount: Story = { play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'Number of players' });
    await userEvent.clear(input); await userEvent.type(input, '13');
    await userEvent.click(canvas.getByRole('button', { name: 'Start table' }));
    await expect(canvas.getByRole('alert')).toHaveTextContent('Choose a whole number from 2 to 12.');
} };
export const Narrow: Story = { decorators: [Story => <div style={{ width: 296, maxWidth: '100%' }}><Story /></div>] };
