import { css } from '@emotion/css';
import { theme } from './theme';

/**
 * Shared style factories for the application.
 * These styles use theme tokens to allow for dynamic skin switching while preserving
 * the exact look of the default "fantasy scroll" theme.
 */

/**
 * Tab Navigation Styles
 * Exact match for ChroniclerView tabs
 */
export const tabStyles = {
    container: () => css`
        display: flex;
        gap: 16px;
        border-bottom: 1px solid ${theme.borders.light};
        margin-bottom: 16px;
    `,

    tab: (active: boolean) => css`
        padding: 8px 16px;
        cursor: pointer;
        font-weight: bold;
        color: ${active ? theme.colors.accent : theme.colors.textMuted};
        border-bottom: 2px solid ${active ? theme.colors.accent : 'transparent'};
        transition: all 0.2s;
        
        &:hover {
            color: ${theme.colors.accent};
        }
    `,
};

/**
 * Content Panel Styles
 * Replaces hardcoded "background: white" with theme.colors.contentBoxBg
 */
export const panelStyles = {
    /**
     * The main full-page container for views
     * Default: #fdfaf6 (via theme.colors.viewBg)
     */
    viewContainer: () => css`
        padding: 20px;
        background: ${theme.colors.viewBg};
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    `,

    /**
     * Standard content box with border and padding
     * Default: white background (via theme.colors.contentBoxBg)
     */
    contentBox: () => css`
        padding: 20px;
        background: ${theme.colors.contentBoxBg};
        border-radius: 8px;
        border: 1px solid ${theme.borders.light};
    `,

    /**
     * Standard header for content boxes
     */
    sectionHeader: () => css`
        margin-top: 0;
        color: ${theme.colors.accent};
    `,
};

/**
 * Layout Styles
 */
export const layoutStyles = {
    /**
     * Two-column layout (sidebar + content)
     * Matches ChroniclerView: 400px sidebar, rest is content
     */
    twoColumnSidebar: () => css`
        display: grid;
        grid-template-columns: 400px 1fr;
        gap: ${theme.spacing.l};
        width: 100%;
        max-width: 1200px;
        @media (max-width: 1000px) {
            grid-template-columns: 1fr;
        }
    `,

    /**
     * Vertical stack of items with spacing
     */
    verticalStack: () => css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.m};
    `
};
