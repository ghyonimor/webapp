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

	activate: function(tab) {
		if (UTILS.qs('.active-tab') && tab === UTILS.qs('.active-tab')) {
			return;
		}
		else {
			var panel = this.getPanel(tab);

			if (UTILS.qs('.active-tab')) {
				var activeTab = UTILS.qs('.active-tab'),
				activePanel = this.getPanel(activeTab);

				UTILS.removeClass(activeTab, 'active-tab');
				activeTab.removeAttribute('aria-selected');
				activeTab.setAttribute('aria-selected', 'false');
				UTILS.removeClass(activePanel, 'active-panel');
				activePanel.removeAttribute('aria-hidden');
				activePanel.setAttribute('aria-hidden', 'true');
			}

			UTILS.addClass(tab, 'active-tab');
			tab.setAttribute('aria-selected', 'true');
			UTILS.addClass(panel, 'active-panel');
			panel.setAttribute('aria-hidden', 'false');
		}
	},

	exportData: function() {
		var quickReports = UTILS.qs('#quick-reports-panel').innerHTML,
		myTeamFolders = UTILS.qs('#my-team-folders-panel').innerHTML,
		selectedIndex1 = UTILS.qs('#quick-reports-panel .site-select').selectedIndex,
		selectedIndex2 = UTILS.qs('#my-team-folders-panel .site-select').selectedIndex,
		formInputs1 = UTILS.qsa('#quick-reports-panel .form-group input'),
		formInputs2 = UTILS.qsa('#my-team-folders-panel .form-group input'),
		formValues1 = [],
		formValues2 = [];

		for (var i = 0; i < formInputs1.length; i++) {
			formValues1.push(formInputs1[i].value);
		}

		for (var j = 0; j < formInputs2.length; j++) {
			formValues2.push(formInputs2[j].value);
		}

		var forms = {
			form1 : quickReports,
			form2: myTeamFolders,
			i1: selectedIndex1,
			i2: selectedIndex2,
			val1: formValues1,
			val2: formValues2
		};

		if (localStorage.setItem('forms', JSON.stringify(forms))) {
			localStorage.setItem('forms', JSON.stringify(forms));
		}
	},

	importData: function() {
		if (localStorage.getItem('forms')) {
			var tabNodes = JSON.parse(localStorage.getItem('forms')),
			formInputs1,
			formInputs2;
			UTILS.qs('#quick-reports-panel').innerHTML = tabNodes.form1;
			UTILS.qs('#my-team-folders-panel').innerHTML = tabNodes.form2;
			formInputs1 = UTILS.qsa('#quick-reports-panel .form-group input');
			formInputs2 = UTILS.qsa('#my-team-folders-panel .form-group input');

			for (var i = 0; i < formInputs1.length; i++) {
				formInputs1[i].value = tabNodes.val1[i];
			}

			for (var j = 0; j < formInputs2.length; j++) {
				formInputs2[j].value = tabNodes.val2[j];
			}

			if (tabNodes.i1 >= 0) {
				var select1 = UTILS.qs('#quick-reports-panel .site-select'),
				value1,
				iframe1,
				button1;
				select1.selectedIndex = tabNodes.i1;
				value1 = select1.options[select1.selectedIndex].value;
				iframe1 = UTILS.qs('#quick-reports-panel iframe');
				button1 = UTILS.qs('#quick-reports-panel .to-website');
				iframe1.setAttribute('src', value1);
				button1.setAttribute('href', value1);
			}

			if (tabNodes.i2 >= 0) {
				var select2 = UTILS.qs('#my-team-folders-panel .site-select'),
				value2,
				iframe2,
				button2;
				select2.selectedIndex = tabNodes.i2;
				value2 = select2.options[select2.selectedIndex].value;
				iframe2 = UTILS.qs('#my-team-folders-panel iframe');
				button2 = UTILS.qs('#my-team-folders-panel .to-website');
				iframe2.setAttribute('src', value2);
				button2.setAttribute('href', value2);
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
		var controls = UTILS.qsa('.form-control');
		for (var i = 0; i < controls.length; i++) {
			var control = controls[i];
			UTILS.addEvent(control, 'click', formsBehavior.displayOrHideForm.bind(formsBehavior));
		}

		var cancels = UTILS.qsa('.cancel');
		for (var j = 0; j < cancels.length; j++) {
			var cancel = cancels[j];
			UTILS.addEvent(cancel, 'click', formsBehavior.hideForm.bind(formsBehavior));
		}

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

		var selects = UTILS.qsa('.site-select');
		for (var m = 0; m < selects.length; m++) {
			var select = selects[m];
			UTILS.addEvent(select, 'change', formsBehavior.selectHandler.bind(formsBehavior));
		}
	},

	getFormWrap: function() {
		var activePanel = UTILS.qs('.active-panel');
		var formWrap = activePanel.querySelector('.form-wrap');
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

	displayWebsites: function(form, siteArray) {
		var selector = '.' + UTILS.qs('.active-panel').querySelector('.form-wrap').id;
		var elements = UTILS.qsa(selector);
		for (var i = 0; i < elements.length; i++) {
			var elm = elements[i];
			if (!siteArray[0] && !UTILS.hasClass(elm, 'hidden')) {
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
			}
			else if (!siteArray[0]) {
				console.log();
			}
			else {
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
						var option = document.createElement('OPTION');
						var text = document.createTextNode(siteArray[j].siteName);
						option.appendChild(text);
						option.setAttribute('value', siteArray[j].siteUrl);
						elm.appendChild(option);
					}
				}
				UTILS.removeClass(form.parentNode, 'visible-form');
			}
		}
	},

	validateForm: function(form) {
		return function(e) {
			var siteArray = [];
			var sets = form.getElementsByTagName('FIELDSET');
			for (var i = 0; i < sets.length; i++) {
				var set = sets[i];
				var name = set.getElementsByTagName('INPUT')[0];
				var url = set.getElementsByTagName('INPUT')[1];
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
			var target = e.target;
			var getValue = target.options[target.selectedIndex].value;
			var panel = UTILS.qs('.active-panel');
			var iframe = panel.querySelector('iframe');
			var button = panel.querySelector('.to-website');
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

	searchHandler: function(e) {
		if (e.which === 13 || e.keyCode === 13) {
			var notificationsWrap = UTILS.qs('.notifications-wrap');
			var notifications = UTILS.qs('.notifications');
			var searchTerm = this.value;
			e.preventDefault();
			if (searchTerm === '') {
				if (UTILS.hasClass(notificationsWrap, 'active-ajax') && notifications.innerText.indexOf('The searched report') === 0) {
					UTILS.removeClass(notificationsWrap, 'active-ajax');
					notifications.style.display = 'none';
				}
				return;
			}
			var tab1 = UTILS.qs('.tab1');
			var panel1 = tabs.getPanel(tab1);
			var tab3 = UTILS.qs('.tab3');
			var panel3 = tabs.getPanel(tab3);
			var select1 = panel1.querySelector('.site-select');
			var options1 = select1.querySelectorAll('option');
			var select3 = panel3.querySelector('.site-select');
			var options3 = select3.querySelectorAll('option');
			for (var i = 0; i < options1.length; i++) {
				if (options1[i].textContent.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0) {
					tab1.click();
					select1.selectedIndex = i;
					panel1.querySelector('iframe').setAttribute('src', options1[i].value);
					panel1.querySelector('.to-website').setAttribute('href', options1[i].value);
					if (UTILS.hasClass(notificationsWrap, 'active-ajax') && notifications.innerText.indexOf('The searched report') === 0) {
						UTILS.removeClass(notificationsWrap, 'active-ajax');
						notifications.style.display = 'none';
					}
					return;
				}
			}

			for (var j = 0; j < options3.length; j++) {
				if (options3[j].textContent.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0) {
					tab3.click();
					select3.selectedIndex = j;
					panel3.querySelector('iframe').setAttribute('src', options3[j].value);
					panel3.querySelector('.to-website').setAttribute('href', options3[j].value);
					if (UTILS.hasClass(notificationsWrap, 'active-ajax') && notifications.innerText.indexOf('The searched report') === 0) {
						UTILS.removeClass(notificationsWrap, 'active-ajax');
						notifications.style.display = 'none';
					}
					return;
				}
			}

			if (!UTILS.hasClass(notificationsWrap, 'active-ajax')) {
				UTILS.addClass(notificationsWrap, 'active-ajax');
			}
			notifications.style.display = 'block';
			notifications.innerText = 'The searched report "' + searchTerm + '" was not found.';
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
				var message = UTILS.qs('.notifications');
				message.innerHTML = response;
				message.style.display = 'block';
				var container = UTILS.qs('.notifications-wrap');
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
