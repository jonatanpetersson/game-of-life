import { IconConfig } from './icon-config';

export const IconInfo = () => (
  <svg {...IconConfig}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <circle cx="12" cy="12" r="9"></circle>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
    <polyline points="11 12 12 12 12 16 13 16"></polyline>
  </svg>
);
