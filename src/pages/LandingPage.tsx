import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMusic, 
  FiHeadphones, 
  FiDisc, 
  FiHeart, 
  FiUsers, 
  FiList, 
  FiShare2, 
  FiLayout,
  FiArrowRight
} from 'react-icons/fi';
import headsetImage from '../assets/images/jbl-headsets.png';
import { useAuth } from '../hooks/useAuth';

/**
 * Landing Page
 * 
 * The main entry point of the application showcasing key features and value proposition.
 * Includes a hero section, feature highlights, and call-to-action components.
 * Features smooth animations and responsive design for optimal user experience.
 */
export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getAnimationClass = (index: number) => {
    const baseDelay = 100;
    const delay = index * baseDelay;
    return `transition-all duration-700 delay-${delay} ${
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`;
  };

  return (
    <div className="min-h-screen bg-macchiato-base text-macchiato-text overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-macchiato-mantle/80 backdrop-blur-glass px-6 py-4 shadow-neumorphic-dark">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-macchiato-mauve">Groovy</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-macchiato-text hover:text-macchiato-mauve transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="neumorphic-button bg-macchiato-mauve text-macchiato-base hover:bg-macchiato-mauve/90 transform hover:-translate-y-1 transition-all"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <section 
        className="relative pt-32 pb-20 px-6 min-h-[90vh] flex items-center justify-center bg-macchiato-base"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient-purple">
                Your Music Journey Starts Here
              </h1>
              <p className="text-xl text-macchiato-subtext0 mb-8">
                Discover, stream, and share your favorite music with Groovy - the next generation music platform designed for true music lovers.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to={isAuthenticated ? "/login" : "/register"} 
                  className="neumorphic-button-lg bg-macchiato-mauve text-macchiato-base hover:bg-macchiato-mauve/90 px-8 py-3 rounded-full flex flex-row items-center justify-center gap-2 whitespace-nowrap leading-none"
                  style={{ lineHeight: 1, minWidth: 'auto' }}
                >
                  <span className="inline-block align-middle">Get Started</span>
                  <FiArrowRight className="inline-block align-middle text-lg" style={{verticalAlign: 'middle'}} />
                </Link>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <img 
                src={headsetImage} 
                alt="JBL Headsets"
                className="w-full max-w-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-macchiato-base relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${getAnimationClass(2)}`}>
              Discover the Groovy Experience
            </h2>
            <p className={`text-xl text-macchiato-subtext0 max-w-3xl mx-auto ${getAnimationClass(3)}`}>
              Elevate your music journey with our feature-rich platform designed for the ultimate listening experience.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Discover */}
            <div 
              className={`glass-card p-8 rounded-2xl shadow-neumorphic-dark hover:shadow-neumorphic-hover group transition-all duration-300 ${getAnimationClass(4)}`}
            >
              <div className="w-14 h-14 rounded-full bg-macchiato-mauve/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiMusic className="text-macchiato-mauve text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-macchiato-mauve transition-colors">Discover New Music</h3>
              <p className="text-macchiato-subtext0">
                Explore curated playlists and personalized recommendations based on your listening habits.
              </p>
            </div>

            {/* Feature 2 - Stream */}
            <div 
              className={`glass-card p-8 rounded-2xl shadow-neumorphic-dark hover:shadow-neumorphic-hover group transition-all duration-300 md:col-span-2 ${getAnimationClass(5)}`}
            >
              <div className="w-14 h-14 rounded-full bg-macchiato-blue/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiHeadphones className="text-macchiato-blue text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-macchiato-blue transition-colors">High-Quality Streaming</h3>
              <p className="text-macchiato-subtext0">
                Enjoy crystal clear audio with our high-fidelity streaming technology. Immerse yourself in the music with our advanced audio processing.
              </p>
            </div>

            {/* Feature 3 - Equalizer */}
            <div
              className="glass-card p-8 rounded-2xl shadow-neumorphic-dark hover:shadow-neumorphic-hover group transition-all duration-300 md:row-span-2 relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-full bg-macchiato-pink/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FiDisc className="text-macchiato-pink text-2xl animate-spin-slow" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-macchiato-pink transition-colors">Immersive Player</h3>
              <p className="text-macchiato-subtext0 mb-6">
                Experience music like never before with our fullscreen player and immersive sound visualizer.
              </p>
              <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end space-x-1 sm:space-x-2 h-32 sm:h-52 px-4 sm:px-8 pb-6">
                {[
                  'bg-macchiato-pink',
                  'bg-macchiato-pink',
                  'bg-macchiato-pink',
                  'bg-macchiato-pink',
                  'bg-macchiato-pink',
                  'bg-macchiato-pink'
                ].map((color, i) => (
                  <div
                    key={i}
                    className={`${color} rounded-t-md animate-equalizer-pro opacity-80 hover:opacity-100 transition-opacity w-[30px] sm:w-[40px] h-[80%] sm:h-[90%]`}
                    style={{
                      transformOrigin: 'bottom',
                      animationDuration: `${6 + (i * 0.5)}s`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Feature 4 - Playlists */}
            <div 
              className={`glass-card p-8 rounded-2xl shadow-neumorphic-dark hover:shadow-neumorphic-hover group transition-all duration-300 ${getAnimationClass(7)}`}
            >
              <div className="w-14 h-14 rounded-full bg-macchiato-teal/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiList className="text-macchiato-teal text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-macchiato-teal transition-colors">Custom Playlists</h3>
              <p className="text-macchiato-subtext0">
                Create and share your perfect playlists for any mood, occasion, or vibe.
              </p>
            </div>

            {/* Feature 5 - Dark Theme */}
            <div 
              className={`glass-card p-8 rounded-2xl shadow-neumorphic-dark hover:shadow-neumorphic-hover group transition-all duration-300 ${getAnimationClass(8)}`}
            >
              <div className="w-14 h-14 rounded-full bg-macchiato-yellow/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiShare2 className="text-macchiato-yellow text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-macchiato-yellow transition-colors">Dark Theme</h3>
              <p className="text-macchiato-subtext0">
                Protect your eyes with our elegant dark theme designed for comfortable listening sessions at any time of day.
              </p>
            </div>

            {/* Feature 6 - Artists */}
            <div 
              className={`glass-card p-8 rounded-2xl shadow-neumorphic-dark hover:shadow-neumorphic-hover group transition-all duration-300 ${getAnimationClass(9)}`}
            >
              <div className="w-14 h-14 rounded-full bg-macchiato-red/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiUsers className="text-macchiato-red text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-macchiato-red transition-colors">Artist Profiles</h3>
              <p className="text-macchiato-subtext0">
                Explore detailed artist profiles and discover their complete discography.
              </p>
            </div>

            {/* Feature 7 - Beautiful UI */}
            <div 
              className={`glass-card p-8 rounded-2xl shadow-neumorphic-dark hover:shadow-neumorphic-hover group transition-all duration-300 ${getAnimationClass(10)}`}
            >
              <div className="w-14 h-14 rounded-full bg-macchiato-lavender/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiLayout className="text-macchiato-lavender text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-macchiato-lavender transition-colors">Beautiful Interface</h3>
              <p className="text-macchiato-subtext0">
                Enjoy a sleek, modern design that makes browsing and playing music a visual delight.
              </p>
            </div>

            {/* Feature 8 - Favorites */}
            <div 
              className={`glass-card p-8 rounded-2xl shadow-neumorphic-dark hover:shadow-neumorphic-hover group transition-all duration-300 ${getAnimationClass(11)}`}
            >
              <div className="w-14 h-14 rounded-full bg-macchiato-peach/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiHeart className="text-macchiato-peach text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-macchiato-peach transition-colors">Favorites Collection</h3>
              <p className="text-macchiato-subtext0">
                Keep track of your favorite songs, albums, and artists in one place.
              </p>
            </div>

            {/* Feature 9 - Album Organization */}
            <div 
              className={`glass-card p-8 rounded-2xl shadow-neumorphic-dark hover:shadow-neumorphic-hover group transition-all duration-300 ${getAnimationClass(12)}`}
            >
              <div className="w-14 h-14 rounded-full bg-macchiato-green/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiDisc className="text-macchiato-green text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-macchiato-green transition-colors">Album Organization</h3>
              <p className="text-macchiato-subtext0">
                Organize your music library with smart album categorization and custom sorting options.
              </p>
            </div>

            {/* Feature 10 - Lyrics on Screen */}
            <div 
              className={`glass-card p-8 rounded-2xl shadow-neumorphic-dark hover:shadow-neumorphic-hover group transition-all duration-300 ${getAnimationClass(13)}`}
            >
              <div className="w-14 h-14 rounded-full bg-macchiato-sapphire/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiList className="text-macchiato-sapphire text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-macchiato-sapphire transition-colors">Lyrics on Screen</h3>
              <p className="text-macchiato-subtext0">
                Follow along with synchronized lyrics that appear on screen as your music plays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-macchiato-mantle relative overflow-hidden">
        <div 
          className="absolute top-0 right-0 w-1/2 h-full opacity-10"
          style={{ 
            backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(203, 166, 247, 0.4) 0%, transparent 70%)',
            transform: `translateX(${scrollY * 0.1}px)`
          }}
        />
        <div className="max-w-7xl mx-auto relative">
          <div className={`glass-card p-12 rounded-3xl shadow-neumorphic-dark overflow-hidden hover:shadow-neumorphic-hover transition-all duration-300 ${getAnimationClass(14)}`}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-macchiato-mauve/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-macchiato-blue/10 blur-3xl"></div>
            
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 text-gradient-purple">Ready to Elevate Your Music Experience?</h2>
              <p className="text-xl text-macchiato-subtext0 mb-8">
                Join Groovy today and discover a new way to enjoy your favorite music. It's free to get started!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to={isAuthenticated ? "/home" : "/register"} 
                  className="neumorphic-button-lg bg-macchiato-mauve text-macchiato-base hover:bg-macchiato-mauve/90 px-8 py-3 rounded-full transform hover:-translate-y-1 transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 bg-macchiato-mantle">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-macchiato-overlay0/20 mt-12 pt-8 text-center text-macchiato-subtext0">
            <p>&copy; {new Date().getFullYear()} Groovy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
