-- CreateTable
CREATE TABLE "airport" (
    "AirportID" INTEGER NOT NULL,
    "Name" VARCHAR(200) NOT NULL,
    "Location" VARCHAR(200) NOT NULL,
    "Terminals" INTEGER NOT NULL,

    CONSTRAINT "airport_pkey" PRIMARY KEY ("AirportID")
);

-- CreateTable
CREATE TABLE "airline" (
    "AirlineID" INTEGER NOT NULL,
    "Name" VARCHAR(200) NOT NULL,
    "Code" VARCHAR(5) NOT NULL,

    CONSTRAINT "airline_pkey" PRIMARY KEY ("AirlineID")
);

-- CreateTable
CREATE TABLE "passenger" (
    "PassengerID" INTEGER NOT NULL,
    "Name" VARCHAR(200) NOT NULL,
    "DOB" DATE NOT NULL,
    "PhoneNumber" BIGINT NOT NULL,

    CONSTRAINT "passenger_pkey" PRIMARY KEY ("PassengerID")
);

-- CreateTable
CREATE TABLE "staff" (
    "StaffID" INTEGER NOT NULL,
    "AirportID" INTEGER NOT NULL,
    "Name" VARCHAR(200) NOT NULL,
    "Password" VARCHAR(25) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("StaffID")
);

-- CreateTable
CREATE TABLE "gate" (
    "GateID" INTEGER NOT NULL,
    "AirportID" INTEGER NOT NULL,
    "Status" VARCHAR(50) NOT NULL,
    "Terminal" INTEGER NOT NULL,

    CONSTRAINT "gate_pkey" PRIMARY KEY ("GateID")
);

-- CreateTable
CREATE TABLE "baggage" (
    "PassengerID" INTEGER NOT NULL,
    "BaggageTag" VARCHAR(200) NOT NULL,
    "Weight" DOUBLE PRECISION NOT NULL,
    "DepartureAirport" VARCHAR(200) NOT NULL,
    "ArrivalAirport" VARCHAR(200) NOT NULL,

    CONSTRAINT "baggage_pkey" PRIMARY KEY ("PassengerID","BaggageTag")
);

-- CreateTable
CREATE TABLE "lostandfound" (
    "ItemID" INTEGER NOT NULL,
    "AirportID" INTEGER NOT NULL,
    "DateFound" DATE NOT NULL,
    "Description" TEXT NOT NULL,

    CONSTRAINT "lostandfound_pkey" PRIMARY KEY ("ItemID")
);

-- CreateTable
CREATE TABLE "flight" (
    "FlightID" INTEGER NOT NULL,
    "AirlineID" INTEGER NOT NULL,
    "DepartureAirportID" INTEGER NOT NULL,
    "ArrivalAirportID" INTEGER NOT NULL,
    "DepartureTime" TIMESTAMP(3) NOT NULL,
    "ArrivalTime" TIMESTAMP(3) NOT NULL,
    "Delay" INTEGER NOT NULL,

    CONSTRAINT "flight_pkey" PRIMARY KEY ("FlightID")
);

-- CreateTable
CREATE TABLE "works_for" (
    "StaffID" INTEGER NOT NULL,
    "AirportID" INTEGER NOT NULL,

    CONSTRAINT "works_for_pkey" PRIMARY KEY ("StaffID","AirportID")
);

-- CreateTable
CREATE TABLE "flight_passenger" (
    "FlightID" INTEGER NOT NULL,
    "PassengerID" INTEGER NOT NULL,

    CONSTRAINT "flight_passenger_pkey" PRIMARY KEY ("FlightID","PassengerID")
);

-- CreateTable
CREATE TABLE "airport_airline" (
    "AirportID" INTEGER NOT NULL,
    "AirlineID" INTEGER NOT NULL,

    CONSTRAINT "airport_airline_pkey" PRIMARY KEY ("AirportID","AirlineID")
);

-- CreateTable
CREATE TABLE "staff_role" (
    "StaffID" INTEGER NOT NULL,
    "Role" VARCHAR(200) NOT NULL,

    CONSTRAINT "staff_role_pkey" PRIMARY KEY ("StaffID","Role")
);

-- CreateTable
CREATE TABLE "flight_gate" (
    "FlightID" INTEGER NOT NULL,
    "GateID" INTEGER NOT NULL,

    CONSTRAINT "flight_gate_pkey" PRIMARY KEY ("FlightID","GateID")
);

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_AirportID_fkey" FOREIGN KEY ("AirportID") REFERENCES "airport"("AirportID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gate" ADD CONSTRAINT "gate_AirportID_fkey" FOREIGN KEY ("AirportID") REFERENCES "airport"("AirportID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "baggage" ADD CONSTRAINT "baggage_PassengerID_fkey" FOREIGN KEY ("PassengerID") REFERENCES "passenger"("PassengerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lostandfound" ADD CONSTRAINT "lostandfound_AirportID_fkey" FOREIGN KEY ("AirportID") REFERENCES "airport"("AirportID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "flight_AirlineID_fkey" FOREIGN KEY ("AirlineID") REFERENCES "airline"("AirlineID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "flight_DepartureAirportID_fkey" FOREIGN KEY ("DepartureAirportID") REFERENCES "airport"("AirportID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "flight_ArrivalAirportID_fkey" FOREIGN KEY ("ArrivalAirportID") REFERENCES "airport"("AirportID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "works_for" ADD CONSTRAINT "works_for_StaffID_fkey" FOREIGN KEY ("StaffID") REFERENCES "staff"("StaffID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "works_for" ADD CONSTRAINT "works_for_AirportID_fkey" FOREIGN KEY ("AirportID") REFERENCES "airport"("AirportID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_passenger" ADD CONSTRAINT "flight_passenger_FlightID_fkey" FOREIGN KEY ("FlightID") REFERENCES "flight"("FlightID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_passenger" ADD CONSTRAINT "flight_passenger_PassengerID_fkey" FOREIGN KEY ("PassengerID") REFERENCES "passenger"("PassengerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airport_airline" ADD CONSTRAINT "airport_airline_AirportID_fkey" FOREIGN KEY ("AirportID") REFERENCES "airport"("AirportID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airport_airline" ADD CONSTRAINT "airport_airline_AirlineID_fkey" FOREIGN KEY ("AirlineID") REFERENCES "airline"("AirlineID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_role" ADD CONSTRAINT "staff_role_StaffID_fkey" FOREIGN KEY ("StaffID") REFERENCES "staff"("StaffID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_gate" ADD CONSTRAINT "flight_gate_FlightID_fkey" FOREIGN KEY ("FlightID") REFERENCES "flight"("FlightID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_gate" ADD CONSTRAINT "flight_gate_GateID_fkey" FOREIGN KEY ("GateID") REFERENCES "gate"("GateID") ON DELETE RESTRICT ON UPDATE CASCADE;
