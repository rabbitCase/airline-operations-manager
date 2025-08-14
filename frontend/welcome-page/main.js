//server code
function locationToId(location) {
	//convert location to reference id used by database
	if (location.toLowerCase() == "mumbai") {
		return 1;
	} else if (location.toLowerCase() == "delhi") {
		return 2;
	} else if (location.toLowerCase() == "bengaluru") {
		return 3;
	} else if (location.toLowerCase() == "kolkata") {
		return 4;
	} else {
		return 5;
	}
}
function idToLocation(id) {
	if (id === 1) {
		return "Mumbai";
	} else if (id === 2) {
		return "Delhi";
	} else if (id === 3) {
		return "Bengaluru";
	} else if (id === 4) {
		return "Kolkata";
	} else {
		return "Hyderabad";
	}
}
function idToAirline(id) {
	//convert airline id to airline name referenced by database
	if (id === 1) {
		return "Air India";
	} else if (id === 2) {
		return "IndiGo";
	} else if (id === 3) {
		return "SpiceJet";
	} else if (id === 4) {
		return "Vistara";
	} else {
		return "GoAir";
	}
}


const button = document.getElementById("flight-search");
const flyingfrom = document.getElementById("flying-from");
const flyingto = document.getElementById("flying-to");
const tripdate = document.getElementById("trip-date");

button.addEventListener("click", async () => {
	const depairport = locationToId(`${flyingfrom.value}`);
	const arrairport = locationToId(`${flyingto.value}`);
	const result = document.getElementById("results");
	result.innerHTML = "";
	try {
		const request = await fetch("http://localhost:3000/welcome/", {
			mode: "cors",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				type: "database search request",
				for: "available flights",
				parameter1: "flying from",
				parameter2: "flying to",
				parameter3: "date",
				flyingfrom: `${flyingfrom.value}`,
				flyingto: `${flyingto.value}`,
				tripdate: `${tripdate.value}`,
				depairport: `${depairport}`,
				arrairport: `${arrairport}`,
			}),
		});
		const response = await request.json();
		if(response.length == 0){
			alert("No flights on this date");
		}
		response.forEach((key, index) => {
			const newresult = document.createElement("div");
			newresult.className = "card";
			newresult.style.animationDelay = `${index/100}s`;
			result.appendChild(newresult); //new info card
			
			const airlineInfo = document.createElement("div");
			airlineInfo.className = "airline-info";
			newresult.appendChild(airlineInfo);

			const tripdetails = document.createElement("div"); //for airline name and dep/land location
			tripdetails.className = "left-info";
			newresult.appendChild(tripdetails); //add this div to our card

			let link= "";
			switch (idToAirline(key.AirlineID)) {
				case "Air India":
					link = "https://www.airindia.com";
					break;
				case "IndiGo":
					link = "https://www.goindigo.in";
					break;
				case "SpiceJet":
					link = "https://www.spicejet.com";
					break;
				case "Vistara":
					link = "https://www.airvistara.com";
					break;
				case "GoAir":
					link = "https://www.goair.in";
					break;
				default:
					link = "#";
					break;
			}

			const airlineName = document.createElement("div"); //for airline name
			airlineName.textContent = idToAirline(key.AirlineID);
			airlineName.style.fontWeight = "900";
			const redirect = document.createElement("div");
			redirect.style.height = "20px";
			redirect.style.width = "20px";
			redirect.style.marginLeft = "5px";
			redirect.style.marginTop = "3px";

			const airlineRedirect = document.createElement("a");
			airlineRedirect.href = `${link}`;
			airlineRedirect.target = "_blank";
			airlineRedirect.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
											<title>open-in-new</title>
											<path fill="rgba(0, 194, 61, 1)" d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
										</svg>`;
			redirect.appendChild(airlineRedirect);
			airlineInfo.appendChild(airlineName);
			airlineInfo.appendChild(redirect);

			const travelPath = document.createElement("div");
			travelPath.textContent = `${idToLocation(
				key.DepartureAirportID
			)} to ${idToLocation(key.ArrivalAirportID)}`;
			tripdetails.appendChild(travelPath);

			const flightDelay = document.createElement("div");
			flightDelay.className = "right-info";
			if(key.delay === 0){
				flightDelay.style.color = "rgba(0, 152, 23, 1)";
				flightDelay.style.fontWeight = 700;
				flightDelay.style.textDecoration = "underline";
				flightDelay.textContent = "On Time";
			}
			else{
				flightDelay.style.color = "rgba(156, 42, 0, 1)";
				flightDelay.style.fontWeight = 700;
				flightDelay.style.textDecoration = "underline";
				flightDelay.textContent = `Delayed : ${key.delay} ${key.delay === 1 ? "minute" : "minutes"}`;
			}
			newresult.appendChild(flightDelay);
			const deptime = document.createElement("div"); //for departure time
			deptime.className = "right-info";
			newresult.appendChild(deptime);

			const depHeader = document.createElement("div");
			depHeader.textContent = "DEPARTURE TIME";
			depHeader.style.fontWeight = "900";
			deptime.appendChild(depHeader);

			const depTime = document.createElement("div"); //time of departure
			depTime.textContent = `${key.DepartTime}`;
			deptime.appendChild(depTime);

			const arrtime = document.createElement("div"); //time of departure
			arrtime.className = "right-info";
			newresult.appendChild(arrtime);

			const arrHeader = document.createElement("div");
			arrHeader.textContent = "ARRIVAL TIME";
			arrHeader.style.fontWeight = "900";
			arrtime.appendChild(arrHeader);

			const arrTime = document.createElement("div"); //time of arrival
			arrTime.textContent = `${key.ArriveTime}`;
			arrtime.appendChild(arrTime);
		});
	} catch (error) {
		console.log(error);
	}
});
