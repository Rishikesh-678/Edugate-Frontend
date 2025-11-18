import '../src/index.css'; // Import Tailwind's CSS
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    // Add a MemoryRouter decorator so components using <Link> don't break
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default preview;