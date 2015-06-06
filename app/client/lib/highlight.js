/*

highlight v5

Highlights arbitrary terms.

<http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>

MIT license.

Johann Burkard
<http://johannburkard.de>
<mailto:jb@eaio.com>

*/

jQuery.fn.highlight = function(pat) {
  console.log(pat);
 function innerHighlight(node, pat) {
  var skip = 0;
  if (node.nodeType == 3) {
   var pos = node.data.toUpperCase().indexOf(pat);
   pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
   console.log(node);

   // pos will only be below 0 if the desired text is not found
   if (pos >= 0) {
    // creates a span element
    var spannode = document.createElement('span');
    // gives the span element a class of 'highlight'
    spannode.className = 'highlight';
    // the text node is split in to two nodes
    // starting at the position of the desired.
    // bit of text to be highlighted with
    // the function called .splitText(pos);
    // var middlebit becomes the text to be highlighted.
    var middlebit = node.splitText(pos);
    // endbit is an empty node created at the end of
    // the middlebit text node. I'm not sure why this is needed.
    var endbit = middlebit.splitText(pat.length);
    // a clone is made of middlebit, the text to be highlighted
    var middleclone = middlebit.cloneNode(true);
    // the clone/text to be highlighted is put in the span element
    spannode.appendChild(middleclone);
    // the node that has the original text to be highlighted is replaced
    // with the span that has the text node to be highlighted
    middlebit.parentNode.replaceChild(spannode, middlebit);
    skip = 1;
   }
  }
  // if the returned node is an element and the element has child nodes...
  else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
   for (var i = 0; i < node.childNodes.length; ++i) {
    // do the innerHighlight for all child nodes.
    // Not sure what the 'i +=' is for.
    i += innerHighlight(node.childNodes[i], pat);
   }
  }
  return skip;
 }
 // no idea what this is accomplishing
 return this.length && pat && pat.length ? this.each(function() {
  innerHighlight(this, pat.toUpperCase());
 }) : this;
};

jQuery.fn.removeHighlight = function() {
  // for every span element with a class of highlight
 return this.find("span.highlight").each(function() {
  this.parentNode.firstChild.nodeName;
  with (this.parentNode) {
   replaceChild(this.firstChild, this);
   normalize();
  }
 }).end();
};