Projection
==========

A simple HTML based presentation tool.

You write your slides in individual .html files, make a list, and then upload them to a server. Ta-da!

In Projection, each .html fragment contains a single `<section>` element with your slide content.

<pre>
<span id="L1" class="LineNr">1 </span><span class="Identifier">&lt;</span><span class="Statement">section</span><span class="Identifier">&gt;</span>
<span id="L2" class="LineNr">2 </span>
<span id="L3" class="LineNr">3 </span>    <span class="Comment">&lt;!</span><span class="Comment">-- your HTML here --</span><span class="Comment">&gt;</span>
<span id="L4" class="LineNr">4 </span>
<span id="L5" class="LineNr">5 </span><span class="Identifier">&lt;/</span><span class="Statement">section</span><span class="Identifier">&gt;</span>
</pre>

You don't have to assign them to be `class="slide"` or anything like that. The top level presentation .html page needs only to load the CSS stylesheet and JavaScript script that together are the presentation engine, and have a `<div class="deck">` wherein the slide content will be loaded:

<style>
pre { font-family: monospace; color: #000000; background-color: #ffffff; }
.String { color: #204a87; font-weight: bold; }
.Statement { color: #8f5902; font-weight: bold; }
.LineNr { color: #eeeeec; }
.Comment { color: #888a85; }
.Type { color: #73d216; font-weight: bold; }
.Identifier { color: #729fcf; }
</style>


<pre>
<span id="L1" class="LineNr"> 1 </span><span class="Identifier">&lt;</span><span class="Statement">html</span><span class="Identifier">&gt;</span>
<span id="L2" class="LineNr"> 2 </span><span class="Identifier">&lt;</span><span class="Statement">head</span><span class="Identifier">&gt;</span>
<span id="L3" class="LineNr"> 3 </span><span class="Identifier">&lt;</span><span class="Statement">meta</span><span class="Identifier"> </span><span class="Type">http-equiv</span><span class="Identifier">=</span><span class="String">&quot;Content-Type&quot;</span><span class="Identifier"> </span><span class="Type">content</span><span class="Identifier">=</span><span class="String">&quot;text/html; charset=UTF-8&quot;</span><span class="Identifier">&gt;</span>
<span id="L4" class="LineNr"> 4 </span>
<span id="L5" class="LineNr"> 5 </span><span class="Identifier">&lt;</span><span class="Statement">script</span><span class="Identifier"> </span><span class="Type">src</span><span class="Identifier">=</span><span class="String">&quot;//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js&quot;</span><span class="Identifier">&gt;</span><span class="Identifier">&lt;/</span><span class="Statement">script</span><span class="Identifier">&gt;</span>
<span id="L6" class="LineNr"> 6 </span>
<span id="L7" class="LineNr"> 7 </span><span class="Identifier">&lt;</span><span class="Statement">link</span><span class="Identifier"> </span><span class="Type">rel</span><span class="Identifier">=</span><span class="String">&quot;stylesheet&quot;</span><span class="Identifier"> </span><span class="Type">href</span><span class="Identifier">=</span><span class="String">&quot;engine/style.css&quot;</span><span class="Identifier">&gt;</span>
<span id="L8" class="LineNr"> 8 </span><span class="Identifier">&lt;</span><span class="Statement">link</span><span class="Identifier"> </span><span class="Type">rel</span><span class="Identifier">=</span><span class="String">&quot;stylesheet&quot;</span><span class="Identifier"> </span><span class="Type">href</span><span class="Identifier">=</span><span class="String">&quot;themes/style.css&quot;</span><span class="Identifier">&gt;</span>
<span id="L9" class="LineNr"> 9 </span>
<span id="L10" class="LineNr">10 </span><span class="Identifier">&lt;</span><span class="Statement">title</span><span class="Identifier">&gt;</span><span class="Title">Presentation!</span><span class="Identifier">&lt;/</span><span class="Statement">title</span><span class="Identifier">&gt;</span>
<span id="L11" class="LineNr">11 </span><span class="Identifier">&lt;/</span><span class="Statement">head</span><span class="Identifier">&gt;</span>
<span id="L12" class="LineNr">12 </span>
<span id="L13" class="LineNr">13 </span><span class="Identifier">&lt;</span><span class="Statement">body</span><span class="Identifier">&gt;</span>
<span id="L14" class="LineNr">14 </span>
<span id="L15" class="LineNr">15 </span><span class="Identifier">&lt;</span><span class="Statement">div</span><span class="Identifier"> </span><span class="Type">class</span><span class="Identifier">=</span><span class="String">&quot;slide&quot;</span><span class="Identifier">&gt;</span>
<span id="L16" class="LineNr">16 </span>    <span class="Comment">&lt;!</span><span class="Comment">-- Slide content will be inserted here --</span><span class="Comment">&gt;</span>
<span id="L17" class="LineNr">17 </span><span class="Identifier">&lt;/</span><span class="Statement">div</span><span class="Identifier">&gt;</span>
<span id="L18" class="LineNr">18 </span>
<span id="L19" class="LineNr">19 </span><span class="Identifier">&lt;</span><span class="Statement">script</span><span class="Identifier"> </span><span class="Type">type</span><span class="Identifier">=</span><span class="String">&quot;text/javascript&quot;</span><span class="Identifier"> </span><span class="Type">src</span><span class="Identifier">=</span><span class="String">&quot;engine/projection.js&quot;</span><span class="Identifier">&gt;</span><span class="Identifier">&lt;/</span><span class="Statement">script</span><span class="Identifier">&gt;</span>
<span id="L20" class="LineNr">20 </span><span class="Identifier">&lt;/</span><span class="Statement">body</span><span class="Identifier">&gt;</span>
<span id="L21" class="LineNr">21 </span><span class="Identifier">&lt;/</span><span class="Statement">html</span><span class="Identifier">&gt;</span>
</pre>

Projection is, essentially, a refactoring of the most excellent [Shower](http://shwr.me/) by Vadim Makeev. Frankly, it's _amazing_, and studying it I learned a lot about what is possible with raw JavaScript, HTML 5, and CSS 3. I won't feel bad in the slightest if you think the original Shower -- 
or one of the approximately 7 million other HTML based presentation tools -- is better.

AfC

