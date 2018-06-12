import MatchEntry from '../match-entry';

export default function (event) {
    console.log(event);
    return '<div><h3>{event-name}</h3><div>{matches}</div></div>'
        .replace('{event-name}', event.name)
        .replace('{matches}', event.matches.map(m => MatchEntry(m)).join(''));
}