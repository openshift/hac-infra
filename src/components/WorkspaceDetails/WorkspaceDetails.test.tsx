import * as React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import type { MemoryHistory } from 'history';
import { k8sGetResource, k8sDeleteResource } from '@openshift/dynamic-plugin-sdk-utils';
import { WorkspaceDetails } from './index';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  ...jest.requireActual('@openshift/dynamic-plugin-sdk-utils'),
  k8sGetResource: jest.fn(),
  k8sDeleteResource: jest.fn(),
}));
const k8sGetResourceMock = k8sGetResource as jest.Mock;
const k8sDeleteResourceMock = k8sDeleteResource as jest.Mock;

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

const useNavigateMock = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    workspaceName: workspaceData.metadata.name,
  }),
  useNavigate: () => useNavigateMock,
}));

describe('Workspace Details Page', () => {
  let history: MemoryHistory;

  beforeEach(() => {
    jest.resetModules();
    k8sGetResourceMock.mockClear();
    k8sDeleteResourceMock.mockClear();
    history = createMemoryHistory();
    history.push('/workspaces/demo-workspace');
    useNavigateMock.mockClear();
  });

  test('Call to get information is made', async () => {
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
  describe('Action menu', () => {
    it('delete workspace', async () => {
      k8sGetResourceMock.mockResolvedValue(workspaceData);
      k8sDeleteResourceMock.mockResolvedValue({});
      render(
        <Router location={history.location} navigator={history}>
          <WorkspaceDetails />
        </Router>,
      );
      await waitFor(() => expect(k8sGetResourceMock).toHaveBeenCalledTimes(1));

      // Open delete modal
      fireEvent.click(screen.getByText('Actions'));
      expect(await screen.findByText('Delete workspace')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Delete workspace'));

      // Delete workspace via the modal
      expect(await screen.findByRole('dialog')).toBeInTheDocument();
      expect(await screen.findByRole('textbox')).toBeInTheDocument();
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'demo-workspace' },
      });
      fireEvent.click(screen.getByText('Delete'));
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

      // Verify delete and navigation to the workspace list page
      expect(k8sDeleteResourceMock).toHaveBeenCalled();
      expect(useNavigateMock).toHaveBeenCalledWith('/workspaces');
    });
  });

  describe('Overview tab', () => {
    test('Data is displayed', async () => {
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

    test('Is accessible', async () => {
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

    test('Error is displayed', async () => {
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
