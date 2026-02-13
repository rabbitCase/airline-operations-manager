"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import Image from "next/image";

export default function HomeClient() {
  useEffect(() => {
    // Initialize particles.js
    if (typeof window !== "undefined" && (window as any).particlesJS) {
      (window as any).particlesJS("particles-js", {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 500,
            },
          },
          color: {
            value: "#000000",
          },
          shape: {
            type: "circle",
            stroke: {
              width: 0,
              color: "#000000",
            },
          },
          opacity: {
            value: 0.15,
            random: true,
            anim: {
              enable: true,
              speed: 0.5,
              opacity_min: 0.05,
              sync: false,
            },
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: 0.5,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#000000",
            opacity: 0.1,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "grab",
            },
            onclick: {
              enable: true,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 0.3,
              },
            },
            push: {
              particles_nb: 4,
            },
          },
        },
        retina_detect: true,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eee] via-[#e4f3ff] to-[#eee] text-black flex flex-col items-center relative overflow-hidden">
      <div id="particles-js" className="absolute inset-0 z-0" />
      <div className="relative z-10 w-full flex flex-col min-h-screen">
        <div className="w-full flex justify-between items-center px-10 pt-8">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg tracking-wide">
              Gokul Nair
            </span>
            <Link
              href="https://github.com/rabbitCase"
              target="_blank"
              rel="noopener noreferrer"
              className="size-7 flex items-center justify-center text-whit"
              aria-label="GitHub"
            >
              <Image
                src={"/github-svgrepo-com.svg"}
                alt="GitHub"
                width={0}
                height={0}
                className="h-full w-auto"
              />
            </Link>

            <Link
              href="https://linkedin.com/in/gokul-nair-819252285/"
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 flex items-center justify-center text-white"
              aria-label="LinkedIn"
            >
              <Image
                src={"/linkedin-svgrepo-com.svg"}
                alt="GitHub"
                width={0}
                height={0}
                className="h-full w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-black/60">
            <span>Plan</span>
            <span className="size-1 rounded-full bg-black/40" />
            <span>Book</span>
            <span className="size-1 rounded-full bg-black/40" />
            <span>Manage</span>
          </div>
        </div>

        <main className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="text-center space-y-6 animate-fade-up">
            <p className="text-xs tracking-[0.3em] uppercase text-black/60">
              Fasten Your Seat Belts
            </p>
            <h1 className="font-display text-5xl md:text-6xl tracking-tight">
              Airline Management System
            </h1>
            <p className="max-w-xl mx-auto text-sm md:text-base text-black/70">
              Explore a demo airline experience with live flight search, dynamic
              pricing, seat management, and an admin portal that orchestrates it
              all.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button asChild size="lg">
                <Link href="/airline">Go to project</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link
                  href="https://github.com/rabbitCase/airline-operations-manager"
                  target="_blank"
                >
                  View GitHub
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
