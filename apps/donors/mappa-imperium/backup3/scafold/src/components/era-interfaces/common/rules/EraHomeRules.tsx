import React from 'react';
import RulesContainer from './RulesContainer';
import RuleSection from '../RuleSection';
import GameLengthTable from './tables/GameLengthTable';

const EraHomeRules = () => {
    return (
        <RulesContainer>
            <div className="space-y-8">
                <header>
                    <h1 className="text-5xl font-extrabold text-amber-900">Mappa Imperium: Basics & Setup 📖</h1>
                    <p className="mt-4 text-xl text-gray-600">Welcome to a collaborative worldbuilding adventure! Here you'll find the core rules to get started.</p>
                </header>
                
                <RuleSection title="Game Basics">
                    <p className="rule-text">In Mappa Imperium, you and any number of friends will take control of an entire fantasy world. Dividing the map equally and working together you will create unique landmasses, geography, and resources for your world.</p>
                    <p className="rule-text">From there each player will take command of a kingdom and develop it from a struggling settlement to a massive empire, or perhaps, drive it into the lost histories of time.</p>
                    <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800">
                        <p><strong>Mappa Imperium is first and foremost a cooperative storytelling game and is played best when the players work together. By the end of the game you will have a full fantasy map complete with empires, lore, hostile tribes, and horrific monsters.</strong></p>
                    </div>
                </RuleSection>

                <RuleSection title="Game Setup">
                    <p className="rule-text">The world map is divided equally by the number of players. Each player takes control of one of these regions, referred to as "Home Regions".</p>
                    <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2">Solo Play</h3>
                    <p className="rule-text">To play solo, divide the paper into the number of major empires you wish to have, then play commences taking turns as usual.</p>
                    <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2">Multiplayer</h3>
                    <p className="rule-text">Mappa Imperium can be played with more than a few players and even large groups. Rather than using one sheet of paper for the world, each player will have their own sheet and that will be their "Home Region". Once the game is complete you can attach the separate sheets of paper creating one large map.</p>
                </RuleSection>

                <RuleSection title="Play Overview">
                    <p className="rule-text">There are 6 phases of the game called eras. Each of these develop and progress the story of your world and contain different tables to reference when rolling the dice. Once an era is complete, players will advance to the next.</p>
                    <p className="rule-text">Each turn of eras 4-6 consists of around 10 years. With Era 3 lasting 30 years, you will end up with a 200 year history on a standard game, plus a pantheon and mythology to go with it.</p>
                </RuleSection>
                
                <RuleSection title="Game Length">
                    <p className="rule-text">The number of turns per era can be adjusted for longer or shorter games. Be aware, the more players & empires you have will greatly increase the playtime.</p>
                    <GameLengthTable />
                </RuleSection>
            </div>
        </RulesContainer>
    );
};

export default EraHomeRules;