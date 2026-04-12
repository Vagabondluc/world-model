import React, { FC, ReactNode } from 'react';

interface FilteredListProps<T> {
    items: T[];
    renderItem: (item: T) => ReactNode;
    getKey: (item: T) => string | number;
    emptyText?: string;
    className?: string;
    emptyClassName?: string;
}

export const FilteredList = <T,>({
    items,
    renderItem,
    getKey,
    emptyText = 'No items match.',
    className,
    emptyClassName,
}: FilteredListProps<T>) => {
    if (items.length === 0) {
        return <p className={emptyClassName}>{emptyText}</p>;
    }

    return (
        <div className={className}>
            {items.map((item) => (
                <React.Fragment key={getKey(item)}>
                    {renderItem(item)}
                </React.Fragment>
            ))}
        </div>
    );
};
