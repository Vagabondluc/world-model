import React from 'react';
import RulesContainer from './RulesContainer';
import RuleSection from '../RuleSection';
import RaceTable from './tables/RaceTable';
import SymbolTable from './tables/SymbolTable';
import ColorTable from './tables/ColorTable';
import NamingIdeasTable from './tables/NamingIdeasTable';
import NeighborsTable from './tables/NeighborsTable';
import SettlementTable from './tables/SettlementTable';

const EraFoundationRules = () => {
    return (
        <RulesContainer>
            <div className="space-y-8">
                <header>
                    <h1 className="text-5xl font-extrabold text-amber-900">Era III: Age of Foundation 🏛️</h1>
                    <p className="mt-4 text-xl text-gray-600">The lands have been drawn. The wandering clans of the world are beginning to come together and form permanent settlements. This era will create your prime factions and begin to develop them into burgeoning empires. Each player will focus solely on their home regions and consists of the first 30 years of your faction's story.</p>
                </header>

                <RuleSection title="3.1 Prime Faction">
                    <p className="rule-text">Using the table below, each player will create their prime faction, this is the empire they will be devoting most of their time to for the majority of the game. Roll two six sided dice to determine the prominent ancestry of each Prime Faction and place a capital settlement on the map.</p>
                    <RaceTable />
                </RuleSection>

                <RuleSection title="3.2 Faction Development">
                    <p className="rule-text">The following sections will take you through the development of your Prime Faction using a number of tables. They may not add much detail on the map itself but will help build the story of the world.</p>
                    <p className="rule-text">Feel free to skip the rolling and design your faction however you wish, but if needed the tables should help distinguish them with crest designs, color, theme, and leadership.</p>

                    <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">Symbol</h3>
                    <p className="rule-text">Pick a symbol to represent the faction using the table below (Roll one die for column, then one for row)</p>
                    <SymbolTable />

                    <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">Color</h3>
                    <p className="rule-text">Determine a primary color for your faction. If you wish to have a secondary color you may roll twice.</p>
                    <ColorTable />

                    <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">Naming</h3>
                    <p className="rule-text">Create a name for the faction, then draw the crest alongside the name on the map near the capital.</p>
                    <NamingIdeasTable />

                    <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">Leadership</h3>
                    <p className="rule-text">Someone must have inspired your people into forming this new united faction. Whether by war, diplomacy, feats of strength, or charisma. Create a name for this hero or group and name a nearby location or geography after this first leader.</p>
                </RuleSection>

                <RuleSection title="3.3 Neighbors">
                    <p className="rule-text">Each player takes turns rolling on the Faction Table below to select their neighbors, then places them anywhere in their home region. Give them a name and draw in an appropriate symbol to designate their location.</p>
                    <NeighborsTable />
                </RuleSection>

                <RuleSection title="3.4 Early Settlers">
                    <p className="rule-text">Each player will take turns rolling on the table below, placing new settlements for their prime faction. These must all be placed on the same island as their capital. Be sure to name and connect each settlement with a road.</p>
                    <p className="rule-text"><strong>Roll twice for each player.</strong></p>
                    <SettlementTable />
                </RuleSection>
            </div>
        </RulesContainer>
    );
};

export default EraFoundationRules;
