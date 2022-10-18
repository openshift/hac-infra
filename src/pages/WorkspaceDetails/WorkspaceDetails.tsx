import React from 'react';
import { Helmet } from 'react-helmet';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { WorkspaceDetails } from '../../components/WorkspaceDetails';
import { useParams } from 'react-router-dom';

const Workspaces: React.FC = () => {
  const title = 'Workspace Details';
  const { workspaceName } = useParams();

  return (
    <>
      <Helmet>
        <title>{`${title} - ${workspaceName}`}</title>
      </Helmet>
      <PageSection variant={PageSectionVariants.light}>
        <WorkspaceDetails />
      </PageSection>
    </>
  );
};

export default Workspaces;
