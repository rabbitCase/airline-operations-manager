"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INDIAN_AIRPORTS } from "@/lib/airports";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type Flight = {
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
  const [editing, setEditing] = useState<Partial<Flight>>({});
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
      .then((res) => res.json())
      .then((data: Seat[]) => {
        setSeats(data);
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
    <div className="min-h-screen bg-[#eee] px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl tracking-tight">
              Admin portal
            </h1>
            <p className="text-sm text-black/60">
              Control the flights, pricing, delays, gates, and seat maps that
              power the demo frontend.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              signOut();
              router.push("/admin/sign-in");
            }}
          >
            Sign out
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
          <Card className="border-black/15 bg-white/90">
            <CardHeader>
              <CardTitle className="text-sm">Flights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setSelectedFlightId(null);
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
              <div className="max-h-[420px] space-y-2 overflow-y-auto pt-1">
                {flights.map((flight) => (
                  <button
                    key={flight.id}
                    type="button"
                    onClick={() => {
                      setSelectedFlightId(flight.id);
                      setEditing(flight);
                    }}
                    className={`flex w-full flex-col rounded-lg border px-3 py-2 text-left text-xs transition ${
                      selectedFlightId === flight.id
                        ? "border-sky-500 bg-sky-50"
                        : "border-black/10 bg-white hover:border-sky-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        {flight.flightNumber}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-black/50">
                        {flight.status}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-black/70">
                      <span>{flight.fromAirport}</span>
                      <span>→</span>
                      <span>{flight.toAirport}</span>
                    </div>
                    <div className="mt-0.5 text-[10px] text-black/50">
                      ₹{flight.basePriceINR.toLocaleString("en-IN")}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`rounded-full px-3 py-1 ${
                  activeTab === "details"
                    ? "bg-black text-[#eee]"
                    : "bg-white text-black/70"
                }`}
              >
                Flight details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seats")}
                className={`rounded-full px-3 py-1 ${
                  activeTab === "seats"
                    ? "bg-black text-[#eee]"
                    : "bg-white text-black/70"
                }`}
              >
                Seat map
              </button>
            </div>
            {activeTab === "details" && (
              <Card className="border-black/15 bg-white/95">
                <CardHeader>
                  <CardTitle className="text-sm">
                    {selectedFlight ? "Edit flight" : "Create flight"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2 text-sm">
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>From airport</Label>
                    <select
                      className="h-10 w-full rounded-md border border-black/20 bg-[#f7f7f7] px-3 text-sm"
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
                      className="h-10 w-full rounded-md border border-black/20 bg-[#f7f7f7] px-3 text-sm"
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
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-between pt-2">
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        onClick={
                          selectedFlight
                            ? handleUpdateFlight
                            : handleCreateFlight
                        }
                      >
                        {selectedFlight ? "Save changes" : "Create flight"}
                      </Button>
                      {selectedFlight && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleDeleteFlight}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                    {selectedFlight && (
                      <div className="text-xs text-black/50">
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
                <CardHeader>
                  <CardTitle className="text-sm">Seat map</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  {!selectedFlight && (
                    <div className="text-black/60">
                      Select or create a flight first.
                    </div>
                  )}
                  {selectedFlight && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {selectedFlight.flightNumber}
                          </div>
                          <div className="text-[11px] text-black/60">
                            {selectedFlight.fromAirport} to{" "}
                            {selectedFlight.toAirport}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleSaveSeats}
                          disabled={isSavingSeats}
                        >
                          {isSavingSeats ? "Saving..." : "Save seat map"}
                        </Button>
                      </div>
                      <div className="mt-2 rounded-xl border border-dashed border-black/15 bg-[#f8fafc] p-3">
                        <div className="grid grid-cols-6 gap-1">
                          {seats.map((seat) => (
                            <button
                              key={seat.id}
                              type="button"
                              onClick={() => handleToggleSeat(seat)}
                              className={`flex h-7 items-center justify-center rounded-md border text-[11px] transition ${
                                seat.isBlocked
                                  ? "border-black bg-black text-[#eee]"
                                  : "border-black/10 bg-white hover:border-sky-400 hover:bg-sky-50"
                              }`}
                            >
                              {seat.seatNumber}
                            </button>
                          ))}
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-[10px] text-black/60">
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
