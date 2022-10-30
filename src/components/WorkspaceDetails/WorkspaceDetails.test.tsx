import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import type { MemoryHistory } from 'history';
import { k8sGetResource } from '@openshift/dynamic-plugin-sdk-utils';
import { WorkspaceDetails } from './index';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  ...jest.requireActual('@openshift/dynamic-plugin-sdk-utils'),
  k8sGetResource: jest.fn(),
}));
const k8sGetResourceMock = k8sGetResource as jest.Mock;

const workspaceData = {
  apiVersion: 'v1beta1',
  apiGroup: 'tenancy.kcp.dev',
  kind: 'Workspace',
  metadata: {
    name: 'demo-workspace',
    labels: {
      label1: 'value1',
      label2: 'value2',
    },
    creationTimestamp: '2022-09-15T21:07:32Z',
  },
  spec: { type: { name: 'universal' } },
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    workspaceName: workspaceData.metadata.name,
  }),
}));

describe('Workspace Details Page', () => {
  let history: MemoryHistory;

  beforeEach(() => {
    jest.resetModules();
    k8sGetResourceMock.mockClear();
    history = createMemoryHistory();
    history.push('/workspaces/demo-workspace');
  });

  it('Call to get information is made', async () => {
    k8sGetResourceMock.mockResolvedValue(workspaceData);
    render(
      <Router location={history.location} navigator={history}>
        <WorkspaceDetails />
      </Router>,
    );

    // Test that calls have been made
    await waitFor(() => expect(k8sGetResourceMock).toHaveBeenCalledTimes(1));

    expect(k8sGetResourceMock).toHaveBeenCalledWith({
      model: { apiGroup: 'tenancy.kcp.dev', apiVersion: 'v1beta1', kind: 'Workspace', plural: 'workspaces' },
      queryOptions: { path: 'demo-workspace' },
    });
  });

  describe('Overview tab', () => {
    it('Data is displayed', async () => {
      k8sGetResourceMock.mockResolvedValue(workspaceData);
      const { container } = render(
        <Router location={history.location} navigator={history}>
          <WorkspaceDetails />
        </Router>,
      );
      // Ensure that the useEffect has fully finished
      expect(await screen.findByText('universal')).toBeInTheDocument();

      expect(screen.getByText('label1=value1')).toBeInTheDocument();
      expect(screen.queryByText('Labels')).toBeInTheDocument();

      // Ensure that we are on the Overview tab
      expect(container.querySelector('.pf-m-current')).toHaveTextContent('Overview');
      expect(screen.getAllByText('demo-workspace').length).not.toEqual(0);
    });

    it('Is accessible', async () => {
      k8sGetResourceMock.mockResolvedValue(workspaceData);
      const { container } = render(
        <Router location={history.location} navigator={history}>
          <WorkspaceDetails />
        </Router>,
      );
      // Ensure that the useEffect has fully finished
      expect(await screen.findByText('universal')).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Error is displayed', async () => {
      const err = { message: 'Sample Error', json: { code: 123 } };
      k8sGetResourceMock.mockRejectedValue(err);

      render(
        <Router location={history.location} navigator={history}>
          <WorkspaceDetails />
        </Router>,
      );
      expect(await screen.findByText('Sample Error')).toBeInTheDocument();
      expect(screen.queryByText('Labels')).not.toBeInTheDocument();
    });
  });
});
