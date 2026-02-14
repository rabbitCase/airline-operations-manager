"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
    <div className="min-h-screen bg-[#eee] px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:gap-6 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] xl:gap-8">
        <div className="space-y-3 sm:space-y-4">
          <Card className="border-black/15 bg-white/90">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex flex-col gap-2 text-base sm:flex-row sm:items-center sm:justify-between sm:text-lg">
                <span>Traveller</span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-black/50 sm:text-xs sm:tracking-[0.2em]">
                  Guest session
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs sm:text-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-medium">{user.name ?? "John Doe"}</div>
                  <div className="text-[11px] text-black/60 sm:text-xs">
                    {user.email ?? "john.doe.demo@demo-ams.local"}
                  </div>
                </div>
                <div className="self-start rounded-full bg-black px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#eee] sm:px-3 sm:text-[10px] sm:tracking-[0.18em]">
                  Demo user
                </div>
              </div>
              <div className="pt-1 text-[11px] text-black/60 sm:text-xs">
                This account represents an anonymous user without admin
                privileges. The admin portal controls which flights and seats
                are available.
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/15 bg-white/90">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">
                Flight and seats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs sm:space-y-4 sm:text-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#7b0b0b] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#eee] sm:text-[10px] sm:tracking-[0.16em]">
                      {flight.airlineName}
                    </span>
                    <span className="text-[11px] text-black/60 sm:text-xs">
                      {flight.flightNumber}
                    </span>
                  </div>
                  <div className="mt-1.5 text-sm font-semibold sm:mt-1 sm:text-base">
                    {flight.fromAirport} to {flight.toAirport}
                  </div>
                  <div className="mt-1.5 flex flex-col gap-1 text-[11px] text-black/60 sm:mt-1 sm:flex-row sm:gap-4 sm:text-xs">
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
                <div className="flex gap-4 text-[11px] text-black/60 sm:flex-col sm:gap-0 sm:text-right sm:text-xs">
                  <div>
                    {Math.round(flight.durationMinutes / 60)}h{" "}
                    {flight.durationMinutes % 60}m
                  </div>
                  <div>
                    {passengers} {passengers == 1 ? "passenger" : "passengers"}
                  </div>
                  {isStudent && <div>Student discount applied</div>}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs sm:text-sm">Seat selection</Label>
                  <span className="text-[9px] text-black/50 sm:text-[10px]">
                    {selectedSeats.length}/{passengers} selected
                  </span>
                </div>
                <div className="rounded-xl border border-dashed border-black/15 bg-[#f8fafc] p-2.5 sm:p-3">
                  <div className="grid grid-cols-6 gap-1 text-xs sm:gap-1.5">
                    {seats.map((seat) => {
                      const isTaken = seat.isBlocked || !!seat.bookingSeat;
                      const active = selectedSeats.includes(seat.seatNumber);
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          disabled={isTaken}
                          onClick={() => handleToggleSeat(seat.seatNumber)}
                          className={`flex h-8 items-center justify-center rounded-md border text-[10px] transition sm:h-7 sm:text-[11px] ${
                            active
                              ? "border-sky-600 bg-sky-500 text-white"
                              : isTaken
                                ? "border-black/5 bg-black/5 text-black/20 cursor-not-allowed"
                                : "border-black/10 bg-white hover:border-sky-400 hover:bg-sky-50"
                          }`}
                        >
                          {seat.seatNumber}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 text-[9px] text-black/60 sm:text-[10px]">
                    Seats that are greyed out are blocked or already booked.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Meal preference</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={meal === "veg" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMeal("veg")}
                      className="flex-1 text-xs sm:flex-none sm:text-sm"
                    >
                      Veg
                    </Button>
                    <Button
                      type="button"
                      variant={meal === "non-veg" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMeal("non-veg")}
                      className="flex-1 text-xs sm:flex-none sm:text-sm"
                    >
                      Non-veg
                    </Button>
                    <Button
                      type="button"
                      variant={meal === "none" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMeal("none")}
                      className="flex-1 text-xs sm:flex-none sm:text-sm"
                    >
                      None
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Extras</Label>
                  <div className="space-y-2 text-[11px] sm:text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span>Discount credits for future flights</span>
                      <Switch
                        checked={extraCredits}
                        onCheckedChange={(checked) =>
                          setExtraCredits(Boolean(checked))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
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

        <div className="space-y-3 sm:space-y-4 lg:sticky lg:top-4 lg:self-start">
          <Card className="border-black/15 bg-white/95">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">
                Fare summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs sm:space-y-3 sm:text-sm">
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
              <div className="my-2 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
              <div className="flex items-center justify-between text-sm font-semibold sm:text-base">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
              <Button
                className="mt-3 w-full sm:mt-4"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Processing..." : "Checkout"}
              </Button>
              <p className="text-[10px] text-black/60 sm:text-[11px]">
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
