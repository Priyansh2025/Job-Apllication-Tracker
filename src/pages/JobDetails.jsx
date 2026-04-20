import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Building2, Calendar, MapPin, ArrowLeft, Trash2, Save } from 'lucide-react';
import { useJobs } from '../context/JobContext';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJob, deleteJob } = useJobs();
  const [job, setJob] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const foundJob = jobs.find(j => j.id === id);
    if (foundJob) {
      setJob(foundJob);
      setNotes(foundJob.notes || '');
      setStatus(foundJob.status);
    } else if (jobs.length > 0) {
      // Job not found but jobs are loaded
      navigate('/');
    }
  }, [id, jobs, navigate]);

  if (!job) {
    return <div className="p-8 text-center bg-white rounded-lg mt-8">Loading...</div>;
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job application?")) {
      await deleteJob(job.id);
      navigate('/');
    }
  };

  const handleUpdate = async () => {
    await updateJob(job.id, { notes, status });
    setEditMode(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Pipeline
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-10 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
              {job.role}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-5 h-5 text-gray-400" />
                {job.company}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-5 h-5 text-gray-400" />
                {job.location || 'Remote'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
             {editMode ? (
               <select
                 value={status}
                 onChange={(e) => setStatus(e.target.value)}
                 className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary text-sm font-medium bg-white"
               >
                  <option>Saved</option>
                  <option>Applied</option>
                  <option>Interviewing</option>
                  <option>Offered</option>
                  <option>Rejected</option>
               </select>
             ) : (
                <span className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 inline-block">
                  {job.status}
                </span>
             )}
            <button 
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
              title="Delete Job"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-8 sm:p-10 bg-gray-50/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Application Notes</h2>
            {!editMode ? (
              <button 
                onClick={() => setEditMode(true)}
                className="text-sm font-medium text-primary hover:underline"
              >
                Edit Details
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditMode(false);
                    setNotes(job.notes || '');
                    setStatus(job.status);
                  }}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate}
                  className="inline-flex items-center gap-1 text-sm font-medium text-white bg-primary px-3 py-1.5 rounded-lg hover:bg-primary/90"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            )}
          </div>
          
          {editMode ? (
            <textarea
              className="w-full h-48 p-4 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary shadow-inner"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot down interview questions, interviewer names, or research about the company..."
            />
          ) : (
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[12rem] whitespace-pre-wrap text-gray-700 text-base leading-relaxed">
              {job.notes || <span className="text-gray-400 italic">No notes added yet. Click edit to add some.</span>}
            </div>
          )}

          <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Added to tracker on {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
