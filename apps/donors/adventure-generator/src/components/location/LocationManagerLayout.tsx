import React, { FC, PropsWithChildren } from 'react';
import { css } from '@emotion/css';

const styles = {
    layout: css`
        display: grid;
        grid-template-columns: 1fr 350px;
        flex: 1;
        overflow: hidden;
        min-height: 0;

        @media (max-width: 1100px) { grid-template-columns: 1fr; 300px; }
        @media (max-width: 900px) { grid-template-columns: 1fr; grid-template-rows: 2fr 1fr; }
    `,
};

export const LocationManagerLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <div className={styles.layout}>
            {children}
        </div>
    );
};