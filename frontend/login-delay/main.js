const button = document.getElementById('send-button');
const flightid = document.getElementById('flightid-input');
const delay = document.getElementById('delay-input');

button.addEventListener('click', async (event) =>{
    try {
        event.preventDefault();
        if (delay.value < 1) {
            alert("Please enter a value greater than 0");
            return;
        }
        const request = await fetch("http://localhost:3000/delay",{
            mode : 'cors',
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                type : "database update request",
                for : "flight delay",
                parameter1 : "flightid",
                parameter2 : 'delay (in minutes)',
                flightid : `${flightid.value}`,
                delay : `${delay.value}`
            })
        });
        const response = await request.json();
        if(response.message == "query executed"){
            alert("Delay updated. Check Database");
        }
        else{
            alert("Error updating delay. Try again");
        }
    } catch (error) {
        console.log(error);
    }
});
