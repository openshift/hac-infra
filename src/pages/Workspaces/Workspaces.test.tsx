import React from 'react';
import { render, screen } from '@testing-library/react';
import { Workspaces } from './index';

jest.mock('../../components/WorkspacesGettingStarted', () => ({
  WorkspacesGettingStartedCard: jest.fn(() => <div data-testid="workspaces-getting-started-card" />),
}));

jest.mock('../../components/WorkspaceList', () => ({
  WorkspaceList: jest.fn(() => <div data-testid="workspace-list" />),
}));

test('that the Workspaces page header is displayed', () => {
  render(<Workspaces />);

  expect(screen.getByTestId('page-header')).toHaveTextContent('Workspaces');
});

test('that the WorkspacesGettingStartedCard component is rendered', () => {
  render(<Workspaces />);

  expect(screen.getByTestId('workspaces-getting-started-card')).toBeInTheDocument();
});

test('that the WorkspacesList component is rendered', () => {
  render(<Workspaces />);

  expect(screen.getByTestId('workspace-list')).toBeTruthy();
});
