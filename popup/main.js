document.onreadystatechange = function () {
	if (document.readyState === 'complete') {		
		let startButton = document.getElementById('start-debugger');
		let pathInputField = document.getElementById('path-input-field');

		pathInputField.addEventListener('keyup', function () {
			localStorage.setItem('prefs', JSON.stringify({ path: this.value }));
		}, false);

		startButton.addEventListener('click', function () {
			localStorage.setItem('prefs', JSON.stringify({ path: pathInputField.value }));
			chrome.extension.sendMessage('kjppjhifcapacgldhmagolflapbdgnko', {
			  action: 'start'
			});
		}, false);

		chrome.extension.sendMessage('kjppjhifcapacgldhmagolflapbdgnko', {
		  action: 'prefs'
		}, function (response) {
			if (typeof response !== 'undefined') {
				pathInputField.value = response.path
			}
		});
	}
}
