import React from 'react';
import { ButtonVariant, Card, CardBody, CardFooter, CardTitle, Split, SplitItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import img from '../../imgs/workspaces-get-started.svg';
import { HelpTopicLink } from '../HelpTopicLink/HelpTopicLink';

const WorkspacesGetStartedCard: React.FC = () => (
  <Card>
    <Split>
      <SplitItem className="pf-u-my-lg pf-u-ml-lg pf-u-display-none pf-u-display-block-on-md">
        <img src={img} alt="" className="" />
      </SplitItem>
      <SplitItem isFilled>
        <TextContent>
          <CardTitle>
            <Text component={TextVariants.h2}>Get started with Workspaces</Text>
          </CardTitle>
          <CardBody>
            <Text component={TextVariants.p}>
              Workspaces provide a Kubernetes-like API to create and manage container-based apps without needing to set up or worry about the
              infrastructure underneath them.
            </Text>
          </CardBody>
          <CardFooter>
            <Text component={TextVariants.p}>
              {/* TODO: correct topicId once new help topic is created per https://github.com/RedHatInsights/quickstarts/blob/main/docs/help-topics/README.md */}
              <HelpTopicLink topicId="app-view" buttonVariant={ButtonVariant.secondary}>
                Learn more
              </HelpTopicLink>
            </Text>
          </CardFooter>
        </TextContent>
      </SplitItem>
    </Split>
  </Card>
);

export default WorkspacesGetStartedCard;
