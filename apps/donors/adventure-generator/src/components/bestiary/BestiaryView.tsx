
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { BestiaryFilters } from './BestiaryFilters';
import { BestiaryToolbar } from './BestiaryToolbar';
import { MonsterCard } from './MonsterCard';
import { MonsterList } from './MonsterList';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { BestiaryDetail } from './BestiaryDetail';
import { useBestiaryLogic } from '../../hooks/useBestiaryLogic';
import { FilteredList } from '../common/FilteredList';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
    `,
    scrollContainer: css`
        flex: 1;
        overflow-y: auto;
        padding: var(--space-l);
    `,
    grid: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--space-l);
    `,
    placeholder: css`
        text-align: center;
        padding: var(--space-xxl);
        color: var(--medium-brown);
        font-size: 1.2rem;
        font-style: italic;
        background-color: rgba(0,0,0,0.03);
        border-radius: var(--border-radius);
        margin: var(--space-l);
    `
};

export const BestiaryView: FC = () => {
    const {
        areDatabasesLoaded,
        loadedMonsterIndex,
        allMonstersForList,
        filteredAndSortedMonsters,
        selectedMonsterId,
        detailedMonster,
        isLoadingDetails,
        viewMode,
        searchQuery,
        selectedType,
        minCr,
        maxCr,
        sortBy,
        sortDirection,
        setSelectedMonsterId,
        setViewMode,
        setSearchQuery,
        setSelectedType,
        setMinCr,
        setMaxCr,
        setSortBy,
        setSortDirection,
        handleDelete
    } = useBestiaryLogic();

    if (selectedMonsterId) {
        if (isLoadingDetails) return <LoadingSkeleton type="detail-view" />;
        if (!detailedMonster) return (
            <div className={styles.placeholder}>
                <h3>Error loading monster details.</h3>
                <button className="primary-button" onClick={() => setSelectedMonsterId(null)}>← Back to Bestiary</button>
            </div>
        );
        return <BestiaryDetail monster={detailedMonster} onClose={() => setSelectedMonsterId(null)} />;
    }
    
    const renderContent = () => {
        if (!areDatabasesLoaded && loadedMonsterIndex.length === 0) return <div className={styles.placeholder}><div className="loader"></div><h3>Loading Bestiary Index...</h3></div>;
        
        const emptyText = allMonstersForList.length === 0 ? "Your bestiary is empty." : "No monsters match your filters.";

        return (
            <div className={styles.scrollContainer}>
                {viewMode === 'grid' ? (
                    <FilteredList
                        items={filteredAndSortedMonsters}
                        getKey={(monster) => monster.id}
                        className={styles.grid}
                        emptyClassName={styles.placeholder}
                        emptyText={emptyText}
                        renderItem={(monster) => (
                            <MonsterCard
                                monster={monster}
                                onClick={() => setSelectedMonsterId(monster.id)}
                                onDelete={() => handleDelete(monster.id)}
                            />
                        )}
                    />
                ) : (
                    filteredAndSortedMonsters.length === 0
                        ? <div className={styles.placeholder}><p>{emptyText}</p></div>
                        : <MonsterList monsters={filteredAndSortedMonsters} onSelect={setSelectedMonsterId} onDelete={handleDelete} />
                )}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <BestiaryFilters 
                searchQuery={searchQuery} onSearchChange={setSearchQuery}
                selectedType={selectedType} onTypeChange={setSelectedType}
                minCr={minCr} onMinCrChange={setMinCr}
                maxCr={maxCr} onMaxCrChange={setMaxCr}
            />
            <BestiaryToolbar 
                viewMode={viewMode} onViewModeChange={setViewMode}
                sortBy={sortBy} onSortChange={setSortBy}
                sortDirection={sortDirection} onSortDirectionChange={setSortDirection}
                totalCount={allMonstersForList.length} filteredCount={filteredAndSortedMonsters.length}
            />
            {renderContent()}
        </div>
    );
};
