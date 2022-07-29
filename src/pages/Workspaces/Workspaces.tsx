import React from 'react';
import { Helmet } from 'react-helmet';
import { PageSection, PageSectionVariants, Text, TextContent } from '@patternfly/react-core';
import { WorkspaceList } from '../../components/WorkspaceList';

const Workspaces: React.FC = () => {
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
        <WorkspaceList />
      </PageSection>
    </>
  );
};

export default Workspaces;
