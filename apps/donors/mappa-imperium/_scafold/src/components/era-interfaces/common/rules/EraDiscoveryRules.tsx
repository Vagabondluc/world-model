import React from 'react';
import RulesContainer from './RulesContainer';
import RuleSection from '../RuleSection';
import DiscoveryTable from './tables/DiscoveryTable';
import ProfessionsTable from './tables/ProfessionsTable';
import ProsperityTable from './tables/ProsperityTable';

const EraDiscoveryRules = () => {
    return (
        <RulesContainer>
            <div className="space-y-8">
                <header>
                    <h1 className="text-5xl font-extrabold text-amber-900">Era IV: Age of Discovery 🗺️</h1>
                    <p className="mt-4 text-xl text-gray-600">The Empires are ready to explore and expand. Scouts and settlers are now being sent to explore and colonize the world.</p>
                </header>

                <RuleSection title="4.1 Exploration Begins">
                    <p className="rule-text">Each player will take turns rolling on the table below to explore their nearby shores. All results can be placed anywhere within each player's Home Region. Roll according to your game length settings.</p>
                    <DiscoveryTable />
                </RuleSection>

                <RuleSection title="4.2 Colonization">
                    <p className="rule-text">The factions have stumbled their way out into the world and begun forming sprawling nations. In this section you will discover some of the important figures, vital to the development of your empire, and begin to name the local landmarks to honor these pioneers. Each player will roll on the table below 3 times, then creating names for the local heroes you will name 3 places in your home region.</p>
                    <ProfessionsTable />
                    <p className="rule-text mt-4"><strong>Example:</strong> Player A rolls 11 for Explorer, they choose to name a distant forest after that famous explorer. They create a name for them, Magela, then label one of the forest geographys in their Home Region "Magela Woods"</p>
                </RuleSection>

                <RuleSection title="4.3 Prosperity">
                    <p className="rule-text">Every empire has a distinct good, service, or profession than distinguishes it from its neighbors. Whether it's sword making, fishing, wizardry, etc. this will help distinguish and give each empire its own flavor. Each player will take turns developing their empire further by creating a good, service, or profession their empire excels at.</p>
                    <ProsperityTable />
                </RuleSection>
            </div>
        </RulesContainer>
    );
};

export default EraDiscoveryRules;