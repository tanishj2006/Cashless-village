import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { TrendingUp, Users, CreditCard, BookOpen, BarChart3 } from 'lucide-react';
import Navbar from '../components/Navbar';

const Impact = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const maxUsers = Math.max(...analytics.monthly_growth.map(m => m.users));
  const maxTransactions = Math.max(...analytics.monthly_growth.map(m => m.transactions));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Our Impact
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Tracking progress towards financial inclusion and SDG 8
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fade-in stagger-1" data-testid="metric-users">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {analytics.total_users.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Learners</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fade-in stagger-2" data-testid="metric-transactions">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-emerald-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {analytics.transactions_completed.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Practice Transactions</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fade-in stagger-3" data-testid="metric-modules">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {analytics.modules_completed.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Modules Completed</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fade-in stagger-4" data-testid="metric-adoption">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {analytics.adoption_rate}%
            </p>
            <p className="text-sm text-gray-600">Adoption Rate</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Growth Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-slide-in-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              Monthly Growth Trend
            </h2>
            <div className="space-y-6">
              {analytics.monthly_growth.map((month, index) => (
                <div key={index} className="space-y-2" data-testid={`growth-${index}`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-700">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-blue-600">{month.users} users</span>
                      <span className="text-emerald-600">{month.transactions} txns</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(month.users / maxUsers) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(month.transactions / maxTransactions) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-slide-in-right">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
              Payment Method Preference
            </h2>
            <div className="space-y-6">
              {Object.entries(analytics.payment_method_distribution).map(([method, percentage], index) => (
                <div key={method} className="space-y-3" data-testid={`method-dist-${index}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">{method}</span>
                    <span className="text-2xl font-bold text-emerald-600">{percentage}%</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SDG Impact Section */}
        <div className="mt-12 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-3xl shadow-2xl p-12 text-white text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Contributing to SDG 8
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-3xl mx-auto">
            Our platform supports Sustainable Development Goal 8: Decent Work and Economic Growth 
            by promoting financial inclusion and digital literacy in rural communities.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <p className="text-4xl font-bold mb-2">100%</p>
              <p className="text-emerald-100">Free Access</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <p className="text-4xl font-bold mb-2">24/7</p>
              <p className="text-emerald-100">Available</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <p className="text-4xl font-bold mb-2">100+</p>
              <p className="text-emerald-100">Villages Reached</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact;