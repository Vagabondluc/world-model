
import React, { FC, PropsWithChildren } from 'react';
import { css } from '@emotion/css';

const styles = {
    panel: css`
        border: 1px solid var(--border-light);
        padding: var(--space-m);
        border-radius: var(--border-radius);
        background-color: #fff;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    `,
     title: css`
        font-family: var(--header-font);
        margin: 0 0 var(--space-m) 0;
        font-size: 1.2rem;
        color: var(--dark-brown);
    `
};

export const AIPanel: FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <div className={styles.panel}>
            <h3 className={styles.title}>AI Draft</h3>
            {children}
        </div>
    );
};
