/* globals UTILS */

/*================================================
AJAX NOTIFICATION.
================================================*/

// Display an ajax notification using UTILS.ajax.
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
		console.log(err.message);
	}
});

/*================================================
TABS BEHAVIOR.
================================================*/

var tabsObj = {

	// Get a panel connected to a tab.
	getPanel: function(tab) {
		var anchor = tab.getAttribute('href');
		var panel = document.getElementById(anchor.replace('#', '') + '-panel');
		return panel;
	},

	// Add active-tab class, connect it with a panel (activePanel), show the panel and disable other tabs.
	activate: function(tab) {
		// If another tab is activated, and it's equal to the new tab, break the function.
		if (UTILS.qs('.active-tab') && tab === UTILS.qs('.active-tab')) {
			return;
		}
		else {
			// Get the panel related to this tab.
			var panel = this.getPanel(tab);
			// Check if another tab has an active state and remove it.
			if (UTILS.qs('.active-tab')) {
				var activeTab = UTILS.qs('.active-tab');
				// Remove active-tab class.
				UTILS.removeClass(activeTab, 'active-tab');
				// Remove aria-selected attribute from previously active tab.
				activeTab.removeAttribute('aria-selected');
				// Set aria-selected='false' to previously active tab.
				activeTab.setAttribute('aria-selected', 'false');
				// Get the active panel.
				var activePanel = this.getPanel(activeTab);
				// Remove active-panel class.
				UTILS.removeClass(activePanel, 'active-panel');
				// Remove aria-hidden attribute from previously active panel.
				activePanel.removeAttribute('aria-hidden');
				// Set aria-hidden='true' to previously active panel.
				activePanel.setAttribute('aria-hidden', 'true');
			}
			// Activate new tab.
			UTILS.addClass(tab, 'active-tab');
			// Add aria-selected='true' attribute.
			tab.setAttribute('aria-selected', 'true');
			// Activate new Panel.
			UTILS.addClass(panel, 'active-panel');
			// Add aria-hidden='false' attribute.
			panel.setAttribute('aria-hidden', 'false');
		}
	},

	// This function triggers tab activation on 2 cases:
	// 1. On hash change.
	// 2. On page load according to hash.
	hash: function() {
		var count = 0;
		var hashVal = window.location.hash;
		// Get all tabs.
		var tabs = UTILS.qsa('.tab');
		// Iterate on tabs and trigger activation.
		for (var i = 0; i < tabs.length; i++) {
			var tab = tabs[i];
			var anchor = tab.getAttribute('href');
			if (anchor === hashVal) {
				this.activate(tab);
				count = count + 1;
			}
		}
		// If no tab was activated, activate default.
		if (count === 0) {
			window.location.hash = 'quick-reports';
			this.activate(tabs[0]);
		}
	}

};

// Hash change event listener.
UTILS.addEvent(window, 'hashchange', tabsObj.hash.bind(tabsObj));
// On page load.
tabsObj.hash();

// Attach keydown listener to anchorts (click on enter or space).
UTILS.addEvent(document, 'keydown', function(e) {
	if (UTILS.isEnterOrSpace(e) && e.target.tagName === 'A') {
		e.target.click();
		e.preventDefault();
	}
});

/*================================================
DROPDOWNS BEHAVIOR.
================================================*/

var dropdownsObj = {

	// Close a key activated dropdown while hovering on other dropdowns.
	closeDropdown: function() {
	    if (UTILS.qs('.active-menu')) {
		    var activeMenu = UTILS.qs('.active-menu');
		    UTILS.removeClass(activeMenu, 'active-menu');
	   	}
	   	return activeMenu;
	},

	// Open a dropdown on key press, or close an already active one.
	openDropdown: function(e) {
		var target = e.target;
	    // Check that it's a nav-section and not a container.
	    if (UTILS.hasClass(target, 'nav-section')) {
	    	e.preventDefault();
		    var activeMenu = this.closeDropdown();
			if (activeMenu !== target) {
				UTILS.addClass(target, 'active-menu');
			}
		}
	}

};

// Get dropdowns' wrapper.
var nav = document.getElementById('navigation');

// Attach listeners to dropdowns using UTILS.addEvent.
UTILS.addEvent(nav, 'keydown', function(e) {
	if (UTILS.isEnterOrSpace(e)) {
		dropdownsObj.openDropdown.call(dropdownsObj, e);
	}
});
UTILS.addEvent(nav, 'mouseover', dropdownsObj.closeDropdown);

/*================================================
TAB PANELS INTERACTIVITY.
================================================*/

var interactivityObj = {

	// Used to display / hide form.
	getFormWrap: function() {
		var activePanel = UTILS.qs('.active-panel');
		var formWrap = activePanel.querySelector('.form-wrap');
		return formWrap;
	},

	// Add visible-form class to display a form.
	displayForm: function() {
		var connectedForm = this.getFormWrap();
		UTILS.addClass(connectedForm, 'visible-form');
		connectedForm.querySelector('input').focus();
	},

	// Remove visible-form class to hide a form.
	hideForm: function() {
		var connectedForm = this.getFormWrap();
		UTILS.removeClass(connectedForm, 'visible-form');
	},

	// Add / remove a 'visible-form' class to display / hide a form.
	displayOrHideForm: function() {
		var connectedForm = this.getFormWrap();
		if (UTILS.hasClass(connectedForm, 'visible-form')) {
			this.hideForm();
		}
		else {
			this.displayForm();
		}
	},

	// Validate a fieldset (name and URL). Mark invalid fields with a red border.
	validateFieldset: function(e, name, url, siteArray) {
		// If invalid name.
		if (name.value === '') {
			// Prevent form submission.
			e.preventDefault();
			// Add invalid class if it doesn't already exist.
			if (!UTILS.hasClass(name, 'invalid')) {
				UTILS.addClass(name, 'invalid');
			}
		}
		else {
			if (UTILS.hasClass(name, 'invalid')) {
				UTILS.removeClass(name, 'invalid');
			}
		}
		// If invalid URL (later with regex).
		if (url.value === '') {
			// Prevent form submission.
			e.preventDefault();
			// Add invalid class if it doesn't already exist.
			if (!UTILS.hasClass(url, 'invalid')) {
				UTILS.addClass(url, 'invalid');
			}
		}
		else {
			// Check if the URL is valid.
			var isValidUrl = function(url) {
				var re = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
				if (re.test(url.value)) {
					return true;
				}
				else {
					return false;
				}
			};

			// If valid URL, remove any 'invalid' classes.
			if (isValidUrl(url)) {
				if (UTILS.hasClass(url, 'invalid')) {
					UTILS.removeClass(url, 'invalid');
				}
				// If 'http://' is not provided, add it to the URL.
				var setHttp = function(url) {
					var re = /^(https?:\/\/)/;
					if (re.test(url.value)) {
						return;
					}
					else {
						url.value = 'http://' + url.value;
					}
				    return;
				};
				setHttp(url);
			}

			// Else add an 'invalid' class if necessary and prevent form submittion..
			else {
				e.preventDefault();
				if (!UTILS.hasClass(url, 'invalid')) {
					UTILS.addClass(url, 'invalid');
				}
			}
		}
		// If fields are filled and validated, make an object with name and url.
		if (!UTILS.hasClass(name, 'invalid') && !UTILS.hasClass(url, 'invalid')) {
			var obj = {
				siteName: name.value,
				siteUrl: url.value
			};
			siteArray.unshift(obj);
		}
	},

	// Gets the relevant form and siteArray, displays / hides iframe/select/button and updates site list based on changes.
	displayWebsites: function(form, siteArray) {
		// Get form ID and use it as a class selector.
		var selector = '.' + UTILS.qs('.active-panel').querySelector('.form-wrap').id;
		// Get iframe/select/button connected to this ID with a class of the same name.
		var elements = UTILS.qsa(selector);
		// Iterate on all elements connected to form.
		for (var i = 0; i < elements.length; i++) {
			var elm = elements[i];
			console.log(elm);
			// If the array is empty, hide the element if it's not hidden and remove all attributes.
			if (!siteArray[0] && !UTILS.hasClass(elm, 'hidden')) {
				// If element is an iframe.
				if (elm.removeAttribute('src')) {
					console.log(elm.tagName);
					elm.removeAttribute('src', siteArray[0].siteUrl);
				}
				// If element is a button.
				if (elm.removeAttribute('href')) {
					elm.removeAttribute('href', siteArray[0].siteUrl);
				}
				// If element is a dropdown.
				if (elm.tagName === 'SELECT') {
					// init.
					while (elm.firstChild) {
					    elm.removeChild(elm.firstChild);
					}
				}
				// Hide all.
				UTILS.addClass(elm, 'hidden');
			}
			// If array is empty on first iteration.
			else if (!siteArray[0]) {
				console.log('do nothing!');
			}
			// If array is not empty, display elements and add attributes.
			else {
				// Display element.
				if (UTILS.hasClass(elm, 'hidden')) {
					UTILS.removeClass(elm, 'hidden');
				}
				// If element is an iframe
				if (elm.tagName === 'IFRAME') {
					console.log(elm.tagName);
					elm.setAttribute('src', siteArray[0].siteUrl);
				}
				// If element is a button.
				if (UTILS.hasClass(elm, 'to-website')) {
					elm.setAttribute('href', siteArray[0].siteUrl);
				}

				// If element is a dropdown.
				if (elm.tagName === 'SELECT') {
					// init.
					while (elm.firstChild) {
					    elm.removeChild(elm.firstChild);
					}
					// Create an option for each object in siteArray, with a name and a value.
					for (var j = 0; j < siteArray.length; j ++) {
						var option = document.createElement('OPTION');
						var text = document.createTextNode(siteArray[j].siteName);
						option.appendChild(text);
						option.setAttribute('value', siteArray[j].siteUrl);
						elm.appendChild(option);
					}
				}
				// Hide form if valid.
				UTILS.removeClass(form.parentNode, 'visible-form');
			}
		}
	},

	// Validate form input using HTML5 'required'.
	// Validate URL if a site name was entered.
	validateForm: function(form) {
		return function(e) {
			// Contains name + URL objects.
			var siteArray = [];
			// Get all child fieldsets.
			var sets = form.getElementsByTagName('FIELDSET');
			// Inside each fieldset, if any of the fieldset's fields is not empty, activate validations.
			// Validations are: Name must not be empty, URL must be a legal URL.
			for (var i = 0; i < sets.length; i++) {
				var set = sets[i];
				var name = set.getElementsByTagName('INPUT')[0];
				var url = set.getElementsByTagName('INPUT')[1];
				// Only if one of the fields is not empty, start a fieldset validation process.
				if (name.value !== '' || url.value !== '') {
					console.log('start validation!');
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

			// Find if the form is valid.
			if (form.querySelector('.invalid')) {
				// Focus on the first invalid field.
				console.log('some invalid');
				form.querySelector('.invalid').focus();
			}
			else {
				e.preventDefault();
				// Catch valid objects containing site name and site URL (inside of siteArray).
				this.displayWebsites(form, siteArray);
			}
		};
	},

	// Select a website from the dropdown, display in an iframe and make the arrow button point at it.
	selectHandler: function(e) {
		if (e.target.tagName === 'SELECT') {
			var target = e.target;
			// Get selected value.
			var getValue = target.options[target.selectedIndex].value;
			console.log(getValue);
			// Get the active panel.
			var panel = UTILS.qs('.active-panel');
			// Get the iframe.
			var iframe = panel.querySelector('iframe');
			// Get the button.
			var button = panel.querySelector('.to-website');
			// CHange atributes.
			iframe.setAttribute('src', getValue);
			button.setAttribute('href', getValue);
		}
	}

};

// Attach listeners to form control (display / hide form).
var controls = UTILS.qsa('.form-control');
for (var i = 0; i < controls.length; i++) {
	var control = controls[i];
	UTILS.addEvent(control, 'click', interactivityObj.displayOrHideForm.bind(interactivityObj));
}

// Attach listeners to cancel buttons (hide form).
var cancels = UTILS.qsa('.cancel');
for (var i = 0; i < cancels.length; i++) {
	var cancel = cancels[i];
	UTILS.addEvent(cancel, 'click', interactivityObj.hideForm.bind(interactivityObj));
}

// Get forms.
var forms = UTILS.qsa('.enter-site');
// Iterate forms.
for (var i = 0; i < forms.length; i++) {
	var form = forms[i];
	// 'submit' event (connect to 'validateForm' function).
	UTILS.addEvent(form, 'submit', interactivityObj.validateForm(form).bind(interactivityObj));
	// Attach esc. key listener to inputs (hide form).
	var inputs = form.querySelectorAll('input');
	for (var j = 0; j < inputs.length; j++) {
		var input = inputs[j];
		console.log(input);
		UTILS.addEvent(input, 'keydown', function(e){
			if (e.keyCode === 27 || e.which === 27) {
				console.log('esc');
				interactivityObj.hideForm.call(interactivityObj);
			}
		});
	}
}

// 'change' event (connect to 'select' function).
var selects = UTILS.qsa('.site-select');
// Iterate on selects.
for (var i = 0; i < selects.length; i++) {
	var select = selects[i];
	console.log(select);
	UTILS.addEvent(select, 'change', interactivityObj.selectHandler.bind(interactivityObj));
}

/*================================================
SEARCH BOX BEHAVIOR.
================================================*/

var searchBox = {
	searchHandler: function(e) {
		if (e.which === 13 || e.keyCode === 13) {
			var searchTerm = this.value;
			e.preventDefault();
			console.log(searchTerm);
			// Search 'searchTerm' in every select.option.value.
			// Get the first and third tabs, iterate on their options. If a match exists -
			// activate the tab and option and break the function.
			var tab1 = UTILS.qs('.tab1');
			console.log(tab1);
			var panel1 = tabsObj.getPanel(tab1);
			var tab3 = UTILS.qs('.tab3');
			var panel3 = tabsObj.getPanel(tab3);
			console.log(tab3);
			var select1 = panel1.querySelector('.site-select');
			var options1 = select1.querySelectorAll('option');
			console.log(options1);
			var select3 = panel3.querySelector('.site-select');
			var options3 = select3.querySelectorAll('option');
			console.log(options3);
			for (var i = 0; i < options1.length; i++) {
				console.log(options1[i]);
				if (options1[i].textContent === searchTerm) {
					// Activate tab.
					tab1.click();
					// Select the option.
					select1.selectedIndex = i;
					panel1.querySelector('iframe').setAttribute('src', options1[i].value);
					panel1.querySelector('.to-website').setAttribute('href', options1[i].value);
					return;
				}
			}
			for (var j = 0; j < options3.length; j++) {
				console.log(options1[j]);
				if (options3[j].textContent === searchTerm) {
					// Activate tab.
					tab3.click();
					// Select the option.
					select3.selectedIndex = j;
					panel3.querySelector('iframe').setAttribute('src', options3[j].value);
					panel3.querySelector('.to-website').setAttribute('href', options3[j].value);
					return;
				}
			}
		}
	}
};

var searchElm = UTILS.qs('input[type="search"]');
console.log(searchElm);
UTILS.addEvent(searchElm, 'keydown', searchBox.searchHandler.bind(searchElm));


