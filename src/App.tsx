import React, { useState, useRef } from 'react';
import { 
  Users, 
  MapPin, 
  BarChart3, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Heart, 
  Zap, 
  LayoutDashboard,
  ClipboardList,
  AlertTriangle,
  Info,
  Home,
  Briefcase,
  Layers,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Clock,
  Plus,
  Upload,
  Globe,
  Star,
  FileText,
  Mail,
  Moon,
  Sun,
  User as UserIcon,
  Lock as LockIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import ScrollReveal from './components/ScrollReveal';
import Stepper, { Step } from './components/Stepper';
import ReflectiveCard from './components/ReflectiveCard';
import BlurText from './components/BlurText';
import FadeContent from './components/FadeContent';

// --- Types ---
type UserRole = 'admin' | 'guest' | 'public' | null;

interface Assignment {
  needId: number;
  volunteerId: number;
  assignedAt: Date;
}

// --- Data ---

const VOLUNTEERS = [
  { id: 1, name: 'Priya Sharma', location: 'Nashik, Maharashtra', skills: ['Teaching', 'Event Mgmt'], hours: 48, avatar: 'https://i.pravatar.cc/150?u=priya' },
  { id: 2, name: 'Rohit Patil', location: 'Nashik, Maharashtra', skills: ['Logistics', 'Driving'], hours: 36, avatar: 'https://i.pravatar.cc/150?u=rohit' },
  { id: 3, name: 'Aisha Khan', location: 'Nashik, Maharashtra', skills: ['Healthcare', 'Counseling'], hours: 28, avatar: 'https://i.pravatar.cc/150?u=aisha' },
  { id: 4, name: 'Amit Verma', location: 'Nashik, Maharashtra', skills: ['Technology', 'Data Entry'], hours: 14, avatar: 'https://i.pravatar.cc/150?u=amit' },
];

const NEEDS = [
  { id: 1, title: 'Food Distribution', area: 'Panchavati, Nashik', type: 'Food', volunteersNeeded: 8, urgency: 'High', distance: '2.4 km', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400', color: 'rose' },
  { id: 2, title: 'Medical Assistance', area: 'Indra Nagar, Nashik', type: 'Health', volunteersNeeded: 5, urgency: 'Medium', distance: '3.7 km', image: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=400', color: 'amber' },
  { id: 3, title: 'Clothing Donation', area: 'Dwarka, Nashik', type: 'Apparel', volunteersNeeded: 3, urgency: 'Low', distance: '4.2 km', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=400', color: 'emerald' },
  { id: 4, title: 'Clean Water Supply', area: 'Govind Nagar, Nashik', type: 'Resources', volunteersNeeded: 6, urgency: 'High', distance: '5.1 km', image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=400', color: 'blue' },
];

const ANALYTICS_DATA = [
  { name: 'Mon', needs: 400, matched: 240, impact: 300 },
  { name: 'Tue', needs: 600, matched: 480, impact: 500 },
  { name: 'Wed', needs: 400, matched: 350, impact: 400 },
  { name: 'Thu', needs: 900, matched: 700, impact: 800 },
  { name: 'Fri', needs: 1100, matched: 800, impact: 950 },
  { name: 'Sat', needs: 1200, matched: 1000, impact: 1100 },
  { name: 'Sun', needs: 1000, matched: 850, impact: 900 },
];

const PIE_DATA = [
  { name: 'Food', value: 400, color: '#22c55e' },
  { name: 'Health', value: 300, color: '#f59e0b' },
  { name: 'Education', value: 200, color: '#3b82f6' },
  { name: 'Shelter', value: 100, color: '#e11d48' },
  { name: 'Other', value: 50, color: '#64748b' },
];

// --- Sub-Components ---

const Sidebar = ({ activeTab, setActiveTab, userRole, onLogout }: { activeTab: string; setActiveTab: (t: string) => void; userRole: UserRole; onLogout: () => void }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'needs', icon: Layers, label: 'Needs' },
    { id: 'volunteers', icon: Users, label: 'Volunteers' },
    { id: 'reports', icon: ClipboardList, label: 'Reports' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-[#020617] border-r border-slate-800 h-screen sticky top-0 flex flex-col p-4">
      <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => setActiveTab('home')}>
        <div className="w-10 h-10 bg-[#22c55e] rounded-xl flex items-center justify-center text-black shadow-lg shadow-green-500/10">
          <ShieldCheck size={24} fill="currentColor" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-white block leading-none">SevaConnect</span>
          <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Community Impact</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === item.id 
                ? 'bg-[#22c55e] text-black shadow-lg shadow-green-500/20 translate-x-1' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="pt-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-300"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

const Header = ({ userRole }: { userRole: UserRole }) => (
  <div className="h-20 border-b border-slate-800 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
    <div className="flex items-center gap-4 flex-1">
      <div className="relative w-full max-w-lg">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder="Search for active needs or verified volunteers..." 
          className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
        />
      </div>
    </div>
    <div className="flex items-center gap-6">
      <button className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-green-500 hover:border-green-500/50 transition-all">
        <Moon size={20} />
      </button>
      <button className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-green-500 hover:border-green-500/50 transition-all">
        <Bell size={20} />
        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#020617]"></span>
      </button>
      <div className="flex items-center gap-4 pl-6 border-l border-slate-800">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-white capitalize">{userRole === 'admin' ? 'Super Admin' : userRole === 'guest' ? 'Guest User' : 'Public Access'}</p>
          <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">{userRole?.toUpperCase()}</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700/50 overflow-hidden shadow-lg p-0.5">
          <img src={`https://i.pravatar.cc/150?u=${userRole}`} alt="User" className="w-full h-full object-cover rounded-[14px]" />
        </div>
      </div>
    </div>
  </div>
);

const VolunteerCard = ({ volunteer }: { volunteer: typeof VOLUNTEERS[0]; key?: any }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    className="group bg-slate-900/50 border border-slate-800 rounded-3xl p-5 hover:border-green-500/30 transition-all duration-500"
  >
    <div className="flex items-center gap-4 mb-5">
      <div className="w-14 h-14 rounded-2xl border-2 border-slate-800 overflow-hidden group-hover:border-green-500/50 transition-colors">
        <img src={volunteer.avatar} alt={volunteer.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100" />
      </div>
      <div>
        <h4 className="font-bold text-white group-hover:text-green-500 transition-colors">{volunteer.name}</h4>
        <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
          <MapPin size={10} className="text-green-500" /> {volunteer.location}
        </p>
      </div>
    </div>
    <div className="flex flex-wrap gap-2 mb-6">
      {volunteer.skills.map((skill, i) => (
        <span key={i} className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 group-hover:text-slate-200 transition-colors">
          {skill}
        </span>
      ))}
    </div>
    <div className="flex items-center justify-between p-3 rounded-2xl bg-black/30 border border-slate-800 group-hover:border-green-500/20 transition-all">
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-green-500" />
        <span className="text-xs font-bold text-white">{volunteer.hours} Hours</span>
      </div>
      <button className="text-[10px] font-bold text-green-500 uppercase tracking-widest hover:translate-x-1 transition-transform">Profile &rarr;</button>
    </div>
  </motion.div>
);

const NeedCard = ({ need, assignedVolunteer, userRole, onAssign }: any) => {
  const colorMap = {
    rose: 'border-rose-500 text-rose-500 bg-rose-500/10',
    amber: 'border-amber-500 text-amber-500 bg-amber-500/10',
    emerald: 'border-green-500 text-green-500 bg-green-500/10',
    blue: 'border-blue-500 text-blue-500 bg-blue-500/10'
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-600 transition-all duration-500 flex flex-col group h-full relative"
    >
      {assignedVolunteer && (
        <div className="absolute top-4 right-4 z-10">
           <div className="flex items-center gap-2 bg-green-500 text-black px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20">
              <UserIcon size={10} /> Assigned: {assignedVolunteer.name.split(' ')[0]}
           </div>
        </div>
      )}
      <div className="relative h-48 overflow-hidden">
        <img src={need.image} alt={need.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${colorMap[need.color as keyof typeof colorMap]}`}>
            {need.urgency} Priority
          </span>
        </div>
        <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
          <div className="p-2 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800">
             {need.type === 'Food' ? <Heart size={20} className="text-rose-500" /> : <ShieldCheck size={20} className="text-green-500" />}
          </div>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-display font-bold text-lg text-white leading-tight group-hover:text-green-400 transition-colors">{need.title}</h4>
        </div>
        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mb-5 opacity-80">
          <MapPin size={12} className="text-green-500" /> {need.area}
        </p>
        <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-800/50">
          <div>
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Volunteers Needed</p>
            <p className="text-xl font-display font-bold text-white">{need.volunteersNeeded}</p>
          </div>
          <div className="flex gap-2">
            {userRole === 'admin' && (
              <button 
                onClick={(e) => { e.stopPropagation(); onAssign?.(); }}
                className="px-4 py-2 rounded-xl bg-green-500/10 text-green-500 border border-green-500/30 text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all"
              >
                Assign
              </button>
            )}
            <button className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-green-500 flex items-center justify-center text-slate-400 hover:text-black border border-slate-700 hover:border-green-400 transition-all group/btn">
               <ArrowRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Pages ---

const DashboardPage = () => {
  return (
    <div className="p-8 space-y-8 pb-20">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">System Overview</h2>
          <p className="text-slate-500 text-sm font-medium">Real-time pulse of community impact and resource allocation.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:border-green-500/50 transition-colors">
            This Week <ChevronDown size={14} />
          </button>
          <button className="bg-green-500 text-black px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-green-500/20 hover:bg-green-400 transition-all">
            EXPORT DATA
          </button>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Needs Reported', value: '1,248', growth: '+ 12%', icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'In Progress', value: '832', growth: '+ 8%', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Completed', value: '416', growth: '+ 15%', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Active Volunteers', value: '8,430', growth: '+ 20%', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5 }}
            className="bg-slate-900/40 p-6 rounded-[2rem] border border-slate-800 shadow-xl overflow-hidden relative group"
          >
            <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 ${stat.color}`}>
              <stat.icon size={120} />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center border border-current shadow-inner`}>
                <stat.icon size={22} />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
            <div className="flex items-end justify-between relative z-10">
              <p className="text-3xl font-display font-bold text-white tracking-tight">{stat.value}</p>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${
                stat.growth.startsWith('+') ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
              }`}>
                {stat.growth}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-1">Analytics Trends</h3>
              <p className="text-slate-500 text-xs font-medium">Activity distribution across last 7 days.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Needs
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Impact
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_DATA}>
                <defs>
                  <linearGradient id="colorNeeds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="needs" stroke="#3b82f6" fillOpacity={1} fill="url(#colorNeeds)" strokeWidth={3} />
                <Area type="monotone" dataKey="impact" stroke="#22c55e" fillOpacity={1} fill="url(#colorImpact)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl flex flex-col">
          <h3 className="font-display font-bold text-xl text-white mb-1">Impact Segments</h3>
          <p className="text-slate-500 text-xs font-medium mb-8">Needs grouped by category type.</p>
          <div className="h-[260px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={PIE_DATA} 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-display font-bold text-white tracking-tighter">1.2k</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Reported</span>
            </div>
          </div>
          <div className="mt-auto grid grid-cols-2 gap-3 pt-6 border-t border-slate-800/50">
            {PIE_DATA.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-md shadow-lg" style={{ backgroundColor: item.color }}></span>
                <span className="text-[10px] font-black text-slate-400 capitalize tracking-wide">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
          <h3 className="font-display font-bold text-xl text-white mb-8 flex items-center justify-between">
            Live Pulse
            <button className="text-[10px] font-black text-green-500 uppercase tracking-widest hover:underline">View All &rarr;</button>
          </h3>
          <div className="space-y-5">
            {[
              { text: 'Food distribution drive finalized in Panchavati', status: 'Completed', color: 'text-green-500 bg-green-500/10 border-green-500/20' },
              { text: 'Medical camp mobilization initiated in Indra Nagar', status: 'In Transit', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
              { text: 'Critical clothing shortage identified in Dwarka', status: 'New Task', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-black/30 border border-slate-800 group hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-green-500 shrink-0 border border-slate-700 group-hover:scale-110 transition-transform">
                   <Zap size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-200 leading-tight mb-2">{activity.text}</p>
                  <div className="flex items-center gap-3">
                     <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${activity.color}`}>
                       {activity.status}
                     </span>
                     <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">2 MIN AGO</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
          <h3 className="font-display font-bold text-xl text-white mb-8">Priority Pipeline</h3>
          <div className="space-y-5">
            {[
              { title: 'Mega Food Drive', loc: 'Panchavati Hub', time: 'Tomorrow, 9:00 AM', avatar: 'https://i.prava.tar.cc/150?u=a', color: 'rose' },
              { title: 'Vitals Health Camp', loc: 'Sector 4, Indra Nagar', time: '25 May, 10:00 AM', avatar: 'https://i.pravatar.cc/150?u=b', color: 'blue' },
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-5 p-4 rounded-2xl border border-slate-800 hover:bg-slate-800/10 transition-all">
                <div className="relative group/task">
                   <img src={task.avatar} className="w-12 h-12 rounded-2xl object-cover grayscale group-hover/task:grayscale-0 transition-all" />
                   <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#020617] rounded-lg border border-slate-800 flex items-center justify-center">
                     <div className={`w-2.5 h-2.5 rounded-full bg-${task.color}-500 shadow-lg shadow-${task.color}-500/50 animate-pulse`}></div>
                   </div>
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-white tracking-tight">{task.title}</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{task.loc}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-green-500 uppercase tracking-tighter shadow-green-500/20">{task.time}</p>
                  <div className="flex gap-0.5 justify-end mt-1">
                     <span className="w-1 h-3 rounded-full bg-green-500"></span>
                     <span className="w-1 h-3 rounded-full bg-green-500/30"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Landing Page View ---

const LandingPage = ({ onLogin }: { onLogin: (role: UserRole) => void }) => {
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  return (
    <div className="min-h-screen bg-[#020617]">
       {/* Global Navigation */}
       <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/50 backdrop-blur-2xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-black shadow-2xl shadow-green-500/30">
              <ShieldCheck size={24} fill="currentColor" />
            </div>
            <div>
              <span className="text-xl font-display font-black tracking-tight text-white block">SevaConnect</span>
              <span className="text-[9px] text-slate-500 font-black tracking-widest uppercase opacity-70">Connecting Needs. Creating Impact.</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-10">
            {['Home', 'Explore Needs', 'Volunteers', 'NGOs', 'Dashboard'].map((link) => (
              <a 
                key={link} 
                href={link === 'Dashboard' ? '#' : `#${link.toLowerCase().replace(' ', '-')}`} 
                onClick={link === 'Dashboard' ? (e) => { e.preventDefault(); setShowLoginOptions(true); } : undefined}
                className={`text-xs font-black uppercase tracking-widest transition-all duration-300 ${link === 'Home' ? 'text-green-500' : 'text-slate-400 hover:text-white hover:translate-y-[-1px]'}`}
              >
                {link}
              </a>
            ))}
            <div className="flex items-center gap-2 group cursor-pointer text-slate-400 hover:text-white">
               <span className="text-xs font-black uppercase tracking-widest">About Us</span>
               <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
              onClick={() => setShowLoginOptions(true)}
              className="hidden sm:block text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white transition-colors"
             >
               Log In
             </button>
             <button className="bg-green-500 text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-green-500/20 hover:scale-105 active:scale-95 transition-all">Sign Up</button>
          </div>
        </div>

        {/* Login Selection Overlay */}
        <AnimatePresence>
          {showLoginOptions && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-rose-500"></div>
                <button 
                  onClick={() => setShowLoginOptions(false)}
                  className="absolute top-6 right-6 text-slate-500 hover:text-white"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
                <div className="text-center mb-10">
                   <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mx-auto mb-4">
                      <LockIcon size={32} />
                   </div>
                   <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">Access Protocol</h3>
                   <p className="text-slate-500 text-sm font-medium mt-2">Select your access tier to proceed</p>
                </div>
                <div className="space-y-4">
                  {[
                    { role: 'admin', label: 'Super Admin', desc: 'Full system management & coordination', icon: ShieldCheck, color: 'text-green-500' },
                    { role: 'guest', label: 'Guest Observer', desc: 'Limited administrative oversight', icon: UserIcon, color: 'text-blue-500' },
                    { role: 'public', label: 'Public User', desc: 'View global needs & community pulse', icon: Globe, color: 'text-slate-400' },
                  ].map((tier) => (
                    <button
                      key={tier.role}
                      onClick={() => onLogin(tier.role as UserRole)}
                      className="w-full flex items-center gap-4 p-5 rounded-2xl bg-black/40 border border-slate-800 hover:border-green-500/50 hover:bg-slate-800/50 transition-all text-left group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${tier.color} group-hover:scale-110 transition-transform`}>
                        <tier.icon size={22} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-white uppercase tracking-widest">{tier.label}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{tier.desc}</p>
                      </div>
                      <ArrowRight size={16} className="text-slate-700 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-8 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[160px] opacity-20 -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] opacity-20 -z-10 -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <FadeContent blur={true} duration={800} distance={40}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">Open Network v4.2</span>
            </div>
            
            <div className="relative mb-8">
              <BlurText 
                text="Connecting Community Needs"
                delay={50}
                animateBy="words"
                direction="top"
                className="text-6xl md:text-8xl font-display font-black text-white leading-[0.9] tracking-tighter"
              />
              <BlurText 
                text="with Real-Time Help"
                delay={50}
                animateBy="words"
                direction="bottom"
                className="text-6xl md:text-8xl font-display font-black text-green-500 leading-[0.9] tracking-tighter"
              />
            </div>

            <FadeContent blur={true} duration={1000} delay={400}>
              <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed font-display font-medium">
                We collect, analyze, and act on community needs to build a stronger and more compassionate society.
              </p>
              <div className="flex flex-wrap gap-5">
                <button className="bg-green-500 text-black px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-2xl shadow-green-500/30 hover:bg-green-400 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 group">
                  <ClipboardList size={22} className="group-hover:rotate-12 transition-transform" /> Report a Need
                </button>
                <button className="bg-slate-900 border border-slate-800 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest hover:border-slate-600 hover:bg-slate-800 transition-all flex items-center gap-3">
                  <Users size={22} /> Become a Volunteer
                </button>
              </div>
            </FadeContent>
            
            <div className="mt-12 flex items-center gap-8 border-t border-slate-800/50 pt-12">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-12 h-12 rounded-2xl border-4 border-[#020617] overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-full h-full object-cover" />
                   </div>
                 ))}
               </div>
               <div>
                  <p className="text-2xl font-display font-bold text-white leading-none">8,430+</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Active Volunteers</p>
               </div>
            </div>
          </FadeContent>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-[3rem] overflow-hidden shadow-2xl relative aspect-[1.1] border-[12px] border-slate-900/50 group">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop" 
                alt="Volunteers action" 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent opacity-60"></div>
              
              {/* Floating Overlay Stats */}
              <div className="absolute bottom-8 left-8 right-8 bg-[#020617]/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-slate-800 shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-500">
                    <Users size={28} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-display font-bold text-white">24,350+</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lives Impacted</p>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-full border-2 border-green-500/30 flex items-center justify-center">
                   <ArrowRight size={24} className="text-green-500" />
                </div>
              </div>
            </div>

            {/* Live Needs Map Mini */}
            <div className="hidden xl:block absolute top-0 -right-16 w-80 bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 rounded-[2.5rem] shadow-2xl translate-y-[-20%] rotate-[2deg]">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest italic">Live Needs Map</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Live</span>
                  </div>
               </div>
               <div className="h-44 rounded-2xl bg-[#020617] border border-slate-800 relative overflow-hidden mb-6">
                   <img src="https://images.unsplash.com/photo-1548345666-a571648d9299?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover opacity-20 grayscale" />
                   <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-rose-500 rounded-full border-2 border-white shadow-lg animate-bounce"></div>
                   <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-amber-400 rounded-full border-2 border-white shadow-lg"></div>
                   <div className="absolute top-3/4 left-1/3 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
               </div>
               <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span> <span className="text-[8px] font-black text-slate-400 uppercase">High Priority</span></div>
                 <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400"></span> <span className="text-[8px] font-black text-slate-400 uppercase">Medium Priority</span></div>
                 <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> <span className="text-[8px] font-black text-slate-400 uppercase">Low Priority</span></div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid Bar */}
      <section className="py-12 px-8">
        <FadeContent blur={true} duration={1000} threshold={0.2}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {[
               { title: 'Smart Data Collection', desc: 'Gather real-time data from NGOs and communities', icon: ShieldCheck, bg: '#10b981' },
               { title: 'AI-Powered Insights', desc: 'Identify the most urgent needs and priorities', icon: LayoutDashboard, bg: '#6366f1' },
               { title: 'Instant Action', desc: 'Match volunteers with the right tasks instantly', icon: Zap, bg: '#3b82f6' },
               { title: 'Stronger Communities', desc: 'Work together to create lasting impact', icon: Heart, bg: '#f43f5e' }
             ].map((feature, i) => (
               <div key={i} className="bg-slate-900/30 border border-slate-800/50 p-8 rounded-[2rem] hover:bg-slate-800/40 transition-all group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`} style={{ backgroundColor: `${feature.bg}20` }}>
                    <feature.icon size={26} style={{ color: feature.bg }} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2 leading-tight">{feature.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
               </div>
             ))}
          </div>
        </FadeContent>
      </section>

      {/* Section Header */}
      <section id="explore-needs" className="pt-24 pb-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
           <FadeContent blur={true} duration={800} threshold={0.3}>
              <h2 className="text-5xl font-display font-black text-white tracking-tighter mb-4">Explore <span className="text-green-500 underline decoration-green-500/20 underline-offset-8">Urgent Needs</span></h2>
              <p className="text-slate-500 font-medium tracking-tight">Real-time view of community needs and priorities</p>
           </FadeContent>
           <button className="bg-slate-900 border border-slate-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-slate-600 transition-all flex items-center gap-3">
             View All Needs <ArrowRight size={16} className="text-green-500" />
           </button>
        </div>
      </section>

      {/* Needs Grid */}
      <section className="pb-32 px-8 font-sans text-white">
        <FadeContent blur={true} duration={1200} threshold={0.1}>
          <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {NEEDS.map(need => (
              <NeedCard key={need.id} need={need} userRole={null} />
            ))}
          </div>
        </FadeContent>
      </section>

      {/* Massive Stats Strip */}
      <section className="py-20 bg-black/40 border-y border-slate-800/50 relative overflow-hidden">
        <FadeContent blur={true} duration={1000} threshold={0.4}>
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10 px-8">
             {[
               { label: 'Needs Reported', value: '12,580+', icon: ClipboardList, color: 'text-green-500' },
               { label: 'Active Volunteers', value: '8,430+', icon: Users, color: 'text-blue-500' },
               { label: 'NGOs & Groups', value: '1,250+', icon: Globe, color: 'text-amber-500' },
               { label: 'Lives Impacted', value: '24,350+', icon: Heart, color: 'text-rose-500' },
             ].map((stat, i) => (
               <div key={i} className="flex items-center gap-6 group">
                  <div className={`w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ${stat.color}`}>
                     <stat.icon size={28} />
                  </div>
                  <div>
                     <p className="text-4xl font-display font-black text-white leading-none mb-1">{stat.value}</p>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                  </div>
               </div>
             ))}
          </div>
        </FadeContent>
      </section>

      {/* Report a Need Section with STEPPER */}
      <section id="ngos" className="py-32 px-8 bg-slate-900/20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
           <div className="hidden lg:block relative">
             <FadeContent blur={true} duration={1500} threshold={0.2} initialOpacity={0}>
               <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[100px] opacity-20 -z-10 translate-x-[20%] translate-y-[-20%]"></div>
               <div className="rounded-[4rem] overflow-hidden shadow-2xl border-[16px] border-[#020617] rotate-[-2deg] hover:rotate-0 transition-all duration-700">
                 <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?w=800&auto=format&fit=crop" className="w-full aspect-[4/5] object-cover grayscale opacity-80" alt="Field action" />
               </div>
               {/* Text Overlay */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 text-center p-8 bg-black/60 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl">
                  <h3 className="text-4xl font-display font-black text-white mb-4 tracking-tighter uppercase">Variation 3</h3>
                  <p className="text-sm font-medium text-slate-300 italic">"Our field data transforms into immediate volunteer responses within minutes of submission."</p>
               </div>
             </FadeContent>
           </div>

           <div>
              <h2 className="text-6xl font-display font-black text-white tracking-tighter mb-4">Report a Need</h2>
              <p className="text-slate-400 font-medium tracking-tight mb-12">Your field information helps us mobilize the right rescue action immediately.</p>
              
              <Stepper
                initialStep={1}
                stepCircleContainerClassName="!max-w-full !rounded-[2.5rem] !bg-black/40 !border-slate-800 shadow-2xl"
                stepContainerClassName="!p-8 !border-b-0"
                contentClassName="!bg-transparent"
                nextButtonText="Continue"
                backButtonText="Back"
                onFinalStepCompleted={() => alert('Field report submitted to central hub!')}
              >
                <Step>
                  <div className="space-y-6">
                    <h2 className="text-2xl font-display font-bold text-white tracking-tight">Step 1: Classification</h2>
                    <p className="text-slate-500 text-sm">Help us categorize the urgency and type of support required.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Primary Category</label>
                        <select className="w-full bg-[#020617] border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-green-500">
                          <option>Select Category</option>
                          <option>Food Supplies</option>
                          <option>Healthcare</option>
                          <option>Sanitation</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Urgency</label>
                        <select className="w-full bg-[#020617] border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-green-500">
                          <option>Select Priority</option>
                          <option>Critical</option>
                          <option>High</option>
                          <option>Moderate</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </Step>
                <Step>
                  <div className="space-y-6">
                    <h2 className="text-2xl font-display font-bold text-white tracking-tight text-center">Step 2: Location Data</h2>
                    <p className="text-slate-500 text-sm text-center">Provide precise coordinates or landmarks for navigation.</p>
                    <div className="bg-[#020617] rounded-2xl border border-slate-800 p-6 flex items-center justify-center gap-4 cursor-pointer hover:border-green-500/50 transition-all group">
                       <MapPin size={32} className="text-green-500 group-hover:scale-110 transition-transform" />
                       <div className="text-left">
                          <p className="text-sm font-bold text-white tracking-tight">Auto-Detect GPS</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Precision within 2 meters</p>
                       </div>
                    </div>
                    <div>
                      <input 
                        type="text" 
                        placeholder="Street Address, Area, or Landmark..." 
                        className="w-full bg-[#020617] border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>
                </Step>
                <Step>
                  <div className="space-y-6">
                    <h2 className="text-2xl font-display font-bold text-white tracking-tight">Step 3: Visual Proof</h2>
                    <p className="text-slate-500 text-sm">Upload field photos to help teams assess resource volume.</p>
                    <div className="bg-[#020617] border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center hover:border-green-500/30 transition-all group cursor-pointer">
                       <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-green-500 group-hover:scale-110 transition-all mx-auto mb-4">
                          <Upload size={24} />
                       </div>
                       <p className="text-sm font-bold text-white mb-1">Tap/Drop to Upload Photos</p>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">JPG, PNG up to 12MB</p>
                    </div>
                  </div>
                </Step>
                <Step>
                  <div className="text-center space-y-4 py-8">
                    <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6 scale-[1.5]">
                       <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-display font-extrabold text-white tracking-tighter uppercase">Final Review</h2>
                    <p className="text-slate-400 font-medium">Ready to broadcast this need to the local regional hub?</p>
                  </div>
                </Step>
              </Stepper>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000000] border-t border-slate-900 py-32 px-8 overflow-hidden relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
            <div className="lg:col-span-1">
               <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-black shadow-2xl shadow-green-500/30">
                  <ShieldCheck size={24} fill="currentColor" />
                </div>
                <span className="text-xl font-display font-black tracking-tight text-white block">SevaConnect</span>
              </div>
              <p className="text-sm text-slate-500 font-medium italic leading-relaxed mb-8">Building technological bridges for community resilience and mutual aid across the globe.</p>
              <div className="flex gap-4">
                 {[Globe, Mail, FileText, Globe].map((Icon, i) => (
                   <div key={i} className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-green-500 hover:border-green-500/50 transition-all cursor-pointer">
                      <Icon size={18} />
                   </div>
                 ))}
              </div>
            </div>
            <div>
               <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-10 text-green-500">Navigation</h4>
               <ul className="space-y-5 text-sm font-bold text-slate-500 uppercase tracking-widest">
                  <li className="hover:text-white cursor-pointer transition-colors italic">Home Node</li>
                  <li className="hover:text-white cursor-pointer transition-colors italic">Active Needs</li>
                  <li className="hover:text-white cursor-pointer transition-colors italic">Volunteer Pool</li>
                  <li className="hover:text-white cursor-pointer transition-colors italic">System Status</li>
               </ul>
            </div>
            <div>
               <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-10 text-green-500">Protocols</h4>
               <ul className="space-y-5 text-sm font-bold text-slate-500 uppercase tracking-widest">
                  <li className="hover:text-white cursor-pointer transition-colors italic">Privacy Safe v2</li>
                  <li className="hover:text-white cursor-pointer transition-colors italic">Verification SDK</li>
                  <li className="hover:text-white cursor-pointer transition-colors italic">Smart Matching</li>
                  <li className="hover:text-white cursor-pointer transition-colors italic">Impact Ledger</li>
               </ul>
            </div>
            <div>
               <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-10 text-green-500">Hub Location</h4>
               <p className="text-sm text-slate-500 font-medium italic leading-relaxed mb-8">Nashik Innovation District, Maharashtra, 422001, IN</p>
               <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <div className="flex items-center gap-3">
                     <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-xl shadow-green-500/50"></span>
                     <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Operations Active</span>
                  </div>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

// --- App Root ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assigningTo, setAssigningTo] = useState<number | null>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setActiveTab('home');
  };

  const assignTask = (needId: number, volunteerId: number) => {
    if (userRole !== 'admin') return;
    setAssignments(prev => [
      ...prev.filter(a => a.needId !== needId),
      { needId, volunteerId, assignedAt: new Date() }
    ]);
  };

  return (
    <div className="font-sans antialiased text-slate-100 selection:bg-green-500 selection:text-black min-h-screen">
      <AnimatePresence mode="wait">
        {activeTab === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex bg-[#020617] min-h-screen"
          >
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} onLogout={handleLogout} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
              <Header userRole={userRole} />
              <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                {activeTab === 'dashboard' && <DashboardPage />}
                {activeTab === 'needs' && (
                  <div className="p-8 space-y-8 pb-32">
                     <div className="flex items-end justify-between">
                        <div>
                          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter italic">Global Needs Registry</h2>
                          <p className="text-slate-500 font-medium">Prioritized by real-time urgency and proximity signatures.</p>
                        </div>
                        {userRole === 'admin' && (
                          <button className="bg-green-500 text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-green-500/20">
                             + Register New Need
                          </button>
                        )}
                     </div>
                     <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {NEEDS.map(need => {
                          const assignment = assignments.find(a => a.needId === need.id);
                          const volunteer = assignment ? VOLUNTEERS.find(v => v.id === assignment.volunteerId) : undefined;
                          return (
                            <NeedCard 
                              key={need.id} 
                              need={need} 
                              userRole={userRole}
                              assignedVolunteer={volunteer}
                              onAssign={() => setAssigningTo(need.id)}
                            />
                          );
                        })}
                     </div>

                     {/* Assignment Modal */}
                     <AnimatePresence>
                        {assigningTo && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                          >
                            <motion.div
                              initial={{ scale: 0.9, y: 20 }}
                              animate={{ scale: 1, y: 0 }}
                              className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden"
                            >
                              <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                              <div className="flex items-center justify-between mb-8">
                                <div>
                                  <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">Select Volunteer</h3>
                                  <p className="text-slate-500 text-sm font-medium">Assigning resource to: <span className="text-green-500">{NEEDS.find(n => n.id === assigningTo)?.title}</span></p>
                                </div>
                                <button onClick={() => setAssigningTo(null)} className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
                                  <Plus size={20} className="rotate-45" />
                                </button>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                                {VOLUNTEERS.map(v => (
                                  <button
                                    key={v.id}
                                    onClick={() => {
                                      assignTask(assigningTo, v.id);
                                      setAssigningTo(null);
                                    }}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-slate-800 hover:border-green-500/50 hover:bg-slate-800/50 transition-all text-left group"
                                  >
                                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0">
                                      <img src={v.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                      <p className="text-sm font-bold text-white truncate">{v.name}</p>
                                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">{v.skills.join(', ')}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <CheckCircle2 size={16} />
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
                )}
                {activeTab === 'volunteers' && (
                  <div className="p-8 space-y-8 pb-32">
                    <div className="flex items-end justify-between">
                       <div>
                          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter italic">Volunteer Pool</h2>
                          <p className="text-slate-500 font-medium">Accessing {VOLUNTEERS.length} verified response agents in your quadrant.</p>
                       </div>
                       <div className="relative group">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-green-500 transition-colors" size={18} />
                          <input type="text" placeholder="Skill or UID Search..." className="bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-6 py-3 text-xs font-bold focus:outline-none focus:border-green-500" />
                       </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <h3 className="text-xl font-display font-bold text-white border-l-4 border-green-500 pl-4 mb-8">Verified Digital Identities</h3>
                        {VOLUNTEERS.slice(0, 2).map(v => (
                          <div key={v.id} className="inline-block mr-8 mb-8">
                            <ReflectiveCard 
                              name={v.name.toUpperCase()}
                              role={v.skills[0].toUpperCase()}
                              idNumber={`SNC-${v.id}-2026-${v.hours}`}
                              blurStrength={8}
                              roughness={0.3}
                              metalness={0.7}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-8 border-l border-slate-800 pl-12">
                        <h3 className="text-xl font-display font-bold text-white border-l-4 border-blue-500 pl-4 mb-8">Skill Matrices</h3>
                        <div className="grid sm:grid-cols-2 gap-6">
                          {VOLUNTEERS.map(v => (
                            <VolunteerCard key={v.id} volunteer={v} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!['dashboard', 'needs', 'volunteers'].includes(activeTab) && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600 italic">
                    <div className="w-24 h-24 bg-slate-900/50 rounded-[2.5rem] flex items-center justify-center text-slate-800 mb-6 border border-slate-800">
                       <Zap size={40} />
                    </div>
                    <h2 className="text-4xl font-display font-black uppercase tracking-tighter">{activeTab} Section Offline</h2>
                    <p className="mt-2 font-medium tracking-tight">Accessing development protocol 0-5...</p>
                  </div>
                )}
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
