
// File size: ~50 lines
import React, { FC } from 'react';
import { css, keyframes } from '@emotion/css';

const skeletonShine = keyframes`
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
`;

const skeletonStyle = css`
    background-color: rgba(0,0,0,0.05);
    border-radius: var(--border-radius);
    position: relative;
    overflow: hidden;
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        animation: ${skeletonShine} 1.5s infinite;
    }
`;

const skeletonTextStyle = css`
    ${skeletonStyle};
    height: 1em; 
    margin-bottom: var(--space-s);
`;

const skeletonTitleStyle = css`
    ${skeletonStyle};
    height: 1.5em; 
    width: 60%; 
    margin-bottom: var(--space-m);
`;

const skeletonCardStyle = css`
    background-color: var(--card-bg);
    padding: var(--space-l);
    border: var(--border-light);
    border-radius: var(--border-radius);
    margin-bottom: var(--space-l);

    .${skeletonTitleStyle} { background-color: rgba(0,0,0,0.1); }
    .${skeletonTextStyle} { background-color: rgba(0,0,0,0.1); }
`;


interface LoadingSkeletonProps {
    type: 'card' | 'list-item' | 'detail-view';
}

const CardSkeleton: FC = () => (
    <div className={skeletonCardStyle}>
        <div className={skeletonTitleStyle}></div>
        <div className={skeletonTextStyle}></div>
        <div className={skeletonTextStyle} style={{ width: '80%' }}></div>
    </div>
);

const DetailViewSkeleton: FC = () => (
    <div className="step-container">
        <div className={skeletonTitleStyle} style={{ width: '40%', marginBottom: '2rem' }}></div>
        <div className={skeletonTitleStyle} style={{ height: '1.2em', width: '20%' }}></div>
        <div className={skeletonTextStyle}></div>
        <div className={skeletonTextStyle}></div>
        <div className={skeletonTextStyle} style={{ width: '70%' }}></div>
        <div className={skeletonTitleStyle} style={{ height: '1.2em', width: '25%', marginTop: '2rem' }}></div>
        <div className={skeletonTextStyle}></div>
        <div className={skeletonTextStyle} style={{ width: '80%' }}></div>
    </div>
)

export const LoadingSkeleton: FC<LoadingSkeletonProps> = ({ type }) => {
    switch (type) {
        case 'card':
            return <CardSkeleton />;
        case 'list-item':
            return <div className={skeletonCardStyle}><div className={skeletonTextStyle}></div></div>;
        case 'detail-view':
            return <DetailViewSkeleton />;
        default:
            return <div className="loader large" style={{ margin: 'var(--space-xl) auto', display: 'block' }}></div>;
    }
};

export const HooksSkeleton: FC = () => (
    <div className="step-container">
        <CardSkeleton />
        <CardSkeleton />
    </div>
);

export const OutlineSkeleton: FC = () => (
    <div className="step-container">
        <div className="hub-container">
            <div className="hub-main-column">
                <h3>Adventure Scenes</h3>
                <CardSkeleton />
                <CardSkeleton />
            </div>
            <div className="hub-sidebar-column">
                 <h3>Key Locations</h3>
                <CardSkeleton />
            </div>
        </div>
    </div>
)
