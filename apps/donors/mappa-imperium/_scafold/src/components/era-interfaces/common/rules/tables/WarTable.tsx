import React from 'react';
import RuleTable from '../../RuleTable';

const warHeaders = ['1d6', 'Results'];
const warRows = [
    [1, 'Devastating Loss and Counterattack - Defender crushes the attacker. Defender makes an immediate counter attack against a settlement they choose. Now rolling as the attacker. Defender also places a monument to their new war hero.'],
    [2, 'Failed Attack - Defender fights off the attackers, maintaining control of the settlement.'],
    [3, 'Stalemate - After many losses on both sides, the attack fails'],
    [4, 'Successful Assault - Attacker wins and takes control of the settlement'],
    [5, 'Great Victory - Attacker easily overpowers the defender and takes control of the settlement, then places a new fort nearby.'],
    [6, 'Great Campaign - Attacker crushes the enemy, then immediately makes another attack against another settlement. Create a monument to the new hero that emerged from this war.']
];

const WarTable = () => {
    return <RuleTable headers={warHeaders} rows={warRows} />;
};

export default WarTable;