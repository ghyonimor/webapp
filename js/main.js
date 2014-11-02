/* globals UTILS*/
UTILS.ajax('data/notification.txt', {
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
