
import React, { ReactNode } from 'react';
import { css, cx } from '@emotion/css';

const styles = {
    listSection: css`
        padding: 0 var(--space-m);
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        min-height: 0;

        h4 {
            font-family: var(--header-font);
            margin: 0 0 var(--space-s) 0;
            color: var(--dark-brown);
            border-bottom: 1px solid var(--light-brown);
            padding-bottom: var(--space-xs);
            flex-shrink: 0;
        }
    `,
    list: css`
        display: flex;
        flex-direction: column;
        gap: 2px;
        overflow-y: auto;
    `,
    emptyList: css`
        font-style: italic;
        color: var(--medium-brown);
        text-align: center;
        font-size: 0.9rem;
        padding: var(--space-m);
    `,
    addButton: css`
        background: transparent;
        border: 1px dashed var(--medium-brown);
        color: var(--medium-brown);
        width: 100%;
        padding: var(--space-s);
        margin-top: var(--space-s);
        border-radius: var(--border-radius);
        cursor: pointer;
        font-family: var(--header-font);
        flex-shrink: 0;
        &:hover {
            background: var(--parchment-bg);
            color: var(--dark-brown);
            border-color: var(--dark-brown);
        }
    `
};

interface SidebarListProps<T> {
    title: string;
    items: T[];
    renderItem: (item: T) => ReactNode;
    onAdd?: () => void;
    addLabel?: string;
    emptyMessage?: string;
    className?: string;
}

export function SidebarList<T>({ 
    title, 
    items, 
    renderItem, 
    onAdd, 
    addLabel = "Add Item", 
    emptyMessage = "No items found.",
    className
}: SidebarListProps<T>) {
    return (
        <div className={cx(styles.listSection, className)}>
            <h4>{title}</h4>
            <div className={styles.list}>
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <React.Fragment key={index}>
                            {renderItem(item)}
                        </React.Fragment>
                    ))
                ) : (
                    <p className={styles.emptyList}>{emptyMessage}</p>
                )}
            </div>
            {onAdd && (
                <button className={styles.addButton} onClick={onAdd}>
                    + {addLabel}
                </button>
            )}
        </div>
    );
}
