'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

interface ApplicationData {
  name?: string;
  age?: number;
  phone?: string;
  email?: string;
  employment_type?: string;
  monthly_income?: number;
  existing_emi?: number;
  loan_amount?: number;
  tenure_months?: number;
}

// Interactive SVG Robot Agent with cursor tracking
const RobotAgent = ({ isTyping, isActive }: { isTyping: boolean; isActive: boolean }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGreeting, setIsGreeting] = useState(true);

  // Hydration fix - only enable after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initial greeting animation
  useEffect(() => {
    const timer = setTimeout(() => setIsGreeting(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Track mouse for head/eye movement
  useEffect(() => {
    if (!isMounted) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const x = Math.max(-1, Math.min(1, (e.clientX - centerX) / 300));
        const y = Math.max(-1, Math.min(1, (e.clientY - centerY) / 300));
        
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMounted]);

  return (
    <motion.div
      ref={containerRef}
      className="relative"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', duration: 1.2, bounce: 0.4 }}
    >
      {/* Multiple Glow Layers for 3D effect */}
      <motion.div
        className="absolute inset-[-30px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(220,38,38,0.4) 0%, rgba(220,38,38,0.1) 50%, transparent 70%)',
        }}
        animate={{
          scale: isTyping ? [1, 1.2, 1] : [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <motion.div
        className="absolute inset-[-15px] rounded-full bg-red-500/20 blur-2xl"
        animate={{
          scale: isTyping ? [1, 1.3, 1] : [1, 1.15, 1],
          opacity: isTyping ? [0.6, 1, 0.6] : [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      {/* Robot Container */}
      <motion.div
        className="relative w-56 h-56 md:w-72 md:h-72"
        animate={isActive ? {
          y: [0, -12, 0],
          rotateZ: [0, 1, -1, 0],
        } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Robot Body - Money Heist Red Suit with 3D shading */}
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
          {/* Shadow under robot */}
          <ellipse cx="100" cy="185" rx="40" ry="8" fill="rgba(0,0,0,0.3)" />
          
          {/* Body/Suit with 3D gradient */}
          <motion.ellipse
            cx="100"
            cy="140"
            rx="55"
            ry="45"
            fill="url(#suitGradient3D)"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Suit highlight */}
          <ellipse cx="85" cy="125" rx="20" ry="15" fill="rgba(255,255,255,0.1)" />
          
          {/* Suit Details - Zipper */}
          <line x1="100" y1="100" x2="100" y2="175" stroke="#1a1a1a" strokeWidth="4" />
          <circle cx="100" cy="105" r="3" fill="#888" />
          
          {/* Suit Straps */}
          <path d="M 70 110 Q 85 100 100 105 Q 115 100 130 110" stroke="#1a1a1a" strokeWidth="5" fill="none" />
          
          {/* Head - White Helmet with rotation based on mouse */}
          <motion.g
            animate={isMounted ? { 
              rotate: mousePosition.x * 12,
              x: mousePosition.x * 8,
              y: mousePosition.y * 5
            } : {}}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            style={{ transformOrigin: '100px 70px' }}
          >
            {/* Helmet shadow */}
            <ellipse cx="105" cy="75" rx="48" ry="43" fill="rgba(0,0,0,0.2)" />
            
            {/* Main helmet */}
            <motion.ellipse
              cx="100"
              cy="70"
              rx="50"
              ry="45"
              fill="url(#helmetGradient3D)"
              animate={isGreeting ? { scale: [1, 1.05, 1] } : (isTyping ? { rotate: [0, 2, -2, 0] } : {})}
              transition={{ duration: isGreeting ? 0.5 : 0.5, repeat: isGreeting ? 3 : (isTyping ? Infinity : 0) }}
            />
            
            {/* Helmet rim */}
            <ellipse cx="100" cy="70" rx="50" ry="45" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
            
            {/* Visor/Face - Dark Screen with depth */}
            <ellipse cx="100" cy="72" rx="40" ry="30" fill="url(#visorGradient)" />
            <ellipse cx="100" cy="72" rx="38" ry="28" fill="#0a0a1a" />
            
            {/* Screen glow effect */}
            <ellipse cx="100" cy="72" rx="36" ry="26" fill="url(#screenGlow)" opacity="0.5" />
            
            {/* Eyes that follow cursor with glow */}
            <motion.g
              animate={{
                scaleY: isTyping ? [1, 0.2, 1] : [1, 1, 0.2, 1],
              }}
              transition={{ duration: isTyping ? 0.4 : 4, repeat: Infinity, repeatDelay: isTyping ? 0 : 2 }}
            >
              {/* Eye glow */}
              <motion.ellipse
                cx={82 + (isMounted ? mousePosition.x * 6 : 0)}
                cy={70 + (isMounted ? mousePosition.y * 4 : 0)}
                rx="14"
                ry="16"
                fill="url(#eyeGlow)"
                opacity="0.6"
              />
              <motion.ellipse
                cx={118 + (isMounted ? mousePosition.x * 6 : 0)}
                cy={70 + (isMounted ? mousePosition.y * 4 : 0)}
                rx="14"
                ry="16"
                fill="url(#eyeGlow)"
                opacity="0.6"
              />
              
              {/* Main eyes */}
              <motion.ellipse
                cx={82 + (isMounted ? mousePosition.x * 6 : 0)}
                cy={70 + (isMounted ? mousePosition.y * 4 : 0)}
                rx="11"
                ry="13"
                fill="url(#eyeGradient)"
                animate={{
                  fill: isTyping ? ['url(#eyeGradient)', 'url(#eyeGradientActive)', 'url(#eyeGradient)'] : 'url(#eyeGradient)',
                }}
                transition={{ duration: 1, repeat: isTyping ? Infinity : 0 }}
              />
              <motion.ellipse
                cx={118 + (isMounted ? mousePosition.x * 6 : 0)}
                cy={70 + (isMounted ? mousePosition.y * 4 : 0)}
                rx="11"
                ry="13"
                fill="url(#eyeGradient)"
                animate={{
                  fill: isTyping ? ['url(#eyeGradient)', 'url(#eyeGradientActive)', 'url(#eyeGradient)'] : 'url(#eyeGradient)',
                }}
                transition={{ duration: 1, repeat: isTyping ? Infinity : 0 }}
              />
              
              {/* Pupils */}
              <circle cx={82 + (isMounted ? mousePosition.x * 8 : 0)} cy={70 + (isMounted ? mousePosition.y * 5 : 0)} r="4" fill="#0a0a1a" />
              <circle cx={118 + (isMounted ? mousePosition.x * 8 : 0)} cy={70 + (isMounted ? mousePosition.y * 5 : 0)} r="4" fill="#0a0a1a" />
              
              {/* Eye Highlights */}
              <circle cx={78 + (isMounted ? mousePosition.x * 6 : 0)} cy={66 + (isMounted ? mousePosition.y * 4 : 0)} r="3" fill="white" opacity="0.9" />
              <circle cx={114 + (isMounted ? mousePosition.x * 6 : 0)} cy={66 + (isMounted ? mousePosition.y * 4 : 0)} r="3" fill="white" opacity="0.9" />
            </motion.g>
            
            {/* Ear pieces with 3D effect */}
            <ellipse cx="52" cy="70" rx="10" ry="14" fill="url(#earGradient)" />
            <ellipse cx="148" cy="70" rx="10" ry="14" fill="url(#earGradient)" />
            <ellipse cx="50" cy="68" rx="4" ry="6" fill="rgba(255,255,255,0.2)" />
            <ellipse cx="146" cy="68" rx="4" ry="6" fill="rgba(255,255,255,0.2)" />
          </motion.g>
          
          {/* Antennas with enhanced animation */}
          <motion.g
            animate={{ rotate: isActive ? [0, 8, -8, 0] : 0 }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ transformOrigin: '100px 30px' }}
          >
            <line x1="75" y1="35" x2="62" y2="10" stroke="url(#antennaGradient)" strokeWidth="4" strokeLinecap="round" />
            <motion.circle
              cx="62"
              cy="8"
              r="8"
              fill="url(#antennaTipRed)"
              animate={{ 
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <circle cx="60" cy="6" r="2" fill="white" opacity="0.8" />
            
            <line x1="125" y1="35" x2="138" y2="10" stroke="url(#antennaGradient)" strokeWidth="4" strokeLinecap="round" />
            <motion.circle
              cx="138"
              cy="8"
              r="8"
              fill="url(#antennaTipBlue)"
              animate={{ 
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />
            <circle cx="136" cy="6" r="2" fill="white" opacity="0.8" />
          </motion.g>
          
          {/* Arms with greeting wave */}
          <motion.g
            animate={isGreeting ? { rotate: [0, -30, 30, -20, 20, 0] } : (isTyping ? { rotate: [0, 25, 0] } : {})}
            transition={{ duration: isGreeting ? 1.5 : 0.5, repeat: isTyping ? Infinity : 0 }}
            style={{ transformOrigin: '45px 115px' }}
          >
            <ellipse cx="42" cy="130" rx="14" ry="22" fill="url(#armGradient)" />
            <ellipse cx="38" cy="125" rx="4" ry="6" fill="rgba(255,255,255,0.3)" />
          </motion.g>
          
          <motion.g
            animate={isActive ? { rotate: [0, -12, 12, 0] } : {}}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ transformOrigin: '155px 115px' }}
          >
            <ellipse cx="158" cy="130" rx="14" ry="22" fill="url(#armGradient)" />
            <ellipse cx="154" cy="125" rx="4" ry="6" fill="rgba(255,255,255,0.3)" />
          </motion.g>
          
          {/* Enhanced Gradients */}
          <defs>
            <linearGradient id="suitGradient3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="30%" stopColor="#dc2626" />
              <stop offset="70%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
            
            <linearGradient id="helmetGradient3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#f5f5f5" />
              <stop offset="70%" stopColor="#e5e5e5" />
              <stop offset="100%" stopColor="#d4d4d4" />
            </linearGradient>
            
            <linearGradient id="visorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a1a2e" />
              <stop offset="100%" stopColor="#0a0a1a" />
            </linearGradient>
            
            <radialGradient id="screenGlow" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
            </radialGradient>
            
            <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
            </radialGradient>
            
            <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#00a8cc" />
            </linearGradient>
            
            <linearGradient id="eyeGradientActive" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff8080" />
              <stop offset="50%" stopColor="#ff6b6b" />
              <stop offset="100%" stopColor="#ff5252" />
            </linearGradient>
            
            <linearGradient id="earGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a0a0a0" />
              <stop offset="50%" stopColor="#888888" />
              <stop offset="100%" stopColor="#666666" />
            </linearGradient>
            
            <linearGradient id="antennaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#888888" />
              <stop offset="100%" stopColor="#666666" />
            </linearGradient>
            
            <radialGradient id="antennaTipRed" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ff8080" />
              <stop offset="50%" stopColor="#ff6b6b" />
              <stop offset="100%" stopColor="#dc2626" />
            </radialGradient>
            
            <radialGradient id="antennaTipBlue" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#80ffff" />
              <stop offset="50%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#0099cc" />
            </radialGradient>
            
            <linearGradient id="armGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f0f0f0" />
              <stop offset="100%" stopColor="#d0d0d0" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex gap-1.5 shadow-lg shadow-red-500/50"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 bg-white rounded-full"
                  animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Ring */}
        <motion.div
          className={`absolute inset-[-6px] rounded-full border-3 ${isTyping ? 'border-yellow-400' : 'border-green-400'}`}
          style={{ borderWidth: '3px' }}
          animate={{
            opacity: [0.4, 0.9, 0.4],
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Greeting text bubble */}
        <AnimatePresence>
          {isGreeting && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: -20 }}
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white rounded-full shadow-lg"
            >
              <span className="text-lg">👋 ¡Hola!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default function SmartIntakePage() {
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationData>({});
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setUserInput(transcript);
          setIsListening(false);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            addMessage('bot', '🎤 Microphone access denied. Please allow microphone access in your browser settings.');
          }
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const startChat = () => {
    setShowChat(true);
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          type: 'bot',
          content: "🎭 ¡Hola! I am El Profesor Bot - your AI Loan Officer. Like a perfect heist, we'll plan your loan application together. No masks needed, just honesty! 💰\n\nLet's start - What's your name, my friend?",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const addMessage = (type: 'bot' | 'user', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isProcessing) return;

    const userMessage = userInput;
    addMessage('user', userMessage);
    setUserInput('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/intake/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: applicationData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add Money Heist flair to responses
        let botResponse = data.response.message;
        
        addMessage('bot', botResponse);
        
        if (data.response.extracted_data) {
          setApplicationData((prev) => ({
            ...prev,
            ...data.response.extracted_data,
          }));
        }

        if (data.response.next_step === 'documents') {
          setShowDocumentUpload(true);
        }
      } else {
        addMessage('bot', "🎭 Perdón, my friend. I didn't catch that. The plan needs clarity - could you rephrase?");
      }
    } catch (error) {
      addMessage('bot', "🚨 Houston, we have a problem! Our secure line got interrupted. Try again, amigo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProceedToApplication = () => {
    // Build URL with all collected application data
    const params = new URLSearchParams();
    if (applicationData.name) params.set('name', applicationData.name);
    if (applicationData.age) params.set('age', applicationData.age.toString());
    if (applicationData.phone) params.set('phone', applicationData.phone);
    if (applicationData.email) params.set('email', applicationData.email);
    if (applicationData.employment_type) params.set('employment_type', applicationData.employment_type);
    if (applicationData.monthly_income) params.set('monthly_income', applicationData.monthly_income.toString());
    if (applicationData.existing_emi) params.set('existing_emi', applicationData.existing_emi.toString());
    if (applicationData.loan_amount) params.set('loan_amount', applicationData.loan_amount.toString());
    if (applicationData.tenure_months) params.set('tenure_months', applicationData.tenure_months.toString());
    
    router.push(`/apply-loan?${params.toString()}`);
  };

  const toggleVoiceInput = () => {
    if (!recognition) {
      addMessage('bot', '🎤 Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 pt-16 overflow-hidden">
      {/* Money Heist Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Animated Dalí masks */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0.05, 0.1, 0.05],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              delay: i * 2,
            }}
          >
            🎭
          </motion.div>
        ))}
        
        {/* Red accent lines */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"
          animate={{ scaleX: [0, 1, 0], x: ['-100%', '0%', '100%'] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!showChat ? (
          /* Landing Screen */
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4"
          >
            {/* Robot Introduction */}
            <RobotAgent isTyping={false} isActive={true} />
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Meet <span className="text-red-500">El Profesor Bot</span>
              </h1>
              <p className="text-xl text-gray-400 mb-2 max-w-lg mx-auto">
                Your AI Loan Officer - Smart, Fast, and Always on Your Side
              </p>
              <p className="text-red-400 text-lg mb-8">
                "Every heist needs a perfect plan. Let me plan your loan!" 🎭
              </p>

              <motion.button
                onClick={startChat}
                className="px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xl rounded-2xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all border-2 border-red-500/50"
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(220, 38, 38, 0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                🎭 Start the Plan
              </motion.button>

              <div className="mt-8 flex justify-center gap-6 text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> No Paperwork
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 5 Min Application
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Instant Decision
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* Chat Interface */
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-64px)]"
          >
            {/* Robot Sidebar */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="hidden lg:flex flex-col items-center justify-start pt-10"
            >
              <RobotAgent isTyping={isProcessing} isActive={!isProcessing} />
              
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-xl font-bold text-white">El Profesor Bot</h3>
                <p className="text-red-400 text-sm">AI Loan Officer</p>
                <div className={`mt-2 flex items-center justify-center gap-2 ${isProcessing ? 'text-yellow-400' : 'text-green-400'}`}>
                  <motion.div
                    className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-400' : 'bg-green-400'}`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  {isProcessing ? 'Thinking...' : 'Online'}
                </div>
              </motion.div>

              {/* Progress Indicator */}
              <motion.div
                className="mt-8 w-48 bg-white/5 rounded-xl p-4 border border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <h4 className="text-sm font-bold text-gray-400 mb-3">Application Progress</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Personal Info', done: !!applicationData.name },
                    { label: 'Income Details', done: !!applicationData.monthly_income },
                    { label: 'Loan Amount', done: !!applicationData.loan_amount },
                    { label: 'Documents', done: showDocumentUpload },
                  ].map((step, i) => (
                    <div key={step.label} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                        step.done ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-500'
                      }`}>
                        {step.done ? '✓' : i + 1}
                      </div>
                      <span className={step.done ? 'text-green-400' : 'text-gray-500'}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Chat Container */}
            <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-xl rounded-3xl border-2 border-red-900/30 overflow-hidden shadow-2xl shadow-red-900/20">
              {/* Chat Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-red-900/50 to-red-800/50 border-b border-red-900/30 flex items-center gap-4">
                <div className="lg:hidden">
                  {/* Mini animated robot for mobile */}
                  <motion.div 
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-2xl relative overflow-hidden"
                    animate={{ 
                      boxShadow: isProcessing 
                        ? ['0 0 10px rgba(255,107,107,0.5)', '0 0 30px rgba(255,107,107,0.8)', '0 0 10px rgba(255,107,107,0.5)']
                        : '0 0 15px rgba(255,107,107,0.3)'
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <motion.span
                      animate={isProcessing ? { rotate: [0, 10, -10, 0] } : { scale: [1, 1.1, 1] }}
                      transition={{ duration: isProcessing ? 0.5 : 2, repeat: Infinity }}
                    >
                      🤖
                    </motion.span>
                    {/* Status indicator */}
                    <motion.div
                      className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-red-700 ${isProcessing ? 'bg-yellow-400' : 'bg-green-400'}`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </motion.div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    La Casa de Loans
                    <motion.span
                      className="text-sm"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🎭
                    </motion.span>
                  </h2>
                  <p className="text-red-400 text-sm">Secure AI-Powered Application</p>
                </div>
                <div className="ml-auto flex items-center gap-2 text-green-400">
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-sm">Encrypted</span>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, idx) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, x: message.type === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ delay: idx === messages.length - 1 ? 0.1 : 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      {message.type === 'bot' ? (
                        <motion.div 
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-lg shadow-lg shadow-red-500/30"
                          animate={{ 
                            y: [0, -2, 0],
                            scale: [1, 1.05, 1],
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: idx * 0.1 }}
                        >
                          <motion.span
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            🎭
                          </motion.span>
                        </motion.div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg shadow-lg shadow-blue-500/30">
                          👤
                        </div>
                      )}
                      
                      {/* Message Bubble */}
                      <div className={`px-5 py-3 rounded-2xl ${
                        message.type === 'bot'
                          ? 'bg-gradient-to-br from-red-900/50 to-red-800/50 text-white border border-red-700/30'
                          : 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.type === 'bot' ? 'text-red-300/50' : 'text-cyan-200/50'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center gap-2 px-5 py-3 bg-red-900/30 rounded-2xl border border-red-700/30">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-red-400 rounded-full"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
                        <span className="text-red-400 text-sm">El Profesor is typing...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
              </div>

              {/* Document Upload Section */}
              <AnimatePresence>
                {showDocumentUpload && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 py-4 bg-red-900/20 border-t border-red-900/30"
                  >
                    <h4 className="text-white font-bold mb-3">📄 Upload Documents</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {['Aadhaar', 'PAN Card', 'Salary Slip', 'Selfie'].map((doc) => (
                        <motion.button
                          key={doc}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3 bg-white/5 rounded-xl border border-white/10 hover:border-red-500/50 text-center transition-all"
                        >
                          <span className="text-2xl block mb-1">📎</span>
                          <span className="text-sm text-gray-300">{doc}</span>
                        </motion.button>
                      ))}
                    </div>
                    
                    {/* Proceed to Application Button */}
                    <motion.button
                      onClick={handleProceedToApplication}
                      className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all border-2 border-red-500/50"
                      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(220, 38, 38, 0.5)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      🎯 Continue to Application Form →
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Area */}
              <div className="p-4 bg-black/50 border-t border-red-900/30">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? "Listening..." : "Type your message... (Press Enter to send)"}
                    disabled={isProcessing || isListening}
                    className="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-all disabled:opacity-50"
                  />
                  <motion.button
                    onClick={toggleVoiceInput}
                    disabled={isProcessing}
                    className={`px-6 py-4 rounded-xl font-bold transition-all ${
                      isListening 
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white animate-pulse' 
                        : 'bg-white/5 border border-white/10 text-gray-300 hover:border-red-500/50 hover:text-red-400'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? '🎤' : '🎙️'}
                  </motion.button>
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={isProcessing || !userInput.trim()}
                    className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isProcessing ? '...' : '🚀'}
                  </motion.button>
                </div>
                <p className="text-center text-gray-600 text-xs mt-2">
                  🔒 End-to-end encrypted • Your data is safe with El Profesor {isListening && '• 🎤 Listening...'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
