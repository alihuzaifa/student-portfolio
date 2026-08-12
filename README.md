# Student Portfolio — HTML, CSS and Vanilla JavaScript

**Live demo: https://student-portfolio-kappa-weld.vercel.app**

A single page portfolio built with plain HTML, CSS and JavaScript. No frameworks, no build
step, no dependencies. Every section on the page is generated from one file: `data.js`.

Free to use. Fork it, put your own details in `data.js`, and it is your portfolio.

## Running it

Download the files and double click `index.html`. That is the whole setup.

## Adding your own details

1. Open `data.js` in any editor.
2. Replace the sample values with your own. Each section is an array of objects.
3. Save the file and refresh the browser.

### What lives in `data.js`

| Variable | What it controls |
|---|---|
| `profile` | Name, role, tagline, email, phone, photo, CV link |
| `navLinks` | The navigation menu at the top |
| `socialLinks` | GitHub, LinkedIn and other icon buttons |
| `aboutText`, `aboutFacts`, `stats` | The about section and the counting numbers |
| `skillGroups` | Skills grouped by category, each with a progress bar |
| `projects` | Project cards — the filter buttons build themselves |
| `timeline` | Education and work experience |
| `certificates` | Certificate cards |
| `services` | The kind of work you take on |
| `testimonials` | Quotes from people you have worked with |
| `contactInfo`, `contactNote` | Contact cards, plus the line and email button under them |
| `footerInfo` | The footer call to action, columns and bottom line |

### Adding a project

Add one more object to the `projects` array:

```js
{
    title: "My New Project",
    category: "JavaScript",     // a new category name creates a new filter button
    icon: "+",
    description: "One or two sentences about what this project does.",
    tech: ["HTML", "CSS", "JavaScript"],
    demo: "#",
    code: "#",
    featured: true              // true adds a "Featured" tag to the card
}
```

Every other section works exactly the same way: copy an object, change the values.

### Using your photo

Put the image in this folder and point `profile` at it:

```js
photo: "images/my-photo.jpg"
```

Leave it as an empty string and the circle shows your initials instead.

## The files

- `index.html` — the empty structure, mostly just element IDs
- `style.css` — layout, themes, animations, responsive rules
- `data.js` — **your content, the only file you need to edit**
- `script.js` — loops over the data and writes it into the page with `innerHTML`

## What is included

Dark and light theme with a sliding switch that remembers your choice, a typing effect in the
hero, a scroll progress bar, fade in animations, animated skill bars and counters, project
filtering, an alternating timeline, a mobile menu and a back to top button — all without a
single library.

There is deliberately no message form. A form cannot deliver anything without a server behind
it, and this template runs from plain files, so the contact section links straight to a real
email address and phone number instead of pretending to send something.

## How it works

`index.html` ships almost empty. Every element `script.js` needs is looked up once at the top
of the file and kept in a variable:

```js
var projectsGridBox = document.getElementById("projectsGrid");
```

Those variables are then passed into the functions further down, so nothing has to search the
document twice and every id lives in one place. Each function loops over an array from
`data.js`, builds an HTML string with `+`, and writes it in:

```js
function makeProjects(gridBox, category) {
    var html = "";
    for (var i = 0; i < projects.length; i++) {
        html += "<article class='project-card'>...</article>";
    }
    gridBox.innerHTML = html;
}
```

That means adding a project never involves touching HTML — you add an object, and the card,
the filter button and the footer link all appear on their own.

Two small details worth knowing:

- Text from `data.js` passes through `toSafeText()` before it reaches the page. That is what
  lets an icon like `</>` print as text instead of being read as an HTML tag.
- A four line script in the `<head>` of `index.html` applies the saved theme before the page
  paints, so there is no flash of the wrong colours on load.

## Checked on

Layouts verified at 320, 375, 414, 768, 1024, 1280 and 1600 pixels wide with no sideways
scrolling, in both the dark and the light theme.
