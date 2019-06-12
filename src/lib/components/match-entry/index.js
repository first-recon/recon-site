import style from './match-entry.css';

import MatchPeriod from '../match-period';

import { GameConfig } from '../../../recon-lib';


export default function (match) {
    const matchEntry = require('./match-entry.html');
    
    const byCode = ({code}) => match.data[code];
    const getValueFromMatchRule = (value, rule) => (typeof value === 'boolean' ? rule.value : value);

    const autoMatches = GameConfig.getRulesForPeriod('autonoumous').filter(byCode);
    const teleopMatches = GameConfig.getRulesForPeriod('teleop').filter(byCode);
    const endgameMatches = GameConfig.getRulesForPeriod('endgame').filter(byCode);
    const totalScore = GameConfig.getRuleset().reduce((runningTotal, rule) => {
        const matchRuleValue = match.data[rule.code];
        return runningTotal + getValueFromMatchRule(matchRuleValue, rule);
    }, 0);

    const autoPeriod = MatchPeriod('Autonomous', 'rgb(150, 140, 0)', autoMatches);
    const teleopPeriod = MatchPeriod('Teleop', 'darkgreen', teleopMatches);
    const endgamePeriod = MatchPeriod('End Game', 'darkred', endgameMatches);

    return matchEntry
        .replace('{match-num}', match.number)
        .replace('{total-score}', totalScore)
        .replace('{data}', [autoPeriod, teleopPeriod, endgamePeriod].join(''));
}