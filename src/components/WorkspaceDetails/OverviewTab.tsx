import React from 'react';
import { OverviewPage, DetailsItem, K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

const CUSTOM_LABELS = {
  services: 'Services',
};

type OverviewTabProps = {
  loaded: boolean;
  resource: K8sResourceCommon;
  error: { message: string; status: number };
};

const OverviewTab = ({ loaded, resource, error }: OverviewTabProps) => {
  return (
    <OverviewPage loaded={loaded} resource={resource} loadError={error} rightColumn={<></>}>
      <DetailsItem label={CUSTOM_LABELS.services} resource={resource} path="spec.type.name" loaded={loaded} />
    </OverviewPage>
  );
};

export default OverviewTab;
