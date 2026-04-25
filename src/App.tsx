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
  Lock as LockIcon,
  Trash2,
  Eye,
  Shield
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
  Area,
  BarChart,
  Bar
} from 'recharts';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
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

interface VolunteerRecord {
  id: number;
  name: string;
  location: string;
  skills: string[];
  hours: number;
  avatar: string;
  available?: boolean;
}

interface NeedRecord {
  id: number;
  title: string;
  area?: string;
  location?: string;
  type: string;
  volunteersNeeded: number;
  urgency: string;
  image?: string;
  color?: string;
  assignedVolunteerIds?: number[];
}

const API_BASE = 'http://localhost:5000/api';

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

const NGO_DATA = [
  { id: 1, name: 'Helping Hands', state: 'Maharashtra', coordinates: [73.7898, 19.9975], urgency: 'high' },
  { id: 2, name: 'Food for All', state: 'Delhi', coordinates: [77.2090, 28.6139], urgency: 'medium' },
  { id: 3, name: 'Care India', state: 'Karnataka', coordinates: [77.5946, 12.9716], urgency: 'low' },
  { id: 4, name: 'Hope Foundation', state: 'Gujarat', coordinates: [72.5714, 23.0225], urgency: 'high' },
  { id: 5, name: 'Save the Children', state: 'West Bengal', coordinates: [88.3639, 22.5726], urgency: 'low' },
  { id: 6, name: 'Relief Front', state: 'Tamil Nadu', coordinates: [78.6569, 11.1271], urgency: 'medium' },
  { id: 7, name: 'Local Aid', state: 'Kerala', coordinates: [76.2711, 10.8505], urgency: 'high' }
];

const INDIA_TOPO_JSON = 'https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States';

// --- Sub-Components ---

const Sidebar = ({ activeTab, setActiveTab, userRole, onLogout }: { activeTab: string; setActiveTab: (t: string) => void; userRole: UserRole; onLogout: () => void }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'ngos', icon: Globe, label: 'NGO Network' },
    { id: 'needs', icon: Layers, label: 'Needs' },
    { id: 'volunteers', icon: Users, label: 'Volunteers' },
    { id: 'submit-report', icon: FileText, label: 'Submit Report' },
    { id: 'task-summary', icon: CheckCircle2, label: 'Task Conclusion' },
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

const Header = ({ userRole, setActiveTab, theme, toggleTheme }: { userRole: UserRole, setActiveTab: (t: string) => void, theme: string, toggleTheme: () => void }) => (
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
      <button 
        onClick={() => setActiveTab('notifications')}
        className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-green-500 hover:border-green-500/50 transition-all"
      >
        <Bell size={20} />
        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#020617] animate-ping"></span>
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

const VolunteerCard = ({
  volunteer,
  userRole,
  onDelete,
  onProfile
}: {
  volunteer: typeof VOLUNTEERS[0];
  userRole?: string;
  onDelete?: () => void;
  onProfile?: () => void;
  key?: any;
}) => (
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
      <div className="flex gap-2 items-center">
        {userRole === 'admin' && onDelete && (
          <button onClick={onDelete} className="text-[10px] p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors">
            <Trash2 size={14} />
          </button>
        )}
        <button
          onClick={onProfile}
          className="text-[10px] font-bold text-green-500 uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-1"
        >
          <Eye size={12} /> Profile
        </button>
      </div>
    </div>
  </motion.div>
);

const NeedCard = ({ need, assignedVolunteer, userRole, onAssign, onRemove, onDeleteNeed }: any) => {
  const colorMap = {
    Critical: 'border-rose-500 text-rose-500 bg-rose-500/10',
    High: 'border-amber-500 text-amber-500 bg-amber-500/10',
    Medium: 'border-blue-500 text-blue-500 bg-blue-500/10',
    Low: 'border-green-500 text-green-500 bg-green-500/10'
  };
  const themeColor = colorMap[need.urgency as keyof typeof colorMap] || colorMap.Medium;

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
        <img src={need.image || 'https://images.unsplash.com/photo-1593113565694-c6c7475fbd11?auto=format&fit=crop&w=400&q=80'} alt={need.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${themeColor}`}>
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
            {userRole === 'admin' && assignedVolunteer && (
              <button
                onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
                className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
              >
                Remove
              </button>
            )}
            {userRole === 'admin' && (
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteNeed?.(); }}
                className="px-4 py-2 rounded-xl bg-rose-950/30 text-rose-400 border border-rose-500/40 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
              >
                Delete
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

const NgosPage = ({
  userRole,
  onDeleteVolunteer,
  onDeleteNeed
}: {
  userRole: UserRole;
  onDeleteVolunteer?: (id: number) => void;
  onDeleteNeed?: (id: number) => void;
}) => {
  const [ngos, setNgos] = React.useState<any[]>([]);
  const [selectedNgoId, setSelectedNgoId] = React.useState<number | null>(null);
  const [selectedNgoData, setSelectedNgoData] = React.useState<any>(null);

  React.useEffect(() => {
    fetch(`${API_BASE}/ngos`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setNgos(json.data || []);
          if (json.data?.length) setSelectedNgoId(json.data[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch NGOs', err);
      });
  }, []);

  React.useEffect(() => {
    if (!selectedNgoId) return;
    fetch(`${API_BASE}/ngos/${selectedNgoId}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setSelectedNgoData(json.data);
      })
      .catch((err) => {
        console.error('Failed to fetch NGO details', err);
      });
  }, [selectedNgoId]);

  const ngoStateUrgencyMap = React.useMemo(() => {
    const urgencyRank: Record<string, number> = { high: 3, medium: 2, low: 1 };
    const map: Record<string, string> = {};

    NGO_DATA.forEach((ngo) => {
      const current = map[ngo.state];
      if (!current || urgencyRank[ngo.urgency] > urgencyRank[current]) {
        map[ngo.state] = ngo.urgency;
      }
    });

    return map;
  }, []);

  const geographyStyle = React.useMemo(() => ({
    default: { outline: 'none' as const },
    hover: { fill: '#3b82f6', outline: 'none' as const },
    pressed: { outline: 'none' as const }
  }), []);

  const handleDeleteVolunteer = async (volunteerId: number) => {
    onDeleteVolunteer?.(volunteerId);
    if (selectedNgoId) {
      const refreshed = await fetch(`${API_BASE}/ngos/${selectedNgoId}`).then(res => res.json());
      if (refreshed.success) setSelectedNgoData(refreshed.data);
    }
  };

  const handleDeleteNeed = async (needId: number) => {
    onDeleteNeed?.(needId);
    if (selectedNgoId) {
      const refreshed = await fetch(`${API_BASE}/ngos/${selectedNgoId}`).then(res => res.json());
      if (refreshed.success) setSelectedNgoData(refreshed.data);
    }
  };

  return (
    <div className="p-8 space-y-8 pb-32 h-full flex flex-col">
       <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter italic">NGO Network</h2>
            <p className="text-slate-500 font-medium">Interactive Map of NGO Availability in India.</p>
          </div>
       </div>
       
       <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden min-h-[600px]">
          {/* Legend */}
          <div className="absolute top-8 right-8 bg-[#020617]/80 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl z-10 shadow-2xl">
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-3">Map Legend</h4>
            <div className="space-y-2">
              {userRole === 'admin' ? (
                <>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500"></span><span className="text-xs text-slate-400 font-bold">High Urgency</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span><span className="text-xs text-slate-400 font-bold">Medium Urgency</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span><span className="text-xs text-slate-400 font-bold">Available</span></div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span><span className="text-xs text-slate-400 font-bold">NGOs Available</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700"></span><span className="text-xs text-slate-400 font-bold">No coverage</span></div>
                </>
              )}
            </div>
          </div>

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 1000, center: [80, 22] }}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={INDIA_TOPO_JSON}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateName = geo.properties.NAME_1;
                  const matchedState = Object.keys(ngoStateUrgencyMap).find((state) => stateName && stateName.includes(state));
                  const urgency = matchedState ? ngoStateUrgencyMap[matchedState] : null;
                  const hasNgo = Boolean(urgency);
                  
                  let fillColor = "#1e293b"; // default slate-800
                  if (userRole === 'admin') {
                     if (urgency === 'high') fillColor = "#ef4444"; // rose-500
                     else if (urgency === 'medium') fillColor = "#f59e0b"; // amber-500
                     else if (hasNgo) fillColor = "#22c55e"; // green-500
                  } else {
                     if (hasNgo) fillColor = "#22c55e"; // just green if available
                  }

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke="#0f172a"
                      strokeWidth={1}
                      style={geographyStyle}
                    />
                  );
                })
              }
            </Geographies>
            {userRole === 'admin' && NGO_DATA.map((ngo) => (
              <Marker key={ngo.id} coordinates={ngo.coordinates as [number, number]}>
                <circle r={4} fill="#ffffff" stroke="#020617" strokeWidth={2} />
                <text textAnchor="middle" y={-8} style={{ fontFamily: "Inter, system-ui", fill: "#ffffff", fontSize: "10px", fontWeight: "bold", textShadow: "0px 2px 4px rgba(0,0,0,0.8)" }}>
                  {ngo.name}
                </text>
              </Marker>
            ))}
          </ComposableMap>
       </div>
       {userRole === 'admin' && (
         <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
             <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">NGO Resource Controls</h3>
             <select
               value={selectedNgoId || ''}
               onChange={(e) => setSelectedNgoId(Number(e.target.value))}
               className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-green-500 outline-none"
             >
               {ngos.map((ngo) => (
                 <option key={ngo.id} value={ngo.id}>{ngo.name}</option>
               ))}
             </select>
           </div>

           <div className="grid lg:grid-cols-2 gap-6">
             <div className="rounded-2xl border border-slate-800 bg-black/30 p-5">
               <h4 className="text-lg font-bold text-white mb-4">Assigned Volunteers</h4>
               <div className="space-y-3">
                 {selectedNgoData?.volunteerTeam?.length ? selectedNgoData.volunteerTeam.map((volunteer: any) => (
                   <div key={volunteer.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/40">
                     <div>
                       <p className="text-sm font-bold text-white">{volunteer.name}</p>
                       <p className="text-xs text-slate-500">{volunteer.location}</p>
                     </div>
                     <button
                       onClick={() => handleDeleteVolunteer(volunteer.id)}
                       className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                     >
                       Delete
                     </button>
                   </div>
                 )) : <p className="text-xs text-slate-500">No assigned volunteers for this NGO.</p>}
               </div>
             </div>

             <div className="rounded-2xl border border-slate-800 bg-black/30 p-5">
               <h4 className="text-lg font-bold text-white mb-4">Active Needs</h4>
               <div className="space-y-3">
                 {selectedNgoData?.activeNeeds?.length ? selectedNgoData.activeNeeds.map((need: any) => (
                   <div key={need.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/40">
                     <div>
                       <p className="text-sm font-bold text-white">{need.title}</p>
                       <p className="text-xs text-slate-500">{need.area || need.location}</p>
                     </div>
                     <button
                       onClick={() => handleDeleteNeed(need.id)}
                       className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                     >
                       Delete
                     </button>
                   </div>
                 )) : <p className="text-xs text-slate-500">No active needs for this NGO.</p>}
               </div>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

// --- Main Pages ---

const NotificationsPage = () => {
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`${API_BASE}/notifications`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setNotifications(json.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch notifications', err);
        setLoading(false);
      });
  }, []);

  const markAsRead = (id: number) => {
    fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' })
      .then(() => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="w-10 h-10 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 pb-20">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase italic">System Alerts</h2>
          <p className="text-slate-500 text-sm font-medium">Real-time notifications and updates.</p>
        </div>
      </div>
      <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-slate-500 text-center py-10 font-bold">No notifications to display.</p>
          ) : (
            notifications.map((n: any) => (
              <div key={n.id} className={`p-4 rounded-2xl border ${n.read ? 'bg-slate-800/20 border-slate-800' : 'bg-black/40 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]'} flex justify-between items-center transition-all`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.read ? 'bg-slate-800 text-slate-500' : 'bg-green-500/10 text-green-500'}`}>
                    <Bell size={18} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${n.read ? 'text-slate-400' : 'text-white'}`}>{n.title}</h4>
                    <p className={`text-xs ${n.read ? 'text-slate-500' : 'text-slate-300'} mt-1`}>{n.message}</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {!n.read && (
                  <button onClick={() => markAsRead(n.id)} className="text-[10px] font-black text-green-500 uppercase tracking-widest hover:underline px-4 py-2 border border-green-500/20 rounded-xl hover:bg-green-500/10 transition-colors">
                    Mark Read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`${API_BASE}/dashboard`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch dashboard data', err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="w-10 h-10 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!data) return null;

  return (
    <div className="p-8 space-y-8 pb-20">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase italic">Intelligence Hub</h2>
          <p className="text-slate-500 text-sm font-medium">Real-time pulse of community impact and resource allocation.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-xl border border-slate-800">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Latency: 24ms</span>
          </div>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Needs Reported', value: data.stats.needsReported.value, growth: data.stats.needsReported.growth, icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'In Progress', value: data.stats.inProgress.value, growth: data.stats.inProgress.growth, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Completed', value: data.stats.completed.value, growth: data.stats.completed.growth, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Active Volunteers', value: data.stats.activeVolunteers.value, growth: data.stats.activeVolunteers.growth, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
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
              <AreaChart data={data.analyticsData}>
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
                  data={data.pieData} 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {data.pieData.map((entry: any, index: number) => (
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
            {data.pieData.map((item: any, i: number) => (
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
            {data.recentActivities.map((activity: any, i: number) => (
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
            {data.priorityPipeline.map((task: any, i: number) => (
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

      {/* System Command Log */}
      <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] -z-10">
           <LayoutDashboard size={120} />
        </div>
        <div className="flex items-center justify-between mb-8">
           <div>
              <h3 className="font-display font-bold text-xl text-white">System Command Log</h3>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Real-time terminal event feed</p>
           </div>
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Awaiting Feed...</span>
           </div>
        </div>
        <div className="grid grid-cols-1 gap-3 font-mono">
           {data.systemLogs?.map((log: any) => (
             <div key={log.id} className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-slate-800/50 group hover:border-slate-700 transition-all">
                <span className="text-[10px] font-black text-slate-500 shrink-0 mt-1">{log.time}</span>
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-1">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                        log.type === 'warning' ? 'text-amber-500 border-amber-500/20 bg-amber-500/10' :
                        log.type === 'success' ? 'text-green-500 border-green-500/20 bg-green-500/10' :
                        'text-blue-500 border-blue-500/20 bg-blue-500/10'
                      }`}>
                        {log.event}
                      </span>
                   </div>
                   <p className="text-xs text-slate-300 font-medium group-hover:text-white transition-colors">{log.detail}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const [data, setData] = React.useState<any>(null);
  const [reports, setReports] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [syncing, setSyncing] = React.useState(false);
  const [actionMessage, setActionMessage] = React.useState('');
  const uploadInputRef = React.useRef<HTMLInputElement | null>(null);

  const fetchAnalyticsData = React.useCallback(async () => {
    const [analyticsJson, reportsJson] = await Promise.all([
      fetch(`${API_BASE}/analytics`).then(res => res.json()),
      fetch(`${API_BASE}/all-reports`).then(res => res.json())
    ]);
    if (analyticsJson.success) setData(analyticsJson.data);
    if (reportsJson.success) setReports(reportsJson.data);
  }, []);

  React.useEffect(() => {
    fetchAnalyticsData().then(() => {
      setLoading(false);
    }).catch((err) => {
      console.error('Failed to fetch analytics', err);
      setLoading(false);
    });
  }, [fetchAnalyticsData]);

  const handleGeneratePdf = async () => {
    try {
      setActionMessage('Preparing PDF export...');
      const res = await fetch(`${API_BASE}/reports/export?format=pdf`);
      const json = await res.json();
      if (json.success) {
        setActionMessage(json.message || 'PDF export ready.');
        if (json.downloadUrl) {
          window.open(`${API_BASE.replace('/api', '')}${json.downloadUrl}`, '_blank');
        }
      } else {
        setActionMessage(json.message || 'Failed to generate PDF.');
      }
    } catch (error) {
      setActionMessage('PDF export failed. Backend unavailable.');
    }
  };

  const handleLiveSync = async () => {
    try {
      setSyncing(true);
      setActionMessage('Syncing live analytics data...');
      await fetch(`${API_BASE}/health`);
      await fetchAnalyticsData();
      setActionMessage('Live sync completed successfully.');
    } catch (error) {
      setActionMessage('Live sync failed. Please check backend.');
    } finally {
      setSyncing(false);
    }
  };

  const handleUploadPdf = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setActionMessage('Uploading PDF metadata...');
      const response = await fetch(`${API_BASE}/uploads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ngoId: 1,
          fileName: file.name,
          fileType: 'pdf',
          source: 'analytics-manual-upload'
        })
      });
      const result = await response.json();
      setActionMessage(result?.message || 'PDF upload job submitted.');
      await fetchAnalyticsData();
    } catch (error) {
      setActionMessage('PDF upload failed.');
    } finally {
      event.target.value = '';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!data) return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500">
      <AlertTriangle size={48} className="mb-4 opacity-20" />
      <p className="text-xl font-display font-bold">Analytics Data Unavailable</p>
    </div>
  );

  return (
    <div className="p-8 space-y-12 pb-32">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter italic">Intelligence Analytics</h2>
          <p className="text-slate-500 font-medium">Deep-dive into community impact and resource optimization metrics.</p>
        </div>
        <div className="flex gap-4">
           <button
             onClick={handleGeneratePdf}
             className="bg-slate-900 border border-slate-800 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-slate-600 transition-all"
           >
             Generate PDF
           </button>
           <button
             onClick={() => uploadInputRef.current?.click()}
             className="bg-blue-500/10 border border-blue-500/40 text-blue-400 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-black transition-all"
           >
             Upload PDF
           </button>
           <button
             onClick={handleLiveSync}
             disabled={syncing}
             className="bg-green-500 text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-500/20 disabled:opacity-60"
           >
             Live Sync
           </button>
           <input ref={uploadInputRef} type="file" accept="application/pdf" onChange={handleUploadPdf} className="hidden" />
        </div>
      </div>
      {actionMessage && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-3 text-xs text-slate-300 font-medium">
          {actionMessage}
        </div>
      )}

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.aiInsights.map((insight: any, i: number) => (
          <div key={i} className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 -z-10 ${
              insight.type === 'warning' ? 'bg-rose-500' : insight.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
            }`}></div>
            <div className="flex items-center gap-3 mb-4">
              {insight.type === 'warning' ? <AlertTriangle className="text-rose-500" size={18} /> : 
               insight.type === 'success' ? <CheckCircle2 className="text-green-500" size={18} /> : 
               <Info className="text-blue-500" size={18} />}
              <h4 className="text-sm font-black text-white uppercase tracking-widest">{insight.title}</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">{insight.content}</p>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.summaryStats.map((stat: any, i: number) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-slate-900/40 p-6 rounded-[2rem] border border-slate-800 shadow-xl"
          >
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-current bg-current/10 ${stat.color}`}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Flow Chart: Response Lifecycle */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-slate-900/40 backdrop-blur-md p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] -z-10"></div>
        <h3 className="font-display font-bold text-2xl text-white mb-12 text-center">System Response Lifecycle</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto relative">
           {[
             { label: 'Report', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
             { label: 'Analysis', icon: LayoutDashboard, color: 'text-purple-400', bg: 'bg-purple-400/10' },
             { label: 'Prioritize', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
             { label: 'Match', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
             { label: 'Resolve', icon: CheckCircle2, color: 'text-rose-400', bg: 'bg-rose-400/10' },
           ].map((step, i, arr) => (
             <React.Fragment key={i}>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="flex flex-col items-center gap-4 relative z-10"
                >
                   <div className={`w-20 h-20 rounded-3xl ${step.bg} ${step.color} flex items-center justify-center border border-current shadow-[0_0_30px_rgba(0,0,0,0.3)] group transition-all duration-500 cursor-pointer`}>
                      <step.icon size={32} className="group-hover:rotate-12 transition-transform" />
                   </div>
                   <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] font-display">{step.label}</span>
                </motion.div>
                {i < arr.length - 1 && (
                  <div className="hidden md:block h-[2px] flex-1 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 relative">
                     <motion.div 
                       animate={{ left: ['0%', '100%'] }}
                       transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                       className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-current rounded-full blur-[4px] opacity-20"
                     />
                  </div>
                )}
             </React.Fragment>
           ))}
        </div>
      </motion.div>

      {/* Network Data Architecture Flow */}
      <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <h3 className="font-display font-bold text-2xl text-white mb-12 text-center">Network Data Architecture</h3>
        <div className="relative flex items-center justify-center min-h-[300px]">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20 relative z-10 w-full max-w-4xl">
              {/* Layer 1: Sources */}
              <div className="flex flex-col justify-center space-y-6">
                 {['IoT Hubs', 'Web App', 'Social Feeds'].map((src, i) => (
                   <motion.div 
                     key={i} 
                     whileHover={{ x: 10, scale: 1.05 }}
                     className="px-6 py-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest text-center shadow-lg"
                   >
                     {src}
                   </motion.div>
                 ))}
              </div>

              {/* Layer 2: Core AI Engine */}
              <div className="flex items-center justify-center">
                 <motion.div 
                   animate={{ 
                     boxShadow: ['0 0 20px rgba(34,197,94,0.1)', '0 0 50px rgba(34,197,94,0.3)', '0 0 20px rgba(34,197,94,0.1)']
                   }}
                   transition={{ duration: 3, repeat: Infinity }}
                   className="w-44 h-44 rounded-full bg-green-500/10 border-2 border-green-500 flex flex-col items-center justify-center text-center p-4 relative group cursor-help"
                 >
                    <div className="absolute inset-0 rounded-full border border-green-500/30 animate-ping"></div>
                    <Zap className="text-green-500 mb-2" size={40} />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">AI Neural<br/>Match Engine</span>
                 </motion.div>
              </div>

              {/* Layer 3: Distribution */}
              <div className="flex flex-col justify-center space-y-6">
                 {['Regional NGOs', 'Volunteers', 'Dashboards'].map((dst, i) => (
                   <motion.div 
                     key={i} 
                     whileHover={{ x: -10, scale: 1.05 }}
                     className="px-6 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest text-center shadow-lg"
                   >
                     {dst}
                   </motion.div>
                 ))}
              </div>
           </div>

           {/* Background Decorative Lines (Simplified for CSS) */}
           <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20">
              <div className="w-full h-[2px] bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500"></div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Trend Chart */}
        <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
           <h3 className="font-display font-bold text-xl text-white mb-8">System Resource Trends</h3>
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.dailyTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="needs" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="matched" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', r: 4 }} />
                  <Line type="monotone" dataKey="volunteers" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Dual Pie Charts */}
        <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
           <div className="grid grid-cols-2 gap-4 h-full">
              <div className="flex flex-col">
                 <h3 className="font-display font-bold text-xs text-slate-500 uppercase tracking-widest mb-6">Need Types</h3>
                 <div className="flex-1 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data.categoryDistribution} innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                          {data.categoryDistribution.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              <div className="flex flex-col">
                 <h3 className="font-display font-bold text-xs text-slate-500 uppercase tracking-widest mb-6">Skill Pool</h3>
                 <div className="flex-1 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data.skillDistribution} innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                          {data.skillDistribution.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Reports Table Section */}
      <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-display font-bold text-xl text-white">Recent Submissions</h3>
            <p className="text-slate-500 text-xs font-medium">All reports submitted by the community in real-time.</p>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] font-black px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full">LIVE FEED</span>
          </div>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Title</th>
                <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Location</th>
                <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Urgency</th>
                <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Submitted By</th>
                <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report: any, i: number) => (
                <tr key={report.id} className="border-b border-slate-800/50 group hover:bg-slate-800/20 transition-colors">
                  <td className="py-4 px-4">
                    <p className="text-sm font-bold text-white group-hover:text-green-500 transition-colors">{report.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{report.type}</p>
                  </td>
                  <td className="py-4 px-4 text-xs font-medium text-slate-400 italic">
                    {report.location}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                      report.urgency === 'Critical' || report.urgency === 'High' ? 'text-rose-500 border-rose-500/20 bg-rose-500/10' :
                      report.urgency === 'Medium' ? 'text-amber-500 border-amber-500/20 bg-amber-500/10' :
                      'text-green-500 border-green-500/20 bg-green-500/10'
                    }`}>
                      {report.urgency}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs font-bold text-slate-300">
                    {report.submittedBy}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                       <span className={`w-1.5 h-1.5 rounded-full ${
                         report.status === 'open' ? 'bg-amber-500 animate-pulse' :
                         report.status === 'in-progress' ? 'bg-blue-500' : 'bg-green-500'
                       }`}></span>
                       <span className="text-[10px] font-black uppercase text-slate-500">{report.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Growth and Regional Distribution Section */}
      <div className="grid lg:grid-cols-3 gap-8">
         {/* Monthly Growth */}
         <div className="lg:col-span-2 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
            <h3 className="font-display font-bold text-xl text-white mb-8">Growth Trajectory</h3>
            <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.monthlyGrowth}>
                    <defs>
                      <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="impact" stroke="#22c55e" fillOpacity={1} fill="url(#colorImp)" strokeWidth={3} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Regional Share */}
         <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
            <h3 className="font-display font-bold text-xl text-white mb-8">Regional Coverage</h3>
            <div className="space-y-6">
               {data.regionalDistribution.map((reg: any, i: number) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                       <span className="text-slate-400">{reg.region} India</span>
                       <span className="text-white">{reg.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${reg.value}%` }}
                         transition={{ duration: 1, delay: i * 0.1 }}
                         className="h-full bg-green-500 rounded-full"
                       />
                    </div>
                 </div>
               ))}
        </div>
      </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Impact Velocity Bar Chart */}
        <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
           <h3 className="font-display font-bold text-xl text-white mb-8">Impact Velocity</h3>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.impactVelocity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                  <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30} />
                  <Bar dataKey="volunteers" fill="#22c55e" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Resource Allocation Horizontal Bars */}
        <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
           <h3 className="font-display font-bold text-xl text-white mb-8">Resource Optimization</h3>
           <div className="space-y-8">
              {data.resourceAllocation.map((res: any, i: number) => (
                <div key={i} className="space-y-3">
                   <div className="flex justify-between items-end">
                      <span className="text-sm font-black text-white uppercase tracking-widest font-display">{res.category}</span>
                      <span className="text-xs font-bold text-slate-500">{res.used}% Allocated</span>
                   </div>
                   <div className="h-3 w-full bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50 p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${res.used}%` }}
                        transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${
                          res.used > 80 ? 'from-rose-500 to-rose-400' : 
                          res.used > 50 ? 'from-amber-500 to-amber-400' : 
                          'from-emerald-500 to-emerald-400'
                        } shadow-[0_0_15px_rgba(0,0,0,0.2)]`}
                      />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const [settings, setSettings] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetch(`${API_BASE}/settings`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setSettings(json.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch settings', err);
        setLoading(false);
      });
  }, []);

  const updateSetting = async (key: string, value: any) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    setSaving(true);
    try {
      await fetch(`${API_BASE}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      });
    } catch (err) {
      console.error('Failed to update settings', err);
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!settings) return null;

  return (
    <div className="p-8 max-w-5xl space-y-8 pb-32">
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-violet-500"></div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">Administration</p>
            <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter italic">Settings Center</h2>
            <p className="text-slate-400 font-medium mt-2">Control platform behavior, privacy, and access policies from a single place.</p>
          </div>
          {saving && <span className="text-[10px] font-black text-emerald-400 animate-pulse uppercase tracking-widest">Syncing...</span>}
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 space-y-6">
          <h3 className="text-lg font-bold text-white">Platform Controls</h3>

          <div className="rounded-2xl border border-slate-800 bg-black/30 p-5 flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold">Global Notifications</h4>
              <p className="text-xs text-slate-500">Push alert routing for newly raised high-priority needs.</p>
            </div>
            <button
              onClick={() => updateSetting('notifications', !settings.notifications)}
              className={`w-14 h-8 rounded-full relative transition-all duration-300 ${settings.notifications ? 'bg-green-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${settings.notifications ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-black/30 p-5 flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold">AI Auto-Matching</h4>
              <p className="text-xs text-slate-500">Automatic volunteer matching based on skills and urgency score.</p>
            </div>
            <button
              onClick={() => updateSetting('autoMatching', !settings.autoMatching)}
              className={`w-14 h-8 rounded-full relative transition-all duration-300 ${settings.autoMatching ? 'bg-blue-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${settings.autoMatching ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-slate-800 bg-black/30 p-5">
              <h4 className="text-white font-semibold mb-2">Privacy Level</h4>
              <select
                value={settings.privacyMode}
                onChange={(e) => updateSetting('privacyMode', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-green-500 outline-none"
              >
                <option>Standard</option>
                <option>High</option>
                <option>Paranoid</option>
              </select>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-black/30 p-5">
              <h4 className="text-white font-semibold mb-2">Interface Theme</h4>
              <div className="flex gap-2">
                {['Dark', 'Light', 'Cyber'].map(t => (
                  <button
                    key={t}
                    onClick={() => updateSetting('theme', t)}
                    className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                      settings.theme === t ? 'bg-white text-black border-white' : 'border-slate-800 text-slate-500 hover:border-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center">
              <Shield size={18} />
            </div>
            <h3 className="text-lg font-bold text-white">Security & Keys</h3>
          </div>
          {settings.apiKeys && Object.entries(settings.apiKeys).map(([name, key]: any) => (
            <div key={name} className="p-4 bg-black/40 border border-slate-800 rounded-2xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{name} Access Token</p>
              <code className="text-xs text-emerald-400 break-all">{key}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AuthPage = ({ onLogin, onBack, initialIsSignUp }: { onLogin: (role: UserRole) => void; onBack: () => void; initialIsSignUp: boolean }) => {
  const [selectedRoleToLogin, setSelectedRoleToLogin] = useState<UserRole | null>(null);
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);

  return (
    <div className="min-h-screen w-full bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[160px] opacity-20 -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] opacity-20 -z-10 -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors mb-8">
           <ArrowRight size={16} className="rotate-180" /> Back to Home
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden transition-all duration-500">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-all duration-500 ${
             selectedRoleToLogin === 'admin' ? 'from-green-400 to-green-600' :
             selectedRoleToLogin === 'guest' ? 'from-blue-400 to-blue-600' :
             selectedRoleToLogin === 'public' ? 'from-slate-300 to-slate-500' :
             'from-green-500 via-blue-500 to-rose-500'
          }`}></div>
          
          {!selectedRoleToLogin ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10">
                 <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mx-auto mb-4">
                    <LockIcon size={32} />
                 </div>
                 <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">Access Protocol</h3>
                 <p className="text-slate-500 text-sm font-medium mt-2">Select your access tier to proceed</p>
              </div>
              <div className="space-y-4">
                {[
                  { role: 'admin', label: 'Super Admin', desc: 'Full system management & coordination', icon: ShieldCheck, color: 'text-green-500', bgHover: 'hover:border-green-500/50' },
                  { role: 'guest', label: 'Guest Observer', desc: 'Limited administrative oversight', icon: UserIcon, color: 'text-blue-500', bgHover: 'hover:border-blue-500/50' },
                  { role: 'public', label: 'Public User', desc: 'View global needs & community pulse', icon: Globe, color: 'text-slate-400', bgHover: 'hover:border-slate-400/50' },
                ].map((tier) => (
                  <button
                    key={tier.role}
                    onClick={() => setSelectedRoleToLogin(tier.role as UserRole)}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl bg-black/40 border border-slate-800 ${tier.bgHover} hover:bg-slate-800/50 transition-all text-left group`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${tier.color} group-hover:scale-110 transition-transform`}>
                      <tier.icon size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-white uppercase tracking-widest">{tier.label}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{tier.desc}</p>
                    </div>
                    <ArrowRight size={16} className={`text-slate-700 group-hover:${tier.color} group-hover:translate-x-1 transition-all`} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 relative">
              <button 
                onClick={() => setSelectedRoleToLogin(null)}
                className="absolute -top-4 -right-4 p-2 text-slate-500 hover:text-white transition-colors"
              >
                <Plus size={20} className="rotate-45" />
              </button>
              <div className="text-center mb-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                   selectedRoleToLogin === 'admin' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                   selectedRoleToLogin === 'guest' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                   'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                   {selectedRoleToLogin === 'admin' ? <ShieldCheck size={32} /> : selectedRoleToLogin === 'guest' ? <UserIcon size={32} /> : <Globe size={32} />}
                </div>
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                  {selectedRoleToLogin} {isSignUp ? 'Registration' : 'Login'}
                </h3>
                <p className="text-slate-500 text-sm font-medium mt-2">
                  {isSignUp ? 'Create a secure account to access features' : 'Enter your credentials to continue'}
                </p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  onLogin(selectedRoleToLogin);
                }} 
                className="space-y-4"
              >
                {isSignUp && (
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Full Name</label>
                    <div className="relative">
                       <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                       <input type="text" required placeholder="John Doe" className="w-full bg-[#020617] border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors" />
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Email Address</label>
                  <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                     <input type="email" required placeholder="name@example.com" className="w-full bg-[#020617] border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Password</label>
                  <div className="relative">
                     <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                     <input type="password" required placeholder="••••••••" className="w-full bg-[#020617] border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors" />
                  </div>
                </div>

                <button type="submit" className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-2xl transition-all mt-4 ${
                   selectedRoleToLogin === 'admin' ? 'bg-green-500 text-black hover:bg-green-400 shadow-green-500/20' :
                   selectedRoleToLogin === 'guest' ? 'bg-blue-500 text-white hover:bg-blue-400 shadow-blue-500/20' :
                   'bg-slate-200 text-black hover:bg-white shadow-slate-200/20'
                }`}>
                  {isSignUp ? 'Complete Registration' : 'Authenticate Identity'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"} 
                  <button type="button" onClick={() => setIsSignUp(!isSignUp)} className={`ml-1 font-bold hover:underline ${
                     selectedRoleToLogin === 'admin' ? 'text-green-500' :
                     selectedRoleToLogin === 'guest' ? 'text-blue-500' :
                     'text-slate-300'
                  }`}>
                     {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Landing Page View ---

const LandingPage = ({ onOpenAuth, onOpenReport, onOpenNgos, onOpenAbout, activeTab }: { onOpenAuth: (mode: 'login' | 'signup') => void; onOpenReport: () => void; onOpenNgos: () => void; onOpenAbout: () => void; activeTab: string; }) => {
  return (
    <div className="min-h-screen bg-[#020617]">
       {/* Global Navigation */}
       <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/50 backdrop-blur-2xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onOpenAbout()}>
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-black shadow-2xl shadow-green-500/30">
              <ShieldCheck size={24} fill="currentColor" />
            </div>
            <div>
              <span className="text-xl font-display font-black tracking-tight text-white block">SevaConnect</span>
              <span className="text-[9px] text-slate-500 font-black tracking-widest uppercase opacity-70">Connecting Needs. Creating Impact.</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-10">
            {['Home', 'Explore Needs', 'NGOs', 'Dashboard', 'About Us'].map((link) => (
              <a 
                key={link} 
                href={link === 'Dashboard' ? '#' : `#${link.toLowerCase().replace(' ', '-')}`} 
                onClick={(e) => {
                  if (link === 'Home') {
                    e.preventDefault();
                    onOpenAbout(); // Trick to route home by passing different string or handle in app
                    // Actually let's use href for simple scroll unless it's a special route.
                  }
                  if (link === 'Dashboard') {
                    e.preventDefault();
                    onOpenAuth('login');
                  }
                  if (link === 'NGOs') {
                    e.preventDefault();
                    onOpenNgos();
                    onOpenAuth('login');
                  }
                  if (link === 'About Us') {
                    e.preventDefault();
                    onOpenAbout();
                  }
                }}
                className={`text-xs font-black uppercase tracking-widest transition-all duration-300 ${link === 'Home' && activeTab === 'home' ? 'text-green-500' : 'text-slate-400 hover:text-white hover:translate-y-[-1px]'}`}
              >
                {link}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
             <button 
              onClick={() => onOpenAuth('login')}
              className="hidden sm:block text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white transition-colors"
             >
               Log In
             </button>
             <button 
               onClick={() => onOpenAuth('signup')}
               className="bg-green-500 text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-green-500/20 hover:scale-105 active:scale-95 transition-all"
             >
               Sign Up
             </button>
          </div>
        </div>


      </nav>

      {activeTab === 'about-landing' ? (
        <section className="pt-44 pb-32 px-8 min-h-[80vh] flex items-center justify-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#020617] to-slate-900/50 -z-10"></div>
           <FadeContent blur={true} duration={1000}>
              <div className="max-w-4xl mx-auto text-center">
                 <h2 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter mb-8">About <span className="text-green-500">Us</span></h2>
                 <p className="text-xl text-slate-400 leading-relaxed font-medium mb-16">
                   SevaConnect is a technology-driven community platform dedicated to bridging the gap between those in need and those who can help. Our mission is to enable rapid response to community needs, ensuring that no request for help goes unanswered. We believe in the power of local communities powered by global technology.
                 </p>
                 <div className="grid md:grid-cols-3 gap-8 text-left">
                    <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800 shadow-xl hover:border-green-500/50 transition-colors">
                       <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                       <p className="text-slate-500 text-sm">To create a resilient network of volunteers and NGOs across India that can respond to any crisis.</p>
                    </div>
                    <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800 shadow-xl hover:border-green-500/50 transition-colors">
                       <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                       <p className="text-slate-500 text-sm">Provide real-time technology solutions to mobilize relief efforts and track impact securely.</p>
                    </div>
                    <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800 shadow-xl hover:border-green-500/50 transition-colors">
                       <h3 className="text-2xl font-bold text-white mb-4">Our Values</h3>
                       <p className="text-slate-500 text-sm">Transparency, Empathy, Action, and always putting the Community First.</p>
                    </div>
                 </div>
              </div>
           </FadeContent>
        </section>
      ) : (
        <>
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
      </>
      )}

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
  const [assigningTo, setAssigningTo] = useState<number | null>(null);
  const [apiNeeds, setApiNeeds] = useState<NeedRecord[]>(NEEDS);
  const [apiVolunteers, setApiVolunteers] = useState<VolunteerRecord[]>(VOLUNTEERS);
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [requestAfterLoginTab, setRequestAfterLoginTab] = useState<string>('dashboard');
  const [reportForm, setReportForm] = useState({
    title: '',
    area: '',
    type: 'Food',
    volunteersNeeded: 1,
    urgency: 'Medium',
    description: ''
  });
  const [reportMessage, setReportMessage] = useState('');
  const [summaryForm, setSummaryForm] = useState({
    needId: 0,
    finalStatus: 'resolved',
    summary: '',
    impact: '',
    nextSteps: '',
    closedBy: 'Admin User'
  });
  const [summaryMessage, setSummaryMessage] = useState('');

  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    location: '',
    skills: '',
    hours: 0
  });
  const [volunteerMessage, setVolunteerMessage] = useState('');
  const [volunteerVerificationStream, setVolunteerVerificationStream] = useState<MediaStream | null>(null);
  const [volunteerCameraError, setVolunteerCameraError] = useState('');
  const [showCameraPermissionPopup, setShowCameraPermissionPopup] = useState(false);
  const [cameraPermissionState, setCameraPermissionState] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [cameraDeviceLabel, setCameraDeviceLabel] = useState('');
  const volunteerCameraRef = useRef<HTMLVideoElement | null>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setActiveTab(requestAfterLoginTab || 'dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setActiveTab('home');
  };

  const [theme, setTheme] = useState('dark');

  const fetchPlatformData = async () => {
    try {
      const [needsRes, volunteersRes, settingsRes] = await Promise.all([
        fetch(`${API_BASE}/needs`),
        fetch(`${API_BASE}/volunteers`),
        fetch(`${API_BASE}/settings`)
      ]);
      const needsJson = await needsRes.json();
      const volunteersJson = await volunteersRes.json();
      const settingsJson = await settingsRes.json();
      if (needsJson?.data) setApiNeeds(needsJson.data);
      if (volunteersJson?.data) setApiVolunteers(volunteersJson.data);
      if (settingsJson?.data?.theme) setTheme(settingsJson.data.theme);
    } catch (error) {
      console.error('Backend connection failed', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    try {
      await fetch(`${API_BASE}/settings/theme`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme })
      });
      setTheme(newTheme);
    } catch (error) {
      console.error('Failed to change theme', error);
    }
  };

  React.useEffect(() => {
    fetchPlatformData();
  }, []);

  React.useEffect(() => {
    if (activeTab !== 'volunteers') {
      setVolunteerVerificationStream((previousStream) => {
        previousStream?.getTracks().forEach((track) => track.stop());
        return null;
      });
      setShowCameraPermissionPopup(false);
      setCameraPermissionState('idle');
      setVolunteerCameraError('');
      return;
    }
    setShowCameraPermissionPopup(true);
    return () => {
      setVolunteerVerificationStream((previousStream) => {
        previousStream?.getTracks().forEach((track) => track.stop());
        return null;
      });
    };
  }, [activeTab]);

  React.useEffect(() => {
    if (!volunteerCameraRef.current) return;
    if (!volunteerVerificationStream) {
      volunteerCameraRef.current.srcObject = null;
      return;
    }
    volunteerCameraRef.current.srcObject = volunteerVerificationStream;
    volunteerCameraRef.current.play().catch(() => {});
  }, [volunteerVerificationStream]);

  const requestVolunteerCameraAccess = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setVolunteerCameraError('Camera is not supported in this browser.');
      setCameraPermissionState('denied');
      setShowCameraPermissionPopup(false);
      return;
    }
    try {
      let stream: MediaStream;
      try {
        // Explicit constraints to ensure an actual webcam feed is requested.
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch {
        // Fallback for systems that reject strict constraints.
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      const firstVideoTrack = stream.getVideoTracks()[0];
      if (!firstVideoTrack) {
        throw new Error('No camera track available');
      }

      setVolunteerVerificationStream(stream);
      setCameraDeviceLabel(firstVideoTrack.label || 'Default Camera');
      setVolunteerCameraError('');
      setCameraPermissionState('granted');
      setShowCameraPermissionPopup(false);
    } catch (error) {
      setVolunteerCameraError('Camera permission is required for volunteer verification.');
      setCameraPermissionState('denied');
      setCameraDeviceLabel('');
      setShowCameraPermissionPopup(false);
    }
  };

  const denyVolunteerCameraAccess = () => {
    setVolunteerVerificationStream((previousStream) => {
      previousStream?.getTracks().forEach((track) => track.stop());
      return null;
    });
    setCameraPermissionState('denied');
    setCameraDeviceLabel('');
    setVolunteerCameraError('Verification camera access was denied.');
    setShowCameraPermissionPopup(false);
  };

  const assignTask = async (needId: number, volunteerId: number) => {
    if (userRole !== 'admin') return;
    await fetch(`${API_BASE}/needs/${needId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ volunteerId, ngoId: 1 })
    });
    await fetchPlatformData();
  };

  const openVolunteerProfile = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/volunteers/${id}`);
      const result = await response.json();
      if (result?.success && result?.data) {
        setSelectedVolunteer(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch volunteer profile', error);
    }
  };

  const deleteVolunteer = async (id: number) => {
    if (userRole !== 'admin') return;
    const previousVolunteers = apiVolunteers;
    const previousNeeds = apiNeeds;

    // Optimistic UI: remove the whole volunteer card instantly.
    setApiVolunteers(prev => prev.filter(v => v.id !== id));
    setApiNeeds(prev =>
      prev.map(need => ({
        ...need,
        assignedVolunteerIds: (need.assignedVolunteerIds || []).filter(volunteerId => volunteerId !== id)
      }))
    );

    try {
      const response = await fetch(`${API_BASE}/volunteers/${id}`, { method: 'DELETE' });
      if (response.ok) {
        if (selectedVolunteer?.id === id) setSelectedVolunteer(null);
        await fetchPlatformData();
      } else {
        // Rollback UI if backend delete fails.
        setApiVolunteers(previousVolunteers);
        setApiNeeds(previousNeeds);
      }
    } catch (error) {
      console.error('Failed to delete volunteer', error);
      setApiVolunteers(previousVolunteers);
      setApiNeeds(previousNeeds);
    }
  };

  const removeTask = async (needId: number, volunteerId: number) => {
    if (userRole !== 'admin') return;
    await fetch(`${API_BASE}/needs/${needId}/assign/${volunteerId}`, { method: 'DELETE' });
    await fetchPlatformData();
  };

  const deleteNeed = async (id: number) => {
    if (userRole !== 'admin') return;
    try {
      const response = await fetch(`${API_BASE}/needs/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchPlatformData();
      }
    } catch (error) {
      console.error('Failed to delete need', error);
    }
  };

  const openReportPage = () => {
    if (userRole) {
      setActiveTab('submit-report');
      return;
    }
    setRequestAfterLoginTab('submit-report');
  };

  const openNgosPage = () => {
    if (userRole) {
      setActiveTab('ngos');
      return;
    }
    setRequestAfterLoginTab('ngos');
  };

  const submitReport = async () => {
    setReportMessage('Submitting...');
    try {
      const response = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportForm)
      });
      const result = await response.json();
      if (!response.ok) {
        setReportMessage(result?.message || 'Failed to submit report');
        return;
      }
      setReportMessage('Report submitted successfully.');
      setReportForm({
        title: '',
        area: '',
        type: 'Food',
        volunteersNeeded: 1,
        urgency: 'Medium',
        description: ''
      });
      await fetchPlatformData();
    } catch (error) {
      setReportMessage('Backend unavailable. Please start backend server.');
    }
  };

  const submitTaskSummary = async () => {
    if (!summaryForm.needId) {
      setSummaryMessage('Please select a task.');
      return;
    }
    if (!summaryForm.summary.trim()) {
      setSummaryMessage('Please write a final summary before submitting.');
      return;
    }

    setSummaryMessage('Submitting conclusion...');
    try {
      const response = await fetch(`${API_BASE}/needs/${summaryForm.needId}/conclusion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summaryForm)
      });
      const result = await response.json();
      if (!response.ok) {
        setSummaryMessage(result?.message || 'Failed to submit conclusion.');
        return;
      }
      setSummaryMessage(result?.message || 'Task conclusion submitted successfully.');
      setSummaryForm({
        needId: 0,
        finalStatus: 'resolved',
        summary: '',
        impact: '',
        nextSteps: '',
        closedBy: 'Admin User'
      });
      await fetchPlatformData();
    } catch (error) {
      setSummaryMessage('Backend unavailable. Please start backend server.');
    }
  };

  const submitVolunteer = async () => {
    setVolunteerMessage('Submitting...');
    try {
      const payload = {
        ...volunteerForm,
        skills: volunteerForm.skills.split(',').map(s => s.trim()).filter(Boolean),
        available: true,
        verified: true
      };
      const response = await fetch(`${API_BASE}/volunteers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) {
        setVolunteerMessage(result?.message || 'Failed to register volunteer');
        return;
      }
      setVolunteerMessage('Volunteer registered successfully.');
      setVolunteerForm({ name: '', location: '', skills: '', hours: 0 });
      await fetchPlatformData();
    } catch (error) {
      setVolunteerMessage('Backend unavailable. Please start backend server.');
    }
  };

  return (
    <div className="font-sans antialiased text-slate-100 selection:bg-green-500 selection:text-black min-h-screen">
      <AnimatePresence mode="wait">
        {!userRole ? (
          (activeTab === 'login' || activeTab === 'signup') ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <AuthPage onLogin={handleLogin} onBack={() => setActiveTab('home')} initialIsSignUp={activeTab === 'signup'} />
            </motion.div>
          ) : (activeTab === 'home' || activeTab === 'about-landing') ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LandingPage onOpenAuth={(mode) => setActiveTab(mode)} onOpenReport={openReportPage} onOpenNgos={openNgosPage} onOpenAbout={() => setActiveTab('about-landing')} activeTab={activeTab} />
            </motion.div>
          ) : null
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
              <Header userRole={userRole} setActiveTab={setActiveTab} theme={theme} toggleTheme={toggleTheme} />
              <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                {activeTab === 'dashboard' && <DashboardPage />}
                {activeTab === 'notifications' && <NotificationsPage />}
                {activeTab === 'ngos' && (
                  <NgosPage
                    userRole={userRole}
                    onDeleteVolunteer={deleteVolunteer}
                    onDeleteNeed={deleteNeed}
                  />
                )}
                {activeTab === 'needs' && (
                  <div className="p-8 space-y-8 pb-32">
                     <div className="flex items-end justify-between">
                        <div>
                          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter italic">Global Needs Registry</h2>
                          <p className="text-slate-500 font-medium">Prioritized by real-time urgency and proximity signatures.</p>
                        </div>
                        {userRole === 'admin' && (
                          <button 
                            onClick={() => setActiveTab('submit-report')}
                            className="bg-green-500 text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-green-500/20"
                          >
                             + Register New Need
                          </button>
                        )}
                     </div>
                     <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {apiNeeds.map(need => {
                          const assignedId = need.assignedVolunteerIds?.[0];
                          const volunteer = assignedId ? apiVolunteers.find(v => v.id === assignedId) : undefined;
                          return (
                            <NeedCard 
                              key={need.id} 
                              need={need} 
                              userRole={userRole}
                              assignedVolunteer={volunteer}
                              onAssign={() => setAssigningTo(need.id)}
                              onRemove={() => volunteer && removeTask(need.id, volunteer.id)}
                              onDeleteNeed={() => deleteNeed(need.id)}
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
                                {apiVolunteers.map(v => (
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
                {activeTab === 'analytics' && <AnalyticsPage />}
                {activeTab === 'settings' && <SettingsPage />}
                {activeTab === 'volunteers' && (
                  <div className="p-8 space-y-8 pb-32">
                    <AnimatePresence>
                      {showCameraPermissionPopup && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
                        >
                          <motion.div
                            initial={{ scale: 0.95, y: 16 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 16 }}
                            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2rem] p-8"
                          >
                            <h3 className="text-2xl font-display font-black text-white mb-3">Allow Camera Verification?</h3>
                            <p className="text-sm text-slate-400 mb-8">
                              This page uses your camera to verify volunteers. Click allow to open webcam verification.
                            </p>
                            <div className="flex items-center justify-end gap-3">
                              <button onClick={denyVolunteerCameraAccess} className="px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                                Deny
                              </button>
                              <button onClick={requestVolunteerCameraAccess} className="bg-green-500 text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-green-500/20 hover:bg-green-400 transition-colors">
                                Allow Camera
                              </button>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex items-end justify-between">
                       <div>
                          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter italic">Volunteer Pool</h2>
                          <p className="text-slate-500 font-medium">Accessing {apiVolunteers.length} verified response agents in your quadrant.</p>
                       </div>
                       <div className="flex items-center gap-4">
                         <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-green-500 transition-colors" size={18} />
                            <input type="text" placeholder="Skill or UID Search..." className="bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-6 py-3 text-xs font-bold focus:outline-none focus:border-green-500" />
                         </div>
                         {userRole === 'admin' && (
                           <>
                             <button 
                               onClick={() => setActiveTab('register-volunteer')}
                               className="bg-green-500 text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-green-500/20 hover:bg-green-400 transition-colors"
                             >
                               + Register Volunteer
                             </button>
                           </>
                         )}
                       </div>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-sm font-black text-white uppercase tracking-widest">Volunteer Verification Camera</h3>
                          {cameraDeviceLabel && (
                            <p className="text-[10px] text-slate-500 mt-1">{cameraDeviceLabel}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {cameraPermissionState !== 'granted' && (
                            <button
                              onClick={() => setShowCameraPermissionPopup(true)}
                              className="px-3 py-1.5 rounded-lg border border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:border-green-500 hover:text-green-400 transition-colors"
                            >
                              Enable Camera
                            </button>
                          )}
                          <span className={`text-[10px] font-black uppercase tracking-widest ${volunteerVerificationStream ? 'text-green-400' : cameraPermissionState === 'denied' ? 'text-rose-400' : 'text-slate-500'}`}>
                            {volunteerVerificationStream ? 'Live' : cameraPermissionState === 'denied' ? 'Denied' : 'Offline'}
                          </span>
                        </div>
                      </div>
                      {volunteerCameraError ? (
                        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
                          {volunteerCameraError}
                        </div>
                      ) : (
                        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black">
                          <video ref={volunteerCameraRef} className="w-full max-h-72 object-cover" autoPlay muted playsInline />
                        </div>
                      )}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <h3 className="text-xl font-display font-bold text-white border-l-4 border-green-500 pl-4 mb-8">Verified Digital Identities</h3>
                        {apiVolunteers.slice(0, 2).map(v => (
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
                          {apiVolunteers.map(v => (
                            <VolunteerCard
                              key={v.id}
                              volunteer={v}
                              userRole={userRole || undefined}
                              onDelete={() => deleteVolunteer(v.id)}
                              onProfile={() => openVolunteerProfile(v.id)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <AnimatePresence>
                  {selectedVolunteer && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                      <motion.div
                        initial={{ y: 20, scale: 0.96 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 20, scale: 0.96 }}
                        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[2rem] p-8 relative"
                      >
                        <button onClick={() => setSelectedVolunteer(null)} className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                          <Plus size={18} className="rotate-45" />
                        </button>
                        <div className="flex items-center gap-4 mb-6">
                          <img src={selectedVolunteer.avatar} alt={selectedVolunteer.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-700" />
                          <div>
                            <h3 className="text-2xl font-display font-bold text-white">{selectedVolunteer.name}</h3>
                            <p className="text-sm text-slate-400">{selectedVolunteer.location}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="p-4 rounded-2xl border border-slate-800 bg-black/30">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Hours</p>
                            <p className="text-2xl font-black text-green-400 mt-1">{selectedVolunteer.hours}</p>
                          </div>
                          <div className="p-4 rounded-2xl border border-slate-800 bg-black/30">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Skills</p>
                            <p className="text-sm text-white mt-1">{selectedVolunteer.skills.length}</p>
                          </div>
                        </div>
                        <div className="p-4 rounded-2xl border border-slate-800 bg-black/30">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Skill Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedVolunteer.skills.map((skill) => (
                              <span key={skill} className="px-3 py-1 rounded-full text-xs border border-green-500/30 text-green-400 bg-green-500/10">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {activeTab === 'submit-report' && (
                  <div className="p-8 max-w-4xl mx-auto">
                    <div className="mb-10">
                      <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter mb-3 flex items-center gap-4">
                        <span className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center border border-green-500/20"><Plus size={24} /></span>
                        Register New Need
                      </h2>
                      <p className="text-slate-500 font-medium text-lg ml-16">Register a new community need to alert volunteers and NGOs in the area.</p>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
                      
                      <div className="grid gap-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Need Title</label>
                            <div className="relative group">
                              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-500 transition-colors" size={18} />
                              <input value={reportForm.title} onChange={(e) => setReportForm(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g., Medical Supplies Needed" className="w-full bg-black/50 border border-slate-800 focus:border-green-500 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-slate-600 transition-all outline-none" />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</label>
                            <div className="relative group">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-500 transition-colors" size={18} />
                              <input value={reportForm.area} onChange={(e) => setReportForm(prev => ({ ...prev, area: e.target.value }))} placeholder="e.g., Downtown District" className="w-full bg-black/50 border border-slate-800 focus:border-green-500 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-slate-600 transition-all outline-none" />
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                            <div className="relative group">
                              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-500 transition-colors" size={18} />
                              <select value={reportForm.type} onChange={(e) => setReportForm(prev => ({ ...prev, type: e.target.value }))} className="w-full bg-black/50 border border-slate-800 focus:border-green-500 rounded-2xl pl-12 pr-4 py-4 text-sm text-white transition-all outline-none appearance-none">
                                <option>Food</option><option>Health</option><option>Education</option><option>Shelter</option><option>Environment</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Urgency</label>
                            <div className="relative group">
                              <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-500 transition-colors" size={18} />
                              <select value={reportForm.urgency} onChange={(e) => setReportForm(prev => ({ ...prev, urgency: e.target.value }))} className="w-full bg-black/50 border border-slate-800 focus:border-green-500 rounded-2xl pl-12 pr-4 py-4 text-sm text-white transition-all outline-none appearance-none">
                                <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Volunteers</label>
                            <div className="relative group">
                              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-500 transition-colors" size={18} />
                              <input type="number" min={1} value={reportForm.volunteersNeeded} onChange={(e) => setReportForm(prev => ({ ...prev, volunteersNeeded: Number(e.target.value) || 1 }))} className="w-full bg-black/50 border border-slate-800 focus:border-green-500 rounded-2xl pl-12 pr-4 py-4 text-sm text-white transition-all outline-none" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                          <textarea value={reportForm.description} onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))} rows={4} placeholder="Detailed description of the requirement..." className="w-full bg-black/50 border border-slate-800 focus:border-green-500 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 transition-all outline-none resize-none" />
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                          {reportMessage ? (
                            <p className="text-sm font-bold text-green-400 flex items-center gap-2"><CheckCircle2 size={16} /> {reportMessage}</p>
                          ) : <div/>}
                          <div className="flex items-center gap-4">
                            <button onClick={() => setActiveTab('needs')} className="px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Cancel</button>
                            <button onClick={submitReport} className="bg-green-500 text-black px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-green-500/20 hover:bg-green-400 hover:scale-105 transition-all">Register Need</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'task-summary' && (
                  <div className="p-8 max-w-4xl mx-auto">
                    <div className="mb-10">
                      <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter mb-3 flex items-center gap-4">
                        <span className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20"><CheckCircle2 size={24} /></span>
                        Submit Task Conclusion
                      </h2>
                      <p className="text-slate-500 font-medium text-lg ml-16">Submit the final conclusion summary for a completed or closed task.</p>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>

                      <div className="grid gap-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Task</label>
                            <div className="relative group">
                              <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                              <select
                                value={summaryForm.needId || ''}
                                onChange={(e) => setSummaryForm(prev => ({ ...prev, needId: Number(e.target.value) || 0 }))}
                                className="w-full bg-black/50 border border-slate-800 focus:border-emerald-500 rounded-2xl pl-12 pr-4 py-4 text-sm text-white transition-all outline-none appearance-none"
                              >
                                <option value="">Choose a task</option>
                                {apiNeeds.map((need) => (
                                  <option key={need.id} value={need.id}>
                                    {need.title} ({need.area || need.location || 'Unknown Area'})
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Status</label>
                            <div className="relative group">
                              <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                              <select
                                value={summaryForm.finalStatus}
                                onChange={(e) => setSummaryForm(prev => ({ ...prev, finalStatus: e.target.value }))}
                                className="w-full bg-black/50 border border-slate-800 focus:border-emerald-500 rounded-2xl pl-12 pr-4 py-4 text-sm text-white transition-all outline-none appearance-none"
                              >
                                <option value="resolved">Resolved</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Summary</label>
                          <textarea
                            value={summaryForm.summary}
                            onChange={(e) => setSummaryForm(prev => ({ ...prev, summary: e.target.value }))}
                            rows={4}
                            placeholder="Write the final conclusion and closure notes for this task..."
                            className="w-full bg-black/50 border border-slate-800 focus:border-emerald-500 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 transition-all outline-none resize-none"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Impact Delivered</label>
                            <input
                              value={summaryForm.impact}
                              onChange={(e) => setSummaryForm(prev => ({ ...prev, impact: e.target.value }))}
                              placeholder="e.g., 120 families supported"
                              className="w-full bg-black/50 border border-slate-800 focus:border-emerald-500 rounded-2xl px-4 py-4 text-sm text-white placeholder:text-slate-600 transition-all outline-none"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Closed By</label>
                            <input
                              value={summaryForm.closedBy}
                              onChange={(e) => setSummaryForm(prev => ({ ...prev, closedBy: e.target.value }))}
                              placeholder="e.g., Regional Coordinator"
                              className="w-full bg-black/50 border border-slate-800 focus:border-emerald-500 rounded-2xl px-4 py-4 text-sm text-white placeholder:text-slate-600 transition-all outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Follow-up Notes (Optional)</label>
                          <textarea
                            value={summaryForm.nextSteps}
                            onChange={(e) => setSummaryForm(prev => ({ ...prev, nextSteps: e.target.value }))}
                            rows={3}
                            placeholder="Any follow-up recommendations for future tasks..."
                            className="w-full bg-black/50 border border-slate-800 focus:border-emerald-500 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 transition-all outline-none resize-none"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                          {summaryMessage ? (
                            <p className="text-sm font-bold text-emerald-400 flex items-center gap-2"><CheckCircle2 size={16} /> {summaryMessage}</p>
                          ) : <div />}
                          <div className="flex items-center gap-4">
                            <button onClick={() => setActiveTab('needs')} className="px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Cancel</button>
                            <button onClick={submitTaskSummary} className="bg-emerald-500 text-black px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 hover:scale-105 transition-all">Submit Conclusion</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'register-volunteer' && (
                  <div className="p-8 max-w-4xl mx-auto">
                    <div className="mb-10">
                      <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter mb-3 flex items-center gap-4">
                        <span className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20"><UserIcon size={24} /></span>
                        Register Volunteer
                      </h2>
                      <p className="text-slate-500 font-medium text-lg ml-16">Add a new verified identity to the global response network.</p>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                      
                      <div className="grid gap-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                            <div className="relative group">
                              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                              <input value={volunteerForm.name} onChange={(e) => setVolunteerForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., Sarah Connor" className="w-full bg-black/50 border border-slate-800 focus:border-blue-500 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-slate-600 transition-all outline-none" />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location / Region</label>
                            <div className="relative group">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                              <input value={volunteerForm.location} onChange={(e) => setVolunteerForm(prev => ({ ...prev, location: e.target.value }))} placeholder="e.g., Sector 7G" className="w-full bg-black/50 border border-slate-800 focus:border-blue-500 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-slate-600 transition-all outline-none" />
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Skills (Comma separated)</label>
                            <div className="relative group">
                              <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                              <input value={volunteerForm.skills} onChange={(e) => setVolunteerForm(prev => ({ ...prev, skills: e.target.value }))} placeholder="e.g., Paramedic, Logistics" className="w-full bg-black/50 border border-slate-800 focus:border-blue-500 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-slate-600 transition-all outline-none" />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Hours</label>
                            <div className="relative group">
                              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                              <input type="number" min={0} value={volunteerForm.hours} onChange={(e) => setVolunteerForm(prev => ({ ...prev, hours: Number(e.target.value) || 0 }))} placeholder="0" className="w-full bg-black/50 border border-slate-800 focus:border-blue-500 rounded-2xl pl-12 pr-4 py-4 text-sm text-white transition-all outline-none" />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                          {volunteerMessage ? (
                            <p className="text-sm font-bold text-blue-400 flex items-center gap-2"><CheckCircle2 size={16} /> {volunteerMessage}</p>
                          ) : <div/>}
                          <div className="flex items-center gap-4">
                            <button onClick={() => setActiveTab('volunteers')} className="px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Cancel</button>
                            <button onClick={submitVolunteer} className="bg-blue-500 text-black px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-400 hover:scale-105 transition-all">Verify Identity</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!['dashboard', 'ngos', 'needs', 'volunteers', 'submit-report', 'task-summary', 'register-volunteer', 'analytics', 'settings', 'notifications'].includes(activeTab) && (
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
