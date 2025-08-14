const button = document.getElementById("submit-button");
const staffname = document.getElementById("name");
const staffid = document.getElementById("staffid");
const airportid = document.getElementById("airportid");
const role = document.getElementById("role");
const password = document.getElementById("password");
const password1 = document.getElementById("password1");
const form = document.querySelector("form");

button.addEventListener("click", async (event) => {
	try {
		event.preventDefault();
		if (password.value !== password1.value) {
			alert("Passwords do not match");
			return;
		}
		const request = await fetch("http://localhost:3000/register", {
			mode: "cors",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				type: "database update request",
				for: "staff registration",
				parameter1: "staff name",
				parameter2: "staff id",
				parameter3: "airportid",
				parameter4: "role",
				parameter5: "password",
				staffname: `${staffname.value}`,
				staffid: `${staffid.value}`,
				airportid: `${airportid.value}`,
				role: `${role.value}`,
				password: `${password.value}`,
			}),
		});
		const response = await request.json();
		console.log(response.message);
		if (response.message == "not allowed") {
			alert("You are not allowed to register");
			console.log(response);
		} else if (response.message == "queries executed") {
			alert("You have been registered successfully");
		} else {
			alert("Registration Failed. Try again.");
		}
	} catch (error) {
		console.log(error);
	}
});
