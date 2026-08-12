/* =========================================================================
   script.js  —  The engine of the page.

   Where the data comes from
     index.html loads two files, in this order, just before </body>:

         <script src="data.js"></script>
         <script src="script.js"></script>

     data.js runs first. Everything it declares with var — profile, projects,
     skillGroups and the rest — lands in the global scope, which means this
     file can read those names directly. There is no import and no require,
     because both files share one scope.

     The order matters. Load script.js first and the page stops with
     "projects is not defined", because the data would not exist yet.

     Neither tag uses type="module" on purpose. Modules are blocked on
     file:// addresses, so the site would need a server to run. As plain
     scripts it opens by double clicking index.html.

   How the page is built
     1. Every element the page needs is looked up one time at the top of
        this file with document.getElementById() and stored in a variable.
     2. Those variables are then passed into the functions below, so no
        function has to search the document again. One lookup, reused
        everywhere, which is faster and keeps the ids in a single place.
     3. Each function loops over an array from data.js, builds an HTML
        string with +, and writes it in with .innerHTML

   You do not need to change anything in this file. Edit data.js instead.
   ========================================================================= */


/* =========================================================
   ELEMENT VARIABLES
   All of the document.getElementById calls live here and nowhere else.
   ========================================================= */

/* Head of the document */
var faviconTag  = document.getElementById("favicon");
var metaDescTag = document.getElementById("metaDesc");
var ogTitleTag  = document.getElementById("ogTitle");
var ogDescTag   = document.getElementById("ogDesc");

/* Loading screen and the thin progress line */
var loaderBox     = document.getElementById("loader");
var loaderTextBox = document.getElementById("loaderText");
var scrollBarBox  = document.getElementById("scrollBar");

/* Navigation bar */
var navbarBox   = document.getElementById("navbar");
var navLogoBox  = document.getElementById("navLogo");
var navMenuBox  = document.getElementById("navMenu");
var themeButton = document.getElementById("themeBtn");
var menuButton  = document.getElementById("menuBtn");

/* Hero */
var heroBadgeBox   = document.getElementById("heroBadge");
var heroNameBox    = document.getElementById("heroName");
var typingBox      = document.getElementById("typingText");
var heroTaglineBox = document.getElementById("heroTagline");
var resumeLink     = document.getElementById("resumeBtn");
var socialRowBox   = document.getElementById("socialRow");
var photoBox       = document.getElementById("profilePhoto");
var chipOneBox     = document.getElementById("chipOne");
var chipTwoBox     = document.getElementById("chipTwo");

/* About */
var aboutTextBox  = document.getElementById("aboutText");
var aboutFactsBox = document.getElementById("aboutFacts");
var statsGridBox  = document.getElementById("statsGrid");

/* Skills */
var skillsGridBox = document.getElementById("skillsGrid");

/* Projects */
var filterRowBox   = document.getElementById("filterRow");
var projectsGridBox = document.getElementById("projectsGrid");

/* Education, experience and certificates */
var timelineBox = document.getElementById("timeline");
var certGridBox = document.getElementById("certGrid");

/* Services and testimonials */
var servicesGridBox = document.getElementById("servicesGrid");
var testiGridBox    = document.getElementById("testiGrid");

/* Contact */
var contactCardsBox    = document.getElementById("contactCards");
var contactNoteTextBox = document.getElementById("contactNoteText");
var contactMailButton  = document.getElementById("contactMailBtn");

/* Footer */
var footerCtaTextBox         = document.getElementById("footerCtaText");
var footerCtaSubBox          = document.getElementById("footerCtaSub");
var footerCtaButton          = document.getElementById("footerCtaBtn");
var footerLogoBox            = document.getElementById("footerLogo");
var footerAboutBox           = document.getElementById("footerAbout");
var footerSocialBox          = document.getElementById("footerSocial");
var footerLinksHeadingBox    = document.getElementById("footerLinksHeading");
var footerLinksBox           = document.getElementById("footerLinks");
var footerServicesHeadingBox = document.getElementById("footerServicesHeading");
var footerServicesBox        = document.getElementById("footerServices");
var footerContactHeadingBox  = document.getElementById("footerContactHeading");
var footerContactBox         = document.getElementById("footerContact");
var footerCopyBox            = document.getElementById("footerCopy");
var footerBuiltBox           = document.getElementById("footerBuilt");

/* Back to top button */
var topButton = document.getElementById("topBtn");


/* =========================================================
   SMALL HELPERS
   ========================================================= */

/* Turns characters that mean something in HTML into their safe codes.

   Everything written in data.js is text, not markup, so it has to be made safe
   before it goes into .innerHTML. Without this the "</>" icon would disappear,
   because the browser would try to read it as a tag instead of printing it, and
   an apostrophe in a sentence would cut an attribute short. */
function toSafeText(text) {
    var safe = String(text);

    safe = safe.split("&").join("&amp;");
    safe = safe.split("<").join("&lt;");
    safe = safe.split(">").join("&gt;");
    safe = safe.split("\"").join("&quot;");
    safe = safe.split("'").join("&#39;");

    return safe;
}

/* Splits the full name so the second word can carry the brand gradient */
function makeLogoHtml() {
    var nameParts = toSafeText(profile.name).split(" ");
    var html;

    if (nameParts.length > 1) {
        html = nameParts[0] + " <span>" + nameParts[1] + "</span>";
    } else {
        html = "<span>" + nameParts[0] + "</span>";
    }

    return html;
}

/* Counts the skills inside every category, so the hero can show a total */
function countAllSkills() {
    var total = 0;
    var i;

    for (i = 0; i < skillGroups.length; i++) {
        total = total + skillGroups[i].skills.length;
    }

    return total;
}


/* =========================================================
   1) PAGE TITLE, DESCRIPTION AND TAB ICON
   All of it comes from the profile object in data.js.
   ========================================================= */
function makePageInfo(iconTag, descTag, titleTag, ogTag, loaderTitleBox) {
    var pageTitle = profile.name + " | " + profile.role;

    document.title = pageTitle;
    loaderTitleBox.innerHTML = toSafeText(profile.name);

    descTag.setAttribute("content", profile.tagline);
    titleTag.setAttribute("content", pageTitle);
    ogTag.setAttribute("content", profile.tagline);

    /* A small square with the initials on it, drawn as an SVG tab icon */
    var icon = "data:image/svg+xml," +
               "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E" +
               "%3Crect width='100' height='100' rx='22' fill='%234f46e5'/%3E" +
               "%3Ctext x='50' y='69' font-family='Arial' font-size='50' font-weight='bold' " +
               "fill='white' text-anchor='middle'%3E" + encodeURIComponent(profile.initials) + "%3C/text%3E%3C/svg%3E";

    iconTag.setAttribute("href", icon);
}


/* =========================================================
   2) NAVIGATION BAR AND LOGO
   ========================================================= */
function makeNavbar(menuBox, logoBox, footerLogo) {
    var html = "";
    var i;

    /* One list item for every object in the navLinks array */
    for (i = 0; i < navLinks.length; i++) {
        html += "<li><a href='" + toSafeText(navLinks[i].link) + "'>" + toSafeText(navLinks[i].title) + "</a></li>";
    }

    menuBox.innerHTML = html;

    /* The same logo markup is used at the top of the page and in the footer */
    var logoHtml = makeLogoHtml();
    logoBox.innerHTML = logoHtml;
    footerLogo.innerHTML = logoHtml;
}


/* =========================================================
   3) HERO TEXT
   ========================================================= */
function makeHeroText(badgeBox, nameBox, taglineBox, cvLink) {

    /* The green badge only shows when profile.available is true */
    if (profile.available === true) {
        badgeBox.innerHTML = "<span class='dot'></span> Open to work";
    } else {
        badgeBox.innerHTML = "Currently unavailable";
    }

    nameBox.innerHTML = makeLogoHtml();
    taglineBox.innerHTML = toSafeText(profile.tagline);

    /* Point the CV button at the file named in data.js */
    cvLink.setAttribute("href", profile.resume);
}


/* =========================================================
   4) HERO PHOTO AND THE TWO FLOATING CARDS
   ========================================================= */
function makeHeroPhoto(pictureBox, chipA, chipB) {

    /* Use the photo when one is given, otherwise fall back to the initials */
    if (profile.photo !== "") {
        pictureBox.innerHTML = "<img src='" + toSafeText(profile.photo) + "' alt='Photo of " + toSafeText(profile.name) + "'>";
    } else {
        pictureBox.innerHTML = "<div class='photo-initials'>" + toSafeText(profile.initials) + "</div>";
    }

    /* Both numbers are counted from the data, so they can never be out of date */
    chipA.innerHTML = "<b>" + countAllSkills() + "+</b> Skills";
    chipB.innerHTML = "<b>" + projects.length + "</b> Projects";
}


/* =========================================================
   5) SOCIAL LINKS
   The same list is shown in the hero and again in the footer.
   ========================================================= */
function makeSocialLinks(heroBox, footerBox) {
    var html = "";
    var i;

    for (i = 0; i < socialLinks.length; i++) {
        html += "<li><a href='" + toSafeText(socialLinks[i].link) + "' target='_blank' rel='noopener noreferrer'" +
                " aria-label='" + toSafeText(socialLinks[i].name) + "' title='" + toSafeText(socialLinks[i].name) + "'>" +
                    toSafeText(socialLinks[i].icon) +
                "</a></li>";
    }

    heroBox.innerHTML = html;
    footerBox.innerHTML = html;
}


/* =========================================================
   6) ABOUT TEXT, FACT LIST AND STAT CARDS
   ========================================================= */
function makeAbout(textBox, factsBox, statsBox) {
    var html = "";
    var i;

    /* Each string in the aboutText array becomes its own paragraph */
    for (i = 0; i < aboutText.length; i++) {
        html += "<p>" + toSafeText(aboutText[i]) + "</p>";
    }
    textBox.innerHTML = html;

    /* Short label and value pairs, such as Degree or Location */
    html = "";
    for (i = 0; i < aboutFacts.length; i++) {
        html += "<li><b>" + toSafeText(aboutFacts[i].label) + "</b>" + toSafeText(aboutFacts[i].value) + "</li>";
    }
    factsBox.innerHTML = html;

    /* The numbers start at zero and count up once the section is scrolled into
       view. The target is stored on the element so the counter can read it back. */
    html = "";
    for (i = 0; i < stats.length; i++) {
        html += "<div class='stat-card'>" +
                    "<div class='stat-num' data-target='" + toSafeText(stats[i].number) + "' data-suffix='" + toSafeText(stats[i].suffix) + "'>0</div>" +
                    "<div class='stat-label'>" + toSafeText(stats[i].label) + "</div>" +
                "</div>";
    }
    statsBox.innerHTML = html;
}


/* =========================================================
   7) SKILL CARDS WITH PROGRESS BARS
   ========================================================= */
function makeSkills(gridBox) {
    var html = "";
    var i;
    var j;

    /* Outer loop walks through the categories */
    for (i = 0; i < skillGroups.length; i++) {

        html += "<div class='skill-card'>";
        html += "<div class='skill-head'>" +
                    "<div class='skill-icon' aria-hidden='true'>" + toSafeText(skillGroups[i].icon) + "</div>" +
                    "<h3>" + toSafeText(skillGroups[i].category) + "</h3>" +
                "</div>";

        /* Inner loop walks through the skills inside that category */
        for (j = 0; j < skillGroups[i].skills.length; j++) {
            html += "<div class='skill-item'>" +
                        "<div class='skill-top'>" +
                            "<span>" + toSafeText(skillGroups[i].skills[j].name) + "</span>" +
                            "<span>" + toSafeText(skillGroups[i].skills[j].percent) + "%</span>" +
                        "</div>" +
                        "<div class='bar'>" +
                            "<div class='bar-fill' data-percent='" + toSafeText(skillGroups[i].skills[j].percent) + "'></div>" +
                        "</div>" +
                    "</div>";
        }

        html += "</div>";
    }

    gridBox.innerHTML = html;
}


/* =========================================================
   8) PROJECT FILTER BUTTONS
   Collects every category used in the projects array, with no repeats.
   ========================================================= */
function makeFilters(rowBox) {
    var categories = ["All"];
    var alreadyAdded;
    var html = "";
    var i;
    var j;

    for (i = 0; i < projects.length; i++) {
        alreadyAdded = false;

        for (j = 0; j < categories.length; j++) {
            if (categories[j] === projects[i].category) {
                alreadyAdded = true;
            }
        }

        if (alreadyAdded === false) {
            categories[categories.length] = projects[i].category;
        }
    }

    /* The category is kept on the button itself, in a data attribute, so the
       click handler below can read it back without any code inside the HTML */
    for (i = 0; i < categories.length; i++) {
        if (i === 0) {
            html += "<button type='button' class='filter-btn active' aria-pressed='true' data-category='" +
                    toSafeText(categories[i]) + "'>" + toSafeText(categories[i]) + "</button>";
        } else {
            html += "<button type='button' class='filter-btn' aria-pressed='false' data-category='" +
                    toSafeText(categories[i]) + "'>" + toSafeText(categories[i]) + "</button>";
        }
    }

    rowBox.innerHTML = html;

    /* Give each freshly built button its click handler */
    var buttons = rowBox.children;
    for (i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function () {
            filterProjects(this.getAttribute("data-category"), this);
        };
    }
}


/* =========================================================
   9) PROJECT CARDS
   Pass "All" as the category to show every project.
   ========================================================= */
function makeProjects(gridBox, category) {
    var html = "";
    var shownCount = 0;
    var i;
    var j;

    for (i = 0; i < projects.length; i++) {

        /* Show everything for "All", otherwise only the matching category */
        if (category === "All" || projects[i].category === category) {

            shownCount = shownCount + 1;

            html += "<article class='project-card'>";

            if (projects[i].featured === true) {
                html += "<span class='star'>Featured</span>";
            }

            html += "<div class='project-top' aria-hidden='true'>" + toSafeText(projects[i].icon) + "</div>";
            html += "<div class='project-body'>";
            html += "<span class='project-cat'>" + toSafeText(projects[i].category) + "</span>";
            html += "<h3>" + toSafeText(projects[i].title) + "</h3>";
            html += "<p>" + toSafeText(projects[i].description) + "</p>";

            /* Inner loop prints one small tag for every technology used */
            html += "<div class='tech-row'>";
            for (j = 0; j < projects[i].tech.length; j++) {
                html += "<span class='tech-tag'>" + toSafeText(projects[i].tech[j]) + "</span>";
            }
            html += "</div>";

            /* The link label names the project, so it still makes sense on its own */
            html += "<div class='project-links'>" +
                        "<a href='" + toSafeText(projects[i].demo) + "' target='_blank' rel='noopener noreferrer'" +
                        " aria-label='Live demo of " + toSafeText(projects[i].title) + "'>Live Demo</a>" +
                        "<a href='" + toSafeText(projects[i].code) + "' target='_blank' rel='noopener noreferrer'" +
                        " aria-label='Source code of " + toSafeText(projects[i].title) + "'>Source Code</a>" +
                    "</div>";

            html += "</div></article>";
        }
    }

    if (shownCount === 0) {
        html = "<p class='empty-note'>There are no projects in this category yet.</p>";
    }

    gridBox.innerHTML = html;
}

/* Runs when a filter button is clicked. Highlights that button, redraws the grid. */
function filterProjects(category, clickedButton) {
    var buttons = filterRowBox.children;
    var i;

    for (i = 0; i < buttons.length; i++) {
        buttons[i].className = "filter-btn";
        buttons[i].setAttribute("aria-pressed", "false");
    }

    clickedButton.className = "filter-btn active";
    clickedButton.setAttribute("aria-pressed", "true");

    makeProjects(projectsGridBox, category);
}


/* =========================================================
   10) EDUCATION AND EXPERIENCE TIMELINE
   ========================================================= */
function makeTimeline(lineBox) {
    var html = "";
    var side;
    var i;

    for (i = 0; i < timeline.length; i++) {

        /* Even entries sit left of the line, odd entries sit right of it.
           On a phone the stylesheet moves them all to one side. */
        if (i % 2 === 0) {
            side = "tl-item";
        } else {
            side = "tl-item right";
        }

        html += "<div class='" + side + "'>" +
                    "<span class='tl-dot' aria-hidden='true'></span>" +
                    "<div class='tl-card'>" +
                        "<span class='tl-year'>" + toSafeText(timeline[i].year) + "</span>" +
                        "<h3>" + toSafeText(timeline[i].title) + "</h3>" +
                        "<div class='tl-place'>" + toSafeText(timeline[i].place) + "</div>" +
                        "<p>" + toSafeText(timeline[i].detail) + "</p>" +
                    "</div>" +
                "</div>";
    }

    lineBox.innerHTML = html;
}


/* =========================================================
   11) CERTIFICATE CARDS
   ========================================================= */
function makeCertificates(gridBox) {
    var html = "";
    var i;

    for (i = 0; i < certificates.length; i++) {
        html += "<a class='cert-card' href='" + toSafeText(certificates[i].link) + "' target='_blank' rel='noopener noreferrer'>" +
                    "<span class='cert-year'>" + toSafeText(certificates[i].year) + "</span>" +
                    "<h4>" + toSafeText(certificates[i].title) + "</h4>" +
                    "<p>" + toSafeText(certificates[i].issuer) + "</p>" +
                "</a>";
    }

    gridBox.innerHTML = html;
}


/* =========================================================
   12) SERVICE CARDS
   ========================================================= */
function makeServices(gridBox) {
    var html = "";
    var i;

    for (i = 0; i < services.length; i++) {
        html += "<div class='service-card'>" +
                    "<div class='service-num' aria-hidden='true'>" + toSafeText(services[i].icon) + "</div>" +
                    "<h3>" + toSafeText(services[i].title) + "</h3>" +
                    "<p>" + toSafeText(services[i].detail) + "</p>" +
                "</div>";
    }

    gridBox.innerHTML = html;
}


/* =========================================================
   13) TESTIMONIAL CARDS
   ========================================================= */
function makeTestimonials(gridBox) {
    var html = "";
    var firstLetter;
    var i;

    for (i = 0; i < testimonials.length; i++) {

        /* The round avatar shows the first letter of the person's name */
        firstLetter = toSafeText(testimonials[i].name.charAt(0));

        html += "<figure class='testi-card'>" +
                    "<div class='quote' aria-hidden='true'>&ldquo;</div>" +
                    "<blockquote><p>" + toSafeText(testimonials[i].message) + "</p></blockquote>" +
                    "<figcaption class='testi-person'>" +
                        "<div class='avatar' aria-hidden='true'>" + firstLetter + "</div>" +
                        "<div>" +
                            "<h4>" + toSafeText(testimonials[i].name) + "</h4>" +
                            "<span>" + toSafeText(testimonials[i].role) + "</span>" +
                        "</div>" +
                    "</figcaption>" +
                "</figure>";
    }

    gridBox.innerHTML = html;
}


/* =========================================================
   14) CONTACT CARDS, NOTE AND EMAIL BUTTON

   There is no message form on purpose. A form needs a server behind it to
   deliver anything, and this template is meant to run from plain files, so
   the cards link straight to the real email address and phone number.
   ========================================================= */
function makeContact(cardsBox, noteBox, mailButton) {
    var html = "";
    var i;

    for (i = 0; i < contactInfo.length; i++) {
        html += "<li><a class='contact-card' href='" + toSafeText(contactInfo[i].link) + "'>" +
                    "<span class='contact-icon' aria-hidden='true'>" + toSafeText(contactInfo[i].icon) + "</span>" +
                    "<span>" +
                        "<small>" + toSafeText(contactInfo[i].label) + "</small>" +
                        "<strong>" + toSafeText(contactInfo[i].value) + "</strong>" +
                    "</span>" +
                "</a></li>";
    }

    cardsBox.innerHTML = html;

    /* The line and the button underneath, which open the visitor's email app */
    noteBox.innerHTML = toSafeText(contactNote.text);
    mailButton.innerHTML = toSafeText(contactNote.buttonText);
    mailButton.setAttribute("href", "mailto:" + profile.email);
}


/* =========================================================
   15) FOOTER
   Four columns, all filled from the same arrays used higher up the page,
   so the footer can never drift out of sync with the rest of the site.
   ========================================================= */
function makeFooterTop(headingBox, subBox, buttonBox, aboutBox) {
    headingBox.innerHTML = toSafeText(footerInfo.ctaText);
    subBox.innerHTML = toSafeText(footerInfo.ctaSub);
    buttonBox.innerHTML = toSafeText(footerInfo.ctaButton);
    aboutBox.innerHTML = toSafeText(footerInfo.about);
}

function makeFooterColumns(linksHeading, linksBox, servicesHeading, servicesBox, contactHeading, contactBox) {
    var html = "";
    var i;

    /* Column 2: the same page links used in the navigation bar */
    linksHeading.innerHTML = toSafeText(footerInfo.linksHeading);

    for (i = 0; i < navLinks.length; i++) {
        html += "<li><a href='" + toSafeText(navLinks[i].link) + "'>" + toSafeText(navLinks[i].title) + "</a></li>";
    }
    linksBox.innerHTML = html;

    /* Column 3: the service names, taken from the services array */
    servicesHeading.innerHTML = toSafeText(footerInfo.servicesHeading);

    html = "";
    for (i = 0; i < services.length; i++) {
        html += "<li><a href='#services'>" + toSafeText(services[i].title) + "</a></li>";
    }
    servicesBox.innerHTML = html;

    /* Column 4: contact details */
    contactHeading.innerHTML = toSafeText(footerInfo.contactHeading);

    html = "";
    for (i = 0; i < contactInfo.length; i++) {
        html += "<li>" +
                    "<span class='footer-label'>" + toSafeText(contactInfo[i].label) + "</span>" +
                    "<a href='" + toSafeText(contactInfo[i].link) + "'>" + toSafeText(contactInfo[i].value) + "</a>" +
                "</li>";
    }
    contactBox.innerHTML = html;
}

function makeFooterBottom(copyBox, builtBox) {

    /* The year is read from the clock, so the footer never shows a stale year */
    var year = new Date().getFullYear();

    copyBox.innerHTML = "&copy; " + year + " " + toSafeText(footerInfo.owner) + ". " + toSafeText(footerInfo.rights);
    builtBox.innerHTML = toSafeText(footerInfo.builtWith);
}


/* =========================================================
   16) TYPING EFFECT IN THE HERO
   Types a role letter by letter, holds it, deletes it, then moves on
   to the next one in profile.typingRoles.
   ========================================================= */
var roleIndex = 0;        // which role from the array is on screen
var letterCount = 0;      // how many of its letters are visible
var isDeleting = false;   // true while the word is being erased

function typingEffect(textBox) {
    var currentRole = profile.typingRoles[roleIndex];
    var speed = 90;

    if (isDeleting === false) {

        /* Typing forward, one letter at a time */
        letterCount = letterCount + 1;
        textBox.innerHTML = toSafeText(currentRole.substring(0, letterCount));

        /* The word is complete, so hold it on screen for a moment */
        if (letterCount === currentRole.length) {
            isDeleting = true;
            speed = 1400;
        }

    } else {

        /* Erasing, which reads better a little faster than typing */
        letterCount = letterCount - 1;
        textBox.innerHTML = toSafeText(currentRole.substring(0, letterCount));
        speed = 45;

        /* The word is gone, so move on to the next role and start again */
        if (letterCount === 0) {
            isDeleting = false;
            roleIndex = roleIndex + 1;

            if (roleIndex === profile.typingRoles.length) {
                roleIndex = 0;
            }
            speed = 350;
        }
    }

    setTimeout(function () {
        typingEffect(textBox);
    }, speed);
}


/* =========================================================
   17) EVERYTHING THAT REACTS TO SCROLLING
   ========================================================= */
var skillBarsDone = false;   // the bars should only fill once
var countersDone = false;    // the numbers should only count once

function onScroll() {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;

    /* Solid background on the navigation bar once the page has moved */
    if (scrolled > 30) {
        navbarBox.className = "navbar stuck";
    } else {
        navbarBox.className = "navbar";
    }

    /* Thin progress line across the top of the window */
    var scrollableHeight = document.body.scrollHeight - window.innerHeight;
    var percent = 0;
    if (scrollableHeight > 0) {
        percent = (scrolled / scrollableHeight) * 100;
    }
    scrollBarBox.style.width = percent + "%";

    /* The back to top button appears after the first screen */
    if (scrolled > 400) {
        topButton.className = "top-btn show";
    } else {
        topButton.className = "top-btn";
    }

    revealOnScroll();
    highlightActiveLink(navMenuBox);

    /* Fill the skill bars the first time the skills section comes into view */
    if (skillBarsDone === false && isSectionVisible("skills") === true) {
        fillSkillBars();
        skillBarsDone = true;
    }

    /* Start the counters the first time the about section comes into view */
    if (countersDone === false && isSectionVisible("about") === true) {
        runCounters();
        countersDone = true;
    }
}

/* True when the given section is inside the visible part of the window */
function isSectionVisible(id) {
    var box = document.getElementById(id).getBoundingClientRect();

    if (box.top < window.innerHeight - 120 && box.bottom > 0) {
        return true;
    }
    return false;
}

/* Fades in every element that carries the reveal class */
function revealOnScroll() {
    var boxes = document.getElementsByClassName("reveal");
    var position;
    var i;

    for (i = 0; i < boxes.length; i++) {
        position = boxes[i].getBoundingClientRect();

        if (position.top < window.innerHeight - 70) {
            boxes[i].classList.add("show");
        }
    }
}

/* Marks the menu link of whichever section is on screen right now */
function highlightActiveLink(menuBox) {
    var links = menuBox.getElementsByTagName("a");
    var currentLink = "";
    var sectionId;
    var box;
    var i;

    for (i = 0; i < navLinks.length; i++) {
        sectionId = navLinks[i].link.replace("#", "");
        box = document.getElementById(sectionId).getBoundingClientRect();

        if (box.top <= 140 && box.bottom > 140) {
            currentLink = navLinks[i].link;
        }
    }

    for (i = 0; i < links.length; i++) {
        if (links[i].getAttribute("href") === currentLink) {
            links[i].className = "active";
            links[i].setAttribute("aria-current", "true");
        } else {
            links[i].className = "";
            links[i].removeAttribute("aria-current");
        }
    }
}

/* Grows every bar to the width that makeSkills stored on it */
function fillSkillBars() {
    var bars = document.getElementsByClassName("bar-fill");
    var i;

    for (i = 0; i < bars.length; i++) {
        bars[i].style.width = bars[i].getAttribute("data-percent") + "%";
    }
}

/* Starts the counting animation on every stat card */
function runCounters() {
    var numbers = document.getElementsByClassName("stat-num");
    var i;

    for (i = 0; i < numbers.length; i++) {
        countUp(numbers[i]);
    }
}

/* Counts one element from zero up to its target value */
function countUp(box) {
    var target = parseInt(box.getAttribute("data-target"), 10);
    var suffix = box.getAttribute("data-suffix");
    var current = 0;
    var step = target / 45;

    var timer = setInterval(function () {
        current = current + step;

        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        box.innerHTML = Math.floor(current) + suffix;
    }, 25);
}


/* =========================================================
   18) DARK AND LIGHT THEME SWITCH
   The choice is saved in localStorage, so the site opens in the same
   theme the next time the visitor comes back.
   ========================================================= */
function setupTheme(button) {

    /* The small script in the head of index.html has already chosen the theme
       and put it on the html element. This only has to read it back, so the
       switch starts in the matching position. */
    var saved = "light";
    if (document.documentElement.className === "dark") {
        saved = "dark";
    }

    applyTheme(saved, button);

    /* Clicking the switch flips to the other theme and remembers the choice */
    button.onclick = function () {
        if (document.documentElement.className === "dark") {
            applyTheme("light", button);
            localStorage.setItem("portfolioTheme", "light");
        } else {
            applyTheme("dark", button);
            localStorage.setItem("portfolioTheme", "dark");
        }
    };
}

/* Puts the theme on the page and keeps the switch readable for screen readers */
function applyTheme(theme, button) {
    if (theme === "dark") {
        document.documentElement.className = "dark";
        button.className = "theme-switch on";
        button.setAttribute("aria-checked", "true");
    } else {
        document.documentElement.className = "";
        button.className = "theme-switch";
        button.setAttribute("aria-checked", "false");
    }
}


/* =========================================================
   19) MOBILE MENU
   ========================================================= */
function setupMenu(button, menuBox) {

    button.onclick = function () {
        if (menuBox.className === "nav-menu open") {
            closeMenu(button, menuBox);
        } else {
            menuBox.className = "nav-menu open";
            button.className = "menu-btn open";
            button.setAttribute("aria-expanded", "true");
            button.setAttribute("aria-label", "Close the menu");
        }
    };

    /* Close the panel again as soon as a link inside it is tapped */
    var links = menuBox.getElementsByTagName("a");
    var i;

    for (i = 0; i < links.length; i++) {
        links[i].onclick = function () {
            closeMenu(button, menuBox);
        };
    }

    /* The Escape key closes it too, which keyboard users expect */
    document.onkeydown = function (e) {
        if (e.key === "Escape") {
            closeMenu(button, menuBox);
        }
    };
}

function closeMenu(button, menuBox) {
    menuBox.className = "nav-menu";
    button.className = "menu-btn";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Open the menu");
}


/* =========================================================
   20) BACK TO TOP BUTTON
   ========================================================= */
function setupTopButton(button) {
    button.onclick = function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
}


/* =========================================================
   21) LOADING SCREEN
   ========================================================= */
function hideLoader(box) {
    box.className = "loader hide";
    onScroll();
}


/* =========================================================
   22) START EVERYTHING
   Each function is handed the element variables it needs.
   ========================================================= */
function startWebsite() {

    /* Head of the document */
    makePageInfo(faviconTag, metaDescTag, ogTitleTag, ogDescTag, loaderTextBox);

    /* Draw every section of the page */
    makeNavbar(navMenuBox, navLogoBox, footerLogoBox);
    makeHeroText(heroBadgeBox, heroNameBox, heroTaglineBox, resumeLink);
    makeHeroPhoto(photoBox, chipOneBox, chipTwoBox);
    makeSocialLinks(socialRowBox, footerSocialBox);
    makeAbout(aboutTextBox, aboutFactsBox, statsGridBox);
    makeSkills(skillsGridBox);
    makeFilters(filterRowBox);
    makeProjects(projectsGridBox, "All");
    makeTimeline(timelineBox);
    makeCertificates(certGridBox);
    makeServices(servicesGridBox);
    makeTestimonials(testiGridBox);
    makeContact(contactCardsBox, contactNoteTextBox, contactMailButton);
    makeFooterTop(footerCtaTextBox, footerCtaSubBox, footerCtaButton, footerAboutBox);
    makeFooterColumns(footerLinksHeadingBox, footerLinksBox,
                      footerServicesHeadingBox, footerServicesBox,
                      footerContactHeadingBox, footerContactBox);
    makeFooterBottom(footerCopyBox, footerBuiltBox);

    /* Switch on the interactive parts */
    setupTheme(themeButton);
    setupMenu(menuButton, navMenuBox);
    setupTopButton(topButton);
    typingEffect(typingBox);

    window.onscroll = onScroll;
    onScroll();
}

/* This file sits at the end of the body, so the HTML above is ready by now */
startWebsite();

/* Hide the loading screen once the styles and images have finished loading.
   The timer is a safety net in case a slow image never reports back. */
window.onload = function () {
    setTimeout(function () {
        hideLoader(loaderBox);
    }, 500);
};

setTimeout(function () {
    hideLoader(loaderBox);
}, 4000);
