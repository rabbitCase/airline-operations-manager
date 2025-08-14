const button = document.getElementById("button");
const staffid = document.getElementById("staffid");
const password = document.getElementById("password");

button.addEventListener("click", async (event) => {
	if (staffid.value.length === 0 || password.value.length === 0){
		alert("Please enter all fields");
		return;
	}
	try {
		event.preventDefault();
		const request = await fetch("http://localhost:3000/login", {
			mode: "cors",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				type: "authentication request",
				for: "staff login",
				parameter1: "staffid",
				parameter2: "password",
				staffid: `${staffid.value}`,
				password: `${password.value}`,
			}),
		});
		const response = await request.json();
		console.log(response);
		if (response.message === "authenticated") {
			window.open("http://localhost:3000/logged-in", "_blank");
		} else if (response.message === "not allowed") {
			alert("Invalid Staff ID.");
		} else if (response.message === "not authorized") {
			alert("Invalid credentials.");
		}
	} catch (error) {
		console.log(error);
	}
});
