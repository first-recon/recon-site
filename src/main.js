import { get, inject, keys, navigate } from './lib/helpers/g.js';
import navbar from './lib/components/nav/navbar.js';
import pages from './pages';

import style from './global.css';

window.addEventListener('DOMContentLoaded', function() {
	navigate(get('#content'), window.location.hash, pages);
});

window.onhashchange = function(e) {
	navigate(get('#content'), window.location.hash, pages);
};
