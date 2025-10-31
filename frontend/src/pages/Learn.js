import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API, getSessionId } from '../App';
import { Clock, CheckCircle, Circle, Smartphone, Zap, Wallet, Shield, Store, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Navbar from '../components/Navbar';

const iconMap = {
  Smartphone,
  Zap,
  Wallet,
  Shield,
  Store,
  HelpCircle
};

const Learn = () => {
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const sessionId = getSessionId();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [modulesRes, progressRes] = await Promise.all([
        axios.get(`${API}/modules`),
        axios.get(`${API}/progress/${sessionId}`)
      ]);
      setModules(modulesRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isModuleCompleted = (moduleId) => {
    return progress.some(p => p.module_id === moduleId && p.completed);
  };

  const completedCount = progress.filter(p => p.completed).length;
  const progressPercentage = modules.length > 0 ? (completedCount / modules.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Learning Modules
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6">
            Master digital payments step by step
          </p>
          
          {/* Progress Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 glass" data-testid="progress-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Your Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedCount} of {modules.length} completed
                </p>
              </div>
              <div className="text-4xl font-bold text-emerald-600">
                {Math.round(progressPercentage)}%
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((module, index) => {
            const IconComponent = iconMap[module.icon] || Smartphone;
            const completed = isModuleCompleted(module.id);
            
            return (
              <Link 
                key={module.id} 
                to={`/learn/${module.id}`}
                data-testid={`module-${index}`}
              >
                <div className={`bg-white rounded-2xl shadow-lg p-6 card-hover animate-fade-in stagger-${(index % 6) + 1} h-full`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        completed 
                          ? 'bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600' 
                          : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600'
                      }`}>
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {module.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {module.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                    {completed ? (
                      <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" data-testid={`completed-${index}`} />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                    )}
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {module.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                      {module.category}
                    </span>
                    <Button 
                      variant={completed ? "outline" : "default"}
                      size="sm"
                      className={completed 
                        ? "border-emerald-600 text-emerald-600 hover:bg-emerald-50" 
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }
                    >
                      {completed ? 'Review' : 'Start'}
                    </Button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Learn;