
import { injectGlobal } from '@emotion/css';
import { theme } from './theme';

injectGlobal`
  .primary-button, .action-button, .secondary-button {
    display: inline-flex; 
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.m} ${theme.spacing.l};
    border-radius: ${theme.borders.radius};
    font-family: ${theme.fonts.header};
    font-size: 1.2rem;
    cursor: pointer;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
    border: none;
    line-height: 1;
  }

  .primary-button {
    background-color: ${theme.colors.accent};
    color: ${theme.colors.bg};
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }

  .primary-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }

  .action-button {
    background-color: ${theme.colors.text};
    color: ${theme.colors.bg};
    font-size: 1rem;
    padding: ${theme.spacing.s} ${theme.spacing.m};
  }

  .action-button:hover:not(:disabled) {
    background-color: ${theme.colors.textMuted};
  }

  .secondary-button {
    background-color: transparent;
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.text};
    font-size: 1.2rem;
  }

  .secondary-button:hover:not(:disabled) {
    background-color: ${theme.colors.text};
    color: ${theme.colors.bg};
  }

  button:disabled {
    background-color: ${theme.colors.textLight};
    cursor: not-allowed;
    opacity: 0.7;
    transform: none !important;
    box-shadow: none !important;
  }

  .start-over-button {
    float: right;
    margin-left: ${theme.spacing.m};
  }
`;
