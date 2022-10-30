import React from 'react';
import { DetailsPage, k8sGetResource, K8sModelCommon /* , useK8sWatchResource */ } from '@openshift/dynamic-plugin-sdk-utils';
import type { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { PageContentWrapper } from '../common';
import OverviewTab from './OverviewTab';
import ROUTES from '../../../config/routeNames';
import { useParams, useNavigate } from 'react-router-dom';

import WorkspaceDeleteModal from '../WorkspaceDelete/WorkspaceDeleteModal';

const PAGE_TITLE = 'Workspace Details';

const WorkspaceDetailsTabs = (workspace: K8sResourceCommon, loaded: boolean, error: { message: string; status: number }) => {
  return [
    {
      key: 'overview',
      title: 'Overview',
      content: <OverviewTab loaded={loaded} resource={workspace} error={error} />,
      ariaLabel: 'Overview',
    },
  ];
};

const WorkspaceDetailsBreadcrumbs = (workspaceName: string) => [
  { name: 'Workspaces', path: ROUTES.workspaces },
  { name: 'Workspace Details', path: workspaceName ? `${ROUTES.workspaces}/${workspaceName}` : '' },
];

const WorkspaceActionMenu = (setDeleteModalOpen: (isOpen: boolean) => void) => ({
  actions: [
    {
      id: 'delete',
      label: 'Delete workspace',
      cta: {
        callback: () => {
          setDeleteModalOpen(true);
        },
      },
    },
  ],
  isDisabled: false,
});

const WorkspaceModel: K8sModelCommon = {
  apiVersion: 'v1beta1',
  apiGroup: 'tenancy.kcp.dev',
  kind: 'Workspace',
  plural: 'workspaces',
};

const WorkspaceDetails = () => {
  const { workspaceName } = useParams();
  const navigate = useNavigate();

  const [workspace, setWorkspace] = React.useState<K8sResourceCommon | undefined>();
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState<
    | {
        message: string;
        status: number;
      }
    | undefined
  >();
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  // Watch isn't currently working
  // const watchedResource = {
  //   isList: false,
  //   groupVersionKind: {
  //     group: 'tenancy.kcp.dev',
  //     version: 'v1beta1',
  //     kind: 'Workspace',
  //   },
  // };

  // console.log('KKD - workspaceName', workspaceName);
  // const [workspaceWatch, loadedWatch, errorWatch] = useK8sWatchResource(watchedResource, {
  //   wsPrefix: `ws/kcp/${workspaceName}`,
  //   pathPrefix: `/api/kcp/${workspaceName}`,
  // });
  // console.log('KKD - workspace:', workspaceWatch, loadedWatch);

  React.useEffect(() => {
    setLoaded(false);
    setError(undefined);
    k8sGetResource({
      model: WorkspaceModel,
      queryOptions: { path: workspaceName },
    })
      .then((response) => {
        setWorkspace(response as K8sResourceCommon);
      })
      .catch((err) => {
        setError({ message: err.message, status: err.json.code });
      })
      .finally(() => {
        setLoaded(true);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContentWrapper>
      <WorkspaceDeleteModal
        workspaceName={workspace?.metadata?.name}
        isOpen={deleteModalOpen}
        closeModal={() => setDeleteModalOpen(false)}
        onDelete={() => {
          navigate(ROUTES.workspaces);
        }}
      />
      <DetailsPage
        ariaLabel={PAGE_TITLE}
        tabs={WorkspaceDetailsTabs(workspace, loaded, error)}
        breadcrumbs={WorkspaceDetailsBreadcrumbs(workspace?.metadata?.name)}
        pageHeading={{ title: workspace?.metadata?.name || workspaceName || PAGE_TITLE }}
        actionMenu={WorkspaceActionMenu(setDeleteModalOpen)}
      />
    </PageContentWrapper>
  );
};

export default WorkspaceDetails;
