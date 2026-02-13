export const INDIAN_AIRPORTS = [
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International Airport" },
  { code: "DEL", city: "Delhi", name: "Indira Gandhi International Airport" },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda International Airport" },
  { code: "MAA", city: "Chennai", name: "Chennai International Airport" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International Airport" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose International Airport" },
  { code: "GOI", city: "Goa", name: "Manohar International Airport" },
  { code: "AMD", city: "Ahmedabad", name: "Sardar Vallabhbhai Patel International Airport" },
  { code: "COK", city: "Kochi", name: "Cochin International Airport" },
  { code: "PNQ", city: "Pune", name: "Pune International Airport" },
  { code: "PAT", city: "Patna", name: "Jay Prakash Narayan Airport" },
  { code: "LKO", city: "Lucknow", name: "Chaudhary Charan Singh International Airport" },
  { code: "JAI", city: "Jaipur", name: "Jaipur International Airport" },
  { code: "TRV", city: "Thiruvananthapuram", name: "Trivandrum International Airport" },
  { code: "CCJ", city: "Kozhikode", name: "Calicut International Airport" },
] as const;

export type IndianAirportCode = (typeof INDIAN_AIRPORTS)[number]["code"];

