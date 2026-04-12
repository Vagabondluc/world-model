
import { injectGlobal, keyframes } from '@emotion/css';
import { theme } from './theme';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

injectGlobal`
  .error-message {
    background-color: ${theme.colors.errorBg};
    color: ${theme.colors.error};
    border: 1px solid ${theme.colors.error};
    padding: ${theme.spacing.m};
    border-radius: ${theme.borders.radius};
    margin-bottom: ${theme.spacing.l};
  }

  .error-message h4 {
      margin-top: 0;
      color: ${theme.colors.error};
  }

  .loader {
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-left: 2px solid currentColor;
    border-radius: 50%;
    width: 1em;
    height: 1em;
    animation: ${spin} 1s linear infinite;
    display: inline-block;
    vertical-align: text-bottom;
  }

  .loader.large {
      width: 48px;
      height: 48px;
      border-width: 4px;
      border-color: ${theme.colors.textLight};
      border-left-color: ${theme.colors.text};
  }
`;
