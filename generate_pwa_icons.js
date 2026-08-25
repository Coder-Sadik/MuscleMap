const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Vector SVG for MuscleMap icon: Dark obsidian rounded shield with glowing emerald dumbbell
function createSvg(size) {

  return `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="neonEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="plateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="112" fill="#09090b" />
  <rect width="512" height="512" rx="112" fill="url(#bgGlow)" />
  <rect x="8" y="8" width="496" height="496" rx="104" stroke="#27272a" stroke-width="4" stroke-opacity="0.6" />

  <!-- Outer ambient ring -->
  <circle cx="256" cy="256" r="160" stroke="#10b981" stroke-width="3" stroke-opacity="0.15" stroke-dasharray="8 8" />

  <!-- Dumbbell Center Group -->
  <g transform="rotate(-45 256 256)" filter="url(#glow)">
    <!-- Central Bar -->
    <rect x="236" y="120" width="40" height="272" rx="20" fill="url(#neonEmerald)" />
    
    <!-- Bar Knurling details -->
    <line x1="240" y1="230" x2="272" y2="230" stroke="#064e3b" stroke-width="4" stroke-linecap="round" />
    <line x1="240" y1="246" x2="272" y2="246" stroke="#064e3b" stroke-width="4" stroke-linecap="round" />
    <line x1="240" y1="262" x2="272" y2="262" stroke="#064e3b" stroke-width="4" stroke-linecap="round" />
    <line x1="240" y1="278" x2="272" y2="278" stroke="#064e3b" stroke-width="4" stroke-linecap="round" />

    <!-- Left Plates -->
    <rect x="200" y="100" width="112" height="34" rx="14" fill="url(#plateGrad)" />
    <rect x="216" y="66" width="80" height="30" rx="12" fill="#34d399" />
    <rect x="230" y="44" width="52" height="18" rx="8" fill="#6ee7b7" />

    <!-- Right Plates -->
    <rect x="200" y="378" width="112" height="34" rx="14" fill="url(#plateGrad)" />
    <rect x="216" y="416" width="80" height="30" rx="12" fill="#34d399" />
    <rect x="230" y="450" width="52" height="18" rx="8" fill="#6ee7b7" />
  </g>

  <!-- Accent Pulse Dot -->
  <circle cx="390" cy="120" r="14" fill="#10b981" />
  <circle cx="390" cy="120" r="24" stroke="#10b981" stroke-width="2" stroke-opacity="0.5" />
</svg>
`;
}

async function generate() {
  const sizes = [
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon.png', size: 512 },
  ];

  for (const item of sizes) {
    const svgBuffer = Buffer.from(createSvg(item.size));
    const outputPath = path.join(publicDir, item.name);
    await sharp(svgBuffer)
      .resize(item.size, item.size)
      .png()
      .toFile(outputPath);
    console.log(`Generated ${item.name} (${item.size}x${item.size})`);
  }
}

generate().catch(console.error);
