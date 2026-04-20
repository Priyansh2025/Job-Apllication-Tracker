import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { User, LogOut, Briefcase, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const { jobs } = useJobs();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Calculate stats
  const totalJobs = jobs.length;
  const interviewing = jobs.filter(j => j.status === 'Interviewing').length;
  const offered = jobs.filter(j => j.status === 'Offered').length;
  const rejected = jobs.filter(j => j.status === 'Rejected').length;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full mb-4 flex items-center justify-center">
               <User className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{currentUser?.name || 'Applicant'}</h2>
            <p className="text-sm text-gray-500 mb-6">{currentUser?.email}</p>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-full gap-2 text-sm text-red-600 hover:bg-red-50 py-2 rounded-xl border border-red-100 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Search Metrics</h3>
             
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                 <div className="flex items-center gap-2 text-gray-500 mb-2">
                   <Briefcase className="w-4 h-4" />
                   <span className="text-sm font-medium">Total Tracked</span>
                 </div>
                 <span className="text-3xl font-bold text-gray-900">{totalJobs}</span>
               </div>
               
               <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                 <div className="flex items-center gap-2 text-purple-700 mb-2">
                   <TrendingUp className="w-4 h-4" />
                   <span className="text-sm font-medium">Interviewing</span>
                 </div>
                 <span className="text-3xl font-bold text-purple-900">{interviewing}</span>
               </div>
               
               <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                 <div className="flex items-center gap-2 text-green-700 mb-2">
                   <CheckCircle className="w-4 h-4" />
                   <span className="text-sm font-medium">Offers</span>
                 </div>
                 <span className="text-3xl font-bold text-green-900">{offered}</span>
               </div>
               
               <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                 <div className="flex items-center gap-2 text-red-700 mb-2">
                   <XCircle className="w-4 h-4" />
                   <span className="text-sm font-medium">Rejected</span>
                 </div>
                 <span className="text-3xl font-bold text-red-900">{rejected}</span>
               </div>
             </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
             <div className="space-y-4">
                {jobs.slice(-3).reverse().map(job => (
                  <div key={job.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-gray-900">{job.role}</h4>
                      <p className="text-sm text-gray-500">{job.company}</p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <p className="text-gray-500 text-sm">No activity recorded yet.</p>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
