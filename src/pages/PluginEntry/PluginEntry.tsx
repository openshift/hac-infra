import React from 'react';
import { Helmet } from 'react-helmet';
import { Workspaces } from '../Workspaces';

const PluginEntry = () => (
  <>
    <Helmet titleTemplate="%s" />
    <Workspaces />
  </>
);

export default PluginEntry;
