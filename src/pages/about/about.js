import style from './about.css';

const template = require('./about.html');

export default function () {

    document.title = 'About';

    return template;
}