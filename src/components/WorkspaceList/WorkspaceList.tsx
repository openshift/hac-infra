import * as React from 'react';
import type { K8sModelCommon, K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { k8sListResourceItems, ListView } from '@openshift/dynamic-plugin-sdk-utils';
import type { WorkspaceRowData } from './WorkspaceListConfig';
import { WorkspaceRow, workspaceColumns, workspaceFilters, defaultErrorText } from './WorkspaceListConfig';
import { Card } from '@patternfly/react-core';

const WorkspaceModel: K8sModelCommon = {
  apiVersion: 'v1beta1',
  apiGroup: 'tenancy.kcp.dev',
  kind: 'Workspace',
  plural: 'workspaces',
};

const WorkspaceList: React.FC = () => {
  const [listData, setListData] = React.useState<WorkspaceRowData[]>([]);
  const [error, setError] = React.useState<string>();
  const [loaded, setLoaded] = React.useState<boolean>();

  // TODO: k8sListResourceItems should be replaced with useWatchK8sResource hook to pick up edits to workspaces, but this hook does not appear to be working as expected with KCP and needs investigation
  const fetchWorkspaces = React.useCallback(() => {
    let data: WorkspaceRowData[] = [];
    k8sListResourceItems({
      model: WorkspaceModel,
    })
      .then((workspaces) => {
        setLoaded(true);
        if (Array.isArray(workspaces as K8sResourceCommon[])) {
          workspaces.forEach((workspace: K8sResourceCommon) => {
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
      })
      .catch((e) => {
        setError(`${defaultErrorText} ${e?.message}`);
        setLoaded(true);
      });
  }, []);

  React.useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return (
    <Card>
      <div style={{ overflow: 'scroll' }}>
        <ListView
          columns={workspaceColumns}
          data={listData}
          loaded={loaded}
          loadErrorDefaultText={error}
          Row={WorkspaceRow}
          filters={workspaceFilters}
          emptyStateDescription="No data was retrieved" // TODO: Add check so that empty payload results in the "Get Started with Workspaces" UI
        />
      </div>
    </Card>
  );
};

export default WorkspaceList;
