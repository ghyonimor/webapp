/* globals UTILS */

/*================================================
AJAX NOTIFICATION.
================================================*/

// Display an ajax notification using UTILS.ajax.
UTILS.ajax('../Web-App/data/notification.txt', {
	method: 'GET',
	done: function (response) {
		if (response && response !== '') {
			var message = document.querySelectorAll('.notifications')[0];
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
	if (document.querySelectorAll('.activeTab')[0] && tab === document.querySelectorAll('.activeTab')[0]) {
		return;
	}
	else {
		// Get the panel related to this tab.
		var panel = getPanel(tab);
		// Check if another tab has an active state and remove it.
		if (document.querySelectorAll('.activeTab')[0]) {
			var activeTab = document.querySelectorAll('.activeTab')[0];
			activeTab.className = activeTab.className.replace(/\bactiveTab\b/,'');
			// Remove aria-selected attribute from previously active tab.
			activeTab.removeAttribute('aria-selected');
			// Set aria-selected='false' to previously active tab.
			activeTab.setAttribute('aria-selected', 'false');
			// Get the active panel.
			var activePanel = getPanel(activeTab);
			activePanel.className = activePanel.className.replace(/\bactivePanel\b/,'');
			// Remove aria-hidden attribute from previously active panel.
			activePanel.removeAttribute('aria-hidden');
			// Set aria-hidden='true' to previously active panel.
			activePanel.setAttribute('aria-hidden', 'true');
		}
		// Activate new tab.
		tab.className = tab.className + ' activeTab';
		// Add aria-selected='true' attribute.
		tab.setAttribute('aria-selected', 'true');
		// Activate new Panel.
		panel.className = panel.className + ' activePanel';
		// Add aria-hidden='false' attribute.
		panel.setAttribute('aria-hidden', 'false');
		// Jumping prefix.
		clearJump(tab);
	}
};

// Activate tab on click / keypress.
var display = function(e) {
	if (e.preventDefault) {
		e.preventDefault();
	}
	else {
		e.returnValue = false;
	}
	// Get the clicked element.
	var target = e.target || e.srcElement;
	// Check that it's a tab and not a container.
	if (UTILS.hasClass(target, 'tab')) {
		console.log(target);
		activate(target);
	}
};

// Validate enter or space keypress.
var isEnterOrSpace = function(e) {
	if (e.preventDefault) {
		e.preventDefault();
	}
	else {
		e.returnValue = false;
	}
	console.log(e.keyCode);
	console.log(e.which);
    if (e.which === 13 || e.keyCode === 13 || e.which === 32 || e.keyCode === 32) {
        display(e);
    }
};

// Get all tabs.
var tabs = document.querySelectorAll('.tab');
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
UTILS.addEvent(tablist, 'keypress', isEnterOrSpace);

/*================================================
DROPDOWNS BEHAVIOR.
================================================*/

// Close a key activated dropdown while hovering on other dropdowns.
var closeDropdown = function() {
    if (document.querySelectorAll('.active-menu')[0]) {
	    var activeMenu = document.querySelectorAll('.active-menu')[0];
	    activeMenu.className = activeMenu.className.replace(/\bactive-menu\b/,'');
   	}
   	return activeMenu;
};

// Open a dropdown on key press, or close an already active one.
var openDropdown = function(e) {
	if (e.preventDefault) {
		e.preventDefault();
	}
	else {
		e.returnValue = false;
	}
	// Validate enter or space keypress
	if (e.which === 13 || e.keyCode === 13 || e.which === 32 || e.keyCode === 32) {
        var target = e.target || e.srcElement;
        // Check that it's a nav-section and not a container.
        if (UTILS.hasClass(target, 'nav-section')) {
	        var activeMenu = closeDropdown();
			if (activeMenu !== target) {
				target.className = target.className+ ' active-menu';
			}
		}
	}
};

// Get dropdowns' wrapper.
var nav = document.getElementById('navigation');

// Attach listeners to dropdowns using UTILS.addEvent.
UTILS.addEvent(nav, 'keypress', openDropdown);
UTILS.addEvent(nav, 'mouseover', closeDropdown);









