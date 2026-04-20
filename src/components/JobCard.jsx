import { Link } from 'react-router-dom';
import { Building2, Calendar, MapPin } from 'lucide-react';

const statusColors = {
  Saved: 'bg-gray-100 text-gray-800 border-gray-200',
  Applied: 'bg-blue-50 text-blue-700 border-blue-200',
  Interviewing: 'bg-purple-50 text-purple-700 border-purple-200',
  Offered: 'bg-green-50 text-green-700 border-green-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
};

export default function JobCard({ job }) {
  const badgeClasses = statusColors[job.status] || statusColors.Saved;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow relative group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
            {job.role}
          </h3>
          <div className="flex items-center text-gray-600 mt-1 space-x-2 text-sm">
            <Building2 className="w-4 h-4" />
            <span>{job.company}</span>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${badgeClasses}`}>
          {job.status}
        </span>
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-500 mb-5">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{job.location || 'Remote'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Applied: {job.dateApplied ? new Date(job.dateApplied).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>

      <Link 
        to={`/job/${job.id}`}
        className="block w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium py-2 rounded-lg transition-colors border border-gray-200"
      >
        View Details
      </Link>
    </div>
  );
}
