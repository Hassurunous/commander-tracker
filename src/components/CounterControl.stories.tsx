import { useArgs } from 'storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CounterControl } from './CounterControl';

const meta = {
    title: 'Components/CounterControl',
    component: CounterControl,
    args: { playerName: 'Player 1', label: 'Life', value: 40, onChange: () => {} },
    render: function InteractiveCounter(args) {
        const [{ value }, updateArgs] = useArgs<{ value: number }>();
        return <CounterControl {...args} value={value} onChange={delta => updateArgs({ value: args.label === 'Poison' ? Math.max(0, value + delta) : value + delta })} />;
    },
} satisfies Meta<typeof CounterControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Life: Story = {};
export const NegativeLife: Story = { args: { value: -1 } };
export const LargeLife: Story = { args: { value: 10000 } };
export const PoisonAtZero: Story = { args: { label: 'Poison', value: 0 } };
export const PositivePoison: Story = { args: { label: 'Poison', value: 3 } };
