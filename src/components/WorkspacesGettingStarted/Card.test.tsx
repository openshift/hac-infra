import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { WorkspacesGettingStartedCard } from './index';

jest.mock('../../components/HelpTopicLink', () => ({
  HelpTopicLink: jest.fn(() => <span>mock help topic link</span>),
}));

describe('WorkspacesGettingStartedCard', () => {
  test('should have an image', () => {
    render(<WorkspacesGettingStartedCard />);
    expect(screen.getByRole('img')).toBeVisible();
  });

  test('should have a title', () => {
    render(<WorkspacesGettingStartedCard />);
    expect(screen.getByText('Get started with Workspaces')).toBeVisible();
  });

  test('should not be dismissable', () => {
    render(<WorkspacesGettingStartedCard />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('is accessible', async () => {
    const { container } = render(<WorkspacesGettingStartedCard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
