"use client";

import React, { useEffect, useRef } from 'react';

const TypewriterEffect = () => {
    const typewriterRef = useRef(null); // Reference to the typewriter element

    useEffect(() => {
        // To hold the timeout reference for cleanup
        let timeoutId: NodeJS.Timeout | null = null;

        class TxtType {
            el: HTMLElement;
            toRotate: string[];
            loopNum: number;
            period: number;
            txt: string;
            isDeleting: boolean;
            constructor(el: HTMLElement, toRotate: string[], period: number) {
                this.toRotate = toRotate;
                this.el = el;
                this.loopNum = 0;
                this.period = period || 2000;
                this.txt = '';
                this.isDeleting = false;
                this.tick();
            }

            tick = () => {
                const i = this.loopNum % this.toRotate.length;
                const fullTxt = this.toRotate[i];

                if (this.isDeleting) {
                    this.txt = fullTxt.substring(0, this.txt.length - 1);
                } else {
                    this.txt = fullTxt.substring(0, this.txt.length + 1);
                }

                this.el.innerHTML = `<span class="wrap">${this.txt}</span>`;

                let delta = 200 - Math.random() * 100;

                if (this.isDeleting) { delta /= 2; }

                if (!this.isDeleting && this.txt === fullTxt) {
                    delta = this.period;
                    this.isDeleting = true;
                } else if (this.isDeleting && this.txt === '') {
                    this.isDeleting = false;
                    this.loopNum++;
                    delta = 500;
                }

                // Save the timeoutId to be cleared later
                timeoutId = setTimeout(this.tick, delta);
            };
        }

        if (typewriterRef.current) {
            // Initialize the typewriter effect on component mount
            const element = typewriterRef.current;
            const toRotate = ["Software Engineer", "Computer Science Student", "Problem Solver", "Tech Enthusiast"];
            const period = 2000;
            new TxtType(element, toRotate, period);
        }

        // Cleanup function to clear the timeout when the component unmounts
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []); // Empty array ensures the effect only runs once on mount

    return (
        <span
            ref={typewriterRef}
            className="typewrite italic"
            data-type='["Software Engineer", "Computer Science Student", "Problem Solver", "Tech Enthusiast"]'
            data-period="2000"
        ></span>
    );
};

export default TypewriterEffect;

