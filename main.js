// Vars
let waitForLazyLoader = [
	'app',
	'runtime',
	'windows',
];
let ajax = new XMLHttpRequest();
let response = undefined;

// short handlers
let defined = x => typeof x !== 'undefined' && x !== null;

// Functions
let loadFile = function (resolve) {
	ajax.onreadystatechange = function() {
		if (ajax.readyState == 4 && ajax.responseText !== "") {
			response = JSON.parse(ajax.responseText);
			resolve();
		}
	};
	ajax.open('GET', 'file:///Users/dewald/node-debugger-url.json', true);
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

let lazyLoadQueue = function (object, cb) {
	checkLazyLoadAvailability(object);
	if (waitForLazyLoader.length > 0) {
		t = setTimeout(() => {
			clearTimeout(t); // cleanup
			lazyLoadQueue(object, cb);
		}, 1000);
	} else {
		cb();
	}
}

let boot = function () {
	let test = chrome.windows.create({
		url: response.url,
	});
}

// Start
new Promise(loadFile)
	.then(() => {
		lazyLoadQueue(chrome, () => {
			boot();
		})
	});

