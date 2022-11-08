import React from 'react';
import { ButtonVariant, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { GettingStartedCard } from '@openshift/dynamic-plugin-sdk-utils';
import img from '../../imgs/workspaces-getting-started.svg';
import { HelpTopicLink } from '../HelpTopicLink';

const WorkspacesGettingStartedCard: React.FC = () => (
  <GettingStartedCard
    cardClassName="pf-u-mb-lg"
    imgClassName="pf-u-my-lg pf-u-ml-lg pf-u-display-none pf-u-display-block-on-md"
    imgSrc={img}
    isDismissable={false}
    localStorageKey="get-started-with-workspaces"
    title="Get started with Workspaces"
  >
    <TextContent>
      <Text component={TextVariants.p}>
        Workspaces provide a Kubernetes-like API to create and manage container-based apps without needing to set up or worry about the infrastructure
        underneath them.
      </Text>
      <Text component={TextVariants.p}>
        {/* TODO: correct topicId once new help topic is created per https://github.com/RedHatInsights/quickstarts/blob/main/docs/help-topics/README.md */}
        <HelpTopicLink topicId="app-view" buttonVariant={ButtonVariant.secondary}>
          Learn more
        </HelpTopicLink>
      </Text>
    </TextContent>
  </GettingStartedCard>
);

export default WorkspacesGettingStartedCard;
