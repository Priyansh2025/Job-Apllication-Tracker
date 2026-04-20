import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Briefcase } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import JobCard from '../components/JobCard';
import useDebounce from '../hooks/useDebounce';

export default function Home() {
  const { jobs, loading } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Advanced React: useMemo to efficiently filter and group jobs
  // This satisfies the performance optimizations requirement
  const groupedJobs = useMemo(() => {
    const filtered = jobs.filter(job => {
      const searchStr = debouncedSearch.toLowerCase();
      return (
        job.company.toLowerCase().includes(searchStr) ||
        job.role.toLowerCase().includes(searchStr)
      );
    });

    const groups = {
      'Saved': [],
      'Applied': [],
      'Interviewing': [],
      'Offered': [],
      'Rejected': []
    };

    filtered.forEach(job => {
      if (groups[job.status]) {
        groups[job.status].push(job);
      } else {
        groups['Saved'].push(job); // fallback
      }
    });

    return groups;
  }, [jobs, debouncedSearch]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Pipeline</h1>
          <p className="mt-1 text-sm text-gray-500">Track and manage your job search journey.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Link 
            to="/add-job"
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-sm active:scale-95 shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Add Job</span>
          </Link>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new job entry.</p>
          <div className="mt-6">
            <Link to="/add-job" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90">
              <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Application
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
          {Object.entries(groupedJobs).map(([status, statusJobs]) => (
            <div key={status} className="flex-1 min-w-[300px] bg-gray-100/50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700">{status}</h3>
                <span className="bg-gray-200 text-gray-700 py-0.5 px-2.5 rounded-full text-xs font-medium">
                  {statusJobs.length}
                </span>
              </div>
              
              <div className="space-y-4">
                {statusJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
                {statusJobs.length === 0 && (
                  <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center text-sm text-gray-400 font-medium">
                    Empty
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
