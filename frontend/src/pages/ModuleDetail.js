import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, getSessionId } from '../App';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';

const ModuleDetail = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const sessionId = getSessionId();

  useEffect(() => {
    fetchModuleData();
  }, [moduleId]);

  const fetchModuleData = async () => {
    try {
      const [moduleRes, progressRes] = await Promise.all([
        axios.get(`${API}/modules/${moduleId}`),
        axios.get(`${API}/progress/${sessionId}`)
      ]);
      setModule(moduleRes.data);
      const moduleProgress = progressRes.data.find(p => p.module_id === moduleId);
      setCompleted(moduleProgress?.completed || false);
    } catch (error) {
      console.error('Error fetching module:', error);
      toast.error('Failed to load module');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      await axios.post(`${API}/progress`, {
        session_id: sessionId,
        module_id: moduleId,
        completed: true
      });
      setCompleted(true);
      toast.success('Module completed! Great job!');
    } catch (error) {
      console.error('Error marking complete:', error);
      toast.error('Failed to update progress');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading module...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Module not found</p>
          <Button onClick={() => navigate('/learn')} className="mt-4">
            Back to Learning
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/learn')} 
          className="mb-6 hover:bg-white/50"
          data-testid="back-btn"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Modules
        </Button>

        {/* Module Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 animate-fade-in">
          {/* Header */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {module.title}
                </h1>
                <p className="text-lg text-gray-600 mb-4">{module.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {module.duration} minutes
                  </span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                    {module.category}
                  </span>
                </div>
              </div>
              {completed && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl" data-testid="completed-badge">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Completed</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none mb-12">
            <div className="text-gray-700 leading-relaxed text-lg space-y-6">
              {module.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Takeaways</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Digital payments are safe, fast, and convenient</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Always verify recipient details before sending money</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Keep your PIN and OTP confidential</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Practice makes perfect - use demo mode to learn</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {!completed && (
              <Button 
                onClick={handleMarkComplete}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg rounded-xl shadow-lg"
                data-testid="mark-complete-btn"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Mark as Complete
              </Button>
            )}
            <Button 
              onClick={() => navigate('/practice')}
              variant="outline"
              className="flex-1 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-6 text-lg rounded-xl"
              data-testid="practice-btn"
            >
              Practice Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;