
import { injectGlobal } from '@emotion/css';
import { theme } from './theme';

injectGlobal`
  input, button, textarea, select {
    font: inherit;
  }

  input[type="text"], 
  input[type="number"], 
  input[type="password"], 
  input[type="email"], 
  input[type="search"],
  textarea, 
  select {
    background-color: ${theme.colors.inputBg};
    color: ${theme.colors.inputText};
    border: 1px solid ${theme.colors.inputBorder};
    border-radius: 4px;
    padding: 8px 12px;
    font-family: ${theme.fonts.body};
    font-size: 1rem;
    transition: all 0.2s ease;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
    width: 100%;
    max-width: 100%; 
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: ${theme.colors.inputFocus};
    box-shadow: 0 0 0 3px rgba(146, 38, 16, 0.1);
  }

  input::placeholder, textarea::placeholder {
    color: ${theme.colors.inputPlaceholder};
    font-style: italic;
  }

  textarea.context-input, .search-input, .cr-input {
    margin-bottom: ${theme.spacing.m};
  }

  textarea.context-input {
    min-height: 120px;
    resize: vertical;
  }

  .form-group {
      margin-bottom: ${theme.spacing.l};
  }

  .form-group input.error,
  .form-group textarea.error,
  .form-group select.error {
      border-color: ${theme.colors.error};
      background-color: ${theme.colors.errorBg};
  }

  .field-error {
      display: block;
      color: ${theme.colors.error};
      font-size: 0.9rem;
      margin-top: -0.5rem;
      margin-bottom: ${theme.spacing.s};
  }

  label {
    display: block;
    font-weight: bold;
    margin-bottom: ${theme.spacing.s};
    font-family: ${theme.fonts.statBody};
  }

  /* --- Custom Radio & Checkbox --- */
  .custom-radio, .custom-checkbox {
    display: flex;
    align-items: flex-start;
    position: relative;
    padding-left: 35px;
    margin-bottom: ${theme.spacing.s};
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .custom-radio input, .custom-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .radio-checkmark, .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
    border: 1px solid ${theme.colors.textMuted};
    flex-shrink: 0; 
  }

  .radio-checkmark { border-radius: 50%; }
  .checkmark { border-radius: 4px; }

  .custom-radio:hover input ~ .radio-checkmark, .custom-checkbox:hover input ~ .checkmark {
    background-color: #ccc;
  }

  .custom-radio input:checked ~ .radio-checkmark, .custom-checkbox input:checked ~ .checkmark {
    background-color: ${theme.colors.text};
  }

  .radio-checkmark:after, .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  .custom-radio input:checked ~ .radio-checkmark:after, .custom-checkbox input:checked ~ .checkmark:after {
    display: block;
  }

  .custom-radio .radio-checkmark:after {
    top: 7px;
    left: 7px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${theme.colors.bg};
  }

  .custom-checkbox .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid ${theme.colors.bg};
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  .radio-title, .custom-checkbox strong {
      font-weight: bold;
      font-family: ${theme.fonts.statBody};
  }

  .custom-radio small, .custom-checkbox .description {
      display: block;
      font-size: 0.9rem;
      color: ${theme.colors.textMuted};
      line-height: 1.3;
  }
`;
