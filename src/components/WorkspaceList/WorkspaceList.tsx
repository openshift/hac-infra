import * as React from 'react';
import type { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { ListView, useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import type { WorkspaceRowData } from './WorkspaceListConfig';
import { WorkspaceRow, workspaceColumns, workspaceFilters, workspaceActions, defaultErrorText } from './WorkspaceListConfig';
import { Card } from '@patternfly/react-core';
import type { ListViewLoadError, HttpError } from './utils';
import WorkspaceAddButton from '../WorkspaceAdd/WorkspaceAddButton';

const watchedResource = {
  isList: true,
  groupVersionKind: {
    group: 'tenancy.kcp.dev',
    version: 'v1beta1',
    kind: 'Workspace',
  },
};

const WorkspaceList: React.FC = () => {
  // Watch list of workspace resources
  const [workspaces, loaded, error] = useK8sWatchResource(watchedResource);

  const [listData, setListData] = React.useState<WorkspaceRowData[]>([]);
  const [listDataError, setListDataError] = React.useState<ListViewLoadError>();

  const buildListData = React.useCallback(() => {
    let data: WorkspaceRowData[] = [];

    if (error) {
      const loadError: ListViewLoadError = error as ListViewLoadError;
      loadError.status = (error as HttpError).status ?? (error as HttpError).response?.status;
      setListDataError(loadError);
    } else if (Array.isArray(workspaces as K8sResourceCommon[])) {
      (workspaces as K8sResourceCommon[]).forEach((workspace: K8sResourceCommon) => {
        let labels: string[] = [];
        if (workspace.metadata?.labels) {
          labels = Object.entries(workspace.metadata?.labels).map(([key, value]) => `${key}=${value}`);
        }
        data = [
          ...data,
          {
            name: workspace.metadata?.name ?? '',
            labels,
          },
        ];
      });
      setListData([...data] as WorkspaceRowData[]);
    }
  }, [workspaces, error]);

  React.useEffect(() => {
    buildListData();
  }, [buildListData, workspaces]);

  return (
    <Card>
      <div style={{ overflow: 'scroll' }}>
        <WorkspaceAddButton workspaces={Array.isArray(workspaces) ? workspaces : [workspaces]} />
        <ListView
          columns={workspaceColumns}
          data={listData}
          loaded={loaded}
          loadError={listDataError}
          loadErrorDefaultText={defaultErrorText}
          Row={WorkspaceRow}
          filters={workspaceFilters}
          rowActions={workspaceActions}
          emptyStateDescription="No data was retrieved" // TODO: Add check so that empty payload results in the "Get Started with Workspaces" UI
        />
      </div>
    </Card>
  );
};

export default WorkspaceList;
