import { GameConfig } from '../../../recon-lib';

import style from './match-tournament.css';

const ruleKeyToHeader = (key = '') => {
    const ruleParts = key.toString()
        .split('_')
        .slice(1)
        // .map(part => part.charAt(0).toUpperCase() + part.slice(1));
        .map(part => part.toUpperCase());

    return ruleParts.join(' ');
};

const createTableRenderer = (HeaderRenderer, RowRenderer) => (headers, matches) => `
    <div>
        ${HeaderRenderer(headers)}
        ${matches.map(RowRenderer).join('')}
    </div>
`;

const Cell = (value, classes) => `
    <div class="${classes}">${value}</div>
`;

const HeaderCell = (value, i) => `<div class="data-cell-container ${i === 0 ? 'col-sm' : ''}">${Cell(value, `data-cell ${i === 0 ? 'col-sm' : ''}`)}</div>`;
const DataCell = (value, i) => `<div class="data-cell-container ${i === 0 ? 'col-sm' : ''}">${Cell(value, `data-cell`)}</div>`;

const Header = (list) => `<div>${
    list.map(HeaderCell).join('')
}</div>`;


const Row = (list) => `<div class="data-row">${
    list.map(DataCell).join('')
}</div>`;

const Table = createTableRenderer(Header, Row);

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

    const matchRows = event.matches.map(({
        number,
        data
    }) => ([
        number,
        ...Object.values(GameConfig.calcScoresFromData(data)).filter(value => typeof value === 'number')
    ]));

    return `
        <div style="margin-bottom: 60px">
            <div style="
                text-align: center;
                margin-bottom: 5px;
                font-style: italic;
                font-size: 24px;
                color: grey;
            ">${event.name || 'Unknown'}</div>
            ${Table(['#', ...headerKeys.map(ruleKeyToHeader)], matchRows)}
        </div>
    `;
}