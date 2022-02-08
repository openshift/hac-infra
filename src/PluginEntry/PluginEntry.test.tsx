import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import { PluginEntry } from './index';

test('that the header presents the welcome message', () => {
  render(<PluginEntry />);

  expect(screen.getByTestId('page-header')).toHaveTextContent('Welcome to HAC-Infra!');
});
