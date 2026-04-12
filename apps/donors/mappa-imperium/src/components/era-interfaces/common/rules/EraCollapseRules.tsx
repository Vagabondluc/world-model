import React from 'react';
import RulesContainer from './RulesContainer';
import RuleSection from '../RuleSection';
import WarTable from './tables/WarTable';
import CollapseTable from './tables/CollapseTable';
import OmensTable from './tables/OmensTable';

const EraCollapseRules = () => {
    return (
        <RulesContainer>
            <div className="space-y-8">
                <header>
                    <h1 className="text-5xl font-extrabold text-amber-900">Era VI: Age of Collapse 🔥</h1>
                    <p className="mt-4 text-xl text-gray-600">Era 6 is the final phase of the game, covering 50 years of your story. Empires begin to crumble, hostile forces and organizations begin to rise. Players may continue drawing anywhere on the map, but all results are still focused onto the player's prime faction.</p>
                </header>

                <RuleSection title="6.1 Final Era">
                    <p className="rule-text">Take turns in this era according to your game length settings. All results can be placed anywhere on the map.</p>
                    <CollapseTable />
                </RuleSection>

                <RuleSection title="6.2 Iconic Landmarks">
                    <p className="rule-text">Each player will take a moment to name one location on the map that was an important part of their Prime factions story. This may be a nearby forest where disaster struck, grassland where a decisive battle was fought, or mountain that ended up being an important religious site.</p>
                    <p className="rule-text">Name these iconic locations as you see fit, whether by a heroes name, deity, nearby monster, etc. These may be placed anywhere on the map.</p>
                </RuleSection>

                <RuleSection title="6.3 Omens">
                    <p className="italic rule-text">How does your story end? As this world age comes to a close, what omen will bring this world into a new era?</p>
                    <p className="rule-text">All players will select one player to roll on the table below. This should be either the player that created the most interesting story or who all decide ended with the most powerful faction.</p>
                    <OmensTable />
                </RuleSection>

                <RuleSection title="6.4 Finalizing">
                    <p className="rule-text">The map is almost complete, finish off by naming any important features that haven't been named yet (geography, war sites, lair locations, etc) Then, draw in some accents for final touches (compass rose, ships in open water, sea monsters etc)</p>
                </RuleSection>

                <RuleSection title="Special Rule: War!">
                    <p className="rule-text">War is played out through a simple dice roll by the attacker. Roll on the table below and describe/draw in the results.</p>
                    <WarTable />
                </RuleSection>
            </div>
        </RulesContainer>
    );
};

export default EraCollapseRules;
