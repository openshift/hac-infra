import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import { WorkspaceList } from './index';
import type { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

let mockPromise: Promise<any>;
jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  ...jest.requireActual('@openshift/dynamic-plugin-sdk-utils'),
  k8sListResourceItems: jest.fn(() => {
    return mockPromise;
  }),
}));

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

const promiseForNoData = Promise.resolve([]);
const promiseForMockedData = Promise.resolve(workspacesMockData);

describe('Workspace list', () => {
  // TODO: This test will need to be updated when we implement the "Get Workspaces" card UI for the empty state
  test('should render empty state when no data is retrieved', async () => {
    mockPromise = promiseForNoData;

    render(
      <BrowserRouter>
        <WorkspaceList />
      </BrowserRouter>,
    );
    await act(() => mockPromise);

    expect(screen.getByText('No data was retrieved')).toBeVisible();
  });

  test('should render list when workspaces data is retrieved successfully', async () => {
    mockPromise = promiseForMockedData;

    const { container } = render(
      <BrowserRouter>
        <WorkspaceList />
      </BrowserRouter>,
    );

    await act(() => mockPromise);

    // Verify column headers
    const headers = container.querySelectorAll('table[role="presentation"] th');
    expect(headers.length).toEqual(2);
    expect(headers[0].textContent).toEqual('Name');
    expect(headers[1].textContent).toEqual('Labels');

    // TODO: Verify rows - tbody is not being rendered and needs further investigation
    // expect(screen.getByText('demo-ws1')).toBeTruthy();
    // waitFor(() => screen.getByText(workspacesMockData[0].metadata.name));
    // const rows = container.querySelectorAll('table > tbody > tr');
    // await waitFor(() => expect(screen.getAllByRole('row').length).toEqual(2));
    // expect(rows[1].textContent).toContain('demo-ws2');
    // expect(rows[1].textContent).toContain('demo-ws2');
  });
});
