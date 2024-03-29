import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'jest-axe';
import type { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import WorkspaceAddButton from './WorkspaceAddButton';

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

const openModal = () => {
  fireEvent.click(screen.getByText('Create workspace'));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
};

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  ...jest.requireActual('@openshift/dynamic-plugin-sdk-utils'),
  k8sCreateResource: jest.fn(),
}));
const k8sCreateResourceMock = k8sCreateResource as jest.Mock;

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('Add Workspace modal', () => {
  beforeEach(() => {
    jest.resetModules();
    k8sCreateResourceMock.mockClear();
    mockedUsedNavigate.mockClear();

    render(
      <MemoryRouter>
        <WorkspaceAddButton workspaces={workspacesMockData} />
      </MemoryRouter>,
    );
  });

  test('Modal opens when user clicks on Create workspace button', () => {
    // Sanity check to see if component loaded
    expect(screen.getByText('Create workspace')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    openModal();
  });

  test('Is accessible', async () => {
    openModal();
    // Button is accessible
    let results = await axe(screen.getByText('Create workspace'));
    expect(results).toHaveNoViolations();

    //Modal is accessible
    results = await axe(screen.getByRole('dialog'));
    expect(results).toHaveNoViolations();
  });

  test('Create button is disabled and name field is empty when modal opens', () => {
    openModal();

    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByText('Create')).toBeDisabled();
  });

  describe('Create button is disabled if name is not valid', () => {
    test('Name starts with a dash', () => {
      openModal();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '-workspace' },
      });
      expect(screen.getByText('Create')).toBeDisabled();
    });

    test('Name starts with an invalid character', () => {
      openModal();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '$workspace' },
      });
      expect(screen.getByText('Create')).toBeDisabled();
    });

    test('Name starts with a capital letter', () => {
      openModal();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'Workspace' },
      });
      expect(screen.getByText('Create')).toBeDisabled();
    });

    test('Name has invalid character in the middle', () => {
      openModal();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'work&space' },
      });
      expect(screen.getByText('Create')).toBeDisabled();
    });

    test('Name has  a capital letter in the middle', () => {
      openModal();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'workSpace' },
      });
      expect(screen.getByText('Create')).toBeDisabled();
    });

    test('Name ends with a dash', () => {
      openModal();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'workspace-' },
      });
      expect(screen.getByText('Create')).toBeDisabled();
    });

    test('Name ends with an invalid character', () => {
      openModal();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'workspace$' },
      });
      expect(screen.getByText('Create')).toBeDisabled();
    });

    test('Name ends with a capital letter', () => {
      openModal();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'workspacE' },
      });
      expect(screen.getByText('Create')).toBeDisabled();
    });
  });
  describe('Create button is enabled with a valid name', () => {
    test('Name starts with a number', () => {
      openModal();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '1workspace' },
      });
      expect(screen.getByText('Create')).not.toBeDisabled();
    });

    test('Name starts with a lower case letter', () => {
      openModal();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'workspace' },
      });
      expect(screen.getByText('Create')).not.toBeDisabled();
    });

    test('Name has a dash in the middle', () => {
      openModal();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'work-space' },
      });
      expect(screen.getByText('Create')).not.toBeDisabled();
    });

    test('Name ends with a number', () => {
      openModal();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '1workspace1' },
      });
      expect(screen.getByText('Create')).not.toBeDisabled();
    });

    test('Name ends with a lower case letter', () => {
      openModal();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '1workspace' },
      });
      expect(screen.getByText('Create')).not.toBeDisabled();
    });
  });

  test('Create button is disabled if name matches an existing name', () => {
    openModal();

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'demo-ws2' },
    });
    expect(screen.getByText('Create')).toBeDisabled();
  });

  test('Error is shown on modal if post fails', async () => {
    const err = new Error('test error');

    k8sCreateResourceMock.mockRejectedValue(err);

    openModal();

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

  test('Modal closes on successfully post', async () => {
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

    openModal();

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

    await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledWith('1workspace'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('Modal shows error if addition is successfully created but unable to verify workspace name', async () => {
    k8sCreateResourceMock.mockResolvedValue({
      metadata: {
        uid: 'my-uuid',
      },
      spec: {
        type: {
          name: 'universal',
        },
      },
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    openModal();

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '1workspace' },
    });

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => expect(k8sCreateResourceMock).toHaveBeenCalledTimes(1));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('Clicking cancel button closes modal', () => {
    openModal();
    fireEvent.click(screen.getByText('Cancel'));
    expect(k8sCreateResourceMock).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('Clicking cancel "x" closes modal', () => {
    openModal();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(k8sCreateResourceMock).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });
});
