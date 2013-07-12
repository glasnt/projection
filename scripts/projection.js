(function () {
	var body = document.body;
	var mode;
	var slideList = new Array();
	var lastSlide;
	var currentPosition = 0;
	var cacheStamp;
	var initialSlide;

/*
 * There are some nasty cases where browsers decide (based on absence of
 * Expires: headers) that they can cache something permenantly. So we employ
 * the jQuery trick of appending a no-op query string parameter to HTML
 * requests, with the variation that we only set it once per [re]load of the
 * master presentation page, not once per request. So business as usual, unless
 * there's a problem, in which case a forced reload will fix it.
 */

	cacheStamp = new Date().getTime();

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

				if (file.indexOf(initialSlide) > -1) {
					currentPosition = i;
				}
			}
		}
		lastSlide = slideList.length - 1;

		loadAllSlides();
		if (mode == "list") {
			displayOverview();
		} else {
			displayCurrentSlide();
		}

	}, "text");

/*
 * Was a specific slide specified at load?
 */

	function doInitialSlide() {
		var pos;
		var url;
		var hash;
		var query;

		hash =  window.location.hash;
		query = window.location.search;


		if (query) {
			mode = query.substring(1);
		} else if (hash) {
			initialSlide = hash.substring(1);
		} else {
			mode = "list";
		}
	}

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
	function fileToFragment(filename) {
		var pos, basename;

		pos = filename.lastIndexOf('/');
		basename = filename.substring(pos + 1); 	

		pos = basename.lastIndexOf('.');
		basename = basename.substring(0, pos); 	

		return basename;
	}

	function formatPageNumber(pageIndex) {
		var p;

		p = pageIndex + 1;

		if (p < 10) {
			return "0" + p.toString();
		} else {
			return p.toString();
		}
	}

	function fragmentToTitle(fragment) {
		page = formatPageNumber(currentPosition);

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
	
		fragment = fileToFragment(slide);
		document.title = fragmentToTitle(fragment);

		// TODO replace with window.location fields?
		url = pathFromURL(document.URL);

  		history.replaceState(null, null, url + "#" + fragment);

		$(".active").removeClass("active");
		$("#"+fragment).addClass("active");
	}

	function displayOverview() {
	}

	function loadAllSlides() {
		for (var i = 0; i < slideList.length; i++) {
    			$("div.deck").append(function() {
				var slide, div, target, page;

				slide = slideList[i];
				target = fileToFragment(slide);
				page = formatPageNumber(i);
				
				div = $("<div id='" + target + "' class='slide'></div>");
				div.load(slide, function() {
					$("#" + target).append("<footer class='pagenumber'>" + page + "</footer>");
				});

				return div;
			});
		}
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

	doInitialSlide();
	doSetupWindow();
	doScaleBody();

/*
 * Finaly, the initial slide render is done in the callback when the list of
 * slide files is loaded.
 */

}());
