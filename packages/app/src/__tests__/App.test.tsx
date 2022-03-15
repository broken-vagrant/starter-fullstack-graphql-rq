import { expect, it } from 'vitest';

import AppProvider from '@/lib/providers';
import { render, screen, userEvent } from '@/utils/test-utils';
import App from '@/App';

it('Should signup', async () => {
  render(
    <AppProvider>
      <App basename="/" />
    </AppProvider>
  );

  expect(
    screen.getByRole('heading', {
      name: 'Auth Demo',
      level: 1,
    })
  ).toBeDefined();
});
