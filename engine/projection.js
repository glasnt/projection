/*
 * Supporting code for the Projection presentation engine.

 * Copyright © 2010-2011 Vadim Makeev
 * Copyright © 2013-     Operational Dynamics Consulting, Pty Ltd
 *
 * Event handling logic forked from the Shower presentation tool, used
 * under the MIT Open Source licence.
 */

(function () {
	var mode;
	var slideList = new Array();
	var targetMap = new Object();
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
		displayCurrentSlide();

	}, "text");

/*
 * Was a specific slide specified at load? Figure that out, and also set
 * the body CSS accordingly.
 */

	function doInitialSlide() {
		var pos;
		var url;
		var fragment;
		var query;

		fragment = window.location.hash;
		query = window.location.search;

		if (query) {
			mode = query.substring(1);
		}
		if (fragment) {
			initialSlide = fragment.substring(1);
		}

		if (mode == "list") {
			switchToList();
		} else if (mode == "single") {
			switchToSingle();
		} else {
			switchToFull();
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
 * Note that this is called on both full and list mode code paths.
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

	function setTitle(fragment) {
		if (typeof fragment == "undefined") {
			fragment = getFragment()
		}
		if (mode == "list") {
			document.title = "All Slides";
		} else {
			document.title = fragmentToTitle(fragment);
		}
	}

	function getFragment() {
		var slide, fragment; 
		slide = slideList[currentPosition];

		fragment = fileToFragment(slide);
		return fragment
	}

	function displayCurrentSlide() {
		var slide, fragment, element, url;

		fragment = getFragment()
		setTitle(fragment)

		url = window.location.origin + window.location.pathname + window.location.search + "#" + fragment;
  		history.replaceState(null, null, url);

		$(".active").removeClass("active");

		element = document.getElementById(fragment);
		$(element).addClass("active");
	}

/*
 * Set overall style for normal full frame slide view or list mode, as the case
 * may be. Add or remove the ?list query string indicating list mode.
 */

	function switchToFull() {
		var url;

		$("body").removeClass();
		$("body").addClass("full");

		mode = "full";
		setTitle()
		doScaleBody();

		url = window.location.origin + window.location.pathname + window.location.hash;
		history.replaceState(null, null, url);
	}

	function switchToList() {
		var url;
		var slide, fragment, element;

		$("body").removeClass();
		$("body").addClass("list");

		mode = "list";
		doScaleBody();

		url = window.location.origin + window.location.pathname + "?list" + window.location.hash;
		history.replaceState(null, null, url);

		slide = slideList[currentPosition];
		fragment = fileToFragment(slide);
		element = document.getElementById(fragment);
		window.scrollTo(0, element.offsetTop - 50);
	}

	function switchToSingle() {
		var url;

		$("body").removeClass();
		$("body").addClass("single");

		mode = "single";
		doScaleBody();

		url = window.location.origin + window.location.pathname + "?single" + window.location.hash;
		history.replaceState(null, null, url);
	}


/*
 * The other meaty bit: with the list of slides in hand, asynchronously load
 * each one of them into a div id'd by the basename of the containing file,
 * then add a page number to it.
 */

	function loadAllSlides() {
		for (var i = 0; i < slideList.length; i++) {
    			$("div.deck").append(function() {
				var slide, div, target, page;

				slide = slideList[i];
				target = fileToFragment(slide);
				targetMap[target] = i;

				page = formatPageNumber(i);
				
				div = $("<div id='" + target + "' class='slide'></div>");

				div.load(slide, function() {
					var element, children, section;

					element = document.getElementById(target);
					children = element.getElementsByTagName("section");

					if (children.length != 1) {
						return;
					}
					section = children[0];

					$(section).append("<footer class='pagenumber'>" + page + "</footer>");
					$(section).append("<div class='overlay'></div>");
				});

				return div;
			});
		}
	}


/*
 * Event handlers. Note that 'click' handler is only used in list mode in order
 * that users can click on links that might happen to be placed in pages; when
 * I give presentations I always use the keyboard to advance slides.
 */

	function getSlideContainingEvent(e) {
		var node;

		node = e.target;

		while ("HTML" !== node.nodeName) {
			if (node.classList.contains('slide')) {
				return node.id;
			} else {
				node = node.parentNode;
			}
		}

		return '';
	}

	function setCurrentSlideFromEvent(e) {
		var slide;

		slide = getSlideContainingEvent(e);
		if (slide) {
			currentPosition = targetMap[slide];
		}
	}

	window.addEventListener('click', function (e) {
		if (mode == "list") {
			setCurrentSlideFromEvent(e);
			displayCurrentSlide();
		} else if (mode == "single") {
			var url;

			url = window.location.origin + window.location.pathname + window.location.hash;
			window.parent.location = url;
		}
	}, false);

/*
 * A 'click' event will already have changed the current slide, so we merely
 * toggle back to full mode.
 */

	window.addEventListener('dblclick', function (e) {
		if (mode == "list") {
			switchToFull();
		}
	}, false);


	window.addEventListener('resize', function (e) {
		doScaleBody();
	}, false);



/*
 * More than anything, this was the magic in shower.js; outstanding work to
 * pull this together.
 */

	document.addEventListener('keydown', function (e) {
		if (mode == "single") {
			return;
		}

		// Shortcut for alt, shift and meta keys
		if (e.altKey || e.ctrlKey || e.metaKey) { return; }

		switch (e.which) {
			case 116: // F5
			case 13: // Enter
				e.preventDefault();
				switchToFull();
				displayCurrentSlide();
			break;

			case 27: // Esc
				e.preventDefault();
				switchToList();
				displayCurrentSlide();
			break;

			
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

	document.addEventListener('touchstart', function (e) {
		if (mode != "full") {
			return;
		}
		x = e.touches[0].pageX;
		if (x > window.innerWidth / 4) {
			goForward();
		} else {
			goBack();
		}
	}, false);

	document.addEventListener('touchmove', function (e) {
		if (mode != "full") {
			return;
		}
		e.preventDefault();
	}, false);



/*
 * The other shower.js piece of magic: scale the body as a whole; having
 * forced a non-null transform of scale(1) on the <section> element.
 */

	function doScaleBody() {
		var transform, ratio;
		var body = document.body;

		ratio = Math.min(
			window.innerWidth / 1024,
			window.innerHeight / 768
		);

		if (mode == "list") {
			transform = 'scale(1)';
		} else {
			transform = 'scale(' + ratio + ')';
		}

		body.style.WebkitTransform = transform;
		body.style.transform = transform;
		body.style.MozTransform = transform;
		body.style.msTransform = transform;
		body.style.OTransform = transform;
	}

	$(document).ready(function () {
		doInitialSlide();
		doScaleBody();
	});

/*
 * Finaly, the initial slide render is done in the callback when the list of
 * slide files is loaded.
 */

}());
