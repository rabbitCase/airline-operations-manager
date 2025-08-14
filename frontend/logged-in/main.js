async function getname(){
    const response = await fetch("http://localhost:3000/getname");
    const message = await response.json();
    const staffname = document.getElementById('staffname');
    staffname.textContent = `${message.message}`;
};
getname();
const lfbutton = document.getElementById('lf');
const baggagebutton = document.getElementById('baggage');
const delaybutton = document.getElementById('delay');
lfbutton.addEventListener('click', () => {
    window.open("http://localhost:3000/lostandfound/" ,"_blank");
});
baggagebutton.addEventListener('click', () => {
    window.open("http://localhost:3000/baggage/" ,"_blank");
});
delaybutton.addEventListener('click', () => {
    window.open("http://localhost:3000/delay/" ,"_blank");
});