import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { toHaveNoViolations, axe } from 'jest-axe';
expect.extend(toHaveNoViolations);

import { MemoryRouter } from 'react-router-dom';

import type { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import WorkspaceAddModal from './WorkspaceAddModal';

const workspacesMockData: K8sResourceCommon[] = [
  {
    apiVersion: 'v1beta1',
    apiGroup: 'tenancy.kcp.dev',
    kind: 'Workspace',
    metadata: {
      name: 'demo-ws1',
    },
  },
  {
    apiVersion: 'v1beta1',
    apiGroup: 'tenancy.kcp.dev',
    kind: 'Workspace',
    metadata: {
      name: 'demo-ws2',
    },
  },
];

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  ...jest.requireActual('@openshift/dynamic-plugin-sdk-utils'),
  k8sCreateResource: jest.fn(),
}));
const k8sCreateResourceMock = k8sCreateResource as jest.Mock;

const onCloseMock = jest.fn();

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('Add Workspace modal', () => {
  beforeEach(() => {
    jest.resetModules();
    k8sCreateResourceMock.mockClear();
    onCloseMock.mockClear();
    mockedUsedNavigate.mockClear();
    render(
      <MemoryRouter>
        <WorkspaceAddModal workspaces={workspacesMockData} isOpen={true} onClose={onCloseMock} />
      </MemoryRouter>,
    );
  });

  test('Is accessible', async () => {
    //Modal is accessible
    const results = await axe(screen.getByRole('dialog'));
    expect(results).toHaveNoViolations();
  });

  test('Create button is disabled and name field is empty when modal opens', () => {
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByText('Create')).toBeDisabled();
  });

  describe('Create button is disabled if name is not valid', () => {
    test('Name starts with a dash', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '-workspace' },
      });
      expect(screen.getByText('Create')).toBeDisabled();
    });

    test('Name starts with an invalid character', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '$workspace' },
      });
      expect(screen.getByText('Create')).toBeDisabled();
    });

    test('Name starts with a capital letter', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'Workspace' },
      });
      expect(screen.getByText('Create')).toBeDisabled();
    });

    test('Name has invalid character in the middle', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'work&space' },
      });
      expect(screen.getByText('Create')).toBeDisabled();
    });

    test('Name has  a capital letter in the middle', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'workSpace' },
      });
      expect(screen.getByText('Create')).toBeDisabled();
    });

    test('Name ends with a dash', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'workspace-' },
      });
      expect(screen.getByText('Create')).toBeDisabled();
    });

    test('Name ends with an invalid character', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'workspace$' },
      });
      expect(screen.getByText('Create')).toBeDisabled();
    });

    test('Name ends with a capital letter', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'workspacE' },
      });
      expect(screen.getByText('Create')).toBeDisabled();
    });
  });
  describe('Create button is enabled with a valid name', () => {
    test('Name starts with a number', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '1workspace' },
      });
      expect(screen.getByText('Create')).not.toBeDisabled();
    });

    test('Name starts with a lower case letter', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'workspace' },
      });
      expect(screen.getByText('Create')).not.toBeDisabled();
    });

    test('Name has a dash in the middle', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'work-space' },
      });
      expect(screen.getByText('Create')).not.toBeDisabled();
    });

    test('Name ends with a number', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '1workspace1' },
      });
      expect(screen.getByText('Create')).not.toBeDisabled();
    });

    test('Name ends with a lower case letter', () => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '1workspace' },
      });
      expect(screen.getByText('Create')).not.toBeDisabled();
    });
  });

  test('Create button is disabled if name matches an existing name', () => {
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'demo-ws2' },
    });
    expect(screen.getByText('Create')).toBeDisabled();
  });

  test('Error is shown on modal if post fails', async () => {
    const err = new Error('test error');

    k8sCreateResourceMock.mockRejectedValue(err);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '1workspace' },
    });

    fireEvent.click(screen.getByText('Create'));

    expect(k8sCreateResourceMock).toHaveBeenCalledTimes(1);
    expect(k8sCreateResourceMock).toHaveBeenCalledWith({
      model: {
        apiGroup: 'tenancy.kcp.dev',
        apiVersion: 'v1beta1',
        kind: 'Workspace',
        plural: 'workspaces',
      },
      resource: {
        apiVersion: 'tenancy.kcp.dev/v1beta1',
        kind: 'Workspace',
        metadata: {
          name: '1workspace',
        },
        spec: {
          type: {
            name: 'universal',
          },
        },
      },
    });

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.queryByRole('dialog')).toBeInTheDocument();
    expect(mockedUsedNavigate).not.toHaveBeenCalled();

    // Check accessibility of modal with alert
    const results = await axe(screen.queryByRole('dialog'));
    expect(results).toHaveNoViolations();
  });

  test('Modal  calls onClose on successfully post', async () => {
    k8sCreateResourceMock.mockResolvedValue({
      metadata: {
        name: '1workspace',
        uid: 'my-uuid',
      },
      spec: {
        type: {
          name: 'universal',
        },
      },
    });

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '1workspace' },
    });

    fireEvent.click(screen.getByText('Create'));

    expect(k8sCreateResourceMock).toHaveBeenCalledTimes(1);
    expect(k8sCreateResourceMock).toHaveBeenCalledWith({
      model: {
        apiGroup: 'tenancy.kcp.dev',
        apiVersion: 'v1beta1',
        kind: 'Workspace',
        plural: 'workspaces',
      },
      resource: {
        apiVersion: 'tenancy.kcp.dev/v1beta1',
        kind: 'Workspace',
        metadata: {
          name: '1workspace',
        },
        spec: {
          type: {
            name: 'universal',
          },
        },
      },
    });
    await waitFor(() => expect(onCloseMock).toBeCalledTimes(1));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('1workspace');
  });

  test('Clicking cancel button calls onClose', async () => {
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => expect(onCloseMock).toBeCalledTimes(1));
    expect(k8sCreateResourceMock).not.toHaveBeenCalled();
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('Clicking cancel "x" calls onClose', async () => {
    fireEvent.click(screen.getByLabelText('Close'));
    await waitFor(() => expect(onCloseMock).toBeCalledTimes(1));
    expect(k8sCreateResourceMock).not.toHaveBeenCalled();
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });
});
