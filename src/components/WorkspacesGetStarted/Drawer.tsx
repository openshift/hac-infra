import * as React from 'react';
import {
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerColorVariant,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { ExternalLink } from '../shared/links';

type WorkspacesGetStartedDrawerProps = {
  children: React.ReactNode;
  isExpanded: boolean;
  setIsExpanded: (boolean: boolean) => void;
};

const WorkspacesGetStartedDrawer: React.FC<WorkspacesGetStartedDrawerProps> = ({ children, isExpanded, setIsExpanded }) => {
  const drawerRef = React.useRef<HTMLDivElement>(null);

  const onCloseClick = () => {
    setIsExpanded(false);
  };

  const onExpand = () => {
    drawerRef.current && drawerRef.current.focus();
  };

  const panelContent = (
    <DrawerPanelContent>
      <DrawerHead>
        <TextContent>
          <Text component={TextVariants.h1} tabIndex={isExpanded ? 0 : -1} ref={drawerRef}>
            Workspaces
          </Text>
        </TextContent>
        <DrawerActions>
          <DrawerCloseButton onClick={onCloseClick} />
        </DrawerActions>
      </DrawerHead>
      <DrawerPanelBody>
        <TextContent>
          <Text component={TextVariants.h2}>What is a workspace?</Text>
          <Text component={TextVariants.p}>
            Multi-tenancy is implemented through workspaces. A workspace is a Kubernetes-cluster-like HTTPS endpoint, i.e. an endpoint usual
            Kubernetes client tooling (client-go, controller-runtime and others) and user interfaces (kubectl, helm, web console, ...) can talk to
            like to a Kubernetes cluster....
          </Text>
          <Text component={TextVariants.p}>
            <ExternalLink href="#">Check out the documentation</ExternalLink>
          </Text>
          <Text component={TextVariants.h2}>Connecting to a workspace</Text>
          <Text component={TextVariants.p}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </Text>
          <Text component={TextVariants.h2}>Exporting and Importing APIs</Text>
          <Text component={TextVariants.p}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </Text>
        </TextContent>
      </DrawerPanelBody>
    </DrawerPanelContent>
  );

  return (
    <>
      <Drawer isExpanded={isExpanded} onExpand={onExpand} isInline>
        <DrawerContent panelContent={panelContent} colorVariant={DrawerColorVariant.light200}>
          <DrawerContentBody>{children}</DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default WorkspacesGetStartedDrawer;
