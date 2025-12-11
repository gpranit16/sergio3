'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

interface OrbitingBall {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  opacity: number;
}

export default function MoneyHeistBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const yellowBallsRef = useRef<OrbitingBall[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Red particles only (no yellow in regular particles)
    const redColors = ['#dc2626', '#ef4444', '#b91c1c', '#991b1b', '#f87171'];
    const greenColors = ['#10b981', '#059669'];

    // Initialize regular particles (red/green only)
    const initParticles = () => {
      const particles: Particle[] = [];
      
      // Red particles - 30
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          size: Math.random() * 2 + 0.8,
          opacity: Math.random() * 0.2 + 0.1,
          color: redColors[Math.floor(Math.random() * redColors.length)],
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.006 + 0.003,
        });
      }
      
      // Green particles - 8
      for (let i = 0; i < 8; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          size: Math.random() * 2 + 0.8,
          opacity: Math.random() * 0.2 + 0.1,
          color: greenColors[Math.floor(Math.random() * greenColors.length)],
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.006 + 0.003,
        });
      }
      
      particlesRef.current = particles;
    };

    // Initialize EXACTLY 6 orbiting yellow balls
    const initYellowBalls = () => {
      const balls: OrbitingBall[] = [];
      for (let i = 0; i < 6; i++) {
        balls.push({
          angle: (i / 6) * Math.PI * 2, // Evenly spaced
          radius: 150 + Math.random() * 200, // Different orbit radii
          speed: 0.002 + Math.random() * 0.003, // Slow rotation
          size: 8 + Math.random() * 6, // Size 8-14
          opacity: 0.4 + Math.random() * 0.3, // Opacity 0.4-0.7
        });
      }
      yellowBallsRef.current = balls;
    };

    initParticles();
    initYellowBalls();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      // Clear canvas completely (no trail effect)
      ctx.fillStyle = 'rgba(10, 10, 20, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      timeRef.current += 1;

      const particles = particlesRef.current;
      const yellowBalls = yellowBallsRef.current;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Helper to convert hex to rgba
      const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };

      // Draw EXACTLY 6 orbiting yellow balls first (behind other particles)
      yellowBalls.forEach((ball) => {
        // Update angle for rotation
        ball.angle += ball.speed;
        
        // Calculate position on orbit
        const x = centerX + Math.cos(ball.angle) * ball.radius;
        const y = centerY + Math.sin(ball.angle) * ball.radius;
        
        // Draw yellow ball with glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, ball.size * 3);
        gradient.addColorStop(0, `rgba(245, 158, 11, ${ball.opacity})`);
        gradient.addColorStop(0.4, `rgba(245, 158, 11, ${ball.opacity * 0.4})`);
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, ball.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Core
        ctx.beginPath();
        ctx.arc(x, y, ball.size, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
      });

      // Update and draw red/green particles
      particles.forEach((particle, i) => {
        // Update pulse
        particle.pulse += particle.pulseSpeed;
        const pulseFactor = Math.sin(particle.pulse) * 0.3 + 0.7;

        // Mouse interaction - particles glow near cursor
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const mouseInfluence = Math.max(0, 1 - distance / 200);

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Slight attraction to mouse
        if (distance < 300) {
          particle.vx += dx * 0.00005;
          particle.vy += dy * 0.00005;
        }

        // Boundary check with wrap
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow
        const glowSize = particle.size * (1 + mouseInfluence * 1.5) * pulseFactor;
        const glowOpacity = particle.opacity * (0.7 + mouseInfluence * 0.5);

        // Outer glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize * 2.5
        );
        gradient.addColorStop(0, hexToRgba(particle.color, glowOpacity * 0.6));
        gradient.addColorStop(0.5, hexToRgba(particle.color, 0.15));
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((other) => {
          const cdx = other.x - particle.x;
          const cdy = other.y - particle.y;
          const dist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (dist < 120) {
            const lineOpacity = (1 - dist / 120) * 0.2;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(220, 38, 38, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #0a0a14 0%, #1a0a0a 50%, #0a0a14 100%)' }}
      />
      {/* Overlay gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/50" />
      {/* Vignette effect */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
      }} />
    </>
  );
}
