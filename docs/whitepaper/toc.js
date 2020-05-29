function main() {
  var html = ["<h1>Table of Contents</h1>", "<ul>"];
  var headings = Array.apply(null, document.querySelectorAll("h2, h3"));
  var numbering = true;
  var prev = "";
  var section = 0;
  var subsection = 0;
  for (var i = 0; i < headings.length; i++) {
    var heading = headings[i];
    if (heading.id === "abstract") {
      continue;
    }
    if (heading.id === "acknowledgements") {
      numbering = false;
    }
    var tag = heading.tagName;
    if (tag === "H2") {
      if (prev === "H3") {
        html.push("</ol></li>");
      }
      section++;
      html.push("<li>");
      html.push('<a href="#');
      html.push(heading.id);
      html.push('">');
      if (numbering) {
        html.push(section);
        html.push(" &nbsp; ");
      }
      html.push(heading.innerHTML);
      html.push("</a>");
      html.push("</li>");
      subsection = 0;
    } else {
      if (prev === "H2") {
        html.push("<li><ol>");
      }
      subsection++;
      html.push("<li>");
      html.push('<a href="#');
      html.push(heading.id);
      html.push('">');
      if (numbering) {
        html.push(section);
        html.push(".");
        html.push(subsection);
        html.push(" &nbsp; ");
      }
      html.push(heading.innerHTML);
      html.push("</a>");
      html.push("</li>");
    }
    prev = tag;
  }
  html.push("</ul>");
  document.getElementById("toc").innerHTML = html.join("");
}

window.addEventListener("DOMContentLoaded", main);
