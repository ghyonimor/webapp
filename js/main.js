/* globals UTILS */

/*================================================
AJAX NOTIFICATION.
================================================*/

// Display an ajax notification using UTILS.ajax.
UTILS.ajax('../Web-App/data/notification.txt', {
	method: 'GET',
	done: function (response) {
		if (response && response !== '') {
			var message = UTILS.qsa('.notifications')[0];
			message.innerHTML = response;
			message.style.display = 'block';
		}
	},
	fail: function (err) {
		console.log(err.message);
	}
});

/*================================================
TABS BEHAVIOR.
================================================*/

// Get a panel connected to a tab.
var getPanel = function(tab) {
	var anchor = tab.getAttribute('href');
	var panel = document.getElementById(anchor.replace('#', ''));
	return panel;
};

// Hash jumping prefix.
var clearJump = function(tab) {
	var anchor = tab.getAttribute('href');
	window.location.hash = 'panel-' + anchor.replace('#', '');
};

// Add activeTab class, connect it with a panel (activePanel), show the panel and disable other tabs.
var activate = function(tab) {
	// If another tab is activated, and it's equal to the new tab, break the function.
	if (UTILS.qsa('.activeTab')[0] && tab === UTILS.qsa('.activeTab')[0]) {
		return;
	}
	else {
		// Get the panel related to this tab.
		var panel = getPanel(tab);
		// Check if another tab has an active state and remove it.
		if (UTILS.qsa('.activeTab')[0]) {
			var activeTab = UTILS.qsa('.activeTab')[0];
			// Remove activeTab class.
			UTILS.removeClass(activeTab, 'activeTab');
			// Remove aria-selected attribute from previously active tab.
			activeTab.removeAttribute('aria-selected');
			// Set aria-selected='false' to previously active tab.
			activeTab.setAttribute('aria-selected', 'false');
			// Get the active panel.
			var activePanel = getPanel(activeTab);
			// Remove activePanel class.
			UTILS.removeClass(activePanel, 'activePanel');
			// Remove aria-hidden attribute from previously active panel.
			activePanel.removeAttribute('aria-hidden');
			// Set aria-hidden='true' to previously active panel.
			activePanel.setAttribute('aria-hidden', 'true');
		}
		// Activate new tab.
		UTILS.addClass(tab, 'activeTab');
		// Add aria-selected='true' attribute.
		tab.setAttribute('aria-selected', 'true');
		// Activate new Panel.
		UTILS.addClass(panel, 'activePanel');
		// Add aria-hidden='false' attribute.
		panel.setAttribute('aria-hidden', 'false');
		// Jumping prefix.
		clearJump(tab);
	}
};

// Activate tab on click / keypress.
var display = function(e) {
	// Get the clicked element.
	var target = e.target || e.srcElement;
	// Check that it's a tab and not a container.
	if (UTILS.hasClass(target, 'tab')) {
		UTILS.preventEvent(e);
		console.log(target);
		activate(target);
	}
};

// Get all tabs.
var tabs = UTILS.qsa('.tab');
// Get inserted URL hash value.
var hash = window.location.hash;
console.log(hash);
// Count for inserted URL activations.
var count = 0;
// Iterate on tabs.
for (var i = 0; i < tabs.length; i++) {
	var tab = tabs[i];
	// Get the panel related to this tab.
	var panel = getPanel(tab);
	console.log(panel);
	// Default aria attributes.
	tab.setAttribute('aria-selected', 'false');
	panel.setAttribute('aria-hidden', 'true');
	// Get tab's hash value.
	var anchor = tab.getAttribute('href');
	console.log(anchor);
	console.log(hash);
	// Activate inserted URL tab.
	if (hash === '#panel-' + anchor.replace('#', '')) {
		// Count how many times a hashed URL related to a tab was entered (0 or 1).
		count = count + 1;
		// Activate the tab related to the URL.
		activate(tab);
	}
}

// Activate default (first tab) if the URL didn't have an hash value related to a tab.
if (count === 0) {
	activate(tabs[0]);
}

// Get tabs wrapper.
var tablist = document.getElementById('tablist');

// Attach listeners to tabs using UTILS.addEvent.
UTILS.addEvent(tablist, 'click', display);
UTILS.addEvent(tablist, 'keypress', UTILS.isEnterOrSpace(display));

/*================================================
DROPDOWNS BEHAVIOR.
================================================*/

// Close a key activated dropdown while hovering on other dropdowns.
var closeDropdown = function() {
    if (UTILS.qsa('.active-menu')[0]) {
	    var activeMenu = UTILS.qsa('.active-menu')[0];
	    UTILS.removeClass(activeMenu, 'active-menu');
   	}
   	return activeMenu;
};

// Open a dropdown on key press, or close an already active one.
var openDropdown = function(e) {
	var target = e.target || e.srcElement;
    // Check that it's a nav-section and not a container.
    if (UTILS.hasClass(target, 'nav-section')) {
    	UTILS.preventEvent(e);
	    var activeMenu = closeDropdown();
		if (activeMenu !== target) {
			UTILS.addClass(target, 'active-menu');
		}
	}
};

// Get dropdowns' wrapper.
var nav = document.getElementById('navigation');

// Attach listeners to dropdowns using UTILS.addEvent.
UTILS.addEvent(nav, 'keypress', UTILS.isEnterOrSpace(openDropdown));
UTILS.addEvent(nav, 'mouseover', closeDropdown);

/*================================================
TAB PANELS INTERACTIVITY.
================================================*/

// Add / remove a 'visible-form' class to display / hide a form.
var displayForm = function(e) {
	if (UTILS.hasClass(e.target, 'form-control-img')) {
		UTILS.preventEvent(e);
		var control = e.target;
		var connectedFormId = control.getAttribute('aria-controls');
		var connectedForm = document.getElementById(connectedFormId);
		if (UTILS.hasClass(connectedForm, 'visible-form')) {
			UTILS.removeClass(connectedForm, 'visible-form');
		}
		else {
			UTILS.addClass(connectedForm, 'visible-form');
		}

	}
};

// Get form controls.
var controls = UTILS.qsa('.form-control');
// Iterate on form controls.
for (var i = 0; i < controls.length; i++) {
	var control = controls[i];
	// 'click' event (connect to 'displayForm' function).
	UTILS.addEvent(control, 'click', displayForm);
	// 'keypress' event (connect to 'displayForm' function). Use DRY code (UTILS.isEnterOrSpace(func) function).
	UTILS.addEvent(control, 'keypress', UTILS.isEnterOrSpace(displayForm));
}

// Validate a fieldset (name and URL). Mark invalid fields with a red border.
var validateFieldset = function(e, name, url) {
	// If invalid name.
	if (name.value === '' && UTILS.hasClass(name, 'invalid') === false) {
		// Prevent form submission.
		UTILS.preventEvent(e);
		// Add invalid class.
		UTILS.addClass(name, 'invalid');
	}
	else {
		if (UTILS.hasClass(name, 'invalid')) {
			UTILS.removeClass(name, 'invalid');
		}
	}
	// If invalid URL.
	if (/regex/.test(url.value) && UTILS.hasClass(url, 'invalid') === false) {
		// Prevent form submission.
		UTILS.preventEvent(e);
		// Add invalid class.
		UTILS.addClass(url, 'invalid');
	}
	else {
		if (UTILS.hasClass(url, 'invalid')) {
			UTILS.removeClass(url, 'invalid');
		}
	}
};

// Validate form input using HTML5 'required'.
// Validate URL if a site name was entered.
var validateForm = function(form) {
	return function(e) {
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
				validateFieldset(e, name, url);
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
		// Focus on the first invalid field.
	};
};

// Get forms.
var forms = UTILS.qsa('.enterSite');
// Iterate forms.
for (var i = 0; i < forms.length; i++) {
	var form = forms[i];
	// 'submit' event (connect to 'validateForm' function).
	UTILS.addEvent(form, 'submit', validateForm(form));
}


// Get websites from the input fields and insert to dropdowns.
// Remove .hidden classes from the right '.site-select', '.to-website' and 'iframe' elements.
var insert = function(e) {

};

// 'submit' event (connect to 'insert' function).

// Select a website from the dropdown, display in an iframe and make the arrow button point at it.
var select = function(e) {

};

// 'change' event (connect to 'select' function).










