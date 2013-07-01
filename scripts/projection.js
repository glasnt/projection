(function () {
	var body = document.body;
	var slideList = new Array();
	var lastSlide;
	var currentPosition = 0;

/*
 * Retrieve the list of slide files. The last line is likely empty, hence
 * needing the test to find out whether the file is valid; gives us the ability
 * to skip blank lines which we'd need anyway. Skip commented out lines while
 * we're at it.
 */

	$.get("list.txt", "", function(data) {
		files = data.split("\n");
		for (var i = 0; i < files.length; i++) {
			file = files[i];
			if (file && (file.charAt[0] != '#')) {
				slideList.push(file);
			}
		}
		lastSlide = slideList.length - 1;
		displayCurrentSlide();
	}, "text");


/*
 * Slide movement functions.
 */

	function goBack() {
		if (currentPosition > 0) {
			currentPosition--;
			displayCurrentSlide();
		}
	}

	function goForward() {
		if (currentPosition < lastSlide) {
			currentPosition++;
			displayCurrentSlide();
		}
	}

	function goStart() {
		if (currentPosition != 0) {
			currentPosition = 0;
			displayCurrentSlide();
		}
	}

	function goEnd() {
		if (currentPosition != lastSlide) {
			currentPosition = lastSlide;
			displayCurrentSlide();
		}
	}


/*
 * Do the heavy lifting of loading and displaying the currently active slide.
 */
	function fileToURL(filename) {
		var pos, basename;

		pos = filename.lastIndexOf('/');
		basename = filename.substring(pos + 1); 	

		pos = basename.lastIndexOf('.');
		basename = basename.substring(0, pos); 	

		return basename;
	}

	function formatPageNumber() {
		var page;
		page = currentPosition + 1;

		if (page < 10) {
			return "0" + page;
		} else {
			return page;
		}
	}

	function fragmentToTitle(fragment) {
		page = formatPageNumber();

		return page + " - " + fragment;
	}

	function pathFromURL(url) {
		var pos;

		pos = url.indexOf('#');
		if (pos > 0) {
			path = url.substring(0, pos);
		} else {
			path = url;
		}

		return path;
	}

	function displayCurrentSlide() {
		var slide, fragment;

		slide = slideList[currentPosition];
	
    		$("div.slide").load(slide, function() {
			$("div.slide section").append(
				"<div id='pagenumber'>" + formatPageNumber() + "</div>"
			);
		});

		fragment = fileToURL(slide);
		document.title = fragmentToTitle(fragment);

		url = pathFromURL(document.URL);

  		history.replaceState(null, null, url + "#" + fragment);

	}

/*
 * Event handlers. Note that there is /not/ a handler for 'click' in order
 * that users can click on links that might happen to be placed in pages;
 * when I give presentations I always use the keyboard to advance slides.
 */

	window.addEventListener('resize', function (e) {
		doScaleBody();
	}, false);

/*
 * More than anything, this was the magic in shower.js; outstanding work to
 * pull this together.
 */

	document.addEventListener('keydown', function (e) {
		// Shortcut for alt, shift and meta keys
		if (e.altKey || e.ctrlKey || e.metaKey) { return; }

		switch (e.which) {
			
			case 33: // PgUp
			case 38: // Up
			case 37: // Left
			case 72: // h
			case 75: // k
				goBack();
				e.preventDefault();
			break;

			case 34: // PgDown
			case 40: // Down
			case 39: // Right
			case 76: // l
			case 74: // j
				goForward();
				e.preventDefault();
			break;

			case 36: // Home
				goStart();
				e.preventDefault();
			break;

			case 35: // End
				goEnd();
				e.preventDefault();
			break;

			case 32: // Space
				goForward();
				e.preventDefault();
			break;

			default:
				// Behave as usual
		}
	}, false);

	function doSetupWindow() {
		if (body.className) {
			body.className = body.className + " full";
		} else {
			body.className = "full";
		}
	}

/*
 * The other shower.js piece of magic: scale the body as a whole; having
 * forced a non-null transform of scale(1) on the <section> element.
 */

	function doScaleBody() {
		var ratio = Math.min(
			window.innerWidth / 1024,
			window.innerHeight / 768
		);

		var transform = 'scale(' + ratio + ')';


		body.style.WebkitTransform = transform;
		body.style.transform = transform;
		body.style.MozTransform = transform;
		body.style.msTransform = transform;
		body.style.OTransform = transform;
	}

	doSetupWindow();
	doScaleBody();

/*
 * Finaly, the initial slide render is done in the callback when the list of
 * slide files is loaded.
 */

}());
