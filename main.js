/* Big Tech Dinner - GIF mode 1x1 (tuned UI) */

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const stage = document.getElementById('stage');
const gifLeft = document.getElementById('gifLeft');
const gifCenter = document.getElementById('gifCenter');
const gifRight = document.getElementById('gifRight');
const flowerOverlay = document.getElementById('flowerOverlay');

const intro = document.getElementById('intro');
const startGif = document.getElementById('startGif');

// Speech bubble elements
const leftSpeechBubble = document.getElementById('leftSpeechBubble');
const rightSpeechBubble = document.getElementById('rightSpeechBubble');
let speechBubbleInterval;

const menu = document.getElementById('menu');
const avatarsDiv = document.getElementById('avatars');
const startBtn = document.getElementById('startBtn');
const hud = document.getElementById('hud');
const timerEl = document.getElementById('timer');
const scoresEl = document.getElementById('scores');
const hintEl = document.getElementById('hint');
const result = document.getElementById('result');
const resultText = document.getElementById('resultText');
const playAgainBtn = document.getElementById('playAgainBtn');

// Trump intro popup elements
const trumpIntroPopup = document.getElementById('trumpIntroPopup');
const trumpIntroText = document.getElementById('trumpIntroText');
const trumpIntroImage = document.getElementById('trumpIntroImage');
const skipTrumpBtn = document.getElementById('skipTrumpBtn');
const countdownOverlay = document.getElementById('countdownOverlay');
const countdownNumber = document.getElementById('countdownNumber');

// VS Intro elements
const vsIntroPopup = document.getElementById('vsIntroPopup');
const vsPlayerImage = document.getElementById('vsPlayerImage');
const vsPlayerName = document.getElementById('vsPlayerName');
const vsOpponentImage = document.getElementById('vsOpponentImage');
const vsOpponentName = document.getElementById('vsOpponentName');

// Winning screen elements
const winningPopup = document.getElementById('winningPopup');
const winningPlayerImage = document.getElementById('winningPlayerImage');
const winningTitleText = document.getElementById('winningTitleText');
const winningMessageText = document.getElementById('winningMessageText');
const winningPlayAgainBtn = document.getElementById('winningPlayAgainBtn');

// Lose screen elements
const losePopup = document.getElementById('losePopup');
const loseText = document.getElementById('loseText');
const losePlayAgainBtn = document.getElementById('losePlayAgainBtn');
const loseTrumpImage = document.getElementById('loseTrumpImage');

const ASSETS = {
  select: [
    { id: 'mark', name: 'Mark', png: 'assets/mark.png', gif: 'assets/mark_game.gif' },
    { id: 'tim', name: 'Tim', png: 'assets/tim.png', gif: 'assets/tim_game.gif' },
  ],
  trump: 'assets/trump_game.gif',
  introCharacters: [
    { id: 'sergei', name: 'Sergei', src: 'assets/SERGEI_intro.gif' },
    { id: 'bill', name: 'Bill', src: 'assets/Bill_intro.gif' },
    { id: 'sundar', name: 'Sundar', src: 'assets/SUNDAR_INTRO.gif' },
    { id: 'sam', name: 'Sam', src: 'assets/SAM_INTRO.gif' },
    { id: 'mark_intro', name: 'Mark', src: 'assets/MARK_INTRO.gif' },
    { id: 'tim_intro', name: 'Tim', src: 'assets/TIM_INTRO.gif' },
  ],
};

const COLORS = {
  border: '#1f2c36',
  bubbleFill: '#fbf4e3',
};

// Load speech bubble image
const speechBubbleImg = new Image();
speechBubbleImg.src = 'assets/speechbubble.gif';

// Load heart image for stream effect
const heartImg = new Image();
heartImg.src = 'assets/heart.gif';

// 9-slice canvas drawing function for pixel art UI elements
function draw9SlicePixelBorder(ctx, x, y, width, height, borderWidth = 4, cornerSize = 8) {
  const bw = borderWidth;
  
  // Save context
  ctx.save();
  
  // Fill entire area with black first
  ctx.fillStyle = '#000000';
  ctx.fillRect(x, y, width, height);
  
  // Draw white interior
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + bw, y + bw, width - bw * 2, height - bw * 2);
  
  // Create authentic pixel art corners with diagonal cuts
  ctx.fillStyle = '#000000';
  
  // Top-left corner: diagonal cut pattern
  ctx.fillRect(x, y, 2, 1); // Top-left pixel corner cut
  ctx.fillRect(x, y + 1, 1, 1); // Second row cut
  
  // Top-right corner: diagonal cut pattern  
  ctx.fillRect(x + width - 2, y, 2, 1); // Top-right pixel corner cut
  ctx.fillRect(x + width - 1, y + 1, 1, 1); // Second row cut
  
  // Bottom-left corner: diagonal cut pattern
  ctx.fillRect(x, y + height - 2, 1, 1); // Second to last row cut
  ctx.fillRect(x, y + height - 1, 2, 1); // Bottom-left pixel corner cut
  
  // Bottom-right corner: diagonal cut pattern
  ctx.fillRect(x + width - 1, y + height - 2, 1, 1); // Second to last row cut
  ctx.fillRect(x + width - 2, y + height - 1, 2, 1); // Bottom-right pixel corner cut
  
  // Redraw the white interior to ensure clean edges
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + bw, y + bw, width - bw * 2, height - bw * 2);
  
  // Add the inner corner cuts to the white area to create the beveled effect
  ctx.fillStyle = '#000000';
  
  // Inner top-left corner notch
  ctx.fillRect(x + bw - 1, y + bw, 1, 1);
  ctx.fillRect(x + bw, y + bw - 1, 1, 1);
  
  // Inner top-right corner notch
  ctx.fillRect(x + width - bw, y + bw, 1, 1);
  ctx.fillRect(x + width - bw - 1, y + bw - 1, 1, 1);
  
  // Inner bottom-left corner notch
  ctx.fillRect(x + bw - 1, y + height - bw - 1, 1, 1);
  ctx.fillRect(x + bw, y + height - bw, 1, 1);
  
  // Inner bottom-right corner notch
  ctx.fillRect(x + width - bw, y + height - bw - 1, 1, 1);
  ctx.fillRect(x + width - bw - 1, y + height - bw, 1, 1);
  
  ctx.restore();
}

// Helper function to create a canvas element for UI backgrounds
function createUICanvas(width, height, borderWidth = 4, cornerSize = 8) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set high DPI
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.scale(dpr, dpr);
  
  // Disable smoothing for pixel art
  ctx.imageSmoothingEnabled = false;
  
  // Draw the 9-slice border
  draw9SlicePixelBorder(ctx, 0, 0, width, height, borderWidth, cornerSize);
  
  return canvas;
}

// Create progress bar canvas
function createProgressBarCanvas(width, height, progress) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set high DPI
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.scale(dpr, dpr);
  
  // Disable smoothing for pixel art
  ctx.imageSmoothingEnabled = false;
  
  // Draw outer border
  draw9SlicePixelBorder(ctx, 0, 0, width, height, 4, 8);
  
  // Draw progress fill
  if (progress > 0) {
    const fillWidth = Math.max(0, (width - 12) * progress); // 12px for borders
    const fillHeight = height - 12;
    
    // Progress color based on time remaining
    let fillColor;
    if (progress > 0.66) {
      fillColor = '#4CAF50'; // Green for plenty of time
    } else if (progress > 0.33) {
      fillColor = '#FF9800'; // Orange for medium time
    } else {
      fillColor = '#F44336'; // Red for low time
    }
    
    ctx.fillStyle = fillColor;
    ctx.fillRect(6, 6, fillWidth, fillHeight);
  }
  
  return canvas;
}

// Create reactive score canvas with elegant tap feedback
function createScoreCanvas(width, height, score, isLeading = false, isPlayer = false, isFlashing = false) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set high DPI
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.scale(dpr, dpr);
  
  // Disable smoothing for pixel art
  ctx.imageSmoothingEnabled = false;
  
  // Always use white background with black border for visibility
  const borderWidth = 6;
  let bgColor = '#ffffff'; // Always white for maximum visibility
  let accentColor = '#E0E0E0'; // Default accent
  
  if (isFlashing) {
    bgColor = '#fff700'; // Bright yellow flash for player action
    accentColor = '#ffeb3b'; // Bright accent during flash
  } else if (isPlayer) {
    accentColor = '#FFC107'; // Yellow accent for player
  } else if (isLeading) {
    accentColor = '#F44336'; // Red accent for leading opponent
  }
  
  // Draw outer black border
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  
  // Draw main white background
  ctx.fillStyle = bgColor;
  ctx.fillRect(borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2);
  
  // Draw accent strip on the side for visual distinction
  if (isPlayer || isLeading) {
    ctx.fillStyle = accentColor;
    if (isPlayer) {
      // Left accent strip for player
      ctx.fillRect(borderWidth, borderWidth, 4, height - borderWidth * 2);
    } else {
      // Right accent strip for opponent
      ctx.fillRect(width - borderWidth - 4, borderWidth, 4, height - borderWidth * 2);
    }
  }
  
  // Add pixel art corner cuts for authentic retro feel
  ctx.fillStyle = '#000000';
  
  // Top-left corner cut
  ctx.fillRect(0, 0, 2, 1);
  ctx.fillRect(0, 1, 1, 1);
  
  // Top-right corner cut
  ctx.fillRect(width - 2, 0, 2, 1);
  ctx.fillRect(width - 1, 1, 1, 1);
  
  // Bottom-left corner cut
  ctx.fillRect(0, height - 2, 1, 1);
  ctx.fillRect(0, height - 1, 2, 1);
  
  // Bottom-right corner cut
  ctx.fillRect(width - 1, height - 2, 1, 1);
  ctx.fillRect(width - 2, height - 1, 2, 1);
  
  return canvas;
}

function drawSpeechBubble(x, y, w, h, text, alpha=1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  
  // Draw the speech bubble GIF
  if (speechBubbleImg.complete) {
    ctx.drawImage(speechBubbleImg, x - w/2, y - h, w, h);
  }
  
  // Draw the text with proportional padding
  ctx.fillStyle = '#1c2a35';
  ctx.font = 'bold 12px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Calculate proportional padding based on original bubble size
  // Original: 45px from top, 90px from bottom on some reference size
  // For current bubble: scale proportionally
  const topPadding = h * (45 / 135); // 45px out of total 135px (45+90)
  const bottomPadding = h * (90 / 135); // 90px out of total 135px
  
  // Split text into lines if needed
  const lines = [`You are`, text];
  const lineHeight = 16;
  const textAreaHeight = h - topPadding - bottomPadding;
  const textAreaTop = y - h + topPadding;
  const startY = textAreaTop + textAreaHeight/2 - (lines.length - 1) * lineHeight / 2;
  
  lines.forEach((line, i) => {
    ctx.fillText(line, x, startY + i * lineHeight);
  });
  
  ctx.restore();
}

function drawHeart(heart) {
  ctx.save();
  const alpha = Math.max(0, heart.life / heart.maxLife);
  ctx.globalAlpha = alpha;
  
  // Apply GSAP transformations
  ctx.translate(heart.x, heart.y);
  ctx.scale(heart.gsapProps.scale, heart.gsapProps.scale);
  ctx.rotate((heart.gsapProps.rotation * Math.PI) / 180);
  
  if (heartImg.complete) {
    const size = heart.size;
    ctx.drawImage(heartImg, -size/2, -size/2, size, size);
  }
  
  ctx.restore();
}

// Simple heart animation updates
function updateHeartAnimations(dt) {
  // Hearts now have no rotation or additional animations
  // They simply move with their velocity and fade out
}

// Trump introduction functionality
const TRUMP_INTRO_TEXT = "We're making the biggest, smartest, most tremendous investments in AI. Nobody invests like me. And you guys — you love it, don't you?<br><br>You love me. Say it! Say it now!";

// Character mapping for VS intro
const VS_CHARACTER_MAP = {
  'mark': { name: 'Mark', introGif: 'assets/MARK_INTRO.gif' },
  'tim': { name: 'Tim', introGif: 'assets/TIM_INTRO.gif' },
  'sergei': { name: 'Sergei', introGif: 'assets/SERGEI_intro.gif' },
  'bill': { name: 'Bill', introGif: 'assets/Bill_intro.gif' },
  'sundar': { name: 'Sundar', introGif: 'assets/SUNDAR_INTRO.gif' },
  'sam': { name: 'Sam', introGif: 'assets/SAM_INTRO.gif' },
  'mark_intro': { name: 'Mark', introGif: 'assets/MARK_INTRO.gif' },
  'tim_intro': { name: 'Tim', introGif: 'assets/TIM_INTRO.gif' },
  'sergei_intro': { name: 'Sergei', introGif: 'assets/SERGEI_intro.gif' },
  'bill_intro': { name: 'Bill', introGif: 'assets/Bill_intro.gif' },
  'sundar_intro': { name: 'Sundar', introGif: 'assets/SUNDAR_INTRO.gif' },
  'sam_intro': { name: 'Sam', introGif: 'assets/SAM_INTRO.gif' }
};

// Available opponents for random selection
const AVAILABLE_OPPONENTS = ['sergei', 'bill', 'sundar', 'sam', 'mark_intro', 'tim_intro'];

function typewriterEffect(element, text, speed = 50) {
  return new Promise((resolve) => {
    element.innerHTML = '';
    let i = 0;
    let currentHTML = '';
    let inTag = false;
    let currentTag = '';
    
    function typeChar() {
      if (i < text.length) {
        const char = text.charAt(i);
        
        if (char === '<') {
          inTag = true;
          currentTag = char;
        } else if (char === '>') {
          inTag = false;
          currentTag += char;
          currentHTML += currentTag;
          currentTag = '';
          // Don't add delay for HTML tags
          i++;
          typeChar();
          return;
        } else if (inTag) {
          currentTag += char;
        } else {
          currentHTML += char;
        }
        
        element.innerHTML = currentHTML;
        i++;
        setTimeout(typeChar, speed);
      } else {
        resolve();
      }
    }
    
    typeChar();
  });
}

function typewriterEffectByWord(element, text, speed = 200) {
  return new Promise((resolve) => {
    element.textContent = '';
    const words = text.split(' ');
    let i = 0;
    
    function typeWord() {
      if (i < words.length) {
        if (i > 0) {
          element.textContent += ' ';
        }
        element.textContent += words[i];
        i++;
        setTimeout(typeWord, speed);
      } else {
        resolve();
      }
    }
    
    typeWord();
  });
}

function showVSIntro() {
  console.log('showVSIntro called at:', new Date().toLocaleTimeString()); // Debug log
  
  // Safety check - don't show VS popup if game is already playing
  if (state.screen === 'playing') {
    console.log('showVSIntro blocked - game already playing');
    return;
  }
  
  // ALWAYS clear any existing VS timeout first to prevent duplicates
  if (state.vsIntroTimeout) {
    clearTimeout(state.vsIntroTimeout);
    state.vsIntroTimeout = null;
    console.log('Cleared existing VS timeout');
  }
  
  // Character mapping for intro GIFs - using the correct IDs from ASSETS.introCharacters
  const characterIntroGifs = {
    'mark_intro': 'assets/MARK_INTRO.gif',
    'tim_intro': 'assets/TIM_INTRO.gif',
    'sergei': 'assets/SERGEI_intro.gif',
    'sundar': 'assets/SUNDAR_INTRO.gif',
    'sam': 'assets/SAM_INTRO.gif',
    'bill': 'assets/Bill_intro.gif'
  };
  
  // Character names - using the correct IDs from ASSETS.introCharacters
  const characterNames = {
    'mark_intro': 'Mark',
    'tim_intro': 'Tim',
    'sergei': 'Sergei',
    'sundar': 'Sundar',
    'sam': 'Sam',
    'bill': 'Bill'
  };
  
  // Always select a new opponent to avoid same character vs same character
  const allCharacters = ['mark_intro', 'tim_intro', 'sergei', 'sundar', 'sam', 'bill'];
  const availableOpponents = allCharacters.filter(char => char !== state.choice);
  state.opponent = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
  
  console.log('VS Popup - Player choice:', state.choice, 'Opponent:', state.opponent); // Debug log
  
  // Set up the VS intro display
  vsPlayerImage.src = characterIntroGifs[state.choice] || 'assets/MARK_INTRO.gif';
  vsPlayerName.textContent = characterNames[state.choice] || 'Mark';
  vsOpponentImage.src = characterIntroGifs[state.opponent] || 'assets/TIM_INTRO.gif';
  vsOpponentName.textContent = characterNames[state.opponent] || 'Tim';
  
  // Show the popup with entrance animation
  vsIntroPopup.classList.remove('hidden');
  
  // Add debug log to track when VS popup is shown
  console.log('VS popup shown at:', new Date().toLocaleTimeString());
  
  // Add exciting entrance animations using GSAP - characters slide from their sides without crossing
  gsap.fromTo(vsPlayerImage, 
    { x: -300, opacity: 0 }, // Start from left side
    { x: -80, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.2 } // Stop well left of center
  );
  
  gsap.fromTo(vsOpponentImage, 
    { x: 300, opacity: 0 }, // Start from right side
    { x: 80, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.4 } // Stop well right of center
  );
  
  gsap.fromTo('.vs-logo', 
    { scale: 0, y: -50, opacity: 0 },
    { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: "bounce.out", delay: 0.6 }
  );
  
  gsap.fromTo([vsPlayerName, vsOpponentName], 
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.8, stagger: 0.1 }
  );
  
  // Auto-close after 4 seconds (increased from 3) and show countdown
  state.vsIntroTimeout = setTimeout(() => {
    console.log('VS timeout fired at:', new Date().toLocaleTimeString());
    console.log('VS popup hidden?', vsIntroPopup.classList.contains('hidden'));
    console.log('Screen state:', state.screen);
    console.log('Is game?', document.body.classList.contains('is-game'));
    console.log('Timer state:', state.timerMs);
    
    // Multiple safety checks to prevent VS popup from appearing mid-game
    if (!vsIntroPopup.classList.contains('hidden') && 
        state.screen !== 'playing' && 
        !document.body.classList.contains('is-game') &&
        state.timerMs === ROUND_MS) { // Only if timer hasn't started
      console.log('VS timeout proceeding to showCountdown');
      // Exit animation - now handled in showCountdown function for smooth transition
      showCountdown();
    } else {
      console.log('VS timeout blocked by safety checks');
    }
  }, 4000);
}

function showTrumpIntro() {
  console.log('showTrumpIntro called'); // Debug log
  // Reset Trump image to speaking version
  trumpIntroImage.src = 'assets/TRUMPINTRO.gif';
  
  // Show Trump popup directly (no transition needed since we start with it)
  trumpIntroPopup.classList.remove('hidden');
  console.log('Trump popup shown, hidden class removed'); // Debug log
  
  // Get the Trump content container
  const trumpContent = document.querySelector('.popup-content');
  
  // Animate Trump content container entrance
  gsap.fromTo(trumpContent, 
    { 
      opacity: 0, 
      scale: 0.8,
      backgroundColor: '#ffe6c7'
    },
    { 
      opacity: 1, 
      scale: 1,
      backgroundColor: '#ffe6c7',
      duration: 0.6, 
      ease: "power2.out"
    }
  );
  
  // Animate Trump image entrance
  gsap.fromTo(trumpIntroImage, 
    { 
      opacity: 0, 
      scale: 0.8, 
      x: -50 
    },
    { 
      opacity: 1, 
      scale: 1, 
      x: 0, 
      duration: 0.5, 
      ease: "back.out(1.7)", 
      delay: 0.2 
    }
  );
  
  // Animate text container entrance
  gsap.fromTo('.trump-text-container', 
    { 
      opacity: 0, 
      x: 50 
    },
    { 
      opacity: 1, 
      x: 0, 
      duration: 0.4, 
      ease: "power2.out", 
      delay: 0.4 
    }
  );
  
  // Animate skip button entrance
  gsap.fromTo('.trump-skip-button', 
    { 
      opacity: 0, 
      y: 20 
    },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.3, 
      ease: "power2.out", 
      delay: 0.6 
    }
  );
  
  // Start typewriter effect after animations complete
  setTimeout(async () => {
    await typewriterEffect(trumpIntroText, TRUMP_INTRO_TEXT, 80);
    
    // Switch to blinking image when text finishes
    trumpIntroImage.src = 'assets/TRUMPINTRO_blink.gif';
    
    // Wait a moment after text completes
    setTimeout(() => {
      trumpIntroPopup.classList.add('hidden');
      
      // Clear any existing VS timeout before showing new VS popup
      if (state.vsIntroTimeout) {
        clearTimeout(state.vsIntroTimeout);
        state.vsIntroTimeout = null;
      }
      
      showVSIntro();
    }, 1000);
  }, 1000);
}

// Skip button functionality - Updated to go to VS popup first
function skipTrumpIntro() {
  trumpIntroPopup.classList.add('hidden');
  
  // Clear any existing VS timeout before showing new VS popup
  if (state.vsIntroTimeout) {
    clearTimeout(state.vsIntroTimeout);
    state.vsIntroTimeout = null;
  }
  
  showVSIntro(); // Goes to VS popup, then countdown
}

// Global function to clear all popup timeouts
function clearAllPopupTimeouts() {
  if (state.vsIntroTimeout) {
    clearTimeout(state.vsIntroTimeout);
    state.vsIntroTimeout = null;
  }
  if (state.trumpIntroTimeout) {
    clearTimeout(state.trumpIntroTimeout);
    state.trumpIntroTimeout = null;
  }
  if (state.winningMessageTimeout) {
    clearTimeout(state.winningMessageTimeout);
    state.winningMessageTimeout = null;
  }
  if (winningMessageTimeout) {
    clearTimeout(winningMessageTimeout);
    winningMessageTimeout = null;
  }
}

// Add event listener for skip button
skipTrumpBtn.addEventListener('click', skipTrumpIntro);

// Add event listener for winning play again button
winningPlayAgainBtn.addEventListener('click', () => {
  // Clear winning message cycle
  if (winningMessageTimeout) {
    clearTimeout(winningMessageTimeout);
  }
  winningPopup.classList.add('hidden');
  showMenu();
});

// Variable to store the message cycle timeout
let loseMessageTimeout = null;

// Add event listener for lose play again button
losePlayAgainBtn.addEventListener('click', () => {
  // Clear any pending message cycles
  if (loseMessageTimeout) {
    clearTimeout(loseMessageTimeout);
    loseMessageTimeout = null;
  }
  
  losePopup.classList.add('hidden');
  showMenu();
});

function showCountdown() {
  // Multiple safety checks - only show countdown if not already playing
  if (state.screen === 'playing' || 
      document.body.classList.contains('is-game') ||
      state.timerMs < ROUND_MS) {
    return; // Don't show countdown if game is already running
  }
  
  // Hide VS popup first
  vsIntroPopup.classList.add('hidden');
  
  countdownOverlay.classList.remove('hidden');
  
  // Add touch event prevention specifically for countdown to prevent page scaling
  const preventCountdownTouch = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  countdownOverlay.addEventListener('touchstart', preventCountdownTouch, { passive: false });
  countdownOverlay.addEventListener('touchmove', preventCountdownTouch, { passive: false });
  countdownOverlay.addEventListener('touchend', preventCountdownTouch, { passive: false });
  countdownOverlay.addEventListener('gesturestart', preventCountdownTouch, { passive: false });
  countdownOverlay.addEventListener('gesturechange', preventCountdownTouch, { passive: false });
  countdownOverlay.addEventListener('gestureend', preventCountdownTouch, { passive: false });
  
  let count = 3;
  
  // Prevent popup scaling while allowing button clicks
  function preventPopupTouch(e) {
    // Allow button clicks
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return; // Allow button interaction
    }
    e.preventDefault();
    e.stopPropagation();
  }
  
  // Add touch event prevention to all popups
  const popups = document.querySelectorAll('.popup');
  popups.forEach(popup => {
    popup.addEventListener('touchstart', preventPopupTouch, { passive: false });
    popup.addEventListener('touchmove', preventPopupTouch, { passive: false });
    popup.addEventListener('touchend', preventPopupTouch, { passive: false });
    popup.addEventListener('gesturestart', preventPopupTouch, { passive: false });
    popup.addEventListener('gesturechange', preventPopupTouch, { passive: false });
    popup.addEventListener('gestureend', preventPopupTouch, { passive: false });
  });
  
  function updateCountdown() {
    if (count > 0) {
      // Show number countdown
      countdownNumber.innerHTML = count.toString();
      countdownNumber.style.animation = 'none';
      
      // Trigger animation
      setTimeout(() => {
        countdownNumber.style.animation = 'countdownPulse 1s ease-in-out';
      }, 10);
    } else {
      // Show tap icon only in center
      countdownNumber.innerHTML = '<img src="assets/tap.gif" alt="Tap" class="countdown-tap-icon" />';
      countdownNumber.style.animation = 'none';
      
      // Show "TAP!" text in instruction area
      const instruction = document.querySelector('.countdown-instruction');
      if (instruction) {
        instruction.innerHTML = '<p class="tap-text">TAP!</p>';
        instruction.style.display = 'flex';
      }
      
      // Trigger tap flicker animation (3 times) for both icon and text
      let flickerCount = 0;
      function tapFlicker() {
        if (flickerCount < 3) {
          countdownNumber.style.animation = 'tapFlicker 0.15s ease-in-out';
          const tapText = document.querySelector('.tap-text');
          if (tapText) {
            tapText.style.animation = 'tapFlicker 0.15s ease-in-out';
          }
          setTimeout(() => {
            countdownNumber.style.animation = 'none';
            if (tapText) {
              tapText.style.animation = 'none';
            }
            flickerCount++;
            setTimeout(tapFlicker, 100); // 100ms pause between flicks
          }, 150);
        } else {
          // Final pulse after flickering
          setTimeout(() => {
            countdownNumber.style.animation = 'countdownPulse 1s ease-in-out';
          }, 50);
        }
      }
      
      setTimeout(tapFlicker, 100);
    }
    
    count--;
    
    if (count >= 0) {
      setTimeout(updateCountdown, 1000);
    } else {
      setTimeout(() => {
        countdownOverlay.classList.add('hidden');
        startRound(); // Start the actual game
      }, 1000);
    }
  }
  
  updateCountdown();
}

function addHeart(side) {
  const rect = canvas.getBoundingClientRect();
  const w = rect.width, h = rect.height;
  
  // Calculate bubble position alignment
  const containerStart = 0.1867;
  const containerWidth = 0.6266;
  
  let sxBase;
  if (side === 'left') {
    sxBase = w * (containerStart + containerWidth / 6);
  } else {
    sxBase = w * (containerStart + containerWidth * 5/6);
  }
  
  const sx = sxBase + (Math.random() - 0.5) * (w * 0.04); // Less spread
  const sy = h * 0.64; // Same height as bubbles
  
  // Simple heart properties
  const upSpeed = 0.25; // Consistent upward movement
  const sideSpeed = (Math.random() - 0.5) * 0.03; // Minimal side drift
  const size = 20 + Math.random() * 6; // Consistent size 20-26px
  const maxLife = 2000; // 2 seconds consistent lifetime
  
  const heart = {
    x: sx,
    y: sy,
    vx: sideSpeed,
    vy: -upSpeed,
    life: maxLife,
    maxLife,
    size,
    created: Date.now(),
    gsapProps: {
      scale: 0.1, // Start small
      rotation: 0, // No rotation
      ease: "power2.out"
    }
  };
  
  state.hearts.push(heart);
  
  // Animate heart appearance with GSAP
  gsap.to(heart.gsapProps, {
    scale: 1,
    duration: 0.3,
    ease: "back.out(1.7)"
  });
}

const ROUND_MS = 20000; // Reduced from 30 to 20 seconds for more pressure
const WORDS = ['Smart','Huge','Genius','Strong','Best','Wow','Elite','Power','Great','Winning','Incredible','Amazing','Handsome','Perfect','Brilliant','Tremendous','Fantastic','Wonderful'];
const SARCASTIC_WINS = ["Tremendous. You out‑flattered democracy.","A historic victory in sucking up.","Genius level groveling."];
const SARCASTIC_LOSSES = ["Low energy. Try a bigger thesaurus.","Sad! Even the AI beat you.","So close to greatness. But not really."];

// Winning screen messages - Trump-style praise (2 lines each)
const WINNING_MESSAGES = [
  "This compliment is so powerful, Elon just called — he wants to buy it for $44 billion.",
  "You flatter me more than Truth Social bots. That's a lot of bots, folks.",
  "Your praise is bigger than my rallies — and my rallies are the biggest in history.",
  "Incredible! Even Kim Jong-un never said anything this nice to me.",
  "Honestly, this praise is bigger than the Apprentice ratings — and those were number one, everybody knows it.",
  "You flatter me more than Fox News — and believe me, that's a lot of flattering.",
  "You complimented me faster than Sleepy Joe falls asleep. Tremendous!",
  "Your words are stronger than tariffs. China is very scared right now.",
  "The fake news said it couldn't be done. But you did it. Tremendous flattery!",
  "This is a Big beautiful praise. I will appoint you as my Press Secretary",
  "Tremendous! Even Fox & Friends will be talking about this tomorrow morning.",
  "Honestly, the best words. Better than the Bible, maybe. Don't tell Mike Pence.",
  "Historic compliment! They'll write about it in the failing New York Times."
];

// Losing screen messages - Trump-style insults
const LOSING_MESSAGES = [
  "Sad! Very, very sad. Total disaster of a player.",
  "Weak. Pathetic. Even Jeb! would've done better.",
  "Total loser. People are laughing at you — everyone's laughing.",
  "Fake gamer! Not even close to winning.",
  "You played like Sleepy Joe — fell asleep halfway through!",
  "Total disaster. Even Crooked Hillary would've done better.",
  "Pathetic! You're almost as bad as Little Marco.",
  "Low Energy! Just like Jeb, very sad.",
  "You got crushed. Almost worse than Lyin' Ted — almost.",
  "Complete meltdown. People are calling you Pocahontas now.",
  "Weak, weak, weak. Like Crazy Bernie on his worst day.",
  "Fake gamer! More fake than CNN.",
  "Tremendous failure. The worst. Everyone agrees.",
  "You're a disaster. Total disaster. Believe me.",
  "Sad! Even the AI beat you. Very sad.",
  "Low energy performance. Just like Jeb Bush.",
  "You played like a loser. Total loser.",
  "Fake skills! Not even close to being good.",
  "Pathetic attempt. People are laughing at you.",
  "Weak performance. Very weak. Sad!",
  "You got destroyed. Almost as bad as Sleepy Joe.",
  "Complete failure. The media won't even report this.",
  "Tremendous disaster. The biggest disaster ever.",
  "You're a joke. Total joke. Everyone's laughing.",
  "Fake talent! More fake than the fake news.",
  "Weak, weak, weak. Like Little Marco on his worst day.",
  "You played like a total amateur. Very sad.",
  "Pathetic! Even Pocahontas would've done better.",
  "Low energy! Just like Jeb, very low energy.",
  "You're a disaster. Total disaster. The worst."
];


let state = {
  screen: 'intro',
  choice: null,
  opponent: null, // Store the selected opponent
  playerSide: null, // Store which side the player is on (left or right)
  timerMs: ROUND_MS,
  lastTs: 0,
  bubbles: [],
  leftScore: 0,
  rightScore: 0,
  playerFlashTime: 0, // For white flash effect
  hearts: [], // For heart stream effect
  // Tug of war state
  barPosition: 50, // 0-100, where 50 is center
  barVelocity: 0, // Current velocity of bar movement
  gameEnded: false, // Track if game has ended
};

function isPortraitMobile(){
  const ar = window.innerWidth / window.innerHeight;
  return ar < 0.75;
}

function applyBackgroundsForDevice(){
  if (isPortraitMobile()) {
    // iPhone 12 Pro base height (844px)
    const baseHeight = 844;
    const currentHeight = window.innerHeight;
    const heightScale = currentHeight / baseHeight;
    
    stage.style.backgroundImage = "url('assets/background.jpg')"; // Use desktop background
    stage.style.height = `${844 * heightScale}px`; // 844px height scaled proportionally
    
    flowerOverlay.src = 'assets/floweroverlay.png'; // Use desktop flower overlay
    flowerOverlay.style.height = `${844 * heightScale}px`; // 844px height scaled proportionally
    
    // Apply mobile portrait GIF positioning
    applyMobilePortraitGifPositioning();
    
    // Apply gameplay-specific mobile portrait positioning
    applyGameplayMobilePortraitPositioning();
  } else {
    stage.style.backgroundImage = "url('assets/background.jpg')";
    stage.style.height = ''; // Reset to default
    flowerOverlay.src = 'assets/floweroverlay.png';
    flowerOverlay.style.height = ''; // Reset to default
    
    // Reset to default positioning for desktop
    resetGifPositioning();
  }
}

function applyMobilePortraitGifPositioning() {
  // Only apply mobile portrait positioning to intro page, not gameplay
  if (!document.body.classList.contains('is-intro')) {
    return; // Don't apply to gameplay page
  }
  
  // Use same structure as desktop but with responsive scaling
  const logoGif = document.querySelector('.logoGif');
  if (logoGif) {
    logoGif.style.width = 'clamp(500px, 90vw, 1000px)'; // Much bigger logo
    logoGif.style.height = 'auto';
    logoGif.style.top = '12%'; // Move down more
  }
  
  // Apply styles to GIF containers - keep desktop structure
  const gifContainers = document.querySelectorAll('#gameGifsContainer, .intro-gifs');
  gifContainers.forEach(container => {
    container.style.bottom = '0'; // Align to bottom like desktop
    container.style.paddingLeft = '0px';
    container.style.paddingRight = '0px';
    container.style.width = '100%'; // Full width
    container.style.marginLeft = '0px';
    container.style.marginRight = '0px';
  });
  
  // Apply styles to GIF images - triple size, cropping is okay
  const gifImages = document.querySelectorAll('.actorGif');
  gifImages.forEach(img => {
    img.style.setProperty('width', 'clamp(350px, 60yvw, 450px)', 'important'); // Triple size with !important
    img.style.height = 'auto';
    img.style.objectFit = 'cover'; // Allow cropping for larger size
    img.style.objectPosition = 'center bottom'; // Align to bottom
  });
  
  // Start button - keep desktop structure
  const startButton = document.querySelector('.startGif');
  if (startButton) {
    startButton.style.width = 'auto'; // Let CSS handle sizing
    startButton.style.height = 'auto';
    startButton.style.bottom = '4.7%'; // Keep original bottom position
  }
}

function applyGameplayMobilePortraitPositioning() {
  // Only apply to gameplay page on mobile portrait
  if (!document.body.classList.contains('is-game')) {
    return; // Don't apply to intro page
  }
  
  // Apply styles to GIF containers - same as intro page
  const gifContainers = document.querySelectorAll('#gameGifsContainer, .intro-gifs');
  gifContainers.forEach(container => {
    container.style.bottom = '0'; // Align to bottom like intro
    container.style.paddingLeft = '0px';
    container.style.paddingRight = '0px';
    container.style.width = '100%'; // Full width
    container.style.marginLeft = '0px';
    container.style.marginRight = '0px';
    container.style.justifyContent = 'center'; // Center the GIFs horizontally
  });
  
  // Apply styles to GIF images - same as intro page
  const gifImages = document.querySelectorAll('.actorGif');
  gifImages.forEach(img => {
    img.style.setProperty('width', 'clamp(200px, 40vw, 300px)', 'important'); // Same size as intro
    img.style.height = 'auto';
    img.style.objectFit = 'cover'; // Allow cropping
    img.style.objectPosition = 'center bottom'; // Align to bottom like intro
  });
}

function resetGifPositioning() {
  // Reset to default desktop positioning
  const gifContainers = document.querySelectorAll('#gameGifsContainer, .intro-gifs');
  gifContainers.forEach(container => {
    container.style.paddingTop = '';
    container.style.paddingBottom = '';
    container.style.paddingLeft = '';
    container.style.paddingRight = '';
    container.style.width = '';
    container.style.marginLeft = '';
    container.style.marginRight = '';
  });
  
  const gifImages = document.querySelectorAll('.actorGif');
  gifImages.forEach(img => {
    img.style.width = '';
    img.style.height = '';
    img.style.objectFit = '';
    img.style.objectPosition = '';
  });
  
  // Reset logo size
  const logoGif = document.querySelector('.logoGif');
  if (logoGif) {
    logoGif.style.width = '';
    logoGif.style.height = '';
  }
}

function updateUIBackgrounds() {
  // Update timer background
  const timer = document.getElementById('timer');
  if (timer) {
    const rect = timer.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const canvas = createUICanvas(rect.width, rect.height);
      timer.style.background = `url(${canvas.toDataURL()})`;
      timer.style.backgroundSize = '100% 100%';
    }
  }
  
  // Update score chips backgrounds
  document.querySelectorAll('.scoreChip').forEach(chip => {
    const rect = chip.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const canvas = createUICanvas(rect.width, rect.height);
      chip.style.background = `url(${canvas.toDataURL()})`;
      chip.style.backgroundSize = '100% 100%';
    }
  });
  
  // Update hint background
  const hint = document.getElementById('hint');
  if (hint) {
    const rect = hint.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const canvas = createUICanvas(rect.width, rect.height);
      hint.style.background = `url(${canvas.toDataURL()})`;
      hint.style.backgroundSize = '100% 100%';
    }
  }
  
  // Update result panel background
  const resultPanel = document.querySelector('#result .panel');
  if (resultPanel) {
    const rect = resultPanel.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const canvas = createUICanvas(rect.width, rect.height);
      resultPanel.style.background = `url(${canvas.toDataURL()})`;
      resultPanel.style.backgroundSize = '100% 100%';
    }
  }
}

function resize() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  stage.style.width = window.innerWidth + 'px';
  stage.style.height = window.innerHeight + 'px';
  const w = stage.clientWidth, h = stage.clientHeight;
  canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
  canvas.style.width = w+'px'; canvas.style.height = h+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  applyBackgroundsForDevice();
  
  // Update UI backgrounds after resize
  setTimeout(updateUIBackgrounds, 50); // Small delay to ensure elements are rendered
}
window.addEventListener('resize', resize);

function setupMenu() {
  avatarsDiv.innerHTML='';
  ASSETS.introCharacters.forEach(opt=>{
    const card = document.createElement('button');
    card.className = 'avatarCard' + (state.choice===opt.id ? ' selected' : '');
    const img = document.createElement('img');
    img.alt = opt.name; img.src = opt.src;
    card.appendChild(img);
    card.onclick = ()=>{
      console.log('Character clicked:', opt.id, 'Name:', opt.name); // Debug log
      state.choice = opt.id;
      document.querySelectorAll('.avatarCard').forEach(el=>el.classList.remove('selected', 'selecting'));
      
      // Add flickering animation
      card.classList.add('selecting');
      
      // After animation completes, add selected class
      setTimeout(() => {
        card.classList.remove('selecting');
        card.classList.add('selected');
      }, 800); // Match animation duration
      
      startBtn.classList.add('enabled');
      startBtn.textContent = `PLAY WITH ${opt.name.toUpperCase()}`; /* All caps */
      console.log('State choice updated to:', state.choice, 'Button text:', startBtn.textContent); // Debug log
    };
    avatarsDiv.appendChild(card);
  });
  
  // Set initial button text based on current selection
  if (state.choice) {
    const selectedCharacter = ASSETS.introCharacters.find(opt => opt.id === state.choice);
    if (selectedCharacter) {
      startBtn.textContent = `PLAY WITH ${selectedCharacter.name.toUpperCase()}`; /* All caps */
    }
  } else {
    startBtn.textContent = 'SELECT'; // Changed to just "SELECT"
  }
  
  startBtn.classList.toggle('enabled', !!state.choice);
}

// Debug: Check if startGif exists
console.log('startGif element:', startGif);
console.log('startGif onclick:', startGif.onclick);
console.log('Body classes:', document.body.className);
console.log('Button computed style:', window.getComputedStyle(startGif));
console.log('Button visible:', startGif.offsetWidth > 0 && startGif.offsetHeight > 0);

// Test if button is clickable
startGif.addEventListener('mousedown', () => console.log('Mouse down on button'));
startGif.addEventListener('mouseup', () => console.log('Mouse up on button'));
startGif.addEventListener('touchstart', () => console.log('Touch start on button'));
startGif.addEventListener('touchend', () => console.log('Touch end on button'));

startGif.onclick = ()=>{
  console.log('PLAY NOW button clicked!'); // Debug log
  stopSpeechBubbles(); // Stop speech bubbles when leaving intro
  intro.classList.add('hidden');
  document.body.classList.remove('is-intro');
  showMenu();
};

// Also try addEventListener as backup
startGif.addEventListener('click', (e) => {
  console.log('PLAY NOW button clicked via addEventListener!'); // Debug log
  e.preventDefault();
  e.stopPropagation();
  stopSpeechBubbles();
  intro.classList.add('hidden');
  document.body.classList.remove('is-intro');
  showMenu();
});

startBtn.onclick = ()=> {
  console.log('Start button clicked, choice:', state.choice); // Debug log
  if (!state.choice) return;
  menu.classList.add('hidden');
  showTrumpIntro();
};
playAgainBtn.onclick = ()=> showMenu();

const gameGifsContainer = document.getElementById('gameGifsContainer');

function hideGifs(){
  gifLeft.style.display = 'none';
  gifRight.style.display = 'none';
  gifCenter.style.display = 'none';
}

function showGifs(){
  gifLeft.style.display = 'block';
  gifRight.style.display = 'block';
  gifCenter.style.display = 'block';
}

function setTableGifs(){
  // Character mapping for game GIFs - handle both intro and game IDs
  const characterGameGifs = {
    'mark': 'assets/mark_game.gif',
    'mark_intro': 'assets/mark_game.gif', // Map intro ID to game GIF
    'tim': 'assets/tim_game.gif',
    'tim_intro': 'assets/tim_game.gif', // Map intro ID to game GIF
    'sergei': 'assets/sergei_game.gif',
    'sundar': 'assets/sundar_game.gif',
    'sam': 'assets/sam_game.gif',
    'bill': 'assets/bill_game.gif'
  };
  
  // If no opponent is set yet, select one randomly
  if (!state.opponent) {
    const allCharacters = ['mark_intro', 'tim_intro', 'sergei', 'sundar', 'sam', 'bill'];
    const availableOpponents = allCharacters.filter(char => char !== state.choice);
    state.opponent = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
  }
  
  // Determine which side the player is on (left or right) and store it in state
  // Make it consistent: always put player on left side for consistent win/lose logic
  state.playerSide = 'left';
  
  if (state.playerSide === 'left') {
    // Player on left, opponent on right
    gifLeft.src = characterGameGifs[state.choice] || 'assets/mark_game.gif';
    gifRight.src = characterGameGifs[state.opponent] || 'assets/tim_game.gif';
  } else {
    // Player on right, opponent on left
    gifLeft.src = characterGameGifs[state.opponent] || 'assets/tim_game.gif';
    gifRight.src = characterGameGifs[state.choice] || 'assets/mark_game.gif';
  }
  
  // Trump always in the middle
  gifCenter.src = 'assets/trump_game.gif';
}

function showMenu(){
  state.screen = 'menu';
  state.opponent = null; // Reset opponent for new game
  state.playerSide = null; // Reset player side for new game
  menu.classList.remove('hidden');
  hud.classList.add('hidden');
  result.classList.add('hidden');
  setupMenu();
  hideGifs();
  
  // Remove game state class
  document.body.classList.remove('is-game');
}

function startRound(){
  if (!state.choice) return;
  
  console.log('startRound called at:', new Date().toLocaleTimeString());
  
  // Set playing state immediately to prevent any popup timeouts
  state.screen = 'playing';
  
  // Clear ALL popup timeouts to prevent any interference
  clearAllPopupTimeouts();
  
  // Force clear VS timeout one more time just to be sure
  if (state.vsIntroTimeout) {
    clearTimeout(state.vsIntroTimeout);
    state.vsIntroTimeout = null;
    console.log('Force cleared VS timeout in startRound');
  }
  
  // Ensure all popups are hidden when starting the game
  vsIntroPopup.classList.add('hidden');
  trumpIntroPopup.classList.add('hidden');
  countdownOverlay.classList.add('hidden');
  winningPopup.classList.add('hidden');
  losePopup.classList.add('hidden');
  
  console.log('All popups hidden, game starting');
  
  // Select opponent if not already selected
  if (!state.opponent) {
    const allCharacters = ['mark', 'tim', 'sergei', 'sundar', 'sam', 'bill'];
    const availableOpponents = allCharacters.filter(char => char !== state.choice);
    state.opponent = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
  }
  
  menu.classList.add('hidden');
  result.classList.add('hidden');
  hud.classList.remove('hidden');
  countdownOverlay.classList.add('hidden'); // Ensure countdown is hidden when game starts
  hintEl.textContent = 'Tap or press Spacebar to flatter';
  state.timerMs = ROUND_MS;
  state.bubbles.length = 0; state.leftScore = 0; state.rightScore = 0;
  state.hearts.length = 0; // Clear hearts
  setTableGifs();
  showGifs();
  
  // Add game state class for proper layout
  document.body.classList.add('is-game');
  
  // Initialize tug-of-war bar
  initTugOfWarBar();
  
  // Update UI backgrounds and positioning for the game
  setTimeout(() => {
    updateUIBackgrounds();
    applyBackgroundsForDevice(); // Apply mobile portrait positioning if needed
  }, 100);
}

function flatter(){
  if (state.screen!=='playing' || state.gameEnded) return;
  
  // Use the stored player side from setTableGifs instead of hardcoded logic
  const playerSide = state.playerSide || 'left'; // Default to left if not set
  
  // Tug of war logic - move bar toward player
  // Base push strength - can be increased by fast clicking
  const basePushStrength = 1.5;
  const currentTime = Date.now();
  
  // Track click speed for bonus power
  if (!state.lastClickTime) state.lastClickTime = 0;
  const timeSinceLastClick = currentTime - state.lastClickTime;
  state.lastClickTime = currentTime;
  
  // Fast clicking bonus - the faster you click, the stronger you push
  let speedBonus = 0;
  if (timeSinceLastClick < 100) { // Very fast clicking (< 100ms between clicks)
    speedBonus = 1.5; // Big bonus
  } else if (timeSinceLastClick < 200) { // Fast clicking (< 200ms)
    speedBonus = 1.0; // Medium bonus
  } else if (timeSinceLastClick < 300) { // Moderate clicking (< 300ms)
    speedBonus = 0.5; // Small bonus
  }
  
  const pushStrength = basePushStrength + speedBonus;
  
  if (playerSide === 'left') {
    state.barPosition = Math.min(100, state.barPosition + pushStrength);
  } else {
    state.barPosition = Math.max(0, state.barPosition - pushStrength);
  }
  
  // Add visual effects
  addBubble(playerSide);
  addHeart(playerSide);
  
  // Trigger flash effect
  state.playerFlashTime = 200; // 200ms flash
  
  // Check for win condition (player is always on left side)
  if (state.barPosition >= 100) {
    // Player wins when bar reaches 100% (all blue)
    state.gameEnded = true;
    setTimeout(() => endRound(true), 500);
  } else if (state.barPosition <= 0) {
    // Player loses when bar reaches 0% (all red)
    state.gameEnded = true;
    setTimeout(() => endRound(false), 500);
  }
  
  // Update bar display
  updateTugOfWarBar();
}
window.addEventListener('keydown', (e)=>{ if (e.code==='Space') { e.preventDefault(); flatter(); }});
window.addEventListener('pointerdown', flatter);


function addBubble(side){
  const rect = canvas.getBoundingClientRect();
  const w = rect.width, h = rect.height;
  
  // Calculate bubble positions to align with GIF positions
  // GIFs container is 62.66% wide, centered (starts at 18.67% from left)
  // Each GIF is 33.33% of container width with space-between distribution
  const containerStart = 0.1867; // (100% - 62.66%) / 2
  const containerWidth = 0.6266;
  
  let sxBase;
  if (side === 'left') {
    // Left GIF center: container start + 1/6 of container (center of first third)
    sxBase = w * (containerStart + containerWidth / 6);
  } else {
    // Right GIF center: container start + 5/6 of container (center of last third)
    sxBase = w * (containerStart + containerWidth * 5/6);
  }
  
  const sx = sxBase + (Math.random()-0.5) * (w*0.02);
  const sy = h*0.64;
  const t = 1 - (state.timerMs/ROUND_MS);
  const upSpeed = 0.18 + 0.55*t; // Faster bubbles (increased from 0.14 + 0.42*t)
  const word = WORDS[(Math.random()*WORDS.length)|0];
  const maxLife = 1000; // Shorter bubble lifespan (reduced from 1200ms)
  state.bubbles.push({ 
    x:sx, 
    y:sy, 
    vx:0, 
    vy:-upSpeed, 
    life:maxLife, 
    maxLife, 
    word, 
    created: Date.now(),
    scale: 0, // Start at scale 0 for pop effect
    targetScale: 1,
    popPhase: 'growing' // growing, stable, shrinking
  });
}

function aiEmit(dt){
  if (state.screen!=='playing' || state.gameEnded) return;
  
  // AI tug of war logic - consistently challenging from the start
  const baseRate = 6.0; // High base AI click rate (6 clicks per second)
  const difficultyMultiplier = 1.2; // Slight boost when behind
  
  // Calculate how far behind AI is (0-100)
  const aiBehind = state.playerSide === 'left' ? (100 - state.barPosition) : state.barPosition;
  const behindMultiplier = 1 + (aiBehind / 100) * difficultyMultiplier;
  
  // AI is consistently challenging, with slight boost when behind
  const finalRate = baseRate * behindMultiplier;
  
  const p = finalRate * (dt/1000);
  const aiSide = state.playerSide === 'left' ? 'right' : 'left';
  
  if (Math.random() < p) {
    // AI makes a move with consistent strength
    const pushStrength = 1.5; // Same as player's base strength
    if (aiSide === 'left') {
      state.barPosition = Math.min(100, state.barPosition + pushStrength);
    } else {
      state.barPosition = Math.max(0, state.barPosition - pushStrength);
    }
    
    // Add visual effects
    addBubble(aiSide);
    addHeart(aiSide);
    
    // Check for AI win condition (player is always on left side)
    if (state.barPosition <= 0) {
      // AI wins when bar reaches 0% (all red)
      state.gameEnded = true;
      setTimeout(() => endRound(false), 500);
    } else if (state.barPosition >= 100) {
      // AI loses when bar reaches 100% (all blue)
      state.gameEnded = true;
      setTimeout(() => endRound(true), 500);
    }
    
    // Update bar display
    updateTugOfWarBar();
  }
}

// Update the tug-of-war bar visual
function updateTugOfWarBar() {
  const barFill = document.getElementById('barFill');
  if (barFill) {
    barFill.style.width = `${state.barPosition}%`;
    
    // Add visual feedback
    if (state.barPosition > 60) {
      barFill.classList.add('winning');
      barFill.classList.remove('losing');
    } else if (state.barPosition < 40) {
      barFill.classList.add('losing');
      barFill.classList.remove('winning');
    } else {
      barFill.classList.remove('winning', 'losing');
    }
  }
}

// Initialize tug-of-war bar
function initTugOfWarBar() {
  state.barPosition = 50; // Start at center
  state.gameEnded = false;
  updateTugOfWarBar();
  
  // Update player names with actual character names
  const leftName = document.getElementById('leftPlayerName');
  const rightName = document.getElementById('rightPlayerName');
  
  // Get character names (player is always on left)
  const opponentName = VS_CHARACTER_MAP[state.opponent]?.name || 'OPPONENT';
  
  leftName.textContent = 'YOU';
  rightName.textContent = opponentName;
}


function render(dt){
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  
  // Update simple heart animations
  updateHeartAnimations(dt);
  
  // Update bubble positions and remove expired ones
  for (let i=state.bubbles.length-1;i>=0;i--){
    const b = state.bubbles[i];
    b.x += b.vx * dt; 
    b.y += b.vy * dt; 
    
    // Handle bubble animation phases
    if (b.popPhase === 'growing') {
      b.scale += dt * 0.008; // Fast scale up
      if (b.scale >= b.targetScale) {
        b.scale = b.targetScale;
        b.popPhase = 'stable';
      }
    } else if (b.popPhase === 'stable') {
      // Stay at target scale for a bit
      if (b.life < b.maxLife * 0.3) {
        b.popPhase = 'shrinking';
      }
    } else if (b.popPhase === 'shrinking') {
      b.scale -= dt * 0.003; // Slower scale down
      if (b.scale < 0) b.scale = 0;
    }
    
    b.life -= dt;
    if (b.life<=0 || b.y < -20) state.bubbles.splice(i,1);
  }
  
  // Update heart positions and remove expired ones (simple movement)
  for (let i=state.hearts.length-1;i>=0;i--){
    const h = state.hearts[i];
    h.x += h.vx * dt;
    h.y += h.vy * dt;
    h.life -= dt;
    
    if (h.life<=0 || h.y < -50) state.hearts.splice(i,1);
  }
  
  // Sort bubbles by creation time (oldest first) so newest appears on top
  const sortedBubbles = [...state.bubbles].sort((a, b) => a.created - b.created);
  
  // Group bubbles by side for stacking
  const leftBubbles = sortedBubbles.filter(b => b.x < w/2);
  const rightBubbles = sortedBubbles.filter(b => b.x >= w/2);
  
  // Draw bubbles with stacking offset
  const drawBubblesWithStacking = (bubbles) => {
    bubbles.forEach((bubble, index) => {
      const a = Math.max(0, bubble.life / bubble.maxLife);
      const bw = 160 * bubble.scale, bh = 80 * bubble.scale;
      
      // Apply stacking offset - newer bubbles (higher index) get pushed up
      const stackOffset = Math.min(index * 15, 60); // Max 4 bubbles visible per side
      const renderY = bubble.y - stackOffset;
      
      drawSpeechBubble(bubble.x, renderY, bw, bh, bubble.word, a);
    });
  };
  
  drawBubblesWithStacking(leftBubbles);
  drawBubblesWithStacking(rightBubbles);
  
  // Draw hearts with GSAP animations and physics
  state.hearts.forEach(heart => {
    drawHeart(heart);
  });
  
  scoresEl.innerHTML = '';
  // Use the stored player side instead of hardcoded logic
  const youLeft = state.playerSide === 'left';
  
  // Create individual character score elements
  const leftEl = document.createElement('div'); 
  leftEl.className='scoreChip' + (youLeft?' you':''); 
  leftEl.textContent = `${youLeft ? 'YOU' : 'OPPONENT'}: ${state.leftScore}`;
  
  const rightEl = document.createElement('div'); 
  rightEl.className='scoreChip' + (!youLeft?' you':''); 
  rightEl.textContent = `${!youLeft ? 'YOU' : 'OPPONENT'}: ${state.rightScore}`;
  
  scoresEl.appendChild(leftEl); 
  scoresEl.appendChild(rightEl);
  
  // Update score chip backgrounds with reactive colors and flash effect
  setTimeout(() => {
    const leftIsLeading = state.leftScore > state.rightScore;
    const rightIsLeading = state.rightScore > state.leftScore;
    const isFlashing = state.playerFlashTime > 0;
    
    // Left chip
    const leftRect = leftEl.getBoundingClientRect();
    if (leftRect.width > 0 && leftRect.height > 0) {
      const leftIsPlayer = youLeft;
      const leftFlashing = isFlashing && leftIsPlayer;
      const leftCanvas = createScoreCanvas(leftRect.width, leftRect.height, state.leftScore, leftIsLeading, leftIsPlayer, leftFlashing);
      leftEl.style.background = `url(${leftCanvas.toDataURL()})`;
      leftEl.style.backgroundSize = '100% 100%';
    }
    
    // Right chip
    const rightRect = rightEl.getBoundingClientRect();
    if (rightRect.width > 0 && rightRect.height > 0) {
      const rightIsPlayer = !youLeft;
      const rightFlashing = isFlashing && rightIsPlayer;
      const rightCanvas = createScoreCanvas(rightRect.width, rightRect.height, state.rightScore, rightIsLeading, rightIsPlayer, rightFlashing);
      rightEl.style.background = `url(${rightCanvas.toDataURL()})`;
      rightEl.style.backgroundSize = '100% 100%';
    }
  }, 10);
}

function update(dt){
  if (state.screen==='playing'){
    // No more timer - game ends when bar reaches 0 or 100
    aiEmit(dt);
    
    // Update flash timer
    if (state.playerFlashTime > 0) {
      state.playerFlashTime -= dt;
      if (state.playerFlashTime < 0) state.playerFlashTime = 0;
    }
    
    // Update progress bar instead of text
    const progress = state.timerMs / ROUND_MS;
    const rect = timerEl.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const canvas = createProgressBarCanvas(rect.width, rect.height, progress);
      timerEl.style.background = `url(${canvas.toDataURL()})`;
      timerEl.style.backgroundSize = '100% 100%';
      timerEl.textContent = ''; // Remove text, progress bar shows the time
    }
  }
}

function endRound(playerWon = null){
  // If playerWon is explicitly passed, use it; otherwise determine from bar position
  let won;
  if (playerWon !== null) {
    won = playerWon;
  } else {
    // Fallback to old logic if needed
    const playerScore = state.playerSide === 'left' ? state.leftScore : state.rightScore;
    const aiScore = state.playerSide === 'left' ? state.rightScore : state.leftScore;
    won = playerScore >= aiScore;
  }
  
  if (won) {
    // Show winning screen popup
    showWinningScreen();
  } else {
    // Show lose screen popup
    showLoseScreen();
  }
}

function showWinningScreen() {
  // Get the winning player's intro GIF
  const playerCharacter = VS_CHARACTER_MAP[state.choice];
  winningPlayerImage.src = playerCharacter.introGif;
  
  // Hide game elements
  hud.classList.add('hidden');
  hideGifs();
  document.body.classList.remove('is-game');
  
  // Show winning popup
  winningPopup.classList.remove('hidden');
  
  // Add entrance animations
  gsap.fromTo(winningPopup, 
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
  );
  
  gsap.fromTo(winningPlayerImage, 
    { scale: 0, rotation: -180, opacity: 0 },
    { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.2 }
  );
  
  gsap.fromTo('#trumpDanceImage', 
    { scale: 0, rotation: 180, opacity: 0 },
    { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.4 }
  );
  
  // Set title text immediately (no typewriter, just stamp animation)
  winningTitleText.textContent = "So much winning!";
  
  // Start winning message cycle after title stamp animation (0.8s + 0.2s delay)
  setTimeout(() => {
    startWinningMessageCycle();
  }, 1000);
  
  gsap.fromTo(winningPlayAgainBtn, 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 1.4 }
  );
  
  state.screen = 'winning';
}

let winningMessageTimeout;
let lastWinningMessage = '';
let lastLoseMessage = '';

function startWinningMessageCycle() {
  // Clear any existing timeout
  if (winningMessageTimeout) {
    clearTimeout(winningMessageTimeout);
  }
  
  // Select random winning message that's different from the last one
  let randomMessage;
  do {
    randomMessage = WINNING_MESSAGES[Math.floor(Math.random() * WINNING_MESSAGES.length)];
  } while (randomMessage === lastWinningMessage && WINNING_MESSAGES.length > 1);
  
  // Update last message
  lastWinningMessage = randomMessage;
  
  // Clear previous message and start typewriter effect
  winningMessageText.innerHTML = '';
  typewriterEffect(winningMessageText, randomMessage, 80).then(() => {
    // After message is complete, wait 3 seconds then show next message
    winningMessageTimeout = setTimeout(() => {
      startWinningMessageCycle();
    }, 3000);
  });
}

function showLoseScreen() {
  // Reset Trump image to speaking version
  loseTrumpImage.src = 'assets/TRUMPINTRO.gif';
  
  // Hide game elements
  hud.classList.add('hidden');
  hideGifs();
  document.body.classList.remove('is-game');
  
  // Show lose popup
  losePopup.classList.remove('hidden');
  
  // Add entrance animation
  gsap.fromTo(losePopup, 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
  );
  
  // Start the continuous message cycle
  startLoseMessageCycle();
  
  state.screen = 'lose';
}

function startLoseMessageCycle() {
  function showNextMessage() {
    // Select random losing message that's different from the last one
    let randomMessage;
    do {
      randomMessage = LOSING_MESSAGES[Math.floor(Math.random() * LOSING_MESSAGES.length)];
    } while (randomMessage === lastLoseMessage && LOSING_MESSAGES.length > 1);
    
    // Update last message
    lastLoseMessage = randomMessage;
    
    // Switch to speaking image
    loseTrumpImage.src = 'assets/TRUMPINTRO.gif';
    
    // Clear previous text
    loseText.textContent = '';
    
    // Start word-by-word typewriter effect
    typewriterEffectByWord(loseText, randomMessage, 300).then(() => {
      // Switch to blinking image when text finishes
      loseTrumpImage.src = 'assets/TRUMPINTRO_blink.gif';
      
      // Schedule next message after 3 seconds
      loseMessageTimeout = setTimeout(showNextMessage, 3000);
    });
  }
  
  // Start the first message after a short delay
  loseMessageTimeout = setTimeout(showNextMessage, 500);
}

function loop(ts){
  if (!state.lastTs) state.lastTs = ts;
  const dt = Math.min(48, ts - state.lastTs);
  state.lastTs = ts;
  update(dt);
  render(dt);
  requestAnimationFrame(loop);
}

// Boot intro with table gifs and backgrounds
resize();
// Speech bubble functions
function startSpeechBubbles() {
  // Clear any existing interval
  if (speechBubbleInterval) {
    clearInterval(speechBubbleInterval);
  }
  
  // Show left bubble first, then alternate every 3 seconds
  let isLeftTurn = true;
  
  function showNextBubble() {
    // Hide both bubbles first
    leftSpeechBubble.classList.add('hidden');
    rightSpeechBubble.classList.add('hidden');
    
    // Show the appropriate bubble
    if (isLeftTurn) {
      leftSpeechBubble.classList.remove('hidden');
    } else {
      rightSpeechBubble.classList.remove('hidden');
    }
    
    // Toggle for next time
    isLeftTurn = !isLeftTurn;
  }
  
  // Show first bubble immediately
  showNextBubble();
  
  // Set interval for every 3 seconds
  speechBubbleInterval = setInterval(showNextBubble, 3000);
}

function stopSpeechBubbles() {
  if (speechBubbleInterval) {
    clearInterval(speechBubbleInterval);
    speechBubbleInterval = null;
  }
  leftSpeechBubble.classList.add('hidden');
  rightSpeechBubble.classList.add('hidden');
}

setTableGifs();
showGifs();
document.body.classList.add('is-intro');

// Apply mobile portrait positioning after intro page is set up
setTimeout(() => {
  applyBackgroundsForDevice();
}, 100);
document.body.classList.add('is-intro');
intro.classList.remove('hidden');
menu.classList.add('hidden');

// Start speech bubbles on intro screen
startSpeechBubbles();

// Ensure popups start hidden
vsIntroPopup.classList.add('hidden');
trumpIntroPopup.classList.add('hidden');
countdownOverlay.classList.add('hidden');
winningPopup.classList.add('hidden');
losePopup.classList.add('hidden');

// Initialize UI backgrounds
setTimeout(updateUIBackgrounds, 100);

// Add resize listener for mobile portrait positioning
window.addEventListener('resize', () => {
  setTimeout(() => {
    applyBackgroundsForDevice();
  }, 100);
});

// Simple mobile behavior prevention - only prevent text selection
document.addEventListener('selectstart', function(e) {
  if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
    return; // Allow text selection on buttons
  }
  e.preventDefault();
});

requestAnimationFrame(loop); 