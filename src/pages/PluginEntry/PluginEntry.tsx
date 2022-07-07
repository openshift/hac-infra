import React from 'react';
import { Title } from '@patternfly/react-core';
import { NotFound } from '../../components/NotFound';
import './PluginEntry.scss';

const PluginEntry = () => {
  return (
    <div>
      <Title className="page-header" headingLevel="h1" data-testid="page-header">
        Welcome to HAC-Infra!
      </Title>
      <NotFound />
    </div>
  );
};

export default PluginEntry;
