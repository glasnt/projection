Projection
==========

A simple HTML based presentation tool.
--------------------------------------

You write your slides in individual .html files, make a list, and then upload them to a server. Ta-da!

In Projection, each .html fragment contains a single `<section>` element with your slide content:

```html
<section>
<!--
    Your HTML here
-->
</section>
```

You don't have to assign them to be `class="slide"` or anything like that. The top level presentation .html page needs only to load the CSS stylesheet and JavaScript script that together are the presentation engine, and have a `<div class="deck">` wherein the slide content will be loaded:

```html
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js" type="text/javascript"></script>

<script src="engine/projection.js" type="text/javascript"></script>
<link rel="stylesheet" href="engine/style.css">
<link rel="stylesheet" href="themes/style.css">

<title>Presentation!</title>
</head>

<body>

<div class="deck">
    <!-- Slide content will be inserted here -->
</div>

</body>
</html>
```

Projection is, essentially, a refactoring of the most excellent [Shower](http://shwr.me/) by Vadim Makeev. Frankly, it's _amazing_, and studying it I learned a lot about what is possible with raw JavaScript, HTML 5, and CSS 3. I won't feel bad in the slightest if you think the original Shower — or one of the approximately 7 million other HTML based presentation tools — is better.

AfC

