"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type Seat = {
  id: number;
  seatNumber: string;
  isBlocked: boolean;
  bookingSeat: { bookingId: number } | null;
};

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
};

type UserSession = {
  id: string;
  email?: string | null;
  name?: string | null;
};

type Props = {
  user: UserSession;
  flight: Flight;
  seats: Seat[];
  searchParams: {
    passengers?: string;
    student?: string;
    from?: string;
    to?: string;
    departureDate?: string;
    returnDate?: string;
  };
};

export default function CheckoutClient({
  user,
  flight,
  seats,
  searchParams,
}: Props) {
  const initialPassengers = useMemo(() => {
    const value = Number(searchParams.passengers ?? "1");
    if (Number.isNaN(value) || value < 1) {
      return 1;
    }
    return value;
  }, [searchParams.passengers]);

  const initialStudent =
    (searchParams.student ?? "false").toLowerCase() === "true";

  const [passengers] = useState(initialPassengers);
  const [isStudent] = useState(initialStudent);
  const [meal, setMeal] = useState<"veg" | "non-veg" | "none">("veg");
  const [extraCredits, setExtraCredits] = useState(true);
  const [extraBaggage, setExtraBaggage] = useState(isStudent);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const availableSeats = seats.filter(
    (seat) => !seat.isBlocked && !seat.bookingSeat,
  );

  const basePerPassenger =
    flight.basePriceINR + Math.round(flight.durationMinutes * 5);
  const baseFare = basePerPassenger * passengers;
  const studentDiscount = isStudent ? Math.round(baseFare * 0.05) : 0;
  const serviceFee = 300;
  const tax = Math.round((baseFare - studentDiscount) * 0.12);
  const extraBaggageFee = extraBaggage ? 450 : 0;
  const total = baseFare - studentDiscount + tax + serviceFee + extraBaggageFee;

  const handleToggleSeat = (seatNumber: string) => {
    const exists = selectedSeats.includes(seatNumber);
    if (exists) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
      return;
    }
    if (selectedSeats.length >= passengers) {
      return;
    }
    setSelectedSeats([...selectedSeats, seatNumber]);
  };

  const handleCheckout = async () => {
    if (selectedSeats.length !== passengers) {
      toast.error("Select seats for all passengers");
      return;
    }

    setIsCheckingOut(true);
    try {
      toast.success("Demo checkout completed");
      // const response = await fetch("/api/bookings", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     flightId: flight.id,
      //     passengersCount: passengers,
      //     isStudent,
      //     mealPreference: meal,
      //     discountCredits: extraCredits ? 1 : 0,
      //     extraBaggageKg: extraBaggage ? 10 : 0,
      //     seatNumbers: selectedSeats,
      //   }),
      // });

      // if (response.ok) {
      //   toast.success("Demo checkout completed");
      // } else {
      //   toast.error("Something went wrong during checkout");
      // }
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eee] px-4 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        <div className="space-y-4">
          <Card className="border-black/15 bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span>Traveller</span>
                <span className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Guest session
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{user.name ?? "John Doe"}</div>
                  <div className="text-xs text-black/60">
                    {user.email ?? "john.doe.demo@demo-ams.local"}
                  </div>
                </div>
                <div className="rounded-full bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#eee]">
                  Demo user
                </div>
              </div>
              <div className="text-xs text-black/60 pt-1">
                This account represents John Doe with role USER. Use the admin
                portal to control which flights and seats are available.
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/15 bg-white/90">
            <CardHeader>
              <CardTitle className="text-lg">Flight and seats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#7b0b0b] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#eee]">
                      {flight.airlineName}
                    </span>
                    <span className="text-xs text-black/60">
                      {flight.flightNumber}
                    </span>
                  </div>
                  <div className="mt-1 text-sm font-semibold">
                    {flight.fromAirport} to {flight.toAirport}
                  </div>
                  <div className="mt-1 text-xs text-black/60 flex gap-4">
                    <span>
                      Departs{" "}
                      {new Date(flight.departureTime).toLocaleString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                    <span>
                      Arrives{" "}
                      {new Date(flight.arrivalTime).toLocaleString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-black/60">
                  <div>
                    {Math.round(flight.durationMinutes / 60)}h{" "}
                    {flight.durationMinutes % 60}m
                  </div>
                  <div>
                    {passengers} {passengers == 1 ? "passenger" : "paddengers"}
                  </div>
                  {isStudent && <div>Student discount applied</div>}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Seat selection</Label>
                  <span className="text-[10px] text-black/50">
                    {selectedSeats.length}/{passengers} selected
                  </span>
                </div>
                <div className="rounded-xl border border-dashed border-black/15 bg-[#f8fafc] p-3">
                  <div className="grid grid-cols-6 gap-1 text-xs">
                    {availableSeats.map((seat) => {
                      const active = selectedSeats.includes(seat.seatNumber);
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          onClick={() => handleToggleSeat(seat.seatNumber)}
                          className={`flex h-7 items-center justify-center rounded-md border text-[11px] transition ${
                            active
                              ? "border-sky-600 bg-sky-500 text-white"
                              : "border-black/10 bg-white hover:border-sky-400 hover:bg-sky-50"
                          }`}
                        >
                          {seat.seatNumber}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 text-[10px] text-black/60">
                    Seats blocked or already taken are controlled from the admin
                    portal and are hidden here.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Meal preference</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={meal === "veg" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMeal("veg")}
                    >
                      Veg
                    </Button>
                    <Button
                      type="button"
                      variant={meal === "non-veg" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMeal("non-veg")}
                    >
                      Non-veg
                    </Button>
                    <Button
                      type="button"
                      variant={meal === "none" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMeal("none")}
                    >
                      None
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Extras</Label>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Discount credits for future flights</span>
                      <Switch
                        checked={extraCredits}
                        onCheckedChange={(checked) =>
                          setExtraCredits(Boolean(checked))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Additional 10kg baggage</span>
                      <Switch
                        checked={extraBaggage}
                        onCheckedChange={(checked) =>
                          setExtraBaggage(Boolean(checked))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-black/15 bg-white/95">
            <CardHeader>
              <CardTitle className="text-lg">Fare summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Base fare</span>
                <span>₹{baseFare.toLocaleString("en-IN")}</span>
              </div>
              {studentDiscount > 0 && (
                <div className="flex items-center justify-between text-sky-700">
                  <span>Student discount (5%)</span>
                  <span>-₹{studentDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Service fee</span>
                <span>₹{serviceFee.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Taxes</span>
                <span>₹{tax.toLocaleString("en-IN")}</span>
              </div>
              {extraBaggageFee > 0 && (
                <div className="flex items-center justify-between">
                  <span>Extra baggage</span>
                  <span>₹{extraBaggageFee.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="h-px bg-linear-to-r from-transparent via-black/20 to-transparent my-2" />
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
              <Button
                className="w-full mt-4"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Processing..." : "Checkout"}
              </Button>
              <p className="text-[11px] text-black/60">
                Clicking checkout will not charge you. A toast will confirm that
                the demo has been completed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
