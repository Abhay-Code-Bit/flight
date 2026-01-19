const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();


const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


const users = [];
const bookings = [];


const flightsDB = [
    { id: 1, airline: 'Indigo', code: '6E', logo: 'https://logo.clearbit.com/goindigo.in', depTime: '06:00', arrTime: '08:15', duration: '2h 15m', price: 4200, type: 'Direct' },
    { id: 2, airline: 'Air India', code: 'AI', logo: 'https://logo.clearbit.com/airindia.in', depTime: '09:30', arrTime: '12:45', duration: '3h 15m', price: 5500, type: '1 Stop' },
    { id: 3, airline: 'Vistara', code: 'UK', logo: 'https://logo.clearbit.com/airvistara.com', depTime: '15:00', arrTime: '17:10', duration: '2h 10m', price: 6800, type: 'Direct' },
    { id: 4, airline: 'SpiceJet', code: 'SG', logo: 'https://logo.clearbit.com/spicejet.com', depTime: '19:45', arrTime: '22:00', duration: '2h 15m', price: 3900, type: 'Direct' },
    { id: 5, airline: 'Akasa', code: 'QP', logo: 'https://logo.clearbit.com/akasaair.com', depTime: '07:15', arrTime: '09:30', duration: '2h 15m', price: 3400, type: 'Direct' },
    { id: 6, airline: 'Emirates', code: 'EK', logo: 'https://logo.clearbit.com/emirates.com', depTime: '04:00', arrTime: '09:00', duration: '5h 00m', price: 18000, type: 'Direct' },
];


app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (users.find(u => u.email === email)) return res.json({ success: false, message: 'Email exists' });
    const user = { id: Date.now(), name, email, password };
    users.push(user);
    res.json({ success: true });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        const { password, ...safeUser } = user;
        res.json({ success: true, user: safeUser });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/search', (req, res) => {
    const { from, to, date } = req.body;
    setTimeout(() => {
        const results = flightsDB.map(f => ({
            ...f,
            from: from || 'Mumbai',
            to: to || 'Delhi',
            date: date,
            price: f.price + (Math.floor(Math.random() * 10) * 100) 
        }));
        res.json(results);
    }, 500);
});

app.post('/api/book', (req, res) => {
    const { userId, flight, seats } = req.body;
    if(!userId || !seats || seats.length === 0) return res.status(400).json({ success: false, message: 'Invalid data' });

    const ref = 'SKY-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    bookings.push({ id: Date.now(), userId, flight, seats, ref, date: new Date() });
    res.json({ success: true, bookingRef: ref });
});

app.get('/api/bookings/:userId', (req, res) => {
    const uid = parseInt(req.params.userId);
    res.json(bookings.filter(b => b.userId === uid));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});