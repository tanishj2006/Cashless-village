import { Link } from 'react-router-dom';
import { Smartphone, TrendingUp, Shield, Users, ArrowRight, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '../components/Navbar';

const Landing = () => {
  const features = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Easy to Learn",
      description: "Simple, step-by-step modules designed for everyone"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe & Secure",
      description: "Learn best practices for secure digital transactions"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Practice Mode",
      description: "Try digital payments in a safe demo environment"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Progress",
      description: "Monitor your learning journey and achievements"
    }
  ];

  const stats = [
    { value: "12,500+", label: "Active Learners" },
    { value: "8,750+", label: "Practice Transactions" },
    { value: "15,200+", label: "Modules Completed" },
    { value: "68%", label: "Adoption Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-green-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                <Globe className="w-4 h-4" />
                <span>SDG 8: Decent Work & Economic Growth</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Empowering Communities with
                <span className="gradient-text block mt-2">Digital Payment Literacy</span>
              </h1>
              
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Learn, practice, and master digital payments in a safe environment. 
                Join thousands of people transitioning from cash to digital transactions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/learn" data-testid="start-learning-btn">
                  <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg">
                    Start Learning
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/practice" data-testid="try-demo-btn">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-6 text-lg rounded-xl">
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-slide-in-right">
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop" 
                  alt="Digital Payment" 
                  className="rounded-2xl w-full h-auto"
                />
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-emerald-500 to-blue-500 text-white p-6 rounded-2xl shadow-xl">
                  <p className="text-3xl font-bold">100%</p>
                  <p className="text-sm">Free Learning</p>
                </div>
              </div>
              <div className="absolute -z-10 top-8 right-8 w-full h-full bg-gradient-to-br from-emerald-200 to-blue-200 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center p-6 bg-white rounded-2xl shadow-md card-hover animate-fade-in stagger-${index + 1}`}
                data-testid={`stat-${index}`}
              >
                <p className="text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Designed specifically for rural communities and first-time digital payment users
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-white p-8 rounded-2xl shadow-lg card-hover animate-fade-in stagger-${index + 1}`}
                data-testid={`feature-${index}`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-3xl shadow-2xl p-12 text-center text-white animate-fade-in">
            <Users className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Join the Digital Revolution
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Start your journey towards financial inclusion today
            </p>
            <Link to="/learn" data-testid="cta-start-btn">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-10 py-6 text-lg rounded-xl shadow-lg">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;