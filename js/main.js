/* globals UTILS */

/*================================================
TABS BEHAVIOR.
================================================*/

var tabsObj = {

	init: function() {
		UTILS.addEvent(window, 'hashchange', tabsObj.hash.bind(tabsObj));
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
		var anchor = tab.getAttribute('href');
		var panel = document.getElementById(anchor.replace('#', '') + '-panel');
		return panel;
	},

	activate: function(tab) {
		if (UTILS.qs('.active-tab') && tab === UTILS.qs('.active-tab')) {
			return;
		}
		else {
			var panel = this.getPanel(tab);
			if (UTILS.qs('.active-tab')) {
				var activeTab = UTILS.qs('.active-tab');
				UTILS.removeClass(activeTab, 'active-tab');
				activeTab.removeAttribute('aria-selected');
				activeTab.setAttribute('aria-selected', 'false');
				var activePanel = this.getPanel(activeTab);
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
		var quickReports = UTILS.qs('#quick-reports-panel').innerHTML;
		var myTeamFolders = UTILS.qs('#my-team-folders-panel').innerHTML;
		var selectedIndex1 = UTILS.qs('#quick-reports-panel .site-select').selectedIndex;
		var selectedIndex2 = UTILS.qs('#my-team-folders-panel .site-select').selectedIndex;
		var formInputs1 = UTILS.qsa('#quick-reports-panel .form-group input');
		var formInputs2 = UTILS.qsa('#my-team-folders-panel .form-group input');
		var formValues1 = [];
		var formValues2 = [];

		for (var i = 0; i < formInputs1.length; i++) {
			formValues1.push(formInputs1[i].value);
		}

		for (var j = 0; j < formInputs2.length; j++) {
			formValues2.push(formInputs2[j].value);
		}

		var formsObj = {
			form1 : quickReports,
			form2: myTeamFolders,
			i1: selectedIndex1,
			i2: selectedIndex2,
			val1: formValues1,
			val2: formValues2
		};

		if (localStorage.setItem('forms', JSON.stringify(formsObj))) {
			localStorage.setItem('forms', JSON.stringify(formsObj));
		}
	},

	importData: function() {
		if (localStorage.getItem('forms')) {
			var tabNodes = JSON.parse(localStorage.getItem('forms'));
			UTILS.qs('#quick-reports-panel').innerHTML = tabNodes['form1'];
			UTILS.qs('#my-team-folders-panel').innerHTML = tabNodes['form2'];
			var formInputs1 = UTILS.qsa('#quick-reports-panel .form-group input');
			var formInputs2 = UTILS.qsa('#my-team-folders-panel .form-group input');
			for (var i = 0; i < formInputs1.length; i++) {
				formInputs1[i].value = tabNodes['val1'][i];
			}
			for (var j = 0; j < formInputs2.length; j++) {
				formInputs2[j].value = tabNodes['val2'][j];
			}

			if (tabNodes['i1'] >= 0) {
				var select1 = UTILS.qs('#quick-reports-panel .site-select');
				select1.selectedIndex = tabNodes['i1'];
				var value1 = select1.options[select1.selectedIndex].value;
				var iframe1 = UTILS.qs('#quick-reports-panel iframe');
				var button1 = UTILS.qs('#quick-reports-panel .to-website');
				iframe1.setAttribute('src', value1);
				button1.setAttribute('href', value1);
			}

			if (tabNodes['i2'] >= 0) {
				var select2 = UTILS.qs('#my-team-folders-panel .site-select');
				select2.selectedIndex = tabNodes['i2'];
				var value2 = select2.options[select2.selectedIndex].value;
				var iframe2 = UTILS.qs('#my-team-folders-panel iframe');
				var button2 = UTILS.qs('#my-team-folders-panel .to-website');
				iframe2.setAttribute('src', value2);
				button2.setAttribute('href', value2);
			}
		}
	},

	hash: function() {
		var count = 0;
		var hashVal = window.location.hash;
		var tabs = UTILS.qsa('.tab');
		for (var i = 0; i < tabs.length; i++) {
			var tab = tabs[i];
			var anchor = tab.getAttribute('href');
			if (anchor === hashVal) {
				this.activate(tab);
				count = count + 1;
			}
		}
		if (count === 0) {
			window.location.hash = 'quick-reports';
			this.activate(tabs[0]);
		}
	}

};

/*================================================
DROPDOWNS BEHAVIOR.
================================================*/

var dropdownsObj = {

	init: function() {
		var nav = document.getElementById('navigation');

		UTILS.addEvent(nav, 'keydown', function(e) {
			if (UTILS.isEnterOrSpace(e)) {
				dropdownsObj.openDropdown.call(dropdownsObj, e);
			}
		});
		UTILS.addEvent(nav, 'mouseover', dropdownsObj.closeDropdown);
	},

	closeDropdown: function() {
	    if (UTILS.qs('.active-menu')) {
		    var activeMenu = UTILS.qs('.active-menu');
		    UTILS.removeClass(activeMenu, 'active-menu');
	   	}
	   	return activeMenu;
	},

	openDropdown: function(e) {
		var target = e.target;
	    if (UTILS.hasClass(target, 'nav-section')) {
	    	e.preventDefault();
		    var activeMenu = this.closeDropdown();
			if (activeMenu !== target) {
				UTILS.addClass(target, 'active-menu');
			}
		}
	}

};

/*================================================
TAB PANELS INTERACTIVITY.
================================================*/

var interactivityObj = {

	init: function() {
		var controls = UTILS.qsa('.form-control');
		for (var i = 0; i < controls.length; i++) {
			var control = controls[i];
			UTILS.addEvent(control, 'click', interactivityObj.displayOrHideForm.bind(interactivityObj));
		}

		var cancels = UTILS.qsa('.cancel');
		for (var i = 0; i < cancels.length; i++) {
			var cancel = cancels[i];
			UTILS.addEvent(cancel, 'click', interactivityObj.hideForm.bind(interactivityObj));
		}

		var forms = UTILS.qsa('.enter-site');
		for (var i = 0; i < forms.length; i++) {
			var form = forms[i];
			UTILS.addEvent(form, 'submit', interactivityObj.validateForm(form).bind(interactivityObj));
			var inputs = form.querySelectorAll('input');
			for (var j = 0; j < inputs.length; j++) {
				var input = inputs[j];
				UTILS.addEvent(input, 'keydown', function(e){
					if (e.keyCode === 27 || e.which === 27) {
						interactivityObj.hideForm.call(interactivityObj);
					}
				});
			}
		}

		var selects = UTILS.qsa('.site-select');
		for (var i = 0; i < selects.length; i++) {
			var select = selects[i];
			UTILS.addEvent(select, 'change', interactivityObj.selectHandler.bind(interactivityObj));
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
			var obj = {
				siteName: name.value,
				siteUrl: url.value
			};
			siteArray.unshift(obj);
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
				tabsObj.exportData();
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
			tabsObj.exportData();
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
			var panel1 = tabsObj.getPanel(tab1);
			var tab3 = UTILS.qs('.tab3');
			var panel3 = tabsObj.getPanel(tab3);
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
	tabsObj.init();
	dropdownsObj.init();
	interactivityObj.init();
	searchBox.init();
};

initSite();




