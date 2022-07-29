import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PluginEntry } from './index';

jest.mock('react-helmet', () => ({
  Helmet: jest.fn(() => <div data-testid="helmet" />),
}));

jest.mock('../Workspaces', () => ({
  Workspaces: jest.fn(() => <div data-testid="workspaces" />),
}));

test('that the workspaces component gets rendered', () => {
  render(<PluginEntry />);
  expect(screen.getByTestId('workspaces')).toBeTruthy();
  expect(screen.getByTestId('helmet')).toBeTruthy();
});
