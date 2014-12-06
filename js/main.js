/* globals UTILS */

/*================================================
DROPDOWNS BEHAVIOR.
================================================*/

var dropdowns = {

	init: function() {
		var nav = document.getElementById('navigation');

		UTILS.addEvent(nav, 'keydown', function(e) {
			if (UTILS.isEnterOrSpace(e)) {
				dropdowns.openDropdown.call(dropdowns, e);
			}
		});
		UTILS.addEvent(nav, 'mouseover', dropdowns.closeDropdown);
	},

	closeDropdown: function() {
	    if (UTILS.qs('.active-menu')) {
		    var activeMenu = UTILS.qs('.active-menu');

		    UTILS.removeClass(activeMenu, 'active-menu');
		    return activeMenu;
	   	}
	},

	openDropdown: function(e) {
		var target = e.target;

	    if (UTILS.hasClass(target, 'nav-section')) {
	    	var activeMenu = this.closeDropdown();

	    	e.preventDefault();
			if (activeMenu !== target) {
				UTILS.addClass(target, 'active-menu');
			}
		}
	}

};

/*================================================
TABS BEHAVIOR.
================================================*/

var tabs = {

	init: function() {
		UTILS.addEvent(window, 'hashchange', tabs.hash.bind(tabs));
		this.importData();
		this.hash();
		UTILS.addEvent(document, 'keydown', function(e) {
			if (UTILS.isEnterOrSpace(e) && e.target.tagName === 'A') {
				e.target.click();
				e.preventDefault();
			}
		});
	},

	getPanel: function(tab) {
		var anchor = tab.getAttribute('href'),
		panel = document.getElementById(anchor.replace('#', '') + '-panel');

		return panel;
	},

	removeAria: function() {
		var activeTab = UTILS.qs('.active-tab'),
		activePanel = this.getPanel(activeTab);

		UTILS.removeClass(activeTab, 'active-tab');
		activeTab.removeAttribute('aria-selected');
		activeTab.setAttribute('aria-selected', 'false');
		UTILS.removeClass(activePanel, 'active-panel');
		activePanel.removeAttribute('aria-hidden');
		activePanel.setAttribute('aria-hidden', 'true');
	},

	activate: function(tab) {
		if (UTILS.qs('.active-tab') && tab === UTILS.qs('.active-tab')) {
			return;
		}
		else {
			var panel = this.getPanel(tab);

			if (UTILS.qs('.active-tab')) {
				this.removeAria();
			}

			UTILS.addClass(tab, 'active-tab');
			tab.setAttribute('aria-selected', 'true');
			UTILS.addClass(panel, 'active-panel');
			panel.setAttribute('aria-hidden', 'false');
		}
	},

	exportData: function() {
		var panels = [UTILS.qs('#quick-reports-panel'), UTILS.qs('#my-team-folders-panel')],
		data = [];

		for (var i = 0; i < panels.length; i++) {
			var panel = panels[i],
			formHtml = panel.innerHTML,
			inputs = panel.querySelectorAll('.form-group input'),
			selectedIndex = panel.querySelector('select').selectedIndex,
			formValues = [];

			for (var j = 0; j < inputs.length; j++) {
				var input = inputs[j];
				formValues.push(input.value);

			}

			data[i] = [formHtml, selectedIndex, formValues];

		}

		if (localStorage.setItem('data', JSON.stringify(data))) {
			localStorage.setItem('data', JSON.stringify(data));
		}
	},

	importData: function() {
		if (localStorage.getItem('data')) {
			var data = JSON.parse(localStorage.getItem('data')),
			panels = [UTILS.qs('#quick-reports-panel'), UTILS.qs('#my-team-folders-panel')];

			for (var i = 0; i < data.length; i++) {
				// form html,values, select value, iframe src, button href,
				var dataset = data[i],
				formHtml = dataset[0],
				index = dataset[1],
				val = dataset[2],
				panel = panels[i],
				inputs,
				select,
				value,
				iframe,
				button;

				panel.innerHTML = formHtml;
				inputs = panel.querySelectorAll('.form-group input');

				for (var j = 0; j < inputs.length; j++) {
					inputs[j].value = val[j];
				}

				select = panel.querySelector('select');
				select.selectedIndex = index;
				if (index > -1) {
					value = select.options[select.selectedIndex].value;
					iframe = panel.querySelector('iframe');
					iframe.setAttribute('src', value);
					button = panel.querySelector('.to-website');
					button.setAttribute('href', value);
				}
			}
		}
	},

	hash: function() {
		var count = 0,
		hashVal = window.location.hash,
		tabsGroup = UTILS.qsa('.tab');

		for (var i = 0; i < tabsGroup.length; i++) {
			var tab = tabsGroup[i],
			anchor = tab.getAttribute('href');

			if (anchor === hashVal) {
				this.activate(tab);
				count = count + 1;
			}
		}
		if (count === 0) {
			window.location.hash = 'quick-reports';
			this.activate(tabsGroup[0]);
		}
	}

};

/*================================================
FORMS BEHAVIOR.
================================================*/

var formsBehavior = {

	init: function() {

		this.controlButton();

		this.cancelButton();

		this.toWebsiteButton();

		this.siteSelect();

	},

	controlButton: function() {
		var controls = UTILS.qsa('.form-control');

		for (var i = 0; i < controls.length; i++) {
			var control = controls[i];

			UTILS.addEvent(control, 'click', formsBehavior.displayOrHideForm.bind(formsBehavior));
		}
	},

	cancelButton: function() {
		var cancels = UTILS.qsa('.cancel');

		for (var j = 0; j < cancels.length; j++) {
			var cancel = cancels[j];

			UTILS.addEvent(cancel, 'click', formsBehavior.hideForm.bind(formsBehavior));
		}
	},

	toWebsiteButton: function () {
		var forms = UTILS.qsa('.enter-site');

		for (var k = 0; k < forms.length; k++) {
			var form = forms[k];

			UTILS.addEvent(form, 'submit', formsBehavior.validateForm(form).bind(formsBehavior));
			var inputs = form.querySelectorAll('input');

			for (var l = 0; l < inputs.length; l++) {
				var input = inputs[l];

				UTILS.addEvent(input, 'keydown', formsBehavior.escapePress.bind(formsBehavior));
			}
		}
	},

	siteSelect: function() {
		var selects = UTILS.qsa('.site-select');

		for (var m = 0; m < selects.length; m++) {
			var select = selects[m];

			UTILS.addEvent(select, 'change', formsBehavior.selectHandler.bind(formsBehavior));
		}
	},

	getFormWrap: function() {
		var activePanel = UTILS.qs('.active-panel'),
		formWrap = activePanel.querySelector('.form-wrap');

		return formWrap;
	},

	displayForm: function() {
		var connectedForm = this.getFormWrap();

		UTILS.addClass(connectedForm, 'visible-form');
		connectedForm.querySelector('input').focus();
	},

	hideForm: function() {
		var connectedForm = this.getFormWrap();

		UTILS.removeClass(connectedForm, 'visible-form');
	},

	escapePress: function(e) {
		if (e.keyCode === 27 || e.which === 27) {
			this.hideForm();
		}
	},

	displayOrHideForm: function() {
		var connectedForm = this.getFormWrap();

		if (UTILS.hasClass(connectedForm, 'visible-form')) {
			this.hideForm();
		}
		else {
			this.displayForm();
		}
	},

	isValidUrlRegex: function(url) {
		var re = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

		if (re.test(url.value)) {
			return true;
		}
		else {
			return false;
		}
	},

	setHttp: function(url) {
		var re = /^(https?:\/\/)/i;

		if (re.test(url.value)) {
			url.value = url.value.toLowerCase();
			return;
		}
		else {
			url.value = 'http://' + url.value.toLowerCase();
		}
	    return;
	},

	validateURL: function(url, e) {
		if (url.value === '') {
			e.preventDefault();
			if (!UTILS.hasClass(url, 'invalid')) {
				UTILS.addClass(url, 'invalid');
			}
		}
		else {

			if (this.isValidUrlRegex(url)) {
				if (UTILS.hasClass(url, 'invalid')) {
					UTILS.removeClass(url, 'invalid');
				}
				this.setHttp(url);
			}

			else {
				e.preventDefault();
				if (!UTILS.hasClass(url, 'invalid')) {
					UTILS.addClass(url, 'invalid');
				}
			}
		}
	},

	validateFieldset: function(e, name, url, siteArray) {
		if (name.value === '') {
			e.preventDefault();
			if (!UTILS.hasClass(name, 'invalid')) {
				UTILS.addClass(name, 'invalid');
			}
		}
		else {
			if (UTILS.hasClass(name, 'invalid')) {
				UTILS.removeClass(name, 'invalid');
			}
		}
		this.validateURL(url, e);
		if (!UTILS.hasClass(name, 'invalid') && !UTILS.hasClass(url, 'invalid')) {
			var siteInfo = {
				siteName: name.value,
				siteUrl: url.value
			};

			siteArray.unshift(siteInfo);
		}
	},

	initTab: function(elm, siteArray) {
		if (elm.removeAttribute('src')) {
			elm.removeAttribute('src', siteArray[0].siteUrl);
		}
		if (elm.removeAttribute('href')) {
			elm.removeAttribute('href', siteArray[0].siteUrl);
		}
		if (elm.tagName === 'SELECT') {
			while (elm.firstChild) {
			    elm.removeChild(elm.firstChild);
			}
		}
		UTILS.addClass(elm, 'hidden');
	},

	fillTabContent: function(form, elm, siteArray) {
		if (UTILS.hasClass(elm, 'hidden')) {
			UTILS.removeClass(elm, 'hidden');
		}
		if (elm.tagName === 'IFRAME') {
			elm.setAttribute('src', siteArray[0].siteUrl);
		}
		if (UTILS.hasClass(elm, 'to-website')) {
			elm.setAttribute('href', siteArray[0].siteUrl);
		}

		if (elm.tagName === 'SELECT') {
			while (elm.firstChild) {
			    elm.removeChild(elm.firstChild);
			}
			for (var j = 0; j < siteArray.length; j ++) {
				var option = document.createElement('OPTION'),
				text = document.createTextNode(siteArray[j].siteName);

				option.appendChild(text);
				option.setAttribute('value', siteArray[j].siteUrl);
				elm.appendChild(option);
			}
		}
		UTILS.removeClass(form.parentNode, 'visible-form');
	},

	displayWebsites: function(form, siteArray) {
		var selector = '.' + UTILS.qs('.active-panel').querySelector('.form-wrap').id,
		elements = UTILS.qsa(selector);

		for (var i = 0; i < elements.length; i++) {
			var elm = elements[i];

			if (!siteArray[0] && !UTILS.hasClass(elm, 'hidden')) {

				this.initTab(elm, siteArray);

			}
			else if (!siteArray[0]) {
				console.log();
			}
			else {

				this.fillTabContent(form, elm, siteArray);

			}
		}
	},

	validateForm: function(form) {
		return function(e) {
			var siteArray = [],
			sets = form.getElementsByTagName('FIELDSET');

			for (var i = 0; i < sets.length; i++) {
				var set = sets[i],
				name = set.getElementsByTagName('INPUT')[0],
				url = set.getElementsByTagName('INPUT')[1];

				if (name.value !== '' || url.value !== '') {
					this.validateFieldset(e, name, url, siteArray);
				}
				else {
					if (UTILS.hasClass(name, 'invalid')) {
						UTILS.removeClass(name, 'invalid');
					}
					if (UTILS.hasClass(url, 'invalid')) {
						UTILS.removeClass(url, 'invalid');
					}
				}
			}

			if (form.querySelector('.invalid')) {
				form.querySelector('.invalid').focus();
			}
			else {
				e.preventDefault();
				this.displayWebsites(form, siteArray);
				tabs.exportData();
			}
		};
	},

	selectHandler: function(e) {
		if (e.target.tagName === 'SELECT') {
			var target = e.target,
			getValue = target.options[target.selectedIndex].value,
			panel = UTILS.qs('.active-panel'),
			iframe = panel.querySelector('iframe'),
			button = panel.querySelector('.to-website');

			iframe.setAttribute('src', getValue);
			button.setAttribute('href', getValue);
			tabs.exportData();
		}
	}

};

/*================================================
SEARCH BOX BEHAVIOR.
================================================*/

var searchBox = {

	init: function() {
		var searchElm = UTILS.qs('input[type="search"]');

		UTILS.addEvent(searchElm, 'keydown', searchBox.searchHandler.bind(searchElm));
	},

	searchSite: function(tabGroup, searchTerm, notificationsWrap, notifications) {
		for (var i = 0; i < tabGroup.length; i++) {
			var tab = tabGroup[i],
			panel = tabs.getPanel(tab),
			select = panel.querySelector('.site-select'),
			options = select.querySelectorAll('option');

			for (var j = 0; j < options.length; j++) {
				if (options[j].textContent.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0) {
					tab.click();
					select.selectedIndex = j;
					panel.querySelector('iframe').setAttribute('src', options[j].value);
					panel.querySelector('.to-website').setAttribute('href', options[j].value);
					if (UTILS.hasClass(notificationsWrap, 'active-ajax') && notifications.innerText.indexOf('The searched report') === 0) {
						UTILS.removeClass(notificationsWrap, 'active-ajax');
						notifications.style.display = 'none';
					}
					return;
				}

			}
		}

		if (!UTILS.hasClass(notificationsWrap, 'active-ajax')) {
			UTILS.addClass(notificationsWrap, 'active-ajax');
		}
		notifications.style.display = 'block';
		notifications.innerText = 'The searched report "' + searchTerm + '" was not found.';
	},

	searchHandler: function(e) {
		if (e.which === 13 || e.keyCode === 13) {
			var notificationsWrap = UTILS.qs('.notifications-wrap'),
			notifications = UTILS.qs('.notifications'),
			searchTerm = this.value;

			e.preventDefault();
			if (searchTerm === '') {
				if (UTILS.hasClass(notificationsWrap, 'active-ajax') && notifications.innerText.indexOf('The searched report') === 0) {
					UTILS.removeClass(notificationsWrap, 'active-ajax');
					notifications.style.display = 'none';
				}
				return;
			}

			var tabGroup = [UTILS.qs('.tab1'), UTILS.qs('.tab3')];

			searchBox.searchSite(tabGroup, searchTerm, notificationsWrap, notifications);
		}
	}
};

/**
 * Initialize all components.
 */

var initSite = function() {
	UTILS.ajax('../Web-App/data/notification.txt', {

		method: 'GET',

		done: function (response) {
			if (response && response !== '') {
				var message = UTILS.qs('.notifications'),
				container = UTILS.qs('.notifications-wrap');

				message.innerHTML = response;
				message.style.display = 'block';
				UTILS.addClass(container, 'active-ajax');
			}
		},

		fail: function (err) {
			console.log('error in the AJAX request');
		}

	});
	dropdowns.init();
	tabs.init();
	formsBehavior.init();
	searchBox.init();
};

/**
 * On page load.
 */

initSite();
