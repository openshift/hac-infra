import * as React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

type HelpTopicLinkProps = {
  topicId: string;
  buttonVariant?: ButtonVariant;
};

const HelpTopicLink: React.FC<HelpTopicLinkProps> = ({ topicId, children, buttonVariant = ButtonVariant.link }) => {
  const {
    helpTopics: { setActiveTopic, enableTopics, disableTopics },
  } = useChrome();

  React.useEffect(() => {
    enableTopics(topicId);

    return () => disableTopics(topicId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Button variant={buttonVariant} onClick={() => setActiveTopic(topicId)} isInline>
      {children}
    </Button>
  );
};

export default HelpTopicLink;
