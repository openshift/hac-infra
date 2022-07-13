import * as React from 'react';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/js/icons';

type ExternalLinkProps = {
  href: string;
  text?: React.ReactNode;
  additionalClassName?: string;
  dataTestID?: string;
  stopPropagation?: boolean;
};

const ExternalLink: React.FC<ExternalLinkProps> = ({ children, href, text, additionalClassName = '', dataTestID, stopPropagation }) => (
  <a
    className={additionalClassName}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    data-test-id={dataTestID}
    {...(stopPropagation ? { onClick: (e) => e.stopPropagation() } : {})}
  >
    {children || text} <ExternalLinkAltIcon />
  </a>
);

export default ExternalLink;
