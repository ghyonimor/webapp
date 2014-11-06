/* globals UTILS */

/*================================================
AJAX NOTIFICATION.
================================================*/

// Call UTILS.ajax.
UTILS.ajax('../Web-App/data/notification.txt', {
	method: 'GET',
	done: function (response) {
		if (response && response !== '') {
			var message = document.getElementsByClassName('notifications')[0];
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
	if (document.getElementsByClassName('activeTab')[0] && tab === document.getElementsByClassName('activeTab')[0]) {
		return;
	}
	else {
		// Get the panel related to this tab.
		var panel = getPanel(tab);
		// Check if another tab has an active state and remove it.
		if (document.getElementsByClassName('activeTab')[0]) {
			var activeTab = document.getElementsByClassName('activeTab')[0];
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
	e.preventDefault();
	// Get the clicked element.
	var target = e.target;
	// Check that it's a tab and not a container.
	if (target.classList.contains('tab')) {
		console.log(target);
		activate(target);
	}
};

// Validate enter key.
var isEnter = function(e) {
    if (e.which === 13 || e.keyCode === 13) {
        display(e);
    }
};

// Get all tabs.
var tabs = document.getElementsByClassName('tab');
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
	// Activate inserted URL tab.
	console.log('panel-' + anchor.replace('#', ''));
	console.log(hash);
	if (hash === '#panel-' + anchor.replace('#', '')) {
		activate(tab);
		//If count === 0 after all iterations activate default outside the loop.
		count = count + 1;
	}
}

// Activate default.
if (count === 0) {
	activate(tabs[0]);
}

// Get tabs wrapper.
var tablist = document.getElementById('tablist');

// Call UTILS.addEvent.
UTILS.addEvent(tablist, 'click', display);
UTILS.addEvent(tablist, 'keypress', isEnter);

// Close key activated dropdown while hovering on other dropdowns.
var closeDropdown = function() {
    if (document.getElementsByClassName('active-menu')[0]) {
	    var activeMenu = document.getElementsByClassName('active-menu')[0];
	    activeMenu.className = activeMenu.className.replace(/\bactive-menu\b/,'');
   	}
   	return activeMenu;
};

// Open a dropdown on key press, or close an already active one.
var openDropdown = function(e) {
	if (e.which === 13 || e.keyCode === 13) {
        var target = e.target;
        var activeMenu = closeDropdown();
		// Check that it's a nav-section and not a container.
		if (activeMenu !== target) {
			target.className = target.className+ ' active-menu';
		}
	}
};

var nav = document.getElementById('navigation');
UTILS.addEvent(nav, 'keypress', openDropdown);
UTILS.addEvent(nav, 'mouseover', closeDropdown);









