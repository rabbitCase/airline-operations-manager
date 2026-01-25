export interface FlightSearchResult {
    AirlineID: number;
    DepartureAirportID: number;
    ArrivalAirportID: number;
    DepartTime: string;
    ArriveTime: string;
}

export interface AuthResponse {
    message: string;
    details?: string;
}

export interface StaffNameResponse {
    message: string;
}