import React from 'react';
import { Helmet } from 'react-helmet';
import { PageSection, PageSectionVariants, Text, TextContent } from '@patternfly/react-core';
import { WorkspaceList } from '../../components/WorkspaceList';
import { WorkspacesGettingStartedCard } from '../../components/WorkspacesGettingStarted';
import { useQuickstartCloseOnUnmount } from '../../hooks';

const Workspaces: React.FC = () => {
  useQuickstartCloseOnUnmount();

  const title = 'Workspaces';

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1" data-testid="page-header">
            {title}
          </Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <WorkspacesGettingStartedCard />
        <WorkspaceList />
      </PageSection>
    </>
  );
};

export default Workspaces;
