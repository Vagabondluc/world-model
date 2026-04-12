import React from 'react';
import RulesContainer from './RulesContainer';
import RuleSection from '../RuleSection';
import WarTable from './tables/WarTable';
import EmpiresTable from './tables/EmpiresTable';
import NeighborsDevelopTables from './tables/NeighborsDevelopTables';

const EraEmpiresRules = () => {
    return (
        <RulesContainer>
            <div className="space-y-8">
                <header>
                    <h1 className="text-5xl font-extrabold text-amber-900">Era V: Age of Empires 👑</h1>
                    <p className="mt-4 text-xl text-gray-600">Empires have settled and can start flexing their might. This is the point in the game that players are no longer tied to their own "Home Region" and may now begin to draw anywhere on the map. All events still focus on the player's empire for 60 years of advancement.</p>
                </header>

                <RuleSection title="5.1 Worldwide Expansion">
                    <p className="rule-text">All results can now be placed in any region on the map. Roll on this table according to your game length settings for years of advancement, using the Growing Empires Table below and recording the results.</p>
                    <EmpiresTable />
                </RuleSection>

                <RuleSection title="5.2 Neighbors Develop">
                    <p className="rule-text">Each player will take turns rolling on the appropriate table for every non-prime faction in their home region. Roll once for each neighbor.</p>
                    <NeighborsDevelopTables />
                </RuleSection>

                <RuleSection title="Special Rule: War!">
                    <p className="rule-text">War is played out through a simple dice roll by the attacker. Roll on the table below and describe/draw in the results.</p>
                    <WarTable />
                </RuleSection>
            </div>
        </RulesContainer>
    );
};

export default EraEmpiresRules;
