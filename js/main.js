/* globals UTILS, addEvent*/

/**
 * Call UTILS library.
 */
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

/**
 * Display / hide tab panels on tab click using addEvent function (keyboard too).
 */
var display = function(e) {
	e.preventDefault();
	var activeTab = document.getElementsByClassName('activeTab')[0];
	var activePanel = document.getElementsByClassName('activePanel')[0];
	if (e.currentTarget.id !== activeTab.id) {
		activeTab.className = activeTab.className.replace(/\bactiveTab\b/,'');
		activePanel.className = activePanel.className.replace(/\bactivePanel\b/,'');
		e.currentTarget.className = e.currentTarget.className + ' activeTab';
		var anchor = e.currentTarget.getAttribute('href').replace('#', '');
		var tabPanel = document.getElementById(anchor);
		tabPanel.className = tabPanel.className + ' activePanel';
		window.location.hash = 'panel-' + anchor;
	}
};

var isEnter = function(e) {
    if (event.which === 13 || event.keyCode === 13) {
        display(e);
    }
};

var tabs = document.getElementsByClassName('tab');
for (var i = 0; i < tabs.length; i++) {
	var tab = tabs[i];
	if (i === 0) {
		var anchor = tab.getAttribute('href').replace('#', '');
		var tabPanel = document.getElementById(anchor);
		tab.className = tab.className + ' activeTab';
		tabPanel.className = tabPanel.className + ' activePanel';
		window.location.hash = 'panel-' + anchor;
	}
	addEvent(tab, 'click', display);
	addEvent(tab, 'keypress', isEnter);
}



