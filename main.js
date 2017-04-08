let boot = function () {
	chrome.app.runtime.onLaunched.addListener(function() {
		// chrome.app.window.create('chrome-devtools://devtools/remote/serve_file/@60cd6e859b9f557d2312f5bf532f6aec5f284980/inspector.html?experiments=true&v8only=true&ws=localhost:9229/5353f7ab-6bef-4e44-adb0-66bd5af17f74', {});
		chrome.app.window.create('test.html', {
		  id: 'main',
		  bounds: { width: 620, height: 500 }
		});
	});
}

// boot();
