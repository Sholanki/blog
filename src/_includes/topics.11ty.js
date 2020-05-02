// This is a layout implemented in JavaScript instead of Nunjucks.
// It is used by src/topics.md.

// This describes front-matter.
exports.data = {
  layout: 'top-layout.njk'
};

/*
This renders a single nav item in an li element.
It calls renderNavItem recursively to create a tree of links.
*/
function renderNavItem(entry) {
  let classes = '';
  if (entry.order) classes += ' ordered';
  if (!entry.parent) classes += ' top';

  // handleLinkClick is defined in assets/topics.js.
  // It sets the iframe url instead of having
  // an href attribute on the a element so we can animate opacity.
  return `
    <li class="${classes}">
      <a
        class="nav-link"
        onclick="handleLinkClick(this, '${entry.url}')"
        target="frame"
      >
        ${entry.title}
        ${entry.children ? '<div class="triangle">&#x25b6;</div>' : ''}
      </a>
      ${renderNavList(entry.children)}
    </li>
  `;
}

/*
This renders a list of nav items inside a ul element.
*/
function renderNavList(entries) {
  if (!entries) return '';
  const items = entries.map(renderNavItem);
  return `<ul>${items.join('')}</ul>`;
}

// This returns what this layout will render.
//TODO: Is the eleventy-navigation package still needed?
exports.render = data => {
  const {nav} = data.collections;
  // toggleHamburgerMenu and iframeLoaded are
  // defined in _includes/top-layout.js.
  return `
    <link rel="stylesheet" href="/blog/assets/topics.css">
    <script src="/blog/assets/topics.js"></script>
    <button class="hamburger" onclick="toggleHamburgerMenu()">&#x2630;</button>
    <nav>
      ${renderNavList(nav)}
    </nav>
    <section class="topic-content">
      <iframe
        name="frame"
        onLoad={iframeLoaded(this)}
        src="../welcome/"
        title="topic content"></iframe>
    </section>
  `;
};
