<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Launch Path Canada — Credit Roadmap Quiz</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --red: #C8102E;
    --red-dark: #9B0B22;
    --cream: #FAF7F2;
    --dark: #0F0F0F;
    --mid: #2A2A2A;
    --muted: #888;
    --border: rgba(200,16,46,0.2);
  }

  html, body {
    height: 100%;
    overflow: hidden;
    background: var(--dark);
    color: var(--cream);
    font-family: 'DM Sans', sans-serif;
  }

  /* PROGRESS BAR */
  .progress-bar {
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    background: var(--red);
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 100;
  }

  /* SLIDE CONTAINER */
  .slides {
    height: 100vh;
    position: relative;
  }

  .slide {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    opacity: 0;
    transform: translateY(40px);
    pointer-events: none;
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .slide.active {
    opacity: 1;
    transform: translateY(0);
    pointer-events: all;
  }

  .slide.exit {
    opacity: 0;
    transform: translateY(-40px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  /* BACKGROUND ACCENTS */
  .slide::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200,16,46,0.08) 0%, transparent 70%);
    top: -200px;
    right: -200px;
    pointer-events: none;
  }

  /* SLIDE CONTENT */
  .slide-inner {
    max-width: 680px;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  /* STEP COUNTER */
  .step-counter {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--red);
    margin-bottom: 1.5rem;
    opacity: 0;
    animation: fadeUp 0.6s ease 0.1s forwards;
  }

  /* QUESTION */
  .question {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 3rem);
    font-weight: 700;
    line-height: 1.2;
    color: var(--cream);
    margin-bottom: 0.75rem;
    opacity: 0;
    animation: fadeUp 0.6s ease 0.2s forwards;
  }

  .question-sub {
    font-size: 0.95rem;
    color: var(--muted);
    margin-bottom: 2.5rem;
    opacity: 0;
    animation: fadeUp 0.6s ease 0.3s forwards;
  }

  /* OPTIONS */
  .options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    opacity: 0;
    animation: fadeUp 0.6s ease 0.4s forwards;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    background: rgba(255,255,255,0.03);
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .option::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(200,16,46,0.12), transparent);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .option:hover {
    border-color: rgba(200,16,46,0.4);
    background: rgba(200,16,46,0.06);
    transform: translateX(4px);
  }

  .option:hover::before { opacity: 1; }

  .option.selected {
    border-color: var(--red);
    background: rgba(200,16,46,0.12);
  }

  .option.selected::before { opacity: 1; }

  .option-key {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--muted);
    flex-shrink: 0;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0;
    transition: all 0.2s ease;
  }

  .option.selected .option-key {
    background: var(--red);
    border-color: var(--red);
    color: white;
  }

  .option-text {
    font-size: 0.95rem;
    font-weight: 400;
    color: var(--cream);
    line-height: 1.4;
  }

  /* NEXT BUTTON */
  .next-btn {
    margin-top: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.75rem;
    background: var(--red);
    color: white;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0;
    animation: fadeUp 0.6s ease 0.5s forwards;
    letter-spacing: 0.02em;
  }

  .next-btn:disabled {
    opacity: 0.3 !important;
    cursor: not-allowed;
    transform: none !important;
  }

  .next-btn:not(:disabled):hover {
    background: var(--red-dark);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(200,16,46,0.3);
  }

  .next-btn svg {
    transition: transform 0.2s ease;
  }

  .next-btn:not(:disabled):hover svg {
    transform: translateX(3px);
  }

  /* INTRO SLIDE */
  .intro-content {
    text-align: center;
    opacity: 0;
    animation: fadeUp 0.8s ease 0.2s forwards;
  }

  .intro-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 1rem;
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--red);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 2rem;
  }

  .intro-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 1.25rem;
    background: linear-gradient(135deg, var(--cream) 0%, rgba(250,247,242,0.7) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .intro-sub {
    font-size: 1.05rem;
    color: var(--muted);
    max-width: 420px;
    margin: 0 auto 2.5rem;
    line-height: 1.7;
  }

  .intro-stats {
    display: flex;
    gap: 2rem;
    justify-content: center;
    margin-bottom: 2.5rem;
  }

  .stat {
    text-align: center;
  }

  .stat-number {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--red);
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 0.25rem;
  }

  .start-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: var(--red);
    color: white;
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.02em;
  }

  .start-btn:hover {
    background: var(--red-dark);
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(200,16,46,0.35);
  }

  /* RESULT SLIDE */
  .result-content {
    text-align: center;
  }

  .result-icon {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    background: rgba(200,16,46,0.15);
    border: 1px solid rgba(200,16,46,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    font-size: 2rem;
  }

  .result-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: var(--cream);
  }

  .result-sub {
    font-size: 0.95rem;
    color: var(--muted);
    margin-bottom: 2rem;
    line-height: 1.7;
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
  }

  .result-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
    text-align: left;
  }

  .result-card {
    padding: 1rem 1.25rem;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    background: rgba(255,255,255,0.03);
  }

  .result-card-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--muted);
    margin-bottom: 0.4rem;
  }

  .result-card-value {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--cream);
  }

  .result-card-value.highlight {
    color: var(--red);
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
  }

  .cta-row {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.75rem;
    background: var(--red);
    color: white;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .btn-primary:hover {
    background: var(--red-dark);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(200,16,46,0.3);
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.75rem;
    background: transparent;
    color: var(--cream);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-secondary:hover {
    border-color: rgba(255,255,255,0.25);
    background: rgba(255,255,255,0.04);
  }

  /* NAV DOTS */
  .nav-dots {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    z-index: 100;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .dot.active {
    background: var(--red);
    width: 20px;
    border-radius: 3px;
  }

  /* KEYBOARD HINT */
  .key-hint {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    font-size: 0.7rem;
    color: rgba(255,255,255,0.2);
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .key {
    padding: 0.15rem 0.4rem;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 4px;
    font-size: 0.65rem;
  }

  /* DECORATIVE LINE */
  .deco-line {
    position: fixed;
    left: 2rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 120px;
    background: linear-gradient(to bottom, transparent, rgba(200,16,46,0.4), transparent);
  }

  /* DROPDOWN */
  .dropdown-wrap {
    position: relative;
    opacity: 0;
    animation: fadeUp 0.6s ease 0.4s forwards;
  }

  .dropdown {
    width: 100%;
    padding: 1rem 1.25rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    color: var(--cream);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    transition: border-color 0.2s ease;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1.25rem center;
    padding-right: 3rem;
  }

  .dropdown:focus {
    border-color: rgba(200,16,46,0.4);
  }

  .dropdown option {
    background: #1a1a1a;
    color: var(--cream);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* MOBILE */
  @media (max-width: 600px) {
    .intro-stats { gap: 1.25rem; }
    .result-cards { grid-template-columns: 1fr; }
    .key-hint { display: none; }
    .deco-line { display: none; }
  }

  /* SHAKE ANIMATION */
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }

  .shake { animation: shake 0.4s ease; }
</style>
</head>
<body>

<div class="progress-bar" id="progressBar"></div>
<div class="deco-line"></div>

<div class="slides" id="slides">

  <!-- SLIDE 0: INTRO -->
  <div class="slide active" id="slide-0">
    <div class="slide-inner" style="text-align:center">
      <div class="intro-content">
        <div class="intro-badge">
          <span>🇨🇦</span> Credit Building Roadmap
        </div>
        <h1 class="intro-title">Your Path to<br>Canadian Credit</h1>
        <p class="intro-sub">Answer 5 quick questions and get a personalized month-by-month plan built for your exact situation.</p>
        <div class="intro-stats">
          <div class="stat">
            <div class="stat-number">5</div>
            <div class="stat-label">Questions</div>
          </div>
          <div class="stat">
            <div class="stat-number">2min</div>
            <div class="stat-label">To complete</div>
          </div>
          <div class="stat">
            <div class="stat-number">6mo</div>
            <div class="stat-label">Roadmap</div>
          </div>
        </div>
        <button class="start-btn" onclick="goTo(1)">
          Start Quiz
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- SLIDE 1: STATUS -->
  <div class="slide" id="slide-1">
    <div class="slide-inner">
      <div class="step-counter">Step 1 of 5</div>
      <h2 class="question">What is your current status in Canada?</h2>
      <p class="question-sub">This determines which credit products you're eligible for.</p>
      <div class="options" id="options-1">
        <div class="option" onclick="selectOption(1, 'study_permit', this)">
          <span class="option-key">A</span>
          <span class="option-text">Study Permit</span>
        </div>
        <div class="option" onclick="selectOption(1, 'work_permit', this)">
          <span class="option-key">B</span>
          <span class="option-text">Work Permit (PGWP or Employer-Sponsored)</span>
        </div>
        <div class="option" onclick="selectOption(1, 'permanent_resident', this)">
          <span class="option-key">C</span>
          <span class="option-text">Permanent Resident</span>
        </div>
        <div class="option" onclick="selectOption(1, 'citizen', this)">
          <span class="option-key">D</span>
          <span class="option-text">Canadian Citizen</span>
        </div>
      </div>
      <button class="next-btn" id="next-1" onclick="advance(1, 2)" disabled>
        Continue
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </div>

  <!-- SLIDE 2: PROVINCE -->
  <div class="slide" id="slide-2">
    <div class="slide-inner">
      <div class="step-counter">Step 2 of 5</div>
      <h2 class="question">Which province are you in?</h2>
      <p class="question-sub">Some credit unions and products are province-specific.</p>
      <div class="dropdown-wrap">
        <select class="dropdown" id="province-select" onchange="selectDropdown(2, this.value)">
          <option value="" disabled selected>Select your province...</option>
          <option value="ontario">Ontario</option>
          <option value="bc">British Columbia</option>
          <option value="alberta">Alberta</option>
          <option value="quebec">Quebec</option>
          <option value="manitoba">Manitoba</option>
          <option value="saskatchewan">Saskatchewan</option>
          <option value="nova_scotia">Nova Scotia</option>
          <option value="new_brunswick">New Brunswick</option>
          <option value="newfoundland">Newfoundland & Labrador</option>
          <option value="pei">Prince Edward Island</option>
          <option value="yukon">Yukon</option>
          <option value="nwt">Northwest Territories</option>
          <option value="nunavut">Nunavut</option>
        </select>
      </div>
      <button class="next-btn" id="next-2" onclick="advance(2, 3)" disabled>
        Continue
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </div>

  <!-- SLIDE 3: INCOME -->
  <div class="slide" id="slide-3">
    <div class="slide-inner">
      <div class="step-counter">Step 3 of 5</div>
      <h2 class="question">What is your monthly income in CAD?</h2>
      <p class="question-sub">This determines which secured cards and loans you qualify for.</p>
      <div class="options" id="options-3">
        <div class="option" onclick="selectOption(3, 'under_1000', this)">
          <span class="option-key">A</span>
          <span class="option-text">Under $1,000</span>
        </div>
        <div class="option" onclick="selectOption(3, '1000_3000', this)">
          <span class="option-key">B</span>
          <span class="option-text">$1,000 – $3,000</span>
        </div>
        <div class="option" onclick="selectOption(3, '3000_5000', this)">
          <span class="option-key">C</span>
          <span class="option-text">$3,000 – $5,000</span>
        </div>
        <div class="option" onclick="selectOption(3, 'over_5000', this)">
          <span class="option-key">D</span>
          <span class="option-text">$5,000+</span>
        </div>
      </div>
      <button class="next-btn" id="next-3" onclick="advance(3, 4)" disabled>
        Continue
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </div>

  <!-- SLIDE 4: BANK ACCOUNT -->
  <div class="slide" id="slide-4">
    <div class="slide-inner">
      <div class="step-counter">Step 4 of 5</div>
      <h2 class="question">Do you have a Canadian bank account?</h2>
      <p class="question-sub">Your first secured card needs to be linked to a Canadian account.</p>
      <div class="options" id="options-4">
        <div class="option" onclick="selectOption(4, 'yes', this)">
          <span class="option-key">A</span>
          <span class="option-text">Yes, I already have one</span>
        </div>
        <div class="option" onclick="selectOption(4, 'no', this)">
          <span class="option-key">B</span>
          <span class="option-text">No, not yet</span>
        </div>
        <div class="option" onclick="selectOption(4, 'soon', this)">
          <span class="option-key">C</span>
          <span class="option-text">I'm opening one soon</span>
        </div>
      </div>
      <button class="next-btn" id="next-4" onclick="advance(4, 5)" disabled>
        Continue
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </div>

  <!-- SLIDE 5: GOAL -->
  <div class="slide" id="slide-5">
    <div class="slide-inner">
      <div class="step-counter">Step 5 of 5</div>
      <h2 class="question">What is your main credit goal?</h2>
      <p class="question-sub">We'll prioritize the steps that matter most for this outcome.</p>
      <div class="options" id="options-5">
        <div class="option" onclick="selectOption(5, 'apartment', this)">
          <span class="option-key">A</span>
          <span class="option-text">Renting an apartment</span>
        </div>
        <div class="option" onclick="selectOption(5, 'car', this)">
          <span class="option-key">B</span>
          <span class="option-text">Leasing or financing a car</span>
        </div>
        <div class="option" onclick="selectOption(5, 'credit_card', this)">
          <span class="option-key">C</span>
          <span class="option-text">Getting a credit card with rewards</span>
        </div>
        <div class="option" onclick="selectOption(5, 'mortgage', this)">
          <span class="option-key">D</span>
          <span class="option-text">Building credit for a future mortgage</span>
        </div>
      </div>
      <button class="next-btn" id="next-5" onclick="generateResult()" disabled>
        Generate My Roadmap
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </div>

  <!-- SLIDE 6: RESULT -->
  <div class="slide" id="slide-6">
    <div class="slide-inner result-content">
      <div class="result-icon" id="resultIcon">🗺️</div>
      <h2 class="result-title" id="resultTitle">Your Roadmap is Ready</h2>
      <p class="result-sub" id="resultSub">Based on your profile, here's what we recommend.</p>
      <div class="result-cards" id="resultCards"></div>
      <div class="cta-row">
        <button class="btn-primary" onclick="goToRoadmap()">
          View Full Roadmap
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button class="btn-secondary" onclick="goTo(0)">
          Start Over
        </button>
      </div>
    </div>
  </div>

</div>

<!-- NAV DOTS -->
<div class="nav-dots" id="navDots"></div>

<!-- KEYBOARD HINT -->
<div class="key-hint">
  <span class="key">↑</span><span class="key">↓</span> navigate
  <span style="margin-left:0.5rem" class="key">A–D</span> select
</div>

<script>
  let current = 0;
  const total = 6;
  const answers = {};

  // BUILD NAV DOTS
  const dotsEl = document.getElementById('navDots');
  for (let i = 0; i <= total; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.onclick = () => { if (i <= getMaxReached()) goTo(i); };
    dotsEl.appendChild(d);
  }

  function getMaxReached() {
    let max = 0;
    if (answers[1]) max = 1;
    if (answers[2]) max = 2;
    if (answers[3]) max = 3;
    if (answers[4]) max = 4;
    if (answers[5]) max = 5;
    return Math.max(max, current);
  }

  function updateDots(idx) {
    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  function updateProgress(idx) {
    const pct = (idx / total) * 100;
    document.getElementById('progressBar').style.width = pct + '%';
  }

  function goTo(idx) {
    const current_slide = document.getElementById('slide-' + current);
    const next_slide = document.getElementById('slide-' + idx);
    if (!next_slide) return;

    current_slide.classList.remove('active');
    current_slide.classList.add('exit');
    setTimeout(() => current_slide.classList.remove('exit'), 400);

    // Reset animations on new slide
    next_slide.querySelectorAll('.step-counter, .question, .question-sub, .options, .next-btn, .dropdown-wrap').forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight; // reflow
      el.style.animation = '';
    });

    next_slide.classList.add('active');
    current = idx;
    updateDots(idx);
    updateProgress(idx);
  }

  function selectOption(slide, value, el) {
    document.querySelectorAll('#options-' + slide + ' .option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    answers[slide] = value;
    const btn = document.getElementById('next-' + slide);
    if (btn) btn.disabled = false;
  }

  function selectDropdown(slide, value) {
    if (!value) return;
    answers[slide] = value;
    const btn = document.getElementById('next-' + slide);
    if (btn) btn.disabled = false;
  }

  function advance(from, to) {
    if (!answers[from]) {
      const btn = document.getElementById('next-' + from);
      btn.classList.add('shake');
      setTimeout(() => btn.classList.remove('shake'), 400);
      return;
    }
    goTo(to);
  }

  function generateResult() {
    if (!answers[5]) return;

    const status = answers[1];
    const income = answers[3];
    const goal = answers[5];
    const province = answers[2];

    // Determine profile
    let scoreRange = '620–680';
    let timeToGoal = '6–8 months';
    let firstStep = '';
    let keyProduct = '';
    let profileLabel = '';

    if (status === 'study_permit') {
      profileLabel = 'International Student';
      firstStep = 'Open RBC/TD Student Account → Scotiabank Scene+ Secured Card';
      keyProduct = 'Scotiabank Scene+ Secured Visa';
      scoreRange = income === 'under_1000' ? '580–650' : '620–680';
      timeToGoal = '7–9 months';
    } else if (status === 'work_permit') {
      profileLabel = 'Work Permit Holder';
      firstStep = 'RBC Newcomer Package → RBC Secured Visa + Credit Union Loan';
      keyProduct = 'RBC Secured Visa + Credit-Builder Loan';
      scoreRange = income === 'over_5000' ? '660–720' : '640–700';
      timeToGoal = '5–7 months';
    } else if (status === 'permanent_resident') {
      profileLabel = 'Permanent Resident';
      firstStep = 'TD/RBC Newcomer Program → Secured Card + Credit-Builder Loan';
      keyProduct = 'TD Newcomer Program + Tangerine Card';
      scoreRange = '680–740';
      timeToGoal = '4–6 months';
    } else {
      profileLabel = 'Canadian Citizen';
      firstStep = 'Apply for entry-level rewards card immediately';
      keyProduct = 'PC Financial Mastercard or Tangerine';
      scoreRange = '680–750';
      timeToGoal = '3–5 months';
    }

    const goalLabels = {
      apartment: 'Apartment Rental',
      car: 'Car Lease/Finance',
      credit_card: 'Rewards Credit Card',
      mortgage: 'Future Mortgage'
    };

    const provinceLabels = {
      ontario: 'Ontario', bc: 'British Columbia', alberta: 'Alberta',
      quebec: 'Quebec', manitoba: 'Manitoba', saskatchewan: 'Saskatchewan',
      nova_scotia: 'Nova Scotia', new_brunswick: 'New Brunswick',
      newfoundland: 'Newfoundland', pei: 'PEI', yukon: 'Yukon',
      nwt: 'NWT', nunavut: 'Nunavut'
    };

    document.getElementById('resultTitle').textContent = profileLabel + ' Plan Ready';
    document.getElementById('resultSub').textContent = 'Your personalized 6-month credit building roadmap is tailored to your visa status, income, and goal.';

    document.getElementById('resultCards').innerHTML = `
      <div class="result-card">
        <div class="result-card-label">Estimated Score in 6 months</div>
        <div class="result-card-value highlight">${scoreRange}</div>
      </div>
      <div class="result-card">
        <div class="result-card-label">Time to Goal</div>
        <div class="result-card-value highlight">${timeToGoal}</div>
      </div>
      <div class="result-card">
        <div class="result-card-label">First Action</div>
        <div class="result-card-value">${firstStep}</div>
      </div>
      <div class="result-card">
        <div class="result-card-label">Key Product</div>
        <div class="result-card-value">${keyProduct}</div>
      </div>
    `;

    // Save to localStorage
    localStorage.setItem('quizAnswers', JSON.stringify(answers));

    goTo(6);
  }

  function goToRoadmap() {
    // In the full app this navigates to /roadmap
    // For now save answers and redirect
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
    window.location.href = '/roadmap';
  }

  // KEYBOARD NAVIGATION
  document.addEventListener('keydown', (e) => {
    const key = e.key;

    // Arrow navigation
    if (key === 'ArrowDown' || key === 'ArrowRight') {
      e.preventDefault();
      const btn = document.getElementById('next-' + current);
      if (btn && !btn.disabled) btn.click();
    }
    if (key === 'ArrowUp' || key === 'ArrowLeft') {
      e.preventDefault();
      if (current > 0) goTo(current - 1);
    }

    // Letter shortcuts for options
    const keyMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
    if (key.toLowerCase() in keyMap && current >= 1 && current <= 5 && current !== 2) {
      const opts = document.querySelectorAll('#options-' + current + ' .option');
      const idx = keyMap[key.toLowerCase()];
      if (opts[idx]) opts[idx].click();
    }

    // Enter to advance
    if (key === 'Enter') {
      const btn = document.getElementById('next-' + current);
      if (btn && !btn.disabled) btn.click();
    }
  });

  // TOUCH SWIPE
  let touchStart = 0;
  document.addEventListener('touchstart', e => { touchStart = e.touches[0].clientY; });
  document.addEventListener('touchend', e => {
    const diff = touchStart - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        const btn = document.getElementById('next-' + current);
        if (btn && !btn.disabled) btn.click();
      } else {
        if (current > 0) goTo(current - 1);
      }
    }
  });
</script>
</body>
</html>
