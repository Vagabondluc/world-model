
import React, { FC, PropsWithChildren } from 'react';
import { css } from '@emotion/css';

const styles = {
    panel: css`
        border: 1px solid var(--border-light);
        padding: var(--space-m);
        border-radius: var(--border-radius);
        background-color: var(--card-bg);
        height: 100%;
        display: flex;
        flex-direction: column;
    `,
    title: css`
        font-family: var(--header-font);
        margin: 0 0 var(--space-m) 0;
        font-size: 1.2rem;
        color: var(--dnd-red);
        border-bottom: 1px solid var(--border-light);
        padding-bottom: var(--space-s);
    `
};

export const GeneratorControls: FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <div className={styles.panel}>
            <h3 className={styles.title}>Controls & Context</h3>
            {children}
        </div>
    );
};
