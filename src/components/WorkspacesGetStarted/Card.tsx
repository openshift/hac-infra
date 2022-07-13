import React from 'react';
import { Button, Card, CardBody, CardFooter, CardTitle, Split, SplitItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import img from '../../imgs/workspaces-get-started.svg';

type WorkspacesGetStartedCardProps = {
  isExpanded: boolean;
  onClick: () => void;
};

const WorkspacesGetStartedCard: React.FC<WorkspacesGetStartedCardProps> = ({ isExpanded, onClick }) => (
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
              <Button variant="secondary" aria-expanded={isExpanded} onClick={onClick}>
                Learn more
              </Button>
            </Text>
          </CardFooter>
        </TextContent>
      </SplitItem>
    </Split>
  </Card>
);

export default WorkspacesGetStartedCard;
