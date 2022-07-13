import React from 'react';
import { Helmet } from 'react-helmet';
import { PageSection, PageSectionVariants, Text, TextContent } from '@patternfly/react-core';
import { WorkspacesGetStartedCard, WorkspacesGetStartedDrawer } from '../../components/WorkspacesGetStarted';

const Workspaces: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const onClick = () => {
    setIsExpanded(!isExpanded);
  };

  const title = 'Workspaces';

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <WorkspacesGetStartedDrawer isExpanded={isExpanded} setIsExpanded={setIsExpanded}>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1" data-testid="page-header">
              {title}
            </Text>
          </TextContent>
        </PageSection>
        <PageSection>
          <WorkspacesGetStartedCard isExpanded={isExpanded} onClick={onClick} />
        </PageSection>
      </WorkspacesGetStartedDrawer>
    </>
  );
};

export default Workspaces;
