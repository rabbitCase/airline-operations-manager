"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import Image from "next/image";

export default function HomeClient() {
  useEffect(() => {
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
        <div className="w-full flex flex-col gap-4 px-4 pt-6 sm:flex-row sm:justify-between sm:items-center sm:px-6 sm:pt-8 md:px-8 lg:px-10 xl:px-12">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-semibold text-base tracking-wide sm:text-lg">
              Gokul Nair
            </span>
            <Link
              href="https://github.com/rabbitCase"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-6 w-6 items-center justify-center sm:h-7 sm:w-7"
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
              className="flex h-8 w-8 items-center justify-center sm:h-10 sm:w-10"
              aria-label="LinkedIn"
            >
              <Image
                src={"/linkedin-svgrepo-com.svg"}
                alt="LinkedIn"
                width={0}
                height={0}
                className="h-full w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-black/60 sm:gap-3 sm:text-xs sm:tracking-[0.2em]">
            <span>Plan</span>
            <span className="size-1 rounded-full bg-black/40" />
            <span>Book</span>
            <span className="size-1 rounded-full bg-black/40" />
            <span>Manage</span>
          </div>
        </div>

        <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-8">
          <div className="text-center space-y-4 sm:space-y-6 animate-fade-up max-w-4xl">
            <p className="text-[10px] tracking-[0.25em] uppercase text-black/60 sm:text-xs sm:tracking-[0.3em]">
              Fasten Your Seat Belts
            </p>
            <h1 className="font-display text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Airline Management System
            </h1>
            <p className="mx-auto max-w-xl text-xs text-black/70 sm:text-sm md:text-base lg:max-w-2xl">
              Explore a demo airline experience with live flight search, dynamic
              pricing, seat management, and an admin portal that orchestrates it
              all.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row sm:gap-4 sm:pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/airline">Go to project</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
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
