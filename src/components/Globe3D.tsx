import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

interface Globe3DProps {
  onCountrySelect: (countryCode: string) => void;
}

export const Globe3D = ({ onCountrySelect }: Globe3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const globeRef = useRef<THREE.Mesh>();
  const animationRef = useRef<number>();
  
  const { setGlobeLoaded, isDarkMode, countries } = useStore();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    renderer.setSize(containerWidth, containerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Globe creation
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    
    // Create earth texture
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = createEarthTexture();
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        isDark: { value: isDarkMode },
        texture: { value: earthTexture }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform bool isDark;
        uniform sampler2D texture;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec4 texColor = texture2D(texture, vUv);
          
          // Add glow effect
          float intensity = 1.4 - dot(normalize(vPosition), vec3(0.0, 0.0, 1.0));
          vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);
          
          // Add animated grid lines
          float grid = sin(vUv.x * 50.0) * sin(vUv.y * 50.0);
          vec3 gridColor = vec3(0.0, 0.8, 1.0) * 0.1 * step(0.98, grid);
          
          vec3 color = texColor.rgb + atmosphere * 0.3 + gridColor;
          
          if (isDark) {
            color *= vec3(0.4, 0.6, 1.0);
          }
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: true
    });

    const globe = new THREE.Mesh(geometry, material);
    globeRef.current = globe;
    scene.add(globe);

    // Add country markers
    addCountryMarkers(scene);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 5;

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
          y: -((event.clientY - rect.top) / rect.height) * 2 + 1
        });
      }
    };

    const handleClick = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const mouse = new THREE.Vector2(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -((event.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const markers = scene.children.filter(child => child.userData.countryCode);
        const intersects = raycaster.intersectObjects(markers);

        if (intersects.length > 0) {
          const countryCode = intersects[0].object.userData.countryCode;
          onCountrySelect(countryCode);
        }
      }
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('click', handleClick);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (globe) {
        globe.rotation.y += 0.003;
        globe.rotation.x = mousePosition.y * 0.1;
        material.uniforms.time.value += 0.01;
      }
      
      renderer.render(scene, camera);
    };

    animate();
    
    // Handle window resize
    const handleResize = () => {
      const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
      const containerHeight = containerRef.current?.clientHeight || window.innerHeight;
      camera.aspect = containerWidth / containerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerWidth, containerHeight);
    };

    window.addEventListener('resize', handleResize);
    setGlobeLoaded(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('click', handleClick);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDarkMode, countries, onCountrySelect]);

  const createEarthTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Create a simple earth-like texture
    const gradient = ctx.createLinearGradient(0, 0, 512, 256);
    gradient.addColorStop(0, '#001122');
    gradient.addColorStop(0.3, '#002244');
    gradient.addColorStop(0.6, '#003366');
    gradient.addColorStop(1, '#001122');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 256);
    
    // Add some landmass-like shapes
    ctx.fillStyle = '#004d40';
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * 512,
        Math.random() * 256,
        Math.random() * 20 + 5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  const addCountryMarkers = (scene: THREE.Scene) => {
    countries.forEach((country) => {
      const markerGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.9
      });
      
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      
      // Convert lat/lng to 3D coordinates
      const phi = (90 - country.coordinates.lat) * (Math.PI / 180);
      const theta = (country.coordinates.lng + 180) * (Math.PI / 180);
      
      const x = -(2.1 * Math.sin(phi) * Math.cos(theta));
      const y = 2.1 * Math.cos(phi);
      const z = 2.1 * Math.sin(phi) * Math.sin(theta);
      
      marker.position.set(x, y, z);
      marker.userData = { countryCode: country.code, countryName: country.name };
      
      scene.add(marker);
    });
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center cursor-pointer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {hoveredCountry && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-75 backdrop-blur-md rounded-lg px-4 py-2 pointer-events-none">
          <p className="text-white font-medium">{hoveredCountry}</p>
        </div>
      )}
    </motion.div>
  );
};