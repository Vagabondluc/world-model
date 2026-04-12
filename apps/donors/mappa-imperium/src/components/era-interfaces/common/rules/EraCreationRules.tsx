import React from 'react';
import RulesContainer from './RulesContainer';
import RuleSection from '../RuleSection';
import LandmassTable from './tables/LandmassTable';
import GeographyTable from './tables/GeographyTable';

const EraCreationRules = () => {
    return (
        <RulesContainer>
            <div className="space-y-8">
                <header>
                    <h1 className="text-5xl font-extrabold text-amber-900">Era I: Age of Creation 🌍</h1>
                    <p className="mt-4 text-xl text-gray-600">Mountains rise & forests grow. The world begins to take shape. This is the landmass and geography building era.</p>
                </header>

                <RuleSection title="1.1 Create the lands">
                    <p className="rule-text">Roll 1 six sided die, consult the table below and take turns drawing islands into your Home Region. If two or more players wish to combine islands to create a large continent that spreads over multiple home regions they may do so.</p>
                    <LandmassTable />
                    <p className="rule-text font-semibold italic mt-4"><strong>Alternate Pangea Rule:</strong> All players subtract 1 island from their results and place 1 massive continent spanning the center of the map across every player's home region.</p>
                </RuleSection>

                <RuleSection title="1.2 Geography">
                    <p className="rule-text">Roll 2 six sided dice and consult the table below, each player will take turns placing the results into their Home Region. These can be placed anywhere and on any island, it is up to each player to design their own Home Region.</p>
                    <p className="font-bold rule-text">Each player rolls on this table 8 times.</p>
                    <GeographyTable />
                </RuleSection>

                <RuleSection title="1.3 Touching up">
                    <p className="rule-text">Each player may take a moment to touch up and fill any gaps in their lands as they see fit. Feel free to add tiny islands, small groves of trees, minor rivers & lakes, glaciers, etc.</p>
                </RuleSection>

                <RuleSection title="1.4 Resources & Special Sites">
                    <p className="rule-text">Take turns placing 2 different resources or special locations into each player's Home Regions. You can use these to add some fantasy uniqueness to your map outside of the typical lumber, stone, clay. These are up to each player to decide what to place and where.</p>
                </RuleSection>
            </div>
        </RulesContainer>
    );
};

export default EraCreationRules;
