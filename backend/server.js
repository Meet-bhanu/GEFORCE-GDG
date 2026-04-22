const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- In-Memory Database (Replace with MongoDB/PostgreSQL later) ---
let needs = [
  { id: 1, title: 'Food Distribution', area: 'Panchavati, Nashik', type: 'Food', volunteersNeeded: 8, urgency: 'High', distance: '2.4 km', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400', color: 'rose' },
  { id: 2, title: 'Medical Assistance', area: 'Indra Nagar, Nashik', type: 'Health', volunteersNeeded: 5, urgency: 'Medium', distance: '3.7 km', image: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=400', color: 'amber' },
  { id: 3, title: 'Clothing Donation', area: 'Dwarka, Nashik', type: 'Apparel', volunteersNeeded: 3, urgency: 'Low', distance: '4.2 km', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=400', color: 'emerald' },
  { id: 4, title: 'Clean Water Supply', area: 'Govind Nagar, Nashik', type: 'Resources', volunteersNeeded: 6, urgency: 'High', distance: '5.1 km', image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=400', color: 'blue' }
];

let volunteers = [
  { id: 1, name: 'Priya Sharma', location: 'Nashik, Maharashtra', skills: ['Teaching', 'Event Mgmt'], hours: 48, avatar: 'https://i.pravatar.cc/150?u=priya' },
  { id: 2, name: 'Rohit Patil', location: 'Nashik, Maharashtra', skills: ['Logistics', 'Driving'], hours: 36, avatar: 'https://i.pravatar.cc/150?u=rohit' },
  { id: 3, name: 'Aisha Khan', location: 'Nashik, Maharashtra', skills: ['Healthcare', 'Counseling'], hours: 28, avatar: 'https://i.pravatar.cc/150?u=aisha' },
  { id: 4, name: 'Amit Verma', location: 'Nashik, Maharashtra', skills: ['Technology', 'Data Entry'], hours: 14, avatar: 'https://i.pravatar.cc/150?u=amit' }
];

let ngos = [
  { id: 1, name: 'Helping Hands India', focus: 'Food & Shelter', location: 'Nashik', verified: true, contact: 'hello@helpinghands.org' },
  { id: 2, name: 'CareForTomorrow', focus: 'Healthcare', location: 'Pune', verified: true, contact: 'support@carefortomorrow.org' },
  { id: 3, name: 'EduSpark', focus: 'Education', location: 'Mumbai', verified: false, contact: 'info@eduspark.in' }
];

let users = [
  { id: 1, role: 'admin', username: 'admin' },
  { id: 2, role: 'guest', username: 'guest' },
  { id: 3, role: 'public', username: 'public' }
];

// --- Home/Dashboard Mock Data ---
let analyticsData = [
  { name: 'Mon', needs: 400, matched: 240, impact: 300 },
  { name: 'Tue', needs: 600, matched: 480, impact: 500 },
  { name: 'Wed', needs: 400, matched: 350, impact: 400 },
  { name: 'Thu', needs: 900, matched: 700, impact: 800 },
  { name: 'Fri', needs: 1100, matched: 800, impact: 950 },
  { name: 'Sat', needs: 1200, matched: 1000, impact: 1100 },
  { name: 'Sun', needs: 1000, matched: 850, impact: 900 }
];

let pieData = [
  { name: 'Food', value: 400, color: '#22c55e' },
  { name: 'Health', value: 300, color: '#f59e0b' },
  { name: 'Education', value: 200, color: '#3b82f6' },
  { name: 'Shelter', value: 100, color: '#e11d48' },
  { name: 'Other', value: 50, color: '#64748b' }
];

let recentActivities = [
  { text: 'Food distribution drive finalized in Panchavati', status: 'Completed', color: 'text-green-500 bg-green-500/10 border-green-500/20' },
  { text: 'Medical camp mobilization initiated in Indra Nagar', status: 'In Transit', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { text: 'Critical clothing shortage identified in Dwarka', status: 'New Task', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' }
];

let priorityPipeline = [
  { title: 'Mega Food Drive', loc: 'Panchavati Hub', time: 'Tomorrow, 9:00 AM', avatar: 'https://i.pravatar.cc/150?u=a', color: 'rose' },
  { title: 'Vitals Health Camp', loc: 'Sector 4, Indra Nagar', time: '25 May, 10:00 AM', avatar: 'https://i.pravatar.cc/150?u=b', color: 'blue' }
];

// --- Endpoints ---

// 1. Navbar / Authentication (Login)
app.post('/api/login', (req, res) => {
  const { role, username } = req.body;
  // Support both role-based login (from original UI) and username-based login
  const user = users.find(u => u.role === role || u.username === username);
  
  if (user) {
    res.json({ success: true, user, message: `Logged in as ${user.role}` });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Sign Up
app.post('/api/signup', (req, res) => {
  const { username, role, password } = req.body;
  
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ success: false, message: 'Username already exists' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    role: role || 'public' // Default role
  };
  users.push(newUser);
  res.status(201).json({ success: true, user: newUser, message: 'Signed up successfully' });
});

// 2. Report a Need
app.post('/api/needs', (req, res) => {
  const newNeed = {
    id: needs.length + 1,
    ...req.body,
    status: 'pending',
    createdAt: new Date()
  };
  needs.push(newNeed);
  res.status(201).json({ success: true, data: newNeed, message: 'Need reported successfully' });
});

// Get all needs
app.get('/api/needs', (req, res) => {
  res.json({ success: true, data: needs });
});

// 3. Become a Volunteer
app.post('/api/volunteers', (req, res) => {
  const newVolunteer = {
    id: volunteers.length + 1,
    ...req.body,
    status: 'active',
    joinedAt: new Date()
  };
  volunteers.push(newVolunteer);
  res.status(201).json({ success: true, data: newVolunteer, message: 'Successfully registered as a volunteer' });
});

// Get all volunteers
app.get('/api/volunteers', (req, res) => {
  res.json({ success: true, data: volunteers });
});

// 4. Dashboard / Home Page Data
app.get('/api/dashboard', (req, res) => {
  const stats = {
    needsReported: { value: '1,248', growth: '+ 12%' },
    inProgress: { value: '832', growth: '+ 8%' },
    completed: { value: '416', growth: '+ 15%' },
    activeVolunteers: { value: '8,430', growth: '+ 20%' }
  };

  res.json({
    success: true,
    data: {
      stats,
      analyticsData,
      pieData,
      recentActivities,
      priorityPipeline
    }
  });
});

// 5. NGOs
app.get('/api/ngos', (req, res) => {
  res.json({ success: true, data: ngos });
});

app.post('/api/ngos', (req, res) => {
  const newNGO = {
    id: ngos.length + 1,
    ...req.body,
    verified: false,
    registeredAt: new Date()
  };
  ngos.push(newNGO);
  res.status(201).json({ success: true, data: newNGO, message: 'NGO registered successfully' });
});

// 6. About Us
app.get('/api/about', (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Connecting Needs. Creating Impact.',
      description: 'We collect, analyze, and act on community needs to build a stronger and more compassionate society. Our platform enables real-time matching between community needs and available volunteers/NGOs.',
      mission: 'To bridge the gap between resources and requirements during critical times.',
      contactEmail: 'contact@sevaconnect.org',
      foundedYear: 2026
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
