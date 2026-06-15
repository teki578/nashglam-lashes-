import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, BadgeCheck, Send, Quote } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
  service: string;
  verified: boolean;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Alessia Thorne',
    rating: 5,
    date: 'June 10, 2026',
    text: 'NashGlam has completely transformed my lash routine! Sophie Laurent creates the most perfect, fluffy hand-fanned volumes that keep their retention for a full six weeks. I am absolutely obsessed and refuse to go anywhere else!',
    service: 'Volume',
    verified: true,
  },
  {
    id: 'rev-2',
    name: 'Camila Vance',
    rating: 5,
    date: 'May 28, 2026',
    text: 'I purchased the Lash Cleaning Package alongside my appointment. Clean, oil-free formula with the softest micro-brush, it has single-handedly saved my hybrid lashes from fallout. Simply flawless service and products!',
    service: 'Hybrid',
    verified: true,
  },
  {
    id: 'rev-3',
    name: 'Eleanor Sterling',
    rating: 4,
    date: 'June 02, 2026',
    text: 'Incredibly precise booking and clean boutique. The classic set feels weightless, and the custom mapping designed fits my rounded eyes perfectly. A true luxury experience.',
    service: 'Classic',
    verified: true,
  },
];

interface ClientReviewsProps {
  isDarkMode?: boolean;
}

export default function ClientReviews({ isDarkMode = false }: ClientReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [service, setService] = useState('Volume');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Load reviews from localStorage or fall back to defaults
  useEffect(() => {
    const saved = localStorage.getItem('nashglam_reviews');
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {
        setReviews(INITIAL_REVIEWS);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your name to register your review.');
      return;
    }
    if (!text.trim() || text.length < 10) {
      setError('Please write a detailed review (at least 10 characters) about your experience.');
      return;
    }

    const newReview: Review = {
      id: `rev-user-${Date.now()}`,
      name: name.trim(),
      rating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      text: text.trim(),
      service,
      verified: true, // Auto-verify client additions in preview sandbox
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('nashglam_reviews', JSON.stringify(updated));

    // Reset form states
    setName('');
    setText('');
    setRating(5);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 4500);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div id="reviews" className="space-y-12">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className={`text-xs font-mono font-medium tracking-widest uppercase px-3 py-1 rounded-full border ${
          isDarkMode ? 'bg-pink-950/40 border-pink-900/30 text-pink-400' : 'bg-pink-50 border-pink-200/40 text-pink-700'
        }`}>
          Client Diaries
        </span>
        <h2 className={`font-serif text-3xl sm:text-4xl tracking-tight font-medium ${isDarkMode ? 'text-stone-50' : 'text-stone-900'}`}>
          NashGlam Client Reviews
        </h2>
        <p className={`font-sans text-xs sm:text-sm font-light leading-relaxed ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
          Read candid reviews from our beautiful community, or leave your own review below to share your custom style experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form component to submit reviews */}
        <div className={`lg:col-span-5 p-6 sm:p-8 rounded-2xl space-y-6 border transition-all ${
          isDarkMode 
            ? 'bg-stone-900 border-stone-800 text-stone-100 shadow-stone-950/20' 
            : 'bg-stone-100 border-stone-200 text-stone-800'
        }`}>
          <div className="space-y-1.5">
            <h3 className={`font-serif text-xl font-medium tracking-tight flex items-center space-x-2 ${isDarkMode ? 'text-stone-50' : 'text-stone-900'}`}>
              <MessageSquare className="w-5 h-5 text-pink-500" />
              <span>Leave a Review</span>
            </h3>
            <p className={`text-xs font-sans font-light ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
              Your feedback helps us maintain our beauty & luxury service standards.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl leading-relaxed animate-fade-in">
                <strong>Thank you, beautiful!</strong> Your review has been saved in local state and published successfully below.
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className={`text-[10px] font-bold tracking-widest uppercase block ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                Your Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Charlotte Rose"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full border rounded-xl py-3 px-4 text-xs font-sans outline-none focus:ring-1 focus:ring-pink-500 transition-all ${
                  isDarkMode 
                    ? 'bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-600 focus:border-pink-500' 
                    : 'bg-white border-stone-200 text-stone-800 focus:border-pink-600'
                }`}
              />
            </div>

            {/* Star Rating Select */}
            <div className="space-y-1.5">
              <label className={`text-[10px] font-bold tracking-widest uppercase block ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                Star Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    className="p-1 focus:outline-none transition-transform active:scale-95"
                    title={`${starValue} Stars`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        starValue <= rating
                          ? 'text-pink-500 fill-pink-400'
                          : isDarkMode ? 'text-stone-700 hover:text-pink-500' : 'text-stone-300 hover:text-pink-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
                <span className={`text-xs font-mono font-bold ml-2 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                  {rating} of 5
                </span>
              </div>
            </div>

            {/* Treatment Selector */}
            <div className="space-y-1.5">
              <label className={`text-[10px] font-bold tracking-widest uppercase block ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                Lash Service / Product
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className={`w-full border rounded-xl py-3 px-3 text-xs font-medium focus:ring-1 focus:ring-pink-500 outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-stone-950 border-stone-800 text-stone-100 focus:border-pink-500' 
                    : 'bg-white border-stone-200 text-stone-800 focus:border-pink-600'
                }`}
              >
                <option value="Volume">Volume</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Classic">Classic</option>
                <option value="Wet Set">Wet Set</option>
                <option value="Lash Cleaning Package">Lash Cleaning Package</option>
              </select>
            </div>

            {/* Review feedback text */}
            <div className="space-y-1.5">
              <label className={`text-[10px] font-bold tracking-widest uppercase block ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                Your Review
              </label>
              <textarea
                rows={4}
                placeholder="Share details of your lash retention, lashes soft feel, and custom mapping results..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={`w-full border rounded-xl py-3 px-4 text-xs font-sans outline-none focus:ring-1 focus:ring-pink-500 transition-all resize-none leading-relaxed ${
                  isDarkMode 
                    ? 'bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-600 focus:border-pink-500' 
                    : 'bg-white border-stone-200 text-stone-800 focus:border-pink-600'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-stone-900 hover:bg-pink-600 text-[#f5f5f4] hover:text-stone-50 rounded-xl text-xs font-bold tracking-widest transition-all shadow-sm cursor-pointer flex items-center justify-center space-x-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>PUBLISH MY REVIEW</span>
            </button>
          </form>
        </div>

        {/* Right Column: Reviews Board list */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Reviews Score Banner Summary */}
          <div className={`border p-5 rounded-2xl flex items-center justify-between shadow-xs transition-colors ${
            isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
          }`}>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-stone-400 block tracking-wider uppercase">COMMUNITY SCORE</span>
              <div className="flex items-baseline space-x-2">
                <span className={`font-serif text-3xl font-extrabold ${isDarkMode ? 'text-stone-50' : 'text-stone-900'}`}>{getAverageRating()}</span>
                <span className="text-stone-400 text-xs font-sans font-light">/ 5.0 rating</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-pink-500">
              {[1, 2, 3, 4, 5].map((starNum) => (
                <Star key={starNum} className="w-5 h-5 fill-pink-500 text-pink-500 shrink-0" />
              ))}
              <span className={`text-xs font-mono font-bold ml-2 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>({reviews.length} reviews)</span>
            </div>
          </div>

          {/* List of client logs */}
          <div className={`space-y-4 max-h-[580px] overflow-y-auto pr-2 flex flex-col divide-y ${
            isDarkMode ? 'divide-stone-800' : 'divide-stone-100'
          }`}>
            {reviews.map((rev) => (
              <div key={rev.id} className="pt-5 first:pt-0 pb-1 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className={`font-serif text-[15px] font-bold ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{rev.name}</span>
                      {rev.verified && (
                        <span className={`inline-flex items-center space-x-0.5 py-0.5 px-1.5 text-[9px] font-medium font-sans border rounded-md ${
                          isDarkMode
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200/50'
                        }`}>
                          <BadgeCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Verified Client</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-pink-500 font-semibold uppercase">{rev.service}</span>
                  </div>
                  <span className="text-[10px] font-sans text-stone-400 font-light">{rev.date}</span>
                </div>

                {/* Stars container */}
                <div className="flex items-center text-pink-500">
                  {[1, 2, 3, 4, 5].map((itemVal) => (
                    <Star
                      key={itemVal}
                      className={`w-3.5 h-3.5 shrink-0 ${
                        itemVal <= rev.rating ? 'fill-pink-500 text-pink-500' : isDarkMode ? 'text-stone-800' : 'text-stone-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial body */}
                <div className={`relative pl-4 border-l text-xs sm:text-sm leading-relaxed font-sans font-light italic ${
                  isDarkMode ? 'border-stone-800 text-stone-300' : 'border-stone-200 text-stone-600'
                }`}>
                  <Quote className={`w-8 h-8 absolute -top-2 -left-1 -z-10 transform scale-x-[-1] ${
                    isDarkMode ? 'text-stone-800/25' : 'text-stone-100'
                  }`} />
                  <p className="z-10 relative">{rev.text}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
