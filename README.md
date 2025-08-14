# Aiport Management System

Database design/architecture, Entity-Relationship models: Suvan Kumar Shee <a href="http://github.com/skshee/">(skshee)</a>

Login authentication logic, UI design/styling, bug fixes: Armaan Gupta <a href="http://github.com/poseidon-boi/">(poseidon-boi)</a>

Server design, API connections and UI design/styling: Gokul Nair <a href="http://github.com/rabbitCase/">(rabbitCase)</a>

<a href="https://github.com/rabbitCase/dbms-sem4-ams/blob/main/frontend/README.md">Additional Credits</a>

<h2>Project Functionalities</h2>
Airport Management System allows airport staff to manage airport operations which include:
<ul>
  <li>Checking-in Baggage</li>
  <li>Logging lost items in the Lost & Found</li>
  <li>Updating flight status (delayed/on-time) based on the information received from airlines</li>
</ul>
The system also provides a portal for newly employed staff to register using their issued identification number. Passengers visiting the site have an option to view all flights arriving/departing from the airport and check their schedule as updated by the staff.

<h2>Technologies Used</h2>
<ul>
  <li>Database: MySQL</li>
  <li>UI Design: HTML, CSS</li>
  <li>Frontend and Backend Functionality: JavaScript(Node.js and Express.js)</li>
  <li>Version Control: Git and Github</li>
</ul>
<h2>Run Locally</h2>
<ul>
  <li>
    Clone the database
    <ul>
      <li>Go to <a href="https://github.com/rabbitCase/airport-management-system/blob/main/Commands.txt">Commands.txt</a></li>
      <li>Copy all SQL statements</li>
      <li>Paste into your MySQL Client (press 'enter' to execute the last command)</li>
      <li>You should now have the database created with sample values for all tables</li>
    </ul>
  </li>
  <li>
    Clone the repository into a new folder
    <ul>
      <li><code> git clone https://github.com/rabbitCase/airport-management-system.git </code></li>
    </ul
  </li>
  <li>
    Change to the backend folder
    <ul>
      <li><code> cd airport-management-system/backend</code></li>
    </ul>
  </li>
  <li>
    Install dependencies
    <ul>
      <li><code>npm install</code></li>
    </ul>
  </li>
  <li>
    In the backend folder, go to the server.js file
    <ul>
      <li>Change 'process.env.DB_PASSWORD' in the 'password' field (line 21) to your MySQL password (within <code>''</code>)</li>
      <li><code>password : 'your_password'</code></li>
      <li>Save the file</code></li>
    </ul>
  </li>
  <li>
    Run the dev script
    <ul>
      <li><code> npm run dev</code></li>
    </ul>
  </li>
  <li>
    Application should be available at http://localhost:3000
  </li>
  
</ul>
