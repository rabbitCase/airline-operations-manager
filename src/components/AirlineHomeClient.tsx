"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INDIAN_AIRPORTS } from "@/lib/airports";
import { deleteAnonymousUser, signOut, useSession } from "@/lib/auth-client";

type AirportOption = {
  code: string;
  label: string;
};

type FlightResult = {
  id: number;
  flightNumber: string;
  airlineName: string;
  fromAirport: string;
  toAirport: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  basePriceINR: number;
};

function buildAirportOptions(): AirportOption[] {
  return INDIAN_AIRPORTS.map((a) => ({
    code: a.code,
    label: `${a.city} • ${a.code}`,
  }));
}

const airportOptions = buildAirportOptions();

export default function AirlineHomeClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const [passengers, setPassengers] = useState("1");
  const [isStudent, setIsStudent] = useState(false);
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromCode, setFromCode] = useState("BOM");
  const [toCode, setToCode] = useState("DEL");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [results, setResults] = useState<FlightResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const isLoggedOut = !session?.user;

  const filteredFrom = airportOptions.filter((a) =>
    a.label.toLowerCase().includes(fromQuery.toLowerCase()),
  );
  const filteredTo = airportOptions.filter((a) =>
    a.label.toLowerCase().includes(toQuery.toLowerCase()),
  );

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onRequest: async () => {
            if (session?.user.isAnonymous) {
              try {
                await deleteAnonymousUser();
              } catch (err) {
                console.error(err);
              }
            }
          },

          onSuccess: () => {
            router.refresh();
          },
        },
      });
    } catch (err) {
      console.error("Sign out flow failed", err);
    }
  };

  const handleSearch = async () => {
    if (!departureDate || !fromCode || !toCode) {
      return;
    }
    setIsSearching(true);

    try {
      const response = await fetch("/api/flights/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAirport: fromCode,
          toAirport: toCode,
          departureDate,
        }),
      });

      if (!response.ok) {
        setResults([]);
        return;
      }

      const data = await response.json();
      setResults(data);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectFlight = (flight: FlightResult) => {
    const params = new URLSearchParams({
      flightId: String(flight.id),
      passengers,
      student: String(isStudent),
      from: fromCode,
      to: toCode,
      departureDate,
      returnDate,
    });

    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#eee] text-black">
      <header className="border-b border-black/10 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="size-8 rounded-full bg-black flex items-center justify-center text-[#eee] sm:size-9">
              <svg
                viewBox="0 0 24 24"
                className="size-3.5 sm:size-4"
                aria-hidden="true"
              >
                <path
                  d="M2 11.5c0-.8.6-1.5 1.4-1.6l5.9-.7 3.3-5.4c.4-.6 1.3-.6 1.7 0l3.3 5.4 5.9.7c.8.1 1.4.8 1.4 1.6 0 .6-.3 1.1-.8 1.4l-4.8 2.8 1.4 5.4c.2.8-.4 1.6-1.2 1.7-.3 0-.7 0-1-.2L12 19l-6.9 3.6c-.7.4-1.6.1-2-.6-.1-.3-.2-.7-.1-1l1.4-5.4-4.8-2.8C2.3 12.6 2 12.1 2 11.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-wide sm:text-base">
              Airline Management
            </span>
          </div>
          <nav className="flex items-center gap-2 text-xs sm:gap-3 sm:text-sm">
            {isLoggedOut ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/sign-in")}
              >
                Sign in
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            )}
            <Button
              variant="subtle"
              size="sm"
              onClick={() => router.push("/admin/sign-in")}
            >
              Admin login
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:px-8 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <Card className="border-black/15 shadow-md h-fit lg:sticky lg:top-8">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">
                Search flights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="passengers" className="text-xs sm:text-sm">
                  Passengers
                </Label>
                <Input
                  id="passengers"
                  type="number"
                  min={1}
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="text-xs sm:text-sm"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <Label
                  htmlFor="student"
                  className="flex items-center gap-1.5 text-xs sm:text-sm"
                >
                  <span>Student travelling</span>
                  <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-[9px] font-semibold text-sky-700 sm:px-2 sm:text-[10px]">
                    5% off
                  </span>
                </Label>
                <Switch
                  id="student"
                  checked={isStudent}
                  onCheckedChange={(checked) => setIsStudent(!!checked)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">From</Label>
                <div className="space-y-1">
                  <Input
                    placeholder="Search city or code"
                    value={fromQuery}
                    onChange={(e) => setFromQuery(e.target.value)}
                    className="text-xs sm:text-sm"
                  />
                  <div className="max-h-32 overflow-y-auto rounded-md border border-black/10 bg-white text-xs sm:text-sm">
                    {filteredFrom.map((a) => (
                      <button
                        key={a.code}
                        type="button"
                        onClick={() => {
                          setFromCode(a.code);
                          setFromQuery(a.label);
                        }}
                        className={`flex w-full items-center justify-between px-2 py-1.5 text-left hover:bg-sky-50 ${
                          fromCode === a.code ? "bg-sky-50" : ""
                        }`}
                      >
                        <span>{a.label}</span>
                        <span className="text-[9px] uppercase tracking-[0.15em] text-black/50 sm:text-[10px] sm:tracking-[0.2em]">
                          origin
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">To</Label>
                <div className="space-y-1">
                  <Input
                    placeholder="Search city or code"
                    value={toQuery}
                    onChange={(e) => setToQuery(e.target.value)}
                    className="text-xs sm:text-sm"
                  />
                  <div className="max-h-32 overflow-y-auto rounded-md border border-black/10 bg-white text-xs sm:text-sm">
                    {filteredTo.map((a) => (
                      <button
                        key={a.code}
                        type="button"
                        onClick={() => {
                          setToCode(a.code);
                          setToQuery(a.label);
                        }}
                        className={`flex w-full items-center justify-between px-2 py-1.5 text-left hover:bg-sky-50 ${
                          toCode === a.code ? "bg-sky-50" : ""
                        }`}
                      >
                        <span>{a.label}</span>
                        <span className="text-[9px] uppercase tracking-[0.15em] text-black/50 sm:text-[10px] sm:tracking-[0.2em]">
                          destination
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="space-y-2">
                  <Label htmlFor="departure" className="text-xs sm:text-sm">
                    Departure
                  </Label>
                  <Input
                    id="departure"
                    type="date"
                    min="2026-02-13"
                    max="2026-02-16"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="text-xs sm:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="return" className="text-xs sm:text-sm">
                    Return
                  </Label>
                  <Input
                    id="return"
                    type="date"
                    min="2026-02-13"
                    max="2026-02-16"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="text-xs sm:text-sm"
                  />
                </div>
              </div>
              <Button
                className="w-full mt-2"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : "Search flights"}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="font-display text-xl tracking-tight sm:text-2xl lg:text-3xl">
                Available flights
              </h2>
              <span className="text-[10px] uppercase tracking-[0.2em] text-black/50 sm:text-xs sm:tracking-[0.24em]">
                {results.length === 0
                  ? "No results yet"
                  : results.length === 1
                    ? `${results.length} option`
                    : `${results.length} options`}
              </span>
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              {results.map((flight) => {
                const pricePerPassenger =
                  flight.basePriceINR + Math.round(flight.durationMinutes * 5);
                const passengerCount = Math.max(
                  1,
                  Number.isNaN(Number(passengers)) ? 1 : Number(passengers),
                );
                const baseTotal = pricePerPassenger * passengerCount;
                const discount = isStudent ? Math.round(baseTotal * 0.05) : 0;
                const total = baseTotal - discount;

                return (
                  <button
                    key={flight.id}
                    type="button"
                    onClick={() => handleSelectFlight(flight)}
                    className="group flex w-full flex-col gap-3 rounded-xl border border-black/10 bg-white px-3 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-md sm:flex-row sm:items-stretch sm:gap-3 sm:px-4"
                  >
                    <div className="flex flex-1 flex-col gap-1.5 sm:gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#7b0b0b] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#eee] sm:px-2 sm:text-[10px] sm:tracking-[0.16em]">
                          {flight.airlineName}
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.18em] text-black/50 sm:text-[10px] sm:tracking-[0.2em]">
                          {flight.flightNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:gap-3 sm:text-sm">
                        <span className="font-semibold">
                          {flight.fromAirport}
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.25em] text-black/40 sm:text-[10px] sm:tracking-[0.3em]">
                          to
                        </span>
                        <span className="font-semibold">
                          {flight.toAirport}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-black/70 sm:gap-4 sm:text-xs">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <span className="size-1 rounded-full bg-sky-400 sm:size-1.5" />
                          <span>
                            Departs{" "}
                            {new Date(flight.departureTime).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <span className="size-1 rounded-full bg-black/40 sm:size-1.5" />
                          <span>
                            Arrives{" "}
                            {new Date(flight.arrivalTime).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </span>
                        </div>
                        <div className="text-[9px] uppercase tracking-[0.2em] text-black/40 sm:ml-auto sm:text-[11px] sm:tracking-[0.22em]">
                          {Math.round(flight.durationMinutes / 60)}h{" "}
                          {flight.durationMinutes % 60}m
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end sm:justify-between">
                      <div className="flex flex-col items-start sm:items-end sm:text-right">
                        <div className="text-[10px] text-black/50 sm:text-xs">
                          from
                        </div>
                        <div className="text-base font-semibold text-black sm:text-lg">
                          ₹{total.toLocaleString("en-IN")}
                        </div>
                        {discount > 0 && (
                          <div className="text-[9px] text-sky-700 sm:text-[10px]">
                            includes ₹{discount.toLocaleString("en-IN")} student
                            savings
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-sky-500 group-hover:text-sky-600 sm:pl-2">
                        <svg
                          viewBox="0 0 24 24"
                          className="size-4 sm:size-5"
                          aria-hidden="true"
                        >
                          <path
                            d="M5 12h11.17l-4.58-4.59L13 6l7 7-7 7-1.41-1.41L16.17 13H5z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
              {results.length === 0 && (
                <div className="rounded-xl border border-dashed border-black/15 bg-white/60 px-4 py-6 text-xs text-black/60 sm:text-sm">
                  Choose your route and dates on the left, then search to see
                  flights controlled by the admin portal.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
