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
		activeTab.removeAttribute('aria-selected');
		activeTab.setAttribute('aria-selected', 'false');
		activePanel.removeAttribute('aria-hidden');
		activePanel.setAttribute('aria-hidden', 'true');
		e.currentTarget.removeAttribute('aria-selected');
		e.currentTarget.setAttribute('aria-selected', 'true');
		tabPanel.removeAttribute('aria-hidden');
		tabPanel.setAttribute('aria-hidden', 'false');
	}
};

var isEnter = function(e) {
    if (event.which === 13 || event.keyCode === 13) {
        display(e);
    }
};

var tabs = document.getElementsByClassName('tab');
var hash = window.location.hash;
tabs[0].className = tabs[0].className + ' activeTab';
var activeTab = tabs[0];
for (var i = 0; i < tabs.length; i++) {
	var tab = tabs[i];
	var anchor = tab.getAttribute('href').replace('#', '');
	var tabPanel = document.getElementById(anchor);
	console.log(hash);
	console.log('#panel-' + anchor);
	if (tab !== activeTab && hash === ('#panel-' + anchor)){
		activeTab.className = activeTab.className.replace(/\bactiveTab\b/,'');
		if (document.getElementsByClassName('activePanel')[0]) {
			var activePanel = document.getElementsByClassName('activePanel')[0];
			activePanel.className = activePanel.className.replace(/\bactivePanel\b/,'');
		}
		tab.className = tab.className + ' activeTab';
		activeTab = tab;
	}
	if (tab === document.getElementsByClassName('activeTab')[0]) {
		tabPanel.className = tabPanel.className + ' activePanel';
		tab.removeAttribute('aria-selected');
		tab.setAttribute('aria-selected', 'true');
		tabPanel.removeAttribute('aria-hidden');
		tabPanel.setAttribute('aria-hidden', 'false');
		window.location.hash = 'panel-' + anchor;
	}
	else {
		tab.removeAttribute('aria-selected');
		tab.setAttribute('aria-selected', 'false');
		tabPanel.removeAttribute('aria-hidden');
		tabPanel.setAttribute('aria-hidden', 'true');
	}
	addEvent(tab, 'click', display);
	addEvent(tab, 'keypress', isEnter);
}



