import style from './container.css';

import Navbar from '../nav/navbar.js';
import NavbarContainer from '../nav/navbar-container.js';
import NavbarFloat from '../nav/navbar-float.js';
import NavbarItem from '../nav/navbar-item.js';

import Logo from '../logo/logo.js';

export default function (generatedPage) {
	var generatedNavbar = Navbar(
		NavbarContainer(
			NavbarFloat('left', [Logo('#')])
		)
	);

	var containerHTML = require('./container.html');
	containerHTML = containerHTML.replace('{navbar}', generatedNavbar);
	containerHTML = containerHTML.replace('{page}', generatedPage);
	return containerHTML;
}
