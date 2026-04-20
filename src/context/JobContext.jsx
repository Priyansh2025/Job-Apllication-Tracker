import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const JobContext = createContext({});

export const useJobs = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load jobs on mount or user change
  useEffect(() => {
    if (currentUser) {
      const allJobs = JSON.parse(localStorage.getItem('cb_jobs') || '[]');
      const userJobs = allJobs.filter(job => job.userId === currentUser.id);
      setJobs(userJobs);
    } else {
      setJobs([]);
    }
    setLoading(false);
  }, [currentUser]);

  // CREATE
  const addJob = useCallback((jobData) => {
    return new Promise((resolve) => {
      const newJob = { 
        ...jobData, 
        id: Date.now().toString(),
        userId: currentUser.id,
        createdAt: new Date().toISOString()
      };
      
      const allJobs = JSON.parse(localStorage.getItem('cb_jobs') || '[]');
      allJobs.push(newJob);
      localStorage.setItem('cb_jobs', JSON.stringify(allJobs));
      
      setJobs(prev => [...prev, newJob]);
      resolve(newJob);
    });
  }, [currentUser]);

  // UPDATE
  const updateJob = useCallback((id, updatedFields) => {
    return new Promise((resolve) => {
      const allJobs = JSON.parse(localStorage.getItem('cb_jobs') || '[]');
      const index = allJobs.findIndex(j => j.id === id);
      
      if (index !== -1) {
        allJobs[index] = { ...allJobs[index], ...updatedFields };
        localStorage.setItem('cb_jobs', JSON.stringify(allJobs));
        
        setJobs(prev => prev.map(job => job.id === id ? allJobs[index] : job));
        resolve(allJobs[index]);
      }
    });
  }, []);

  // DELETE
  const deleteJob = useCallback((id) => {
    return new Promise((resolve) => {
      const allJobs = JSON.parse(localStorage.getItem('cb_jobs') || '[]');
      const filteredAllJobs = allJobs.filter(j => j.id !== id);
      localStorage.setItem('cb_jobs', JSON.stringify(filteredAllJobs));
      
      setJobs(prev => prev.filter(job => job.id !== id));
      resolve();
    });
  }, []);

  const value = {
    jobs,
    addJob,
    updateJob,
    deleteJob,
    loading
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};
