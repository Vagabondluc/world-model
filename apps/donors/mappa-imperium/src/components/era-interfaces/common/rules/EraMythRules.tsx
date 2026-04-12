import React from 'react';
import RulesContainer from './RulesContainer';
import RuleSection from '../RuleSection';
import DeityCountTable from './tables/DeityCountTable';
import DomainTable from './tables/DomainTable';
import DeitySymbolTable from './tables/DeitySymbolTable';
import NameTable from './tables/NameTable';
import SacredSitesTable from './tables/SacredSitesTable';

const EraMythRules = () => {
    return (
        <RulesContainer>
            <div className="space-y-8">
                <header>
                    <h1 className="text-5xl font-extrabold text-amber-900">Era II: Age of Myth ⚡</h1>
                    <p className="mt-4 text-xl text-gray-600">The story of your world begins here with the development of a pantheon. Each player will create a number of deities that inhabit their home region. These gods may be worshipped, feared, or ignored, and will help to spark the imagination for the development and story of your world.</p>
                </header>

                <RuleSection title="2.1 Number of Deities">
                    <p className="rule-text">Roll 1 die to determine the number of deities for your home region.</p>
                    <DeityCountTable />
                </RuleSection>

                <RuleSection title="2.2 Domain">
                    <p className="rule-text">Roll 1 die to determine a domain for each deity.</p>
                    <DomainTable />
                </RuleSection>

                <RuleSection title="2.3 Symbol">
                    <p className="rule-text">Roll 1 die to determine a symbol for each deity.</p>
                    <DeitySymbolTable />
                </RuleSection>

                <RuleSection title="2.4 Name">
                    <p className="rule-text">Create a name for each deity, then place all 3 (name, domain, symbol) together in either the margins of the map or on a separate sheet of paper.</p>
                    <p className="rule-text">If you need help coming up with a name, roll 2 or 3 times on the table below and combine the results.</p>
                    <NameTable />
                </RuleSection>

                <RuleSection title="2.5 Sacred Sites">
                    <p className="rule-text">Each player will take turns creating and naming sacred locations and items in each Home Region. Roll on the table below a number of times equal to the number of deities in your Home Region, then draw in the results. Label each site for the deity they represent.</p>
                    <SacredSitesTable />
                </RuleSection>
            </div>
        </RulesContainer>
    );
};

export default EraMythRules;
