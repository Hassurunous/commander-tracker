import { useArgs } from 'storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerFrame } from './PlayerFrame';
import { updatePoison } from '../poison';

const meta = {
    title: 'Components/PlayerFrame', component: PlayerFrame,
    args: { name: 'Player 1', seat: 1, life: 40, poison: 0, onLifeChange: () => {}, onPoisonChange: () => {} },
    render: function Frame(args) {
        const [{ life, poison }, updateArgs] = useArgs<{ life: number; poison: number }>();
        return <div style={{ maxWidth: 520 }}><PlayerFrame {...args} life={life} poison={poison} onLifeChange={delta => updateArgs({ life: life + delta })} onPoisonChange={delta => updateArgs({ poison: updatePoison([{ name: args.name, life, poison }], 0, delta)[0].poison })} /></div>;
    },
} satisfies Meta<typeof PlayerFrame>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const LongName: Story = { args: { name: 'Alexandria the Extraordinary Commander' } };
export const NegativeLife: Story = { args: { life: -999 } };
export const LargeLife: Story = { args: { life: 10000 } };
export const Narrow: Story = { decorators: [Story => <div style={{ width: 296, maxWidth: '100%' }}><Story /></div>] };
export const EnlargedText: Story = { decorators: [Story => <div style={{ fontSize: '200%' }}><Story /></div>], parameters: { docs: { description: { story: 'Inherited text enlargement example; also validate browser text zoom because rem-based text follows the document root.' } } } };
