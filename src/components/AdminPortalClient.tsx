"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INDIAN_AIRPORTS } from "@/lib/airports";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export type Flight = {
  id: number;
  flightNumber: string;
  airlineName: string;
  airlineCode: string;
  fromAirport: string;
  toAirport: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  basePriceINR: number;
  gateNumber: string | null;
  delayMinutes: number;
  status: string;
};

type Props = {
  initialFlights: Flight[];
};

type Seat = {
  id: number;
  seatNumber: string;
  isBlocked: boolean;
};

export default function AdminPortalClient({ initialFlights }: Props) {
  const router = useRouter();
  const [flights, setFlights] = useState<Flight[]>(initialFlights);
  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(
    initialFlights[0]?.id ?? null,
  );
  const [activeTab, setActiveTab] = useState<"details" | "seats">("details");
  const [editing, setEditing] = useState<Partial<Flight>>(
    initialFlights[0] ?? {},
  );
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isSavingSeats, setIsSavingSeats] = useState(false);

  const selectedFlight = useMemo(
    () => flights.find((f) => f.id === selectedFlightId) ?? null,
    [flights, selectedFlightId],
  );

  useEffect(() => {
    if (activeTab !== "seats" || !selectedFlightId) {
      return;
    }

    fetch(`/api/admin/seats/${selectedFlightId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch seats");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setSeats(data);
        } else {
          console.error("Expected array but got:", data);
          setSeats([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setSeats([]);
      });
  }, [activeTab, selectedFlightId]);

  const handleCreateFlight = async () => {
    const payload = {
      flightNumber: editing.flightNumber,
      airlineName: editing.airlineName,
      airlineCode: editing.airlineCode,
      fromAirport: editing.fromAirport,
      toAirport: editing.toAirport,
      departureTime: editing.departureTime,
      arrivalTime: editing.arrivalTime,
      basePriceINR: editing.basePriceINR,
      gateNumber: editing.gateNumber,
      delayMinutes: editing.delayMinutes,
      status: editing.status,
    };

    const response = await fetch("/api/admin/flights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return;
    }

    const created = (await response.json()) as Flight;
    setFlights([...flights, created]);
    setSelectedFlightId(created.id);
    setEditing(created);
    setSeats([]);
  };

  const handleUpdateFlight = async () => {
    if (!selectedFlight) {
      return;
    }

    const response = await fetch(`/api/admin/flights/${selectedFlight.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editing),
    });

    if (!response.ok) {
      return;
    }

    const updated = (await response.json()) as Flight;
    setFlights(flights.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleDeleteFlight = async () => {
    if (!selectedFlight) {
      return;
    }

    const response = await fetch(`/api/admin/flights/${selectedFlight.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return;
    }

    const remaining = flights.filter((f) => f.id !== selectedFlight.id);
    setFlights(remaining);
    const next = remaining[0] ?? null;
    setSelectedFlightId(next?.id ?? null);
    setEditing(next ?? {});
    setSeats([]);
  };

  const handleToggleSeat = (seat: Seat) => {
    setSeats(
      seats.map((s) =>
        s.id === seat.id ? { ...s, isBlocked: !s.isBlocked } : s,
      ),
    );
  };

  const handleSaveSeats = async () => {
    if (!selectedFlightId) {
      return;
    }
    setIsSavingSeats(true);
    const updates = seats.map((s) => ({
      seatNumber: s.seatNumber,
      isBlocked: s.isBlocked,
    }));
    await fetch(`/api/admin/seats/${selectedFlightId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    setIsSavingSeats(false);
  };

  const airportOptions = INDIAN_AIRPORTS.map((a) => a.code);

  return (
    <div className="min-h-screen bg-[#eee] px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-xl tracking-tight sm:text-2xl lg:text-3xl">
              Admin portal
            </h1>
            <p className="mt-1 text-xs text-black/60 sm:text-sm">
              Control the flights, pricing, delays, gates, and seat maps that
              power the demo frontend.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => {
              signOut();
              router.push("/admin/sign-in");
            }}
          >
            Sign out
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <Card className="border-black/15 bg-white/90 lg:sticky lg:top-4 lg:self-start">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-sm sm:text-base">Flights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs sm:space-y-3 sm:text-sm">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setSelectedFlightId(null);
                  setSeats([]);
                  setEditing({
                    flightNumber: "",
                    airlineName: "",
                    airlineCode: "",
                    fromAirport: "BOM",
                    toAirport: "DEL",
                    basePriceINR: 5500,
                    delayMinutes: 0,
                    status: "ON_TIME",
                  });
                }}
              >
                New flight
              </Button>
              <div className="max-h-[300px] space-y-1.5 overflow-y-auto sm:max-h-[400px] lg:max-h-[500px]">
                {flights.map((flight) => (
                  <button
                    type="button"
                    key={flight.id}
                    onClick={() => {
                      setSelectedFlightId(flight.id);
                      setEditing(flight);
                      setSeats([]);
                    }}
                    className={`w-full rounded-md border p-2 text-left text-xs transition sm:p-2.5 sm:text-sm ${
                      selectedFlightId === flight.id
                        ? "border-sky-600 bg-sky-50"
                        : "border-black/10 bg-white hover:border-sky-400 hover:bg-sky-50/50"
                    }`}
                  >
                    <div className="font-medium">{flight.flightNumber}</div>
                    <div className="text-[10px] text-black/60 sm:text-xs">
                      {flight.fromAirport} to {flight.toAirport}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex gap-2 overflow-x-auto">
              <Button
                variant={activeTab === "details" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("details")}
                className="whitespace-nowrap text-xs sm:text-sm"
              >
                Flight details
              </Button>
              <Button
                variant={activeTab === "seats" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("seats")}
                className="whitespace-nowrap text-xs sm:text-sm"
              >
                Seat map
              </Button>
            </div>

            {activeTab === "details" && (
              <Card className="border-black/15 bg-white/95">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-sm sm:text-base">
                    {selectedFlight ? "Edit flight" : "Create new flight"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 sm:gap-4 sm:text-sm">
                  <div className="space-y-2">
                    <Label htmlFor="flightNumber">Flight number</Label>
                    <Input
                      id="flightNumber"
                      value={editing.flightNumber ?? ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          flightNumber: e.target.value,
                        })
                      }
                      className="text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="airlineName">Airline name</Label>
                    <Input
                      id="airlineName"
                      value={editing.airlineName ?? ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          airlineName: e.target.value,
                        })
                      }
                      className="text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="airlineCode">Airline code</Label>
                    <Input
                      id="airlineCode"
                      value={editing.airlineCode ?? ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          airlineCode: e.target.value,
                        })
                      }
                      className="text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>From airport</Label>
                    <select
                      className="h-9 w-full rounded-md border border-black/20 bg-[#f7f7f7] px-3 text-xs sm:h-10 sm:text-sm"
                      value={editing.fromAirport ?? airportOptions[0]}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          fromAirport: e.target.value,
                        })
                      }
                    >
                      {airportOptions.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>To airport</Label>
                    <select
                      className="h-9 w-full rounded-md border border-black/20 bg-[#f7f7f7] px-3 text-xs sm:h-10 sm:text-sm"
                      value={editing.toAirport ?? airportOptions[1]}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          toAirport: e.target.value,
                        })
                      }
                    >
                      {airportOptions.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departureTime">Departure time</Label>
                    <Input
                      id="departureTime"
                      type="datetime-local"
                      value={
                        editing.departureTime
                          ? editing.departureTime.slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          departureTime: e.target.value,
                        })
                      }
                      className="text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrivalTime">Arrival time</Label>
                    <Input
                      id="arrivalTime"
                      type="datetime-local"
                      value={
                        editing.arrivalTime
                          ? editing.arrivalTime.slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          arrivalTime: e.target.value,
                        })
                      }
                      className="text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="basePriceINR">Base price (INR)</Label>
                    <Input
                      id="basePriceINR"
                      type="number"
                      value={editing.basePriceINR ?? 0}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          basePriceINR: Number(e.target.value),
                        })
                      }
                      className="text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gateNumber">Gate number</Label>
                    <Input
                      id="gateNumber"
                      value={editing.gateNumber ?? ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          gateNumber: e.target.value,
                        })
                      }
                      className="text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delayMinutes">Delay (minutes)</Label>
                    <Input
                      id="delayMinutes"
                      type="number"
                      value={editing.delayMinutes ?? 0}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          delayMinutes: Number(e.target.value),
                        })
                      }
                      className="text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Input
                      value={editing.status ?? "ON_TIME"}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          status: e.target.value,
                        })
                      }
                      className="text-xs sm:text-sm"
                    />
                  </div>
                  <div className="col-span-1 flex flex-col gap-3 pt-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-2 sm:flex-row sm:space-x-2">
                      <Button
                        size="sm"
                        onClick={
                          selectedFlight
                            ? handleUpdateFlight
                            : handleCreateFlight
                        }
                        className="w-full sm:w-auto"
                      >
                        {selectedFlight ? "Save changes" : "Create flight"}
                      </Button>
                      {selectedFlight && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleDeleteFlight}
                          className="w-full sm:w-auto"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                    {selectedFlight && (
                      <div className="text-[10px] text-black/50 sm:text-xs">
                        Duration:{" "}
                        {Math.round((selectedFlight.durationMinutes ?? 0) / 60)}
                        h {selectedFlight.durationMinutes % 60}m
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "seats" && (
              <Card className="border-black/15 bg-white/95">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-sm sm:text-base">
                    Seat map
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs sm:text-sm">
                  {!selectedFlight && (
                    <div className="text-black/60">
                      Select or create a flight first.
                    </div>
                  )}
                  {selectedFlight && (
                    <>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="font-medium text-sm sm:text-base">
                            {selectedFlight.flightNumber}
                          </div>
                          <div className="text-[10px] text-black/60 sm:text-xs">
                            {selectedFlight.fromAirport} to{" "}
                            {selectedFlight.toAirport}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleSaveSeats}
                          disabled={isSavingSeats}
                          className="w-full sm:w-auto"
                        >
                          {isSavingSeats ? "Saving..." : "Save seat map"}
                        </Button>
                      </div>
                      <div className="mt-2 rounded-xl border border-dashed border-black/15 bg-[#f8fafc] p-2.5 sm:p-3">
                        <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
                          {seats.map((seat) => (
                            <button
                              key={seat.id}
                              type="button"
                              onClick={() => handleToggleSeat(seat)}
                              className={`flex h-8 items-center justify-center rounded-md border text-[10px] transition sm:h-7 sm:text-[11px] ${
                                seat.isBlocked
                                  ? "border-black bg-black text-[#eee]"
                                  : "border-black/10 bg-white hover:border-sky-400 hover:bg-sky-50"
                              }`}
                            >
                              {seat.seatNumber}
                            </button>
                          ))}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[9px] text-black/60 sm:gap-3 sm:text-[10px]">
                          <span className="flex items-center gap-1">
                            <span className="inline-block size-3 rounded-sm border border-black/20 bg-white" />
                            <span>Available</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="inline-block size-3 rounded-sm bg-black" />
                            <span>Blocked</span>
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
