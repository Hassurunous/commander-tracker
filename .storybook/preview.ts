/// <reference types="vite/client" />
import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

const preview: Preview = {
    tags: ['autodocs'],
    parameters: {
        controls: { expanded: true },
        a11y: { test: 'todo' },
    },
};

export default preview;
