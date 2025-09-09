PAGES

- Home (Portfolio)
- Projects
- Blog

# Home

## Sections

- [x] Build Welcome Content
  - Hello, I'm Harry Foster
  - I am a ["Software Engineer", "Computer Science Student", "Problem Solver", "Tech Enthusiast"]

- [x] Add on load animations

## Projects

Top 3 projects (cards taken from the projects component but static selection)

for each project:

- Image
- Title
- Description
- Tags: languages/algorithms
- Link (Github)

- AttendEase
- Chess AI
- Scroll Tracker (if finished)

- [x] Added a card
- [x] Add custom images

## Languages

DECIDED NOT TO MAKE ONE

- Python
- Java
- RISC V
- JS
- CSS/Bootstrap
- C#
- C
- php
- react
- next.js
- SQL

## Professional Timeline (None so far but...)

Dynamically create a timeline svg with the connection between dots.
set an y value of the rendered size of the text  or a div next to it and overlay it?
add anitmation to draw the path on Scroll
add animation to text on scroll

Maybe instead of an svg the timeline is a vertical binary string?
Depending on the size it could be a message? ASCII in binary?

### If binary option

#### ASCII message

- "Hello, World!"

- could be cool to have a hidden message such as the users ip embedded into the binary - Need to create a util function which would convert.

####

## Contact

## Footer

Add to email newsletter call to action

# Projects

- [x] Done

Get projects from Github API add each project
Create a dynamic page for each project

## Extention

Have a lookup table in mongo db which will have a custom md file for the project
If it doesn't exist then pull the readme

Either in mongodb or in the Portfolio repo its self?
Copy the code for the blog?

# Blog

- [x] Done

Get all blog posts and create dynamic list
Obsidian backend

# Not originally planned but possible pages

## Reading List

Connect some api for the cover and book information based off the isbn
Have a small blog type infrastructure where it would store the book details such as read date and any other notes i made for it.

Top of the page has the currently reading book
For the main reading page have a list of books read for each year ordered by the date read. Starting with the current year.

## Trakt API Integration  

Currently Watching

Lifetime Stats

Last Watched

## Wayback machine for website

Commit url = <https://api.github.com/repos/HarryFoster1812/Portfolio-Website/commits>
Create a dropdown menu of the list of commits
Once selected the commit would be shown in a frame

## New 3d model plan

Instead of having a 3d model and dynamically render it instead prerender and export as videos, use a library to change the frame based on the scroll progress and instead of trying to display html content in a 3d scene use a div displayed ontop of a static image/frame
