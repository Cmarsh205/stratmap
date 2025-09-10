import React from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Map,
  Save,
  Play,
  Users,
  Trophy,
  ArrowRight,
  Star,
  Gamepad2,
  Brain,
  Award,
  CheckCircle,
} from "lucide-react";
import logo from "../assets/LogoSB.png";

const Landing: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: "Strategic Planning",
      description:
        "Create detailed tactical plans with our intuitive strategy builder",
      color: "from-orange-400 to-orange-600",
    },
    {
      icon: Map,
      title: "Map Library",
      description: "Access a comprehensive collection of tactical environments",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: Save,
      title: "Save & Share",
      description: "Store your strategies and share them with your team",
      color: "from-green-400 to-green-600",
    },
    {
      icon: Brain,
      title: "Team Collaboration",
      description: "Use together with teamates in real time ",
      color: "from-purple-400 to-purple-600",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Strategists", icon: Users },
    { number: "50K+", label: "Strategies Created", icon: Target },
    { number: "16", label: "Maps Available", icon: Map },
    { number: "95%", label: "Success Rate", icon: Trophy },
  ];

  const testimonials = [
    {
      name: "Eliza Cohen",
      role: "Pro Player",
      content:
        "StratMap revolutionized how our team approaches tactical planning. The visual tools are incredible.",
      rating: 5,
    },
    {
      name: "Zofia Bosak",
      role: "Team Captain",
      content:
        "The ability to save and share strategies with the team has improved our coordination dramatically.",
      rating: 5,
    },
    {
      name: "Seamus Cowden",
      role: "Coach",
      content:
        "Best strategy planning tool I've used. The interface is intuitive and the features are comprehensive.",
      rating: 5,
    },
  ];

  const benefits = [
    "Intuitive drag-and-drop strategy builder",
    "Comprehensive map library with detailed layouts",
    "Team collaboration and sharing features",
    "Advanced tactical analysis tools",
    "Cross-platform compatibility",
    "Regular updates with new maps and features",
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-amber-400 fill-current" : "text-slate-600"
        }`}
      />
    ));
  };

  return (
    <div className="!flex-1 !bg-gradient-to-br !from-slate-900 !via-slate-800 !to-slate-900 !min-h-screen !overflow-y-auto">
      {/* Hero Section */}
      <div className="!relative !overflow-hidden">
        {/* Background Image */}
        <div className="!absolute !inset-0">
          <img
            src="/SiegeBanner.jpg"
            alt="Siege banner of sledge"
            className="!w-full !h-full !object-cover"
          />
          <div className="!absolute !inset-0 !bg-gradient-to-r !from-slate-900/95 !via-slate-900/80 !to-slate-900/95" />
          <div className="!absolute !inset-0 !bg-gradient-to-t !from-slate-900 !via-transparent !to-transparent" />
        </div>

        <div className="!relative !p-8 !pt-16 !pb-24">
          <div className="!max-w-6xl !mx-auto !text-center">
            {/* Logo */}
            <div className="!flex !items-center !justify-center !mx-auto !mb-8">
              <img
                src={logo}
                alt="StratMap Logo"
                className="w-50 !pt-7 !pb-7"
              />
            </div>

            {/* Hero Text */}
            <h1 className="!text-5xl md:!text-6xl !font-bold !mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                Master Your
              </span>
              <br />
              <span className="text-white">Strategy</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 !mb-12 !max-w-3xl !mx-auto !leading-relaxed">
              The ultimate tactical planning platform for competitive gaming.
              Create, analyze, and perfect your strategies with
              professional-grade tools.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center !mb-16">
              <Link
                to="/maps"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-900 !font-bold !py-4 !px-8 !rounded-2xl transition-all duration-300 flex items-center justify-center !gap-3 shadow-2xl shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:scale-105"
              >
                <Play className="w-6 h-6" />
                Start Planning
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 !gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center !mx-auto !mb-3">
                      <Icon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="text-3xl font-bold text-white !mb-1">
                      {stat.number}
                    </div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="!p-8 !py-24">
        <div className="!max-w-6xl !mx-auto">
          <div className="!text-center !mb-16">
            <h2 className="!text-4xl md:!text-5xl !font-bold text-white !mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                Victory
              </span>
            </h2>
            <p className="!text-xl text-slate-400 !max-w-2xl !mx-auto">
              Everything you need to create, analyze, and execute winning
              strategies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 !gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group !bg-slate-800/50 !backdrop-blur-sm !border !border-slate-700/50 hover:!border-slate-600/50 !rounded-2xl !p-8 transition-all duration-300 hover:scale-105 hover:!shadow-2xl hover:!shadow-slate-900/50"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center !mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="!text-xl !font-bold text-white !mb-4 group-hover:text-yellow-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 !leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="!p-8 !py-24 !bg-slate-800/30">
        <div className="!max-w-6xl !mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 !gap-16 !items-center">
            <div>
              <h2 className="!text-4xl md:!text-5xl !font-bold text-white !mb-8">
                Why Choose
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  {" "}
                  StratMap?
                </span>
              </h2>
              <div className="!space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center !gap-4">
                    <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-yellow-400" />
                    </div>
                    <p className="text-slate-300 text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 !backdrop-blur-sm !border !border-slate-700/50 !rounded-3xl !p-8 !shadow-2xl">
                <div className="flex items-center !gap-4 !mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 !rounded-xl flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <h3 className="!text-xl !font-bold !text-white">
                      Pro Gaming Tools
                    </h3>
                    <p className="text-slate-400">
                      Used by professionals worldwide
                    </p>
                  </div>
                </div>
                <div className="!space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Strategy Accuracy</span>
                    <span className="text-yellow-400 !font-semibold">98%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 !h-2 rounded-full w-[98%]"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Team Coordination</span>
                    <span className="text-yellow-400 !font-semibold">95%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 !h-2 rounded-full w-[95%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="!p-8 !py-24">
        <div className="!max-w-6xl !mx-auto">
          <div className="!text-center !mb-16">
            <h2 className="!text-4xl md:!text-5xl !font-bold text-white !mb-6">
              Trusted by
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                Champions
              </span>
            </h2>
            <p className="!text-xl text-slate-400">
              See what pro players and teams are saying about StratMap
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 !gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-800/50 !backdrop-blur-sm !border !border-slate-700/50 !rounded-2xl !p-8 hover:!border-slate-600/50 transition-all duration-300"
              >
                <div className="flex items-center !gap-1 !mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-slate-300 !mb-6 !leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center !gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-slate-900 font-bold text-sm">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="!p-8 !py-24 bg-gradient-to-r from-yellow-500/10 via-yellow-600/5 to-yellow-500/10">
        <div className="!max-w-4xl !mx-auto !text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 !rounded-2xl flex items-center justify-center !mx-auto !mb-8 !shadow-2xl !shadow-yellow-500/25">
            <Award className="w-10 h-10 text-slate-900" />
          </div>

          <h2 className="!text-4xl md:!text-5xl !font-bold text-white !mb-6">
            Ready to Dominate?
          </h2>
          <p className="!text-xl !text-slate-300 !mb-12 !max-w-2xl !mx-auto">
            Join thousands of strategists who are already using StratMap to plan
            their path to victory.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/maps"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-900 !font-bold !py-4 !px-8 !rounded-2xl transition-all duration-300 flex items-center justify-center !gap-3 !shadow-2xl shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:scale-105"
            >
              <Target className="w-6 h-6" />
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
