import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import WorkspaceDetailsPage from './WorkspaceDetails';

jest.mock('../../components/WorkspaceDetails', () => ({
  WorkspaceDetails: jest.fn(() => <div data-testid="workspace-details-component" />),
}));

describe('WorkspaceDetails Page', () => {
  test('that the WorkspaceDetails component is rendered', () => {
    render(<WorkspaceDetailsPage />);

    expect(screen.getByTestId('workspace-details-component')).toBeTruthy();
  });

  test('is accessible', async () => {
    const { container } = render(<WorkspaceDetailsPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
