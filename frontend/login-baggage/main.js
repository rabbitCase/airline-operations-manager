const button = document.getElementById("submit-button");
const passengerid = document.getElementById("passengerid");
const baggagetag = document.getElementById("baggagetag");
const weight = document.getElementById("weight");
const departureairport = document.getElementById("dept-air");
const arrivalairport = document.getElementById("arr-air");

button.addEventListener("click", async (event) => {
	try {
		event.preventDefault();
		const request = await fetch("http://localhost:3000/baggage", {
			mode: "cors",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				type: "database update request",
				for: "baggage check-in",
				parameter1: "passenger id",
				parameter2: "baggage tag",
				parameter3: "weight",
				parameter4: "departure aiport",
				parameter5: "arrival airport",
				passengerid: `${passengerid.value}`,
				baggagetag: `${baggagetag.value}`,
				weight: `${weight.value}`,
				departureairport: `${departureairport.value}`,
				arrivalairport: `${arrivalairport.value}`,
			}),
		});
		const response = await request.json();
		if (response.message == "query executed") {
			alert("Baggage Check-in successful. Check Database");
		} else {
			alert("Baggage Check-in Failed. Try Again");
			console.log(response);
		}
	} catch (error) {
		console.log(error);
	}
});
