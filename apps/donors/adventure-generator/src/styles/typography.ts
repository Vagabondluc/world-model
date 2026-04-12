
import { injectGlobal } from '@emotion/css';
import { theme } from './theme';

injectGlobal`
  body {
    color: ${theme.colors.text};
    font-family: ${theme.fonts.body};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: color 0.3s;
  }

  body, h1, h2, h3, h4, p, ul, ol, li, figure, figcaption, blockquote, dl, dd {
    margin: 0;
  }

  ul, ol {
    padding: 0;
    list-style: none;
  }

  h1 {
    font-family: ${theme.fonts.header};
    font-size: clamp(2.5rem, 5vw, 3rem);
    margin-bottom: ${theme.spacing.m};
    color: ${theme.colors.text};
    text-align: center;
  }

  h2 {
      font-family: ${theme.fonts.header};
      font-size: clamp(1.8rem, 4vw, 2.2rem);
      margin-bottom: ${theme.spacing.s};
  }

  h3, h4 {
      font-family: ${theme.fonts.header};
      color: ${theme.colors.text};
      margin-bottom: ${theme.spacing.s};
  }

  h3 { font-size: 1.5rem; }
  h4 { font-size: 1.3rem; }

  p {
    font-size: 1.1rem;
    margin-bottom: ${theme.spacing.m};
  }

  p, h1, h2, h3, h4, h5, h6, li, figcaption {
      overflow-wrap: break-word;
      max-width: 65ch; 
  }

  .app-main p {
      max-width: none; 
  }

  a {
    color: ${theme.colors.textMuted};
    text-decoration: underline;
    transition: color 0.2s;
  }

  a:hover {
    color: ${theme.colors.text};
  }

  pre, code {
      white-space: pre-wrap;
      word-break: break-all;
  }
`;
