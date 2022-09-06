import * as React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { WorkspaceList } from './index';
import type { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  ...jest.requireActual('@openshift/dynamic-plugin-sdk-utils'),
  useK8sWatchResource: jest.fn(),
}));

const useK8sWatchResourceMock = jest.mocked(useK8sWatchResource, false);

const workspacesMockData: K8sResourceCommon[] = [
  {
    apiVersion: 'v1beta1',
    apiGroup: 'tenancy.kcp.dev',
    kind: 'Workspace',
    metadata: {
      name: 'demo-ws1',
      labels: {
        ['label1']: 'value1',
        ['label2']: 'value2',
      },
    },
  },
  {
    apiVersion: 'v1beta1',
    apiGroup: 'tenancy.kcp.dev',
    kind: 'Workspace',
    metadata: {
      name: 'demo-ws2',
      labels: {
        ['label3']: 'value3',
        ['label4']: 'value4',
      },
    },
  },
];

describe('Workspace list', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('should render error when there is an error fetching workspaces', async () => {
    useK8sWatchResourceMock.mockReturnValue([[], true, { status: 403, message: 'Workspace access not permitted' }]);

    const { container } = render(
      <BrowserRouter>
        <WorkspaceList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Workspace access not permitted')).toBeTruthy();
      expect(container.querySelector('table')).toBeNull();
    });
  });

  // TODO: This test will need to be updated when we implement the "Get Workspaces" card UI for the empty state
  test('should render empty state when no data is retrieved', async () => {
    useK8sWatchResourceMock.mockReturnValue([[], true, null]);

    render(
      <BrowserRouter>
        <WorkspaceList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('No data was retrieved')).toBeVisible();
    });
  });

  test('should render list when workspaces data is retrieved successfully', async () => {
    useK8sWatchResourceMock.mockReturnValue([[...workspacesMockData], true, null]);

    const { container } = render(
      <BrowserRouter>
        <WorkspaceList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      const headers = container.querySelectorAll('table[role="presentation"] th');
      expect(headers[0].textContent).toEqual('Name');
      expect(headers[1].textContent).toEqual('Labels');

      expect(screen.getByText('demo-ws1')).toBeTruthy();
      expect(screen.getByText('demo-ws2')).toBeTruthy();

      const actions = container.querySelector('td.pf-c-table__action button[aria-label="Actions"]');
      fireEvent.click(actions);
      expect(screen.getByText('Edit workspace')).toBeTruthy();
      expect(screen.getByText('Delete workspace')).toBeTruthy();
    });
  });
});
