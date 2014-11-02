/* globals UTILS, addEvent*/

/**
 * Call UTILS library.
 */
UTILS.ajax('../data/notification.txt', {
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
 * First getElementsByClassName('tab').
 */
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
	addEvent(tab, 'click', function display(e) {
		e.preventDefault();
		var activeTab = document.getElementsByClassName('activeTab')[0];
		var activePanel = document.getElementsByClassName('activePanel')[0];
		if (this.id !== activeTab.id) {
			activeTab.className = activeTab.className.replace(/\bactiveTab\b/,'');
			activePanel.className = activePanel.className.replace(/\bactivePanel\b/,'');
			this.className = this.className + ' activeTab';
			var anchor = this.getAttribute('href').replace('#', '');
			var tabPanel = document.getElementById(anchor);
			tabPanel.className = tabPanel.className + ' activePanel';
			window.location.hash = 'panel-' + anchor;
		}
	});
}



