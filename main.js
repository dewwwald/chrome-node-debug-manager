// Vars
let waitForLazyLoader = [
	'app',
	'runtime',
	'windows',
	'tabs'
];
let response = undefined;
let debuggerWindow = undefined;
let debuggerTab = undefined;

// short handlers
let defined = x => typeof x !== 'undefined' && x !== null;

// Functions
let loadFile = function (resolve) {
	let ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		if (ajax.readyState === 4 && ajax.responseText !== "") {
			response = JSON.parse(ajax.responseText);
			resolve();
		}
	};
	ajax.withCredentials = true;
	ajax.open('GET', 'file://' + JSON.parse(localStorage.getItem('prefs')).path, true);
	ajax.setRequestHeader("Content-type", "application/json");
	ajax.send();
}

let checkLazyLoadAvailability = function (object) {
	if (waitForLazyLoader.length === 0) return true;
	let obCopy = object;
	waitForLazyLoader[0].split('.').forEach(v => obCopy = obCopy[v]);
	if (defined(obCopy)) {
		waitForLazyLoader.splice(0, 1);
		return checkLazyLoadAvailability(object);
	}
	return false;
}

let lazyLoadQueue = function (object, resolve) {
	checkLazyLoadAvailability(object);
	if (waitForLazyLoader.length > 0) {
		t = setTimeout(() => {
			clearTimeout(t); // cleanup
			lazyLoadQueue(object, resolve);
		}, 1000);
	} else {
		resolve();
	}
}

let boot = function (resolve) {
	chrome.windows.create({
		url: response.url
	}, function () {
		chrome.windows.getLastFocused({ populate:true }, (a) => {
			debuggerWindow = a;
			resolve();
		});
	});
}

let linkChaged = function () {
	chrome.tabs.update(debuggerTab.id, { url: response.url});
}
	
let startWatchingLinkChages = function () {
	setInterval(() => {
		let copyResponse = response;
		new Promise(loadFile)
			.then(() => {
				if (response.url !== copyResponse.url) {
					linkChaged();
				}
			});
	}, 1000);
}

// Start
// Chrismas tree, I know
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === 'start') {
		new Promise(loadFile)
			.then(() => new Promise(lazyLoadQueue.bind(null, chrome))
			.then(() => new Promise(boot)
			.then(() => new Promise(function (resolve) {
				debuggerTab = debuggerWindow.tabs[0];
				resolve();
			})
			.then(startWatchingLinkChages))));
	}
});

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === 'prefs') {
		sendResponse(JSON.parse(localStorage.getItem('prefs')));
	}
});