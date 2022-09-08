import * as React from 'react';
import { Alert, Button, Modal, ModalVariant, TextInput } from '@patternfly/react-core';
import type { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { k8sDeleteResource } from '@openshift/dynamic-plugin-sdk-utils';

const apiVersion = 'v1beta1';
const apiGroup = 'tenancy.kcp.dev';
const kind = 'Workspace';

const WorkspaceModel: K8sModelCommon = {
  apiVersion,
  apiGroup,
  kind,
  plural: 'workspaces',
};

const WorkspaceDeleteModal = ({ workspaceName, isOpen, closeModal }: { workspaceName: string; isOpen: boolean; closeModal: () => void }) => {
  const [confirmText, setConfirmText] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setConfirmText(''), setError('');
  }, [workspaceName, isOpen]);

  const deleteWorkspace = () => {
    setLoading(true);

    k8sDeleteResource({ model: WorkspaceModel, queryOptions: { path: workspaceName } })
      .then(() => {
        closeModal();
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Modal
        variant={ModalVariant.small}
        title="Delete workspace"
        description={
          <>
            <span className="pf-u-color-400">Workspace</span> {workspaceName}
          </>
        }
        isOpen={isOpen}
        onClose={() => closeModal()}
        actions={[
          !error && !loading ? (
            <Button
              key="confirm"
              variant="danger"
              onClick={() => {
                deleteWorkspace();
              }}
              isDisabled={confirmText !== workspaceName}
            >
              Delete
            </Button>
          ) : null,
          <Button key="cancel" variant="link" onClick={() => closeModal()}>
            {!error ? 'Cancel' : 'Close'}
          </Button>,
        ]}
      >
        {error ? <Alert variant="danger" isInline title={error} role="alert" titleHeadingLevel="h2" /> : null}
        {loading ? 'Loading ....' : null}
        {!error && !loading ? (
          <>
            <p> This action cannot be undone. All data will be deleted.</p>
            <p className="pf-u-my-sm">
              Confirm deletion by typing <span className="pf-u-font-weight-bold">{workspaceName}</span> below:
            </p>

            <TextInput
              type="text"
              value={confirmText}
              onChange={setConfirmText}
              id="workspace-name"
              name="workspace-name"
              aria-label={`Type ${workspaceName} to confirm delete`}
            />
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default WorkspaceDeleteModal;
