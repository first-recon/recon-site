import { GameConfig } from '../../../recon-lib';
const borderStyling = '1px solid grey';

const convertToPoints = (value, rule) => {
    return ;
};

const MatchHeader = (header) => `
    <div style="padding: 5px; border-bottom: 1px solid grey">
        ${header}
    </div>
`;

const MatchColumn = (col) => `
    <div style="flex-direction: column; border: 1px solid grey;">
        ${MatchHeader(col[0])}
        ${col.slice(1, col.length).map(entry => `<div style="padding: 5px">${entry}</div>`).join('')}
    </div>
`;

const MatchTable = (data) => `
    <div style="display: flex;">
        ${data.map(MatchColumn).join('')}
    </div>
`;

export default function (event) {
    const headerKeys = Object.keys(event.matches[0].data);
    headerKeys.sort((a, b) => {
        if (a.includes('auto')) {
            return -1;
        }

        if (a.includes('tele')) {
            return 0;
        }

        if (a.includes('end')) {
            return 1;
        }
    });

    const data = headerKeys.map(key => {
        const scoringRuleElements = key.split('_');
        scoringRuleElements.shift();
        const header = scoringRuleElements.join(' ');
        return [
            header,
            ...event.matches.reduce((col, { data }) => {
                const scoredData = GameConfig.calcScoresFromData(data);
                return [...col, scoredData[key]];
            }, [])
        ];
    });

    return `
        <div>
            <h3>${event.name}</h3>
            <div>${MatchTable(data)}</div>
        </div>
    `;
}