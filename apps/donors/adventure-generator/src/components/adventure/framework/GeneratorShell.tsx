
import React, { FC, ReactNode } from 'react';
import { css } from '@emotion/css';

const styles = {
    shell: css`
        display: grid;
        grid-template-columns: 320px 1fr 1fr;
        grid-template-rows: auto 1fr auto;
        grid-template-areas:
            "header header header"
            "controls procedural ai"
            "editor editor editor";
        gap: var(--space-l);
        height: 100%;
        width: 100%;

        @media (max-width: 1200px) {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto 1fr 1fr auto;
            grid-template-areas:
                "header"
                "controls"
                "procedural"
                "ai"
                "editor";
        }
    `,
    header: css` grid-area: header; `,
    controls: css` grid-area: controls; `,
    procedural: css` grid-area: procedural; min-width: 0;`,
    ai: css` grid-area: ai; min-width: 0;`,
    editor: css` grid-area: editor; `,
};

interface GeneratorShellProps {
    header?: ReactNode;
    controls: ReactNode;
    procedural: ReactNode;
    ai?: ReactNode;
    editor: ReactNode;
}

export const GeneratorShell: FC<GeneratorShellProps> = ({ header, controls, procedural, ai, editor }) => {
    return (
        <div className={styles.shell}>
            {header && <div className={styles.header}>{header}</div>}
            <div className={styles.controls}>{controls}</div>
            <div className={styles.procedural}>{procedural}</div>
            {ai && <div className={styles.ai}>{ai}</div>}
            <div className={styles.editor}>{editor}</div>
        </div>
    );
};
