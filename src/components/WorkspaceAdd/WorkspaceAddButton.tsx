import * as React from 'react';
import {
  Alert,
  Button,
  FormGroup,
  Modal,
  ModalVariant,
  TextInput,
  ValidatedOptions,
  FormSelect,
  FormSelectOption,
  Form,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import type { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { k8sCreateResource, K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { useNavigate } from 'react-router-dom';

const workspaceTypes = ['universal']; // There isn't an api endpoint to get the list of workspace types yet.
const workspaceTypeDefault = workspaceTypes[0];

const apiVersion = 'v1beta1';
const apiGroup = 'tenancy.kcp.dev';
const kind = 'Workspace';

const WorkspaceModel: K8sModelCommon = {
  apiVersion,
  apiGroup,
  kind,
  plural: 'workspaces',
};

const isValidWorkspaceName = (workspaceName: string): boolean => {
  if (!workspaceName || workspaceName.length > 63) {
    return false;
  }
  return /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/g.test(workspaceName);
};

const isUniqueName = (workspaceName: string, existingWorkspaces: K8sResourceCommon[] = []) =>
  !existingWorkspaces.some((workspace) => workspace.metadata.name === workspaceName);

const WorkspaceAddButton = ({ workspaces }: { workspaces: K8sResourceCommon[] }) => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [workspaceName, setWorkspaceName] = React.useState('');
  const [workspaceType, setWorkspaceType] = React.useState(workspaceTypeDefault);
  const [isValidName, setIsValidName] = React.useState(ValidatedOptions.default);
  const [nameExists, setNameExists] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const createWorkspace = () => {
    setLoading(true);

    k8sCreateResource({
      model: WorkspaceModel,
      resource: {
        apiVersion: `${apiGroup}/${apiVersion}`,
        kind,
        metadata: { name: workspaceName },
        spec: { type: { name: workspaceType } },
      },
    })
      .then((response) => {
        setIsModalOpen(!isModalOpen);
        navigate(`${response.metadata.name}`);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    if (!isModalOpen) {
      setWorkspaceName('');
      setError('');
      setWorkspaceType(workspaceTypeDefault);
      setLoading(false);
    }
  }, [isModalOpen]);

  React.useEffect(() => {
    const validName = isValidWorkspaceName(workspaceName);
    if (!validName) {
      setNameExists(false);
      setIsValidName(ValidatedOptions.error);
    } else if (!isUniqueName(workspaceName, workspaces)) {
      setNameExists(true);
      setIsValidName(ValidatedOptions.error);
    } else {
      setIsValidName(ValidatedOptions.success);
    }
  }, [workspaceName, workspaces]);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Create workspace</Button>
      <Modal
        variant={ModalVariant.small}
        title="Create a workspace"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        actions={[
          !error ? (
            <Button key="confirm" variant="primary" onClick={createWorkspace} isDisabled={isValidName !== ValidatedOptions.success}>
              Create
            </Button>
          ) : null,
          <Button key="cancel" variant="link" onClick={() => setIsModalOpen(false)}>
            {!error ? 'Cancel' : 'Close'}
          </Button>,
        ]}
      >
        {error ? <Alert variant="danger" isInline title={error} role="alert" titleHeadingLevel="h2" /> : null}
        {loading ? 'Loading ....' : null}
        {!error && !loading ? (
          <Form>
            <FormGroup
              label="Name"
              isRequired
              helperTextInvalid={nameExists ? 'This name already exists' : 'Must only contain letters, numbers, and dashes'}
              helperTextInvalidIcon={<ExclamationCircleIcon />}
              validated={isValidName}
              fieldId="workspace-name"
            >
              <TextInput
                isRequired
                type="text"
                value={workspaceName}
                onChange={setWorkspaceName}
                validated={isValidName}
                id="workspace-name"
                name="workspace-name"
              />
            </FormGroup>

            <FormGroup label="Type" fieldId="workspace-type">
              <FormSelect value={workspaceType} onChange={setWorkspaceType} id="workspace-type" name="workspace-type">
                {workspaceTypes.map((option, index) => (
                  <FormSelectOption key={index} value={option} label={option} />
                ))}
              </FormSelect>
            </FormGroup>
          </Form>
        ) : null}
      </Modal>
    </>
  );
};

export default WorkspaceAddButton;
