import React from 'react';
import { render, screen } from '@testing-library/react';
import { Workspaces } from './index';

jest.mock('../../components/WorkspaceList', () => ({
  WorkspaceList: jest.fn(() => <div data-testid="workspace-list" />),
}));

test('that the Workspaces page header is displayed', () => {
  render(<Workspaces />);

  expect(screen.getByTestId('page-header')).toHaveTextContent('Workspaces');
});

test('that the WorkspacesList component is rendered', () => {
  render(<Workspaces />);

  expect(screen.getByTestId('workspace-list')).toBeTruthy();
});
