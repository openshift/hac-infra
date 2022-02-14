import React from 'react';
import { Title } from '@patternfly/react-core';
import { NotFound } from '../NotFound';

const PluginEntry = () => {
  return (
    <div>
      <Title headingLevel="h1" data-testid="page-header">
        Welcome to HAC-Infra!
      </Title>
      <NotFound />
    </div>
  );
};

export default PluginEntry;
