const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const allowedUrgencies = ['Low', 'Medium', 'High', 'Critical'];
const needStatuses = ['open', 'in-progress', 'resolved'];
const volunteerBadges = ['First Responder', '10 Tasks Done', 'Community Champion'];

function normalizeArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }
  return [];
}

function scoreFromUrgency(urgency) {
  const map = {
    Low: 3,
    Medium: 5,
    High: 8,
    Critical: 10
  };
  return map[urgency] || 5;
}

function buildUrgencyScore({ urgency, volunteersNeeded, reportsCount, affectedPopulation }) {
  const urgencyWeight = scoreFromUrgency(urgency);
  const volunteerPressure = Math.min(2, Math.ceil((Number(volunteersNeeded) || 0) / 5));
  const reportsWeight = Math.min(2, Math.ceil((Number(reportsCount) || 1) / 3));
  const populationWeight = Math.min(2, Math.ceil((Number(affectedPopulation) || 10) / 100));
  return Math.min(10, urgencyWeight + volunteerPressure + reportsWeight + populationWeight - 2);
}

// --- In-Memory Database (Replace with MongoDB/PostgreSQL later) ---
let needs = [
  { id: 1, title: 'Food Distribution', area: 'Panchavati, Nashik', location: 'Panchavati, Nashik', type: 'Food', category: 'Food', ngoId: 1, source: 'field-report', skillsRequired: ['Logistics', 'Food Packaging'], assignedVolunteerIds: [2], volunteersNeeded: 8, urgency: 'High', distance: '2.4 km', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400', color: 'rose', description: 'Need volunteers for meal packaging and distribution.', status: 'open', reportsCount: 5, affectedPopulation: 320, datePosted: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 2, title: 'Medical Assistance', area: 'Indra Nagar, Nashik', location: 'Indra Nagar, Nashik', type: 'Health', category: 'Health', ngoId: 2, source: 'survey-upload', skillsRequired: ['Healthcare', 'Data Entry'], assignedVolunteerIds: [3], volunteersNeeded: 5, urgency: 'Medium', distance: '3.7 km', image: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=400', color: 'amber', description: 'Need volunteers to support patient registration and triage.', status: 'in-progress', reportsCount: 3, affectedPopulation: 120, datePosted: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 3, title: 'Clothing Donation', area: 'Dwarka, Nashik', location: 'Dwarka, Nashik', type: 'Shelter', category: 'Shelter', ngoId: 1, source: 'manual-entry', skillsRequired: ['Sorting', 'Packaging'], assignedVolunteerIds: [], volunteersNeeded: 3, urgency: 'Low', distance: '4.2 km', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=400', color: 'emerald', description: 'Need helpers for sorting and packing clothes.', status: 'open', reportsCount: 1, affectedPopulation: 55, datePosted: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 4, title: 'Clean Water Supply', area: 'Govind Nagar, Nashik', location: 'Govind Nagar, Nashik', type: 'Environment', category: 'Environment', ngoId: 3, source: 'field-report', skillsRequired: ['Transport', 'Crowd Management'], assignedVolunteerIds: [1], volunteersNeeded: 6, urgency: 'Critical', distance: '5.1 km', image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=400', color: 'blue', description: 'Need people for delivery and temporary tank setup.', status: 'open', reportsCount: 8, affectedPopulation: 500, datePosted: new Date().toISOString(), createdAt: new Date().toISOString() }
];

let volunteers = [
  { id: 1, name: 'Priya Sharma', location: 'Nashik, Maharashtra', languages: ['Hindi', 'Marathi'], skills: ['Teaching', 'Event Mgmt'], areasOfInterest: ['Education', 'Food'], tasksCompleted: 22, rating: 4.8, hours: 48, avatar: 'https://i.pravatar.cc/150?u=priya', available: true, verified: true, status: 'active', badges: ['First Responder'], joinedAt: new Date().toISOString() },
  { id: 2, name: 'Rohit Patil', location: 'Nashik, Maharashtra', languages: ['Hindi', 'English'], skills: ['Logistics', 'Driving'], areasOfInterest: ['Food', 'Environment'], tasksCompleted: 18, rating: 4.6, hours: 36, avatar: 'https://i.pravatar.cc/150?u=rohit', available: true, verified: true, status: 'active', badges: ['10 Tasks Done'], joinedAt: new Date().toISOString() },
  { id: 3, name: 'Aisha Khan', location: 'Nashik, Maharashtra', languages: ['Hindi', 'Urdu'], skills: ['Healthcare', 'Counseling'], areasOfInterest: ['Health'], tasksCompleted: 12, rating: 4.7, hours: 28, avatar: 'https://i.pravatar.cc/150?u=aisha', available: false, verified: true, status: 'active', badges: ['Community Champion'], joinedAt: new Date().toISOString() },
  { id: 4, name: 'Amit Verma', location: 'Nashik, Maharashtra', languages: ['English', 'Marathi'], skills: ['Technology', 'Data Entry'], areasOfInterest: ['Education', 'Shelter'], tasksCompleted: 8, rating: 4.4, hours: 14, avatar: 'https://i.pravatar.cc/150?u=amit', available: true, verified: false, status: 'active', badges: [], joinedAt: new Date().toISOString() }
];

let ngos = [
  { id: 1, name: 'Helping Hands India', logo: 'https://dummyimage.com/120x60/0f766e/ffffff&text=HHI', description: 'Community-first NGO focused on immediate relief and shelter support.', focus: 'Food & Shelter', category: 'Food', location: 'Nashik', socialLinks: { website: 'https://example.org/hhi' }, activeCampaigns: 2, verified: true, contact: 'hello@helpinghands.org', metrics: { needsResolved: 114, volunteersEngaged: 230 } },
  { id: 2, name: 'CareForTomorrow', logo: 'https://dummyimage.com/120x60/1d4ed8/ffffff&text=CFT', description: 'Mobile healthcare support for under-served communities.', focus: 'Healthcare', category: 'Health', location: 'Pune', socialLinks: { website: 'https://example.org/cft' }, activeCampaigns: 1, verified: true, contact: 'support@carefortomorrow.org', metrics: { needsResolved: 78, volunteersEngaged: 150 } },
  { id: 3, name: 'EduSpark', logo: 'https://dummyimage.com/120x60/9333ea/ffffff&text=ES', description: 'Education access and digital learning initiatives.', focus: 'Education', category: 'Education', location: 'Mumbai', socialLinks: { website: 'https://example.org/eduspark' }, activeCampaigns: 1, verified: false, contact: 'info@eduspark.in', metrics: { needsResolved: 38, volunteersEngaged: 67 } }
];

let testimonials = [
  { id: 1, name: 'Ritika N', role: 'Volunteer', quote: 'I got matched with families needing food support within hours. The platform made it easy to help.' },
  { id: 2, name: 'NGO Coordinator - HHI', role: 'NGO', quote: 'Upload and need tracking has reduced our response time significantly.' }
];

let volunteerStories = [
  { id: 1, volunteerId: 1, title: 'Flood relief distribution', story: 'Coordinated with local teams to distribute food kits to 120 families.' },
  { id: 2, volunteerId: 2, title: 'Medical camp support', story: 'Helped manage patient queues and emergency logistics at a health camp.' }
];

let campaigns = [
  { id: 1, ngoId: 1, title: 'Monsoon Relief 2026', startsAt: '2026-06-01', endsAt: '2026-08-31', needIds: [1, 4], status: 'active' }
];

let uploadJobs = [
  { id: 1, ngoId: 1, fileName: 'field-survey-zone-a.pdf', fileType: 'pdf', source: 'survey-scan', status: 'processed', extractedNeeds: 6, createdAt: new Date().toISOString() },
  { id: 2, ngoId: 2, fileName: 'health-camp.csv', fileType: 'csv', source: 'csv-report', status: 'processing', extractedNeeds: 0, createdAt: new Date().toISOString() }
];

let bookmarkedNeedsByVolunteer = {
  1: [4],
  2: [1, 2]
};

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
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend is healthy' });
});

app.get('/api/home', (req, res) => {
  const heroStats = [
    { label: 'Volunteers Matched', value: 1200 },
    { label: 'Needs Resolved', value: 340 },
    { label: 'NGOs Onboarded', value: ngos.length }
  ];
  const featuredNeeds = [...needs]
    .sort((a, b) => scoreFromUrgency(b.urgency) - scoreFromUrgency(a.urgency))
    .slice(0, 4)
    .map(need => ({ ...need, urgencyScore: buildUrgencyScore(need) }));
  const urgencyTicker = featuredNeeds.map(need => ({
    needId: need.id,
    location: need.location || need.area,
    title: need.title,
    urgency: need.urgency
  }));

  res.json({
    success: true,
    data: {
      hero: {
        headline: 'Connecting Needs, Volunteers, and NGOs for Faster Community Response',
        subheadline: 'A unified platform for reporting needs, prioritizing urgency, and coordinating response.',
        ctas: ['Explore Needs', 'Join as Volunteer / NGO']
      },
      stats: heroStats,
      howItWorks: [
        'NGOs upload data',
        'AI aggregates and prioritizes needs',
        'Volunteers get matched in real-time'
      ],
      urgencyTicker,
      featuredNeeds,
      impactMapPreview: needs.map(need => ({
        needId: need.id,
        location: need.location || need.area,
        urgency: need.urgency,
        intensity: buildUrgencyScore(need)
      })),
      testimonials,
      partnerNGOs: ngos.map(ngo => ({ id: ngo.id, name: ngo.name, logo: ngo.logo }))
    }
  });
});

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
function createNeed(req, res) {
  const { title, area, location, type, category, volunteersNeeded, urgency, description, requestedBy, source, skillsRequired, ngoId, affectedPopulation } = req.body;

  if (!title || !area || !type) {
    return res.status(400).json({
      success: false,
      message: 'title, area and type are required'
    });
  }

  if (!Number.isInteger(volunteersNeeded) || volunteersNeeded <= 0) {
    return res.status(400).json({
      success: false,
      message: 'volunteersNeeded must be a positive integer'
    });
  }

  const urgencyValue = urgency || 'Medium';
  if (!allowedUrgencies.includes(urgencyValue)) {
    return res.status(400).json({
      success: false,
      message: `urgency must be one of: ${allowedUrgencies.join(', ')}`
    });
  }

  const newNeed = {
    id: needs.length + 1,
    title,
    area: area || location,
    location: location || area,
    type,
    category: category || type,
    ngoId: Number(ngoId) || null,
    source: source || 'manual-entry',
    skillsRequired: normalizeArray(skillsRequired),
    assignedVolunteerIds: [],
    volunteersNeeded,
    urgency: urgencyValue,
    description: description || '',
    requestedBy: requestedBy || 'anonymous',
    status: 'open',
    reportsCount: 1,
    affectedPopulation: Number(affectedPopulation) || 0,
    datePosted: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  newNeed.urgencyScore = buildUrgencyScore(newNeed);
  needs.push(newNeed);
  res.status(201).json({ success: true, data: newNeed, message: 'Need reported successfully' });
}

app.post('/api/needs', createNeed);
app.post('/api/reports', createNeed);

// Get all needs
app.get('/api/needs', (req, res) => {
  const { urgency, status, type, location, category, datePosted } = req.query;
  const filteredNeeds = needs.filter(need => {
    const urgencyMatched = !urgency || need.urgency === urgency;
    const statusMatched = !status || need.status === status;
    const typeMatched = !type || need.type === type;
    const locationMatched = !location || String(need.location || need.area).toLowerCase().includes(String(location).toLowerCase());
    const categoryMatched = !category || String(need.category).toLowerCase() === String(category).toLowerCase();
    const dateMatched = !datePosted || String(need.datePosted).slice(0, 10) === String(datePosted);
    return urgencyMatched && statusMatched && typeMatched && locationMatched && categoryMatched && dateMatched;
  });

  res.json({
    success: true,
    count: filteredNeeds.length,
    viewOptions: ['map', 'list'],
    data: filteredNeeds.map(need => ({ ...need, urgencyScore: buildUrgencyScore(need) }))
  });
});
app.get('/api/reports', (req, res) => {
  res.json({ success: true, count: needs.length, data: needs });
});

app.patch('/api/needs/:id/status', (req, res) => {
  const needId = Number(req.params.id);
  const { status } = req.body;
  const allowedStatuses = ['open', 'in-progress', 'resolved', 'cancelled'];
  const need = needs.find(item => item.id === needId);

  if (!need) {
    return res.status(404).json({ success: false, message: 'Need not found' });
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `status must be one of: ${allowedStatuses.join(', ')}` });
  }

  need.status = status;
  need.updatedAt = new Date().toISOString();
  res.json({ success: true, data: need, message: 'Need status updated successfully' });
});

// 3. Become a Volunteer
app.post('/api/volunteers', (req, res) => {
  const { name, location, skills, hours, available, languages, areasOfInterest, verified } = req.body;
  if (!name || !location) {
    return res.status(400).json({ success: false, message: 'name and location are required' });
  }

  const newVolunteer = {
    id: volunteers.length + 1,
    name,
    location,
    languages: normalizeArray(languages),
    skills: normalizeArray(skills),
    areasOfInterest: normalizeArray(areasOfInterest),
    tasksCompleted: 0,
    rating: 0,
    hours: Number(hours) || 0,
    available: available ?? true,
    verified: Boolean(verified),
    status: 'active',
    badges: [],
    joinedAt: new Date().toISOString()
  };
  volunteers.push(newVolunteer);
  res.status(201).json({ success: true, data: newVolunteer, message: 'Successfully registered as a volunteer' });
});

// Get all volunteers
app.get('/api/volunteers', (req, res) => {
  const { skill, availability, location, language, status, verified } = req.query;
  const filteredVolunteers = volunteers.filter(volunteer => {
    const skillMatched = !skill || volunteer.skills.some(s => s.toLowerCase().includes(String(skill).toLowerCase()));
    const availabilityMatched = !availability || (availability === 'available-now' ? volunteer.available : true);
    const locationMatched = !location || volunteer.location.toLowerCase().includes(String(location).toLowerCase());
    const languageMatched = !language || volunteer.languages.some(l => l.toLowerCase().includes(String(language).toLowerCase()));
    const statusMatched = !status || volunteer.status === status;
    const verifiedMatched = !verified || String(volunteer.verified) === String(verified);
    return skillMatched && availabilityMatched && locationMatched && languageMatched && statusMatched && verifiedMatched;
  });

  res.json({ success: true, count: filteredVolunteers.length, data: filteredVolunteers });
});

app.patch('/api/volunteers/:id/availability', (req, res) => {
  const volunteerId = Number(req.params.id);
  const { available } = req.body;
  const volunteer = volunteers.find(item => item.id === volunteerId);

  if (!volunteer) {
    return res.status(404).json({ success: false, message: 'Volunteer not found' });
  }

  if (typeof available !== 'boolean') {
    return res.status(400).json({ success: false, message: 'available must be a boolean' });
  }

  volunteer.available = available;
  volunteer.updatedAt = new Date().toISOString();
  res.json({ success: true, data: volunteer, message: 'Volunteer availability updated successfully' });
});

app.get('/api/matches', (req, res) => {
  const matches = needs.map(need => {
    const eligibleVolunteers = volunteers.filter(volunteer => {
      if (!volunteer.available) return false;
      const hasSkillMatch = volunteer.skills.some(skill => (
        skill.toLowerCase().includes(String(need.type).toLowerCase()) ||
        String(need.type).toLowerCase().includes(skill.toLowerCase())
      ));
      return hasSkillMatch || need.urgency === 'High' || need.urgency === 'Critical';
    });

    return {
      needId: need.id,
      needTitle: need.title,
      urgency: need.urgency,
      matchedVolunteers: eligibleVolunteers
    };
  });

  res.json({ success: true, data: matches });
});

app.get('/api/needs/:id', (req, res) => {
  const needId = Number(req.params.id);
  const need = needs.find(item => item.id === needId);
  if (!need) {
    return res.status(404).json({ success: false, message: 'Need not found' });
  }
  const ngo = ngos.find(item => item.id === need.ngoId);
  return res.json({
    success: true,
    data: {
      ...need,
      urgencyScore: buildUrgencyScore(need),
      assignedVolunteersCount: need.assignedVolunteerIds.length,
      ngoName: ngo?.name || 'Unassigned NGO'
    }
  });
});

app.post('/api/needs/:id/bookmark', (req, res) => {
  const needId = Number(req.params.id);
  const volunteerId = Number(req.body.volunteerId);
  if (!volunteerId) {
    return res.status(400).json({ success: false, message: 'volunteerId is required' });
  }
  const volunteer = volunteers.find(item => item.id === volunteerId);
  const need = needs.find(item => item.id === needId);
  if (!volunteer || !need) {
    return res.status(404).json({ success: false, message: 'Volunteer or need not found' });
  }
  bookmarkedNeedsByVolunteer[volunteerId] = bookmarkedNeedsByVolunteer[volunteerId] || [];
  if (!bookmarkedNeedsByVolunteer[volunteerId].includes(needId)) {
    bookmarkedNeedsByVolunteer[volunteerId].push(needId);
  }
  return res.json({ success: true, data: bookmarkedNeedsByVolunteer[volunteerId] });
});

app.get('/api/volunteers/:id', (req, res) => {
  const volunteer = volunteers.find(item => item.id === Number(req.params.id));
  if (!volunteer) {
    return res.status(404).json({ success: false, message: 'Volunteer not found' });
  }
  return res.json({ success: true, data: volunteer });
});

app.get('/api/volunteers/:id/matches', (req, res) => {
  const volunteerId = Number(req.params.id);
  const volunteer = volunteers.find(item => item.id === volunteerId);
  if (!volunteer) {
    return res.status(404).json({ success: false, message: 'Volunteer not found' });
  }
  const matchedNeeds = needs
    .filter(need => need.status !== 'resolved')
    .map(need => {
      const skillMatchCount = need.skillsRequired.filter(skill => volunteer.skills.some(vs => vs.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(vs.toLowerCase()))).length;
      const score = Math.min(100, skillMatchCount * 30 + (volunteer.available ? 25 : 0) + scoreFromUrgency(need.urgency) * 4);
      return { ...need, matchScore: score };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

  return res.json({ success: true, data: matchedNeeds });
});

app.post('/api/needs/:id/assign', (req, res) => {
  const needId = Number(req.params.id);
  const volunteerId = Number(req.body.volunteerId);
  const ngoId = Number(req.body.ngoId || 0);
  const need = needs.find(item => item.id === needId);
  const volunteer = volunteers.find(item => item.id === volunteerId);

  if (!need || !volunteer) {
    return res.status(404).json({ success: false, message: 'Need or volunteer not found' });
  }

  if (need.status === 'resolved' || need.status === 'cancelled') {
    return res.status(400).json({ success: false, message: 'Cannot assign volunteer to closed need' });
  }

  if (!need.assignedVolunteerIds.includes(volunteerId)) {
    need.assignedVolunteerIds.push(volunteerId);
  }
  need.ngoId = need.ngoId || ngoId || null;
  need.updatedAt = new Date().toISOString();

  return res.json({
    success: true,
    data: need,
    message: `${volunteer.name} assigned successfully`
  });
});

app.delete('/api/needs/:id/assign/:volunteerId', (req, res) => {
  const needId = Number(req.params.id);
  const volunteerId = Number(req.params.volunteerId);
  const need = needs.find(item => item.id === needId);
  const volunteer = volunteers.find(item => item.id === volunteerId);

  if (!need || !volunteer) {
    return res.status(404).json({ success: false, message: 'Need or volunteer not found' });
  }

  need.assignedVolunteerIds = need.assignedVolunteerIds.filter(id => id !== volunteerId);
  need.updatedAt = new Date().toISOString();

  return res.json({
    success: true,
    data: need,
    message: `${volunteer.name} removed from task`
  });
});

app.get('/api/volunteers/:id/tasks', (req, res) => {
  const volunteerId = Number(req.params.id);
  const volunteer = volunteers.find(item => item.id === volunteerId);
  if (!volunteer) {
    return res.status(404).json({ success: false, message: 'Volunteer not found' });
  }

  const tasks = needs.filter(need => need.assignedVolunteerIds.includes(volunteerId));
  return res.json({ success: true, data: tasks });
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

app.get('/api/dashboard/:role', (req, res) => {
  const role = req.params.role;
  if (role === 'volunteer') {
    return res.json({
      success: true,
      data: {
        myMatchedNeeds: needs.filter(need => need.status !== 'resolved').slice(0, 4),
        upcomingTasks: needs.map(need => ({ needId: need.id, title: need.title, location: need.location, status: need.status })).slice(0, 3),
        profileCompleteness: 78,
        badges: volunteerBadges,
        notifications: [
          'You have 2 new matches',
          'Helping Hands India sent you a message'
        ]
      }
    });
  }

  if (role === 'ngo') {
    return res.json({
      success: true,
      data: {
        needsSubmitted: needs.length,
        statusTracking: needs.map(need => ({ id: need.id, title: need.title, status: need.status })),
        volunteerAssignments: needs.map(need => ({ needId: need.id, assigned: need.assignedVolunteerIds.length })),
        uploadHistory: uploadJobs,
        urgencyAlerts: needs.filter(need => need.assignedVolunteerIds.length === 0 && (need.urgency === 'High' || need.urgency === 'Critical')),
        analytics: {
          responseRate: '74%',
          avgFillTimeHours: 18,
          topVolunteerContributors: volunteers.slice(0, 3).map(v => ({ name: v.name, tasksCompleted: v.tasksCompleted }))
        }
      }
    });
  }

  if (role === 'admin') {
    return res.json({
      success: true,
      data: {
        platformStats: {
          totalNeeds: needs.length,
          totalVolunteers: volunteers.length,
          totalNgos: ngos.length,
          resolutionRate: `${Math.round((needs.filter(n => n.status === 'resolved').length / needs.length) * 100)}%`
        },
        dataQuality: {
          flaggedUploads: uploadJobs.filter(job => job.status === 'failed').length,
          duplicatesDetected: 2
        },
        userManagement: {
          pendingNgoApprovals: ngos.filter(ngo => !ngo.verified).length,
          pendingVolunteerVerifications: volunteers.filter(volunteer => !volunteer.verified).length
        },
        unmetNeedsHeatmap: needs.map(need => ({
          location: need.location,
          unmet: Math.max(0, need.volunteersNeeded - need.assignedVolunteerIds.length)
        }))
      }
    });
  }

  return res.status(400).json({ success: false, message: 'role must be volunteer, ngo or admin' });
});

// 5. NGOs
app.get('/api/ngos', (req, res) => {
  const { category, location, activeCampaigns } = req.query;
  const filteredNgos = ngos.filter(ngo => {
    const categoryMatched = !category || ngo.category.toLowerCase() === String(category).toLowerCase();
    const locationMatched = !location || ngo.location.toLowerCase().includes(String(location).toLowerCase());
    const campaignsMatched = !activeCampaigns || (activeCampaigns === 'true' ? ngo.activeCampaigns > 0 : true);
    return categoryMatched && locationMatched && campaignsMatched;
  });
  res.json({ success: true, data: filteredNgos });
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

app.get('/api/ngos/:id', (req, res) => {
  const ngoId = Number(req.params.id);
  const ngo = ngos.find(item => item.id === ngoId);
  if (!ngo) {
    return res.status(404).json({ success: false, message: 'NGO not found' });
  }
  const ngoNeeds = needs.filter(need => need.ngoId === ngoId);
  const activeNeeds = ngoNeeds.filter(need => need.status !== 'resolved');
  const resolvedNeeds = ngoNeeds.filter(need => need.status === 'resolved');
  const volunteerPool = volunteers.filter(volunteer =>
    activeNeeds.some(need => need.assignedVolunteerIds.includes(volunteer.id))
  );

  return res.json({
    success: true,
    data: {
      ...ngo,
      activeNeeds,
      resolvedNeeds,
      volunteerTeam: volunteerPool,
      impactMetrics: {
        needsResolved: resolvedNeeds.length,
        volunteersEngaged: volunteerPool.length
      }
    }
  });
});

app.post('/api/ngos/register', (req, res) => {
  const { organizationDetails, categoryAndFocus, verificationDocs, firstNeed } = req.body;
  if (!organizationDetails?.name || !organizationDetails?.location) {
    return res.status(400).json({ success: false, message: 'organizationDetails.name and organizationDetails.location are required' });
  }
  const newNGO = {
    id: ngos.length + 1,
    name: organizationDetails.name,
    logo: organizationDetails.logo || '',
    description: organizationDetails.description || '',
    focus: categoryAndFocus?.focus || '',
    category: categoryAndFocus?.category || 'General',
    location: organizationDetails.location,
    socialLinks: organizationDetails.socialLinks || {},
    activeCampaigns: 0,
    verified: false,
    verificationDocs: verificationDocs || [],
    contact: organizationDetails.contact || '',
    metrics: { needsResolved: 0, volunteersEngaged: 0 }
  };
  ngos.push(newNGO);

  let createdNeed = null;
  if (firstNeed?.title && firstNeed?.type && firstNeed?.volunteersNeeded) {
    createdNeed = {
      id: needs.length + 1,
      title: firstNeed.title,
      area: firstNeed.location || newNGO.location,
      location: firstNeed.location || newNGO.location,
      type: firstNeed.type,
      category: firstNeed.category || firstNeed.type,
      ngoId: newNGO.id,
      source: 'ngo-registration',
      skillsRequired: normalizeArray(firstNeed.skillsRequired),
      assignedVolunteerIds: [],
      volunteersNeeded: Number(firstNeed.volunteersNeeded),
      urgency: firstNeed.urgency || 'Medium',
      description: firstNeed.description || '',
      requestedBy: newNGO.name,
      status: 'open',
      reportsCount: 1,
      affectedPopulation: Number(firstNeed.affectedPopulation) || 0,
      datePosted: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    createdNeed.urgencyScore = buildUrgencyScore(createdNeed);
    needs.push(createdNeed);
  }

  return res.status(201).json({ success: true, data: { ngo: newNGO, firstNeed: createdNeed } });
});

app.post('/api/uploads', (req, res) => {
  const { ngoId, fileName, fileType, source } = req.body;
  if (!ngoId || !fileName) {
    return res.status(400).json({ success: false, message: 'ngoId and fileName are required' });
  }
  const job = {
    id: uploadJobs.length + 1,
    ngoId: Number(ngoId),
    fileName,
    fileType: fileType || 'unknown',
    source: source || 'manual-upload',
    status: 'processing',
    extractedNeeds: 0,
    createdAt: new Date().toISOString()
  };
  uploadJobs.push(job);
  return res.status(201).json({ success: true, data: job, message: 'Upload accepted and processing started' });
});

app.get('/api/uploads', (req, res) => {
  const { ngoId, status } = req.query;
  const jobs = uploadJobs.filter(job => {
    const ngoMatch = !ngoId || String(job.ngoId) === String(ngoId);
    const statusMatch = !status || job.status === status;
    return ngoMatch && statusMatch;
  });
  return res.json({ success: true, data: jobs });
});

app.post('/api/uploads/preview', (req, res) => {
  const { extractedNeeds } = req.body;
  const parsedNeeds = Array.isArray(extractedNeeds) ? extractedNeeds : [];
  const duplicates = parsedNeeds.filter(candidate =>
    needs.some(existing => existing.title.toLowerCase() === String(candidate.title || '').toLowerCase())
  );
  return res.json({
    success: true,
    data: {
      ocrProgress: 100,
      extractedCount: parsedNeeds.length,
      duplicatesDetected: duplicates.length,
      duplicateItems: duplicates
    }
  });
});

app.get('/api/explore/meta', (req, res) => {
  return res.json({
    success: true,
    data: {
      filters: {
        categories: ['Food', 'Health', 'Education', 'Shelter', 'Environment'],
        urgencies: allowedUrgencies,
        statuses: needStatuses
      },
      viewModes: ['map', 'list']
    }
  });
});

app.post('/api/campaigns', (req, res) => {
  const { ngoId, title, startsAt, endsAt, needIds } = req.body;
  if (!ngoId || !title) {
    return res.status(400).json({ success: false, message: 'ngoId and title are required' });
  }
  const campaign = {
    id: campaigns.length + 1,
    ngoId: Number(ngoId),
    title,
    startsAt: startsAt || null,
    endsAt: endsAt || null,
    needIds: Array.isArray(needIds) ? needIds : [],
    status: 'active'
  };
  campaigns.push(campaign);
  return res.status(201).json({ success: true, data: campaign });
});

app.get('/api/campaigns', (req, res) => {
  const { ngoId } = req.query;
  const result = campaigns.filter(campaign => !ngoId || String(campaign.ngoId) === String(ngoId));
  return res.json({ success: true, data: result });
});

// 6. About Us
app.get('/api/about', (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Connecting Needs. Creating Impact.',
      description: 'We collect, analyze, and act on community needs to build a stronger and more compassionate society. Our platform enables real-time matching between community needs and available volunteers/NGOs.',
      mission: 'To bridge the gap between resources and requirements during critical times.',
      vision: 'Empower every region with faster, data-driven humanitarian response.',
      technologyFlow: ['OCR extraction', 'Data aggregation', 'AI urgency prioritization', 'Smart volunteer matching'],
      team: [
        { name: 'Aarav Kulkarni', role: 'Product Lead' },
        { name: 'Neha Rao', role: 'AI Engineer' },
        { name: 'Ishaan Mehta', role: 'Community Operations' }
      ],
      impactNumbers: {
        needsPosted: needs.length,
        volunteersMatched: volunteers.length * 12,
        ngosOnboarded: ngos.length,
        issuesResolved: needs.filter(need => need.status === 'resolved').length
      },
      press: [
        'City Impact Awards 2026 - Social Innovation Finalist',
        'Featured in Local Community Tech Forum'
      ],
      contactEmail: 'contact@sevaconnect.org',
      foundedYear: 2026
    }
  });
});

app.get('/api/volunteer-stories', (req, res) => {
  return res.json({ success: true, data: volunteerStories });
});

app.get('/api/leaderboard/volunteers', (req, res) => {
  const board = [...volunteers]
    .sort((a, b) => b.tasksCompleted - a.tasksCompleted)
    .map((volunteer, index) => ({
      rank: index + 1,
      volunteerId: volunteer.id,
      name: volunteer.name,
      tasksCompleted: volunteer.tasksCompleted,
      badges: volunteer.badges
    }));
  return res.json({ success: true, data: board });
});

app.get('/api/impact/reports', (req, res) => {
  const byCategory = ['Food', 'Health', 'Education', 'Shelter', 'Environment'].map(category => ({
    category,
    count: needs.filter(need => need.category.toLowerCase() === category.toLowerCase()).length
  }));

  const unresolved = needs.filter(need => need.status !== 'resolved');
  const regionHeatmap = unresolved.map(need => ({
    location: need.location,
    urgencyScore: buildUrgencyScore(need)
  }));

  return res.json({
    success: true,
    data: {
      needsByCategory: byCategory,
      monthlyResolutionTrend: analyticsData,
      regionUrgencyHeatmap: regionHeatmap,
      volunteerHours: volunteers.reduce((sum, volunteer) => sum + volunteer.hours, 0),
      publicReportDownload: '/api/reports/export?format=pdf'
    }
  });
});

app.get('/api/reports/export', (req, res) => {
  const format = String(req.query.format || 'pdf').toLowerCase();
  if (format !== 'pdf' && format !== 'csv') {
    return res.status(400).json({ success: false, message: 'format must be pdf or csv' });
  }
  return res.json({
    success: true,
    message: `Mock ${format.toUpperCase()} export ready`,
    downloadUrl: `/downloads/community-impact-report.${format}`
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
