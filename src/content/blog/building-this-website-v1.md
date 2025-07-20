---
title: "A Reflection on Building This Website"
date: 2025-07-20
description: "A reflection on how I built this site"
---

# Tech Stack

I built this website using **React**, **Next.js**, and **Tailwind CSS**. One of the main reasons I created it was to learn how to use these tools—and to be completely honest, I've only scratched the surface of what's possible with them.

This was my first time using React, and I really enjoyed it. Since then, I've made two other projects with React, and I definitely see myself continuing to use it in the future.

**Tailwind** was a game-changer for me. I'm absolutely terrible at design and making things look nice—but thankfully, Tailwind made it much easier to create a clean UI. I also got a lot of visual help from everyone's favorite assistant: AI. There's still a lot I want to improve on this site, but for now, it's in a solid, workable state.

---

# Building Motivation

The main reason I built this is because I'm a computer science student, and everyone says you need a portfolio site. I could've used a premade template or gone with a site builder like Wix or WordPress, but I wanted to create something unique and personal.

I know it's not the best portfolio site—but it's mine. I made it and spent countless hours screaming at the TypeScript linter. Through this process, I've learned the basics of React and TypeScript. I also built a (small) backend using Next.js—my only prior experience was with Express.js.

I don't think this site is going to be widely used or visited, but that's okay. I want to use it as a second brain—a place to dump information about topics I've researched.

---

# Failures

I'm not sure if I should label this a failure, but I had an ambitious idea for the project section on the home page. My idea was to use **Three.js** to display a 3D laptop that animated on scroll. I got it to a point where the animation looked good (though definitely not efficient), and I even managed to render an iframe inside the laptop screen.

Unfortunately, the rendering was just too heavy. The iframe lagged so much that it ruined the experience. My current plan is to create a video version of the animation and use that instead of dynamically rendering it.

---

# Features I Want to Add

## Books

One feature I'd love to implement is a **book section or review page**, where I can track the books I've read and showcase them here. I'm still deciding whether I should hardcode this data, read it from a local file (like this blog system does), or maybe even build my own API endpoint.

I currently use a **Calibre** library to track my reading, so it might be possible to build something that interacts with that.

## Films

Another idea is to add **Trakt integration**. I'd like to have a little "show-off" card displaying stats like how many films and TV episodes I've watched, and maybe even feature a list of my favorites.

## Better Projects Page

I’d really like to improve the projects page. Right now, it pulls the README from the GitHub repo and displays it in a markdown reader. While that works, I think it would be better to pull a dedicated file made specifically for the portfolio.

The downside is that I'd need to manually maintain and update a separate file for every repo, which could make the "last updated" date inaccurate.

---

That's the current state of things—more to come soon!
