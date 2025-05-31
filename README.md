🧾 Restaurant Reservation App
📋 Περιγραφή
Αυτή η εφαρμογή επιτρέπει στους χρήστες:

Να κάνουν εγγραφή ή είσοδο (Login/Register)

Να δουν λίστα εστιατορίων

Να επιλέγουν εστιατόριο και να κάνουν κράτηση

Να δουν, να τροποποιήσουν ή να διαγράψουν τις κρατήσεις τους

Να αποσυνδεθούν (Logout)

Υπάρχει backend με Node.js, Express, MariaDB και frontend με React Native (Expo), κατάλληλο για κινητά Android.

🛠 Οδηγίες Εγκατάστασης
✅ Backend Setup
Απαιτήσεις:

Node.js & npm

MariaDB (ή XAMPP με MariaDB)

Εγκατάσταση εξαρτήσεων:

bash
Copy
cd restaurant-reservation-backend
npm install
Δημιουργία βάσης δεδομένων:

Τρέξε τα SQL scripts για τη δημιουργία των πινάκων users, restaurants, reservations.

Ρύθμιση σύνδεσης με βάση (db.js):

js
Copy
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'restaurant_db'
});
Εκκίνηση backend:

bash
Copy
node main.js
📱 Frontend Setup (React Native - Expo)
Απαιτήσεις:

Node.js

Expo CLI: npm install -g expo-cli

Android Studio (για emulator) ή Expo Go app (σε φυσική συσκευή)

Εκκίνηση project:

bash
Copy
cd RestaurantApp
npm install
npx expo start --tunnel
Σύνδεση backend:

Βεβαιώσου ότι το IP στη fetch URL είναι σωστό (όπως http://192.168.x.x:3000)

🔐 Χρήση API με Postman
Register:
POST http://<IP>:3000/api/register

json
Copy
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "mypassword123"
}
Login:
POST http://<IP>:3000/api/login

json
Copy
{
  "email": "alice@example.com",
  "password": "mypassword123"
}
Create Reservation:
POST http://<IP>:3000/api/reservations (με Authorization Bearer Token)

json
Copy
{
  "restaurant_id": 1,
  "date": "2025-06-01",
  "time": "20:00",
  "people_count": 2
}