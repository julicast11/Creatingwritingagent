'use strict';

/* ════════════════════════════════════════════════════════════════
   LOCAL-STORAGE KEYS
════════════════════════════════════════════════════════════════ */
const LS_PROGRESS = 'writing_agent_progress';
const LS_CURRENT  = 'writing_agent_current';
const LS_STARTED  = 'writing_agent_started';

/* ════════════════════════════════════════════════════════════════
   STAGE & STEP DATA
════════════════════════════════════════════════════════════════ */
const STAGE_ORDER = ['setup', 'configure', 'use'];

const STAGE_META = {
  setup:     { title: 'Setup',     sub: 'Create your project folder and files.' },
  configure: { title: 'Configure', sub: 'Fill in your voice profile, templates, and briefs.' },
  use:       { title: 'Use',       sub: 'Run Claude Code and start writing content.' }
};

const ALL_STEPS = [

  /* ── SETUP ─────────────────────────────────────────────── */
  {
    id: 1,
    title: 'Create Your Folder',
    shortTitle: 'Create Folder',
    stage: 'setup',
    explanation: 'Create a dedicated folder for your writing agent. This folder will hold your voice profile, templates, and all content.',
    commands: [
      'mkdir "Your Name Tone"',
      'cd "Your Name Tone"',
      'mkdir -p content/drafts content/published content/briefs templates'
    ],
    tip: 'Replace "Your Name Tone" with your actual name, e.g. "Juliana Writing".'
  },
  {
    id: 2,
    title: 'Create Your Files',
    shortTitle: 'Create Files',
    stage: 'setup',
    explanation: 'Create the core files Claude Code will read every session. These define your voice and content structure.',
    commands: [
      'touch CLAUDE.md',
      'touch templates/linkedin-post.md',
      'touch templates/email.md',
      'touch templates/long-form.md',
      'touch templates/slides.md',
      'touch content/briefs/brief-001.md'
    ],
    tip: 'You can add more templates later as your needs grow.'
  },

  /* ── CONFIGURE ─────────────────────────────────────────── */
  {
    id: 3,
    title: 'Fill in CLAUDE.md',
    shortTitle: 'CLAUDE.md',
    stage: 'configure',
    explanation: 'This is the most important file. Claude Code reads it every session. Before filling it in manually, use this prompt in Claude chat (claude.ai, not Claude Code) to analyze your writing voice automatically.',
    voicePrompt: true,
    voicePromptText: `You are a brand voice analyst who studies writing patterns to create detailed voice profiles for content teams.

I'm going to give you 3-5 pieces of my best content. Analyze them and extract my unique writing voice.

Here are my content samples:

[PASTE 3-5 OF YOUR BEST POSTS, ARTICLES, OR NEWSLETTERS HERE — the ones that sound most "like you" and performed well]

Your tasks:

1. Analyze my writing patterns across all samples. Identify:
   - Average sentence length (short and punchy? Long and flowing? Mixed?)
   - Paragraph structure (how many sentences per paragraph?)
   - Opening style (how do I start pieces? Questions? Statements? Stories?)
   - Transition style (how do I move between ideas?)
   - Closing style (how do I end pieces?)

2. Identify my tone markers:
   - Formality level (1-10 scale, with examples)
   - Humor style (if any)
   - Energy level (calm? High energy? Conversational?)
   - Confidence style (authoritative? Humble? Direct?)

3. Extract my vocabulary patterns:
   - Words and phrases I use repeatedly
   - Words and phrases I NEVER use
   - Industry jargon I use vs. avoid
   - Emoji usage (yes/no, which ones, how often?)

4. Identify my structural habits:
   - Do I use bullet points or prose?
   - Do I use bold/italics? How?
   - Do I use questions to the reader?
   - Do I use "you" or "we" or "I"?
   - Any signature phrases or patterns?

5. Write a "Voice Profile" (150-200 words) formatted as clear rules, not descriptions. Example: "Use short sentences. Max 2 sentences per paragraph. Never say 'utilize' — say 'use'."`,
    voicePromptTip: 'Pick content that got the best engagement AND sounds most like you. Skip anything ghostwritten or heavily edited by someone else.',
    codeContent: {
      lines: [
        { type: 'heading', text: '# [Your Name] — Content Writing Instructions' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Who I Am' },
        { type: 'comment', text: '[Your role, school, or job. Key credentials. Mission statement.]' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## My Background & Story' },
        { type: 'comment', text: '[Real experiences Claude can draw from when writing.]' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## My Audience' },
        { type: 'comment', text: '[Who reads your content and what they care about.]' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Voice & Tone' },
        { type: 'comment', text: '[Paste the Voice Profile output from the prompt above here.]' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Topics I Write About' },
        { type: 'comment', text: '[Your content areas.]' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Hard Rules' },
        { type: 'normal', text: '- No buzzwords: [list yours]' },
        { type: 'normal', text: '- No filler openers: [list yours]' },
        { type: 'normal', text: '- No filler words: "just," "really," "very," "quite," "actually," "basically"' },
        { type: 'normal', text: '- No em dashes (—) ever' },
        { type: 'comment', text: '- [Add your own rules]' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Language' },
        { type: 'comment', text: '[Primary language. Any other languages and how to handle them.]' }
      ]
    },
    warn: 'The more specific your CLAUDE.md, the less you will need to edit later. Be detailed about your voice.'
  },
  {
    id: 4,
    title: 'Choose Your Templates',
    shortTitle: 'Choose Templates',
    stage: 'configure',
    explanation: 'The next steps show four example templates: Email, LinkedIn, Long-Form, and Slides. These are starting points, not requirements.',
    announcement: true,
    announcementPoints: [
      'You do not need to use all four. Only set up the ones you will actually use.',
      'You can add more templates anytime. If you write newsletters, case studies, proposals, or anything else, create a new file in your templates/ folder.',
      'Each template is just a markdown file. Name it clearly (e.g., templates/newsletter.md, templates/proposal.md) and follow the same structure.',
      'The templates on the following steps are examples. Customize them to match how you actually write.'
    ],
    tip: 'Start with 1-2 templates you need right now. You can always add more later.'
  },
  {
    id: 5,
    title: 'Fill in Email Template',
    shortTitle: 'Email Template',
    stage: 'configure',
    explanation: 'Define how Claude writes emails for you. This template covers structure, tone, and audience-specific rules.',
    codeContent: {
      lines: [
        { type: 'heading', text: '# Email Template — [Your Name]' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Structure' },
        { type: 'normal', text: '1. Opening (1 sentence): Direct. State the purpose immediately.' },
        { type: 'normal', text: '2. Body (2–4 sentences per paragraph): One idea per paragraph.' },
        { type: 'normal', text: '   Context first, then ask or action.' },
        { type: 'normal', text: '3. Closing (1–2 sentences): Clear next step or appreciation. No fluff.' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Format Rules' },
        { type: 'normal', text: '- Subject line: specific, not vague' },
        { type: 'normal', text: '- No more than 3 paragraphs for most emails' },
        { type: 'normal', text: '- Sign off: "Best, [Name]" or "Thank you, [Name]"' },
        { type: 'normal', text: '- Mobile-friendly length — if it needs scrolling, it\'s too long' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Tone' },
        { type: 'normal', text: '- Professional but warm. Never stiff.' },
        { type: 'normal', text: '- Write like a smart, respectful colleague.' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Email Opening Rules' },
        { type: 'normal', text: '- Always start with "Hi Professor [Last Name]," for professors' },
        { type: 'normal', text: '- Always start with "Hi [First Name]," for colleagues, managers, and peers' },
        { type: 'normal', text: '- Second line is always a pleasantry:' },
        { type: 'normal', text: '  - Professors: "I hope the semester is treating you well."' },
        { type: 'normal', text: '  - Everyone else: "I hope you\'re doing well."' },
        { type: 'normal', text: '- After the pleasantry, get straight to the point' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## What to Avoid' },
        { type: 'normal', text: '- "I hope this email finds you well"' },
        { type: 'normal', text: '- "I just wanted to follow up"' },
        { type: 'normal', text: '- "Please let me know if you have any questions"' },
        { type: 'normal', text: '- Filler words: "just," "really," "very," "quite," "actually," "basically"' },
        { type: 'normal', text: '- No em dashes (—) ever' },
        { type: 'normal', text: '- Over-apologizing or over-thanking' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Audience Tone Guide' },
        { type: 'normal', text: '- Professor: precise, well-structured, evidence-backed' },
        { type: 'normal', text: '- Recruiter: confident, specific, achievement-focused' },
        { type: 'normal', text: '- LinkedIn: conversational, insightful, no jargon' },
        { type: 'normal', text: '- Client: clear, direct, solution-oriented' },
        { type: 'normal', text: '- Investor: concise, data-driven, forward-looking' },
        { type: 'normal', text: '- Manager: respectful, direct, no over-explaining' },
        { type: 'normal', text: '- Colleague: casual but professional, collaborative' },
        { type: 'normal', text: '- Boss: concise, confident, no hedging' }
      ]
    },
    tip: 'Save this to templates/email.md in your project folder.'
  },
  {
    id: 6,
    title: 'Fill in LinkedIn Post Template',
    shortTitle: 'LinkedIn Template',
    stage: 'configure',
    explanation: 'Define how Claude writes LinkedIn posts for you. Structure, rhythm, and what to avoid.',
    codeContent: {
      lines: [
        { type: 'heading', text: '# LinkedIn Post Template — [Your Name]' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Structure' },
        { type: 'normal', text: '1. Opening (1 sentence): Declarative. Never a question.' },
        { type: 'normal', text: '2. Paragraph 1 (3–5 sentences): Context + story + pivot forward.' },
        { type: 'normal', text: '3. Paragraph 2 (3–5 sentences): Insight + bigger picture.' },
        { type: 'normal', text: '4. Closing (1–3 sentences): Zoom out. Personal to collective.' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Format Rules' },
        { type: 'normal', text: '- Write in paragraphs, never bullets' },
        { type: 'normal', text: '- One blank line between paragraphs' },
        { type: 'normal', text: '- 150–250 words total' },
        { type: 'normal', text: '- 1–2 hashtags max at the very end' },
        { type: 'normal', text: '- No headers in the final post' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Sentence Rhythm' },
        { type: 'normal', text: '- Medium sentences (15–25 words) build context' },
        { type: 'normal', text: '- Short sentences (6–12 words) land the point' },
        { type: 'normal', text: '- Never string 4+ long sentences together' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Transitions to Use' },
        { type: 'normal', text: 'carried / built on / reinforced / extended / this' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## What to Avoid' },
        { type: 'normal', text: '- Filler openers: "I\'ve always been passionate about..."' },
        { type: 'normal', text: '- Filler words: "just," "really," "very," "quite," "actually," "basically"' },
        { type: 'normal', text: '- No em dashes (—) ever' },
        { type: 'normal', text: '- Ending with a question' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Audience Tone Guide' },
        { type: 'normal', text: '- Professor: precise, well-structured, evidence-backed' },
        { type: 'normal', text: '- Recruiter: confident, specific, achievement-focused' },
        { type: 'normal', text: '- LinkedIn: conversational, insightful, no jargon' },
        { type: 'normal', text: '- Client: clear, direct, solution-oriented' },
        { type: 'normal', text: '- Investor: concise, data-driven, forward-looking' },
        { type: 'normal', text: '- Manager: respectful, direct, no over-explaining' },
        { type: 'normal', text: '- Colleague: casual but professional, collaborative' },
        { type: 'normal', text: '- Boss: concise, confident, no hedging' }
      ]
    },
    tip: 'Save this to templates/linkedin-post.md in your project folder.'
  },
  {
    id: 7,
    title: 'Fill in Long-Form Template',
    shortTitle: 'Long-Form Template',
    stage: 'configure',
    explanation: 'For reports, articles, academic writing, and case studies. This template ensures Claude writes with precision and structure.',
    codeContent: {
      lines: [
        { type: 'heading', text: '# Long-Form Writing Template — [Your Name]' },
        { type: 'comment', text: '## Use for: reports, articles, academic writing, case studies' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Structure' },
        { type: 'normal', text: '1. Opening paragraph: Ground the reader in the problem. State the argument.' },
        { type: 'normal', text: '2. Body paragraphs (one idea each):' },
        { type: 'normal', text: '   - Context (1–2 sentences)' },
        { type: 'normal', text: '   - Evidence or story (2–3 sentences)' },
        { type: 'normal', text: '   - So what (1–2 sentences)' },
        { type: 'normal', text: '   - Pivot forward (1 sentence)' },
        { type: 'normal', text: '3. Closing paragraph: Zoom out. Forward-looking statement, not a summary.' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Format Rules' },
        { type: 'normal', text: '- Headers allowed for reports and technical documents' },
        { type: 'normal', text: '- Cite specifically ("12% reduction in cycle time" not "significant improvement")' },
        { type: 'normal', text: '- Passive voice only when the actor is unknown or irrelevant' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Tone' },
        { type: 'normal', text: '- Precise and confident' },
        { type: 'normal', text: '- Never hedge: "This suggests" not "This might possibly suggest"' },
        { type: 'normal', text: '- Technical for technical audiences. Plain for everyone else.' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## What to Avoid' },
        { type: 'normal', text: '- "In conclusion" or "In summary" to open the closing' },
        { type: 'normal', text: '- Vague claims without data' },
        { type: 'normal', text: '- Filler words: "just," "really," "very," "quite," "actually," "basically"' },
        { type: 'normal', text: '- No em dashes (—) ever' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Audience Tone Guide' },
        { type: 'normal', text: '- Professor: precise, well-structured, evidence-backed' },
        { type: 'normal', text: '- Recruiter: confident, specific, achievement-focused' },
        { type: 'normal', text: '- LinkedIn: conversational, insightful, no jargon' },
        { type: 'normal', text: '- Client: clear, direct, solution-oriented' },
        { type: 'normal', text: '- Investor: concise, data-driven, forward-looking' },
        { type: 'normal', text: '- Manager: respectful, direct, no over-explaining' },
        { type: 'normal', text: '- Colleague: casual but professional, collaborative' },
        { type: 'normal', text: '- Boss: concise, confident, no hedging' }
      ]
    },
    tip: 'Save this to templates/long-form.md in your project folder.'
  },
  {
    id: 8,
    title: 'Fill in Slides Template',
    shortTitle: 'Slides Template',
    stage: 'configure',
    explanation: 'For presentations, defenses, and client decks. Every presentation is a story first, slides second.',
    codeContent: {
      lines: [
        { type: 'heading', text: '# Slides Template — [Your Name]' },
        { type: 'comment', text: '## Use for: presentations, defenses, client decks' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## The Most Important Rule' },
        { type: 'normal', text: 'Every presentation is a story first, slides second.' },
        { type: 'normal', text: 'If the story does not work, the slides do not matter.' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Story Arc' },
        { type: 'normal', text: '- Act 1 — Hook: a number, moment, or scenario that makes them lean in' },
        { type: 'normal', text: '- Act 2 — Tension: the problem, the gap, what\'s at stake' },
        { type: 'normal', text: '- Act 3 — Resolution: findings, recommendations, the path forward' },
        { type: 'normal', text: '- Closing: callback to the hook. End on impact, not "thank you."' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Rubric & Requirements' },
        { type: 'normal', text: '- Always read the brief for required sections before building the arc' },
        { type: 'normal', text: '- Required sections must appear — frame them within the story' },
        { type: 'normal', text: '- Fit the story around the requirements, not the other way around' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Format Rules' },
        { type: 'normal', text: '- Every slide headline is a complete sentence, conclusion first' },
        { type: 'normal', text: '- Max 3 bullets per slide, max 10 words per bullet' },
        { type: 'normal', text: '- Data on the slide, explanation in the speaker notes' },
        { type: 'normal', text: '- No "Thank You" slide with nothing else on it' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## What to Avoid' },
        { type: 'normal', text: '- Opening with "Today I will be presenting..."' },
        { type: 'normal', text: '- Slide titles that are just nouns' },
        { type: 'normal', text: '- Filler words: "just," "really," "very," "quite," "actually," "basically"' },
        { type: 'normal', text: '- No em dashes (—) ever' },
        { type: 'normal', text: '' },
        { type: 'heading', text: '## Audience Tone Guide' },
        { type: 'normal', text: '- Professor: precise, well-structured, evidence-backed' },
        { type: 'normal', text: '- Recruiter: confident, specific, achievement-focused' },
        { type: 'normal', text: '- LinkedIn: conversational, insightful, no jargon' },
        { type: 'normal', text: '- Client: clear, direct, solution-oriented' },
        { type: 'normal', text: '- Investor: concise, data-driven, forward-looking' },
        { type: 'normal', text: '- Manager: respectful, direct, no over-explaining' },
        { type: 'normal', text: '- Colleague: casual but professional, collaborative' },
        { type: 'normal', text: '- Boss: concise, confident, no hedging' }
      ]
    },
    tip: 'Save this to templates/slides.md in your project folder.'
  },
  {
    id: 9,
    title: 'Create Your First Brief',
    shortTitle: 'First Brief',
    stage: 'configure',
    explanation: 'A brief is your assignment sheet for Claude. Instead of explaining what you want in a long chat message every time, you write it once in a structured file. Think of it like a creative brief you would hand to a copywriter: it tells Claude the topic, audience, format, key points, and tone so it can produce a draft that is close to final on the first try. Each piece of content gets its own brief file in content/briefs/.',
    codeContent: {
      lines: [
        { type: 'heading', text: '# Brief: [Title]' },
        { type: 'normal', text: '' },
        { type: 'normal', text: 'Topic: [what you want to write about]' },
        { type: 'normal', text: '' },
        { type: 'normal', text: 'Template to use: [linkedin-post / email / long-form / slides]' },
        { type: 'normal', text: '' },
        { type: 'normal', text: 'Audience: [professor / recruiter / LinkedIn / client /' },
        { type: 'normal', text: '           investor / manager / colleague / boss]' },
        { type: 'normal', text: '' },
        { type: 'normal', text: 'Requirements or rubric: [paste here, or "none"]' },
        { type: 'normal', text: '' },
        { type: 'normal', text: 'Key points:' },
        { type: 'normal', text: '- [point 1]' },
        { type: 'normal', text: '- [point 2]' },
        { type: 'normal', text: '- [point 3]' },
        { type: 'normal', text: '' },
        { type: 'normal', text: 'Angle: [humble / curious / direct / reflective / story-driven]' },
        { type: 'normal', text: '' },
        { type: 'normal', text: 'Length: [word count / slide count / email length]' }
      ]
    },
    tip: 'Save this to content/briefs/brief-001.md. Create a new brief file for each piece of content.'
  },
  {
    id: 10,
    title: 'Configuration Summary',
    shortTitle: 'Summary',
    stage: 'configure',
    explanation: 'Here is what you have built so far and how the pieces work together.',
    summaryStep: true,
    summaryPoints: [
      { label: 'CLAUDE.md', desc: 'Your voice profile. Claude reads this every session. It is the foundation that makes everything else work. The more specific it is, the less you edit.' },
      { label: 'Templates', desc: 'Structural rules for each content type (email, LinkedIn, long-form, slides, or any custom ones you added). They tell Claude how to format and structure the output.' },
      { label: 'Briefs', desc: 'One-per-piece assignment sheets. They tell Claude what to write, for whom, and in what tone. You create a new brief every time you start a new piece of content.' },
      { label: 'Drafts & Published', desc: 'Where Claude saves output. Drafts go to content/drafts/. Once you are happy with a piece, move it to content/published/ to keep things organized.' }
    ],
    summaryFlow: 'CLAUDE.md (who you are) + Template (how to structure it) + Brief (what to write) = a draft that sounds like you.',
    tip: 'You can come back and update any of these files anytime. Your writing agent gets better as your files get more specific.'
  },

  /* ── USE ─────────────────────────────────────────── */
  {
    id: 11,
    title: 'Run Claude Code',
    shortTitle: 'Run Claude',
    stage: 'use',
    explanation: 'Navigate to your folder and start Claude Code. It will automatically read your CLAUDE.md file.',
    commands: [
      'cd "Your Name Tone"',
      'claude'
    ],
    tip: 'Replace "Your Name Tone" with whatever you named your folder in Step 1.',
    subSections: [
      {
        heading: 'For quick tasks, just talk to it:',
        example: 'Read CLAUDE.md and templates/email.md then write an email to\nmy manager requesting feedback on my project draft'
      },
      {
        heading: 'For complex pieces with a rubric, use a brief:',
        example: 'Read CLAUDE.md, templates/slides.md, and content/briefs/brief-001.md.\nWrite a presentation following my voice, template, and brief.\nSave to content/drafts/brief-001-draft.md'
      }
    ]
  },
  {
    id: 12,
    title: 'Refine & Train Your Agent',
    shortTitle: 'Refine & Train',
    stage: 'use',
    explanation: 'Once Claude writes your first draft, refine it in the same session. Tailor these commands to your own style. The more you use them, the more Claude learns what you want.',
    refineTable: [
      { say: 'make the opening more grounded', does: 'Anchors it in a specific scene' },
      { say: 'the closing feels generic, rewrite it', does: 'Forces a stronger zoom-out' },
      { say: 'cut 50 words', does: 'Tightens it' },
      { say: 'fix the transitions', does: 'Applies your voice' },
      { say: 'remove all filler words', does: 'Cleans it up' },
      { say: 'write 2 more variations of the opening', does: 'Gives you options' },
      { say: 'adjust for [new audience]', does: 'Shifts the tone' }
    ],
    memoryTraining: true,
    memoryPoints: [
      'After you refine a piece and are happy with it, tell Claude: "Remember that I prefer this style of opening" or "Save to memory that I never want bullet points in LinkedIn posts."',
      'Claude Code has a built-in memory system. When you tell it to remember something, it saves that preference and applies it in every future session.',
      'Over time, your agent gets trained to your voice without you needing to repeat instructions. The refinements you make today become the defaults tomorrow.',
      'Think of it as training a writing partner: every correction teaches it something new about how you write.'
    ],
    memoryExamples: [
      { say: 'Remember that I always open with a concrete scene, never an abstract statement', does: 'Saves your opening preference to memory' },
      { say: 'Save to memory: when writing for professors, I use formal citations in APA format', does: 'Saves audience-specific formatting rule' },
      { say: 'Remember that my LinkedIn posts should never exceed 200 words', does: 'Saves a length constraint for future posts' },
      { say: 'Save to memory: I prefer "we" over "I" in client-facing content', does: 'Saves a pronoun preference by audience' }
    ],
    folderStructure: [
      'Your Name Tone/',
      '├── CLAUDE.md                    ← your voice, rules, background',
      '├── templates/',
      '│   ├── linkedin-post.md',
      '│   ├── email.md',
      '│   ├── long-form.md',
      '│   └── slides.md',
      '└── content/',
      '    ├── briefs/',
      '    │   └── brief-001.md',
      '    ├── drafts/',
      '    └── published/'
    ],
    quickLaunch: true,
    quickLaunchCommands: [
      'cd "Your Name Tone"',
      'claude'
    ],
    quickLaunchAlias: 'alias writer=\'cd ~/path/to/Your\\ Name\\ Tone && claude\'',
    quickLaunchPoints: [
      'Every time you want to use your writing agent, you just need to open the folder and run Claude. Two commands, every time.',
      'To make it even faster, add a shortcut alias to your shell profile (~/.zshrc on Mac or ~/.bashrc on Windows/Linux). Then you just type "writer" from anywhere and your writing agent opens ready to go.',
      'Once Claude starts, it automatically reads your CLAUDE.md and knows your voice, rules, and templates. You just start talking to it.'
    ]
  }
];

/* Voice prompt text for copy button */
const voicePromptFull = ALL_STEPS.find(s => s.id === 3).voicePromptText;

/* ════════════════════════════════════════════════════════════════
   STATE
════════════════════════════════════════════════════════════════ */
let currentStepIndex = 0;
let progress = {};

function loadState() {
  try {
    progress = JSON.parse(localStorage.getItem(LS_PROGRESS) || '{}');
    const saved = localStorage.getItem(LS_CURRENT);
    if (saved !== null) {
      const idx = ALL_STEPS.findIndex(s => s.id === Number(saved));
      if (idx >= 0) currentStepIndex = idx;
    }
  } catch(e) { progress = {}; }
}

function saveState() {
  localStorage.setItem(LS_PROGRESS, JSON.stringify(progress));
  localStorage.setItem(LS_CURRENT, String(ALL_STEPS[currentStepIndex].id));
}

/* ════════════════════════════════════════════════════════════════
   SCREEN MANAGEMENT
════════════════════════════════════════════════════════════════ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function startWizard() {
  localStorage.setItem(LS_STARTED, 'true');
  showScreen('wizardScreen');
  renderAll();
}

function restartWizard() {
  if (!confirm('This will reset all your progress. Continue?')) return;
  localStorage.removeItem(LS_PROGRESS);
  localStorage.removeItem(LS_CURRENT);
  localStorage.removeItem(LS_STARTED);
  progress = {};
  currentStepIndex = 0;
  showScreen('welcomeScreen');
}

function confirmRestart() { restartWizard(); }

/* ════════════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  loadState();
  if (localStorage.getItem(LS_STARTED)) {
    showScreen('wizardScreen');
    renderAll();
  }
});

/* keyboard nav */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextStep();
  if (e.key === 'ArrowLeft')  prevStep();
});

/* ════════════════════════════════════════════════════════════════
   RENDER
════════════════════════════════════════════════════════════════ */
function renderAll() {
  renderStages();
  renderSidebar();
  renderProgress();
  renderCard();
  updateNav();
  updateSectionHeader();
}

function currentStep() { return ALL_STEPS[currentStepIndex]; }

function stageOf(step) { return step.stage; }

function stepsForStage(stage) { return ALL_STEPS.filter(s => s.stage === stage); }

/* ── Stages ── */
function renderStages() {
  STAGE_ORDER.forEach(stage => {
    const el = document.getElementById('stage' + stage.charAt(0).toUpperCase() + stage.slice(1));
    const dot = document.getElementById('stageDot' + stage.charAt(0).toUpperCase() + stage.slice(1));
    if (!el || !dot) return;

    const steps = stepsForStage(stage);
    const allDone = steps.length > 0 && steps.every(s => progress[s.id]);
    const isCurrent = stageOf(currentStep()) === stage;

    el.className = 'stage-item stage-tab';
    dot.className = 'stage-dot';

    if (allDone) {
      el.classList.add('stage-done');
      dot.classList.add('stage-dot-done');
      dot.innerHTML = '✓';
    } else if (isCurrent) {
      el.classList.add('stage-active');
      dot.classList.add('stage-dot-active');
      dot.innerHTML = '';
    } else {
      dot.classList.add('stage-dot-upcoming');
      dot.innerHTML = '';
    }
  });
}

/* ── Sidebar step list ── */
function renderSidebar() {
  const list = document.getElementById('stepSubList');
  const stage = stageOf(currentStep());
  const steps = stepsForStage(stage);

  list.innerHTML = steps.map(step => {
    const done = progress[step.id];
    const active = step.id === currentStep().id;
    let cls = 'step-sub-item';
    if (active) cls += ' is-active';
    else if (done) cls += ' is-done';

    const dotContent = done ? '✓' : (active ? '' : '');
    return `<li class="${cls}" onclick="goToStep(${step.id})">
      <span class="sub-dot">${dotContent}</span>
      <span>${step.shortTitle}</span>
    </li>`;
  }).join('');
}

/* ── Progress bar & dots ── */
function renderProgress() {
  const total = ALL_STEPS.length;
  const done = ALL_STEPS.filter(s => progress[s.id]).length;
  const pct = total > 0 ? (done / total * 100) : 0;

  document.getElementById('progressBarFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = `${done} of ${total} completed`;
  document.getElementById('stepCounter').textContent = `Step ${currentStepIndex + 1} of ${total}`;

  const dotsEl = document.getElementById('progressDots');
  dotsEl.innerHTML = ALL_STEPS.map((step, i) => {
    let cls = 'prog-dot';
    if (progress[step.id]) cls += ' dot-done';
    if (i === currentStepIndex) cls += ' dot-current';
    return `<span class="${cls}" onclick="goToStep(${step.id})" title="${step.shortTitle}"></span>`;
  }).join('');

  // Check if all done
  if (done === total) {
    setTimeout(() => showScreen('successScreen'), 400);
  }
}

/* ── Section header ── */
function updateSectionHeader() {
  const stage = stageOf(currentStep());
  const meta = STAGE_META[stage];
  document.getElementById('sectionTitle').textContent = meta.title;
  document.getElementById('sectionSub').textContent = meta.sub;
}

/* ── Step card ── */
function renderCard() {
  const step = currentStep();
  const card = document.getElementById('stepCard');
  const done = progress[step.id];

  let html = '';

  // Badge row
  html += '<div class="card-meta">';
  html += `<span class="badge badge-step">Step ${step.id}</span>`;
  html += '</div>';

  // Title
  html += `<h2 class="card-title">${step.title}</h2>`;

  // Explanation
  if (step.explanation) {
    html += `<p class="card-explanation">${step.explanation}</p>`;
  }

  // Announcement (for Choose Templates step)
  if (step.announcement && step.announcementPoints) {
    html += '<ul class="card-bullets">';
    step.announcementPoints.forEach(pt => {
      html += `<li>${pt}</li>`;
    });
    html += '</ul>';
  }

  // Summary step (for Configure Summary)
  if (step.summaryStep && step.summaryPoints) {
    step.summaryPoints.forEach(pt => {
      html += `<div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:10px;padding:14px 18px;margin-bottom:10px;">`;
      html += `<p style="font-weight:800;color:#0f172a;font-size:.9rem;margin-bottom:4px;">${escHtml(pt.label)}</p>`;
      html += `<p style="color:#64748b;font-size:.88rem;line-height:1.6;">${escHtml(pt.desc)}</p>`;
      html += '</div>';
    });
    if (step.summaryFlow) {
      html += '<div class="warn-box" style="background:#eff6ff;border-color:#bfdbfe;color:#1e40af;margin-top:16px;">';
      html += '<span class="box-icon">🔗</span>';
      html += `<span><strong>How it all connects:</strong> ${escHtml(step.summaryFlow)}</span>`;
      html += '</div>';
    }
  }

  // Voice prompt (for CLAUDE.md step)
  if (step.voicePrompt) {
    html += '<div class="warn-box" style="background:#eff6ff;border-color:#bfdbfe;color:#1e40af;margin-bottom:16px;">';
    html += '<span class="box-icon">💬</span>';
    html += '<span><strong>First:</strong> Open <a href="https://claude.ai" target="_blank" style="color:#1d4ed8;font-weight:700;">claude.ai</a> (the chat, not Claude Code) and paste the prompt below with your content samples. Use the Voice Profile output to fill in your CLAUDE.md.</span>';
    html += '</div>';
    html += '<p class="card-sub-heading">Voice Analysis Prompt — copy and paste into Claude chat:</p>';
    html += `<div class="code-block-header"><button class="copy-btn" onclick="copyCmd(this, voicePromptFull)">Copy Prompt</button></div>`;
    html += `<div class="code-content-block">`;
    html += `<pre>${escHtml(step.voicePromptText)}</pre>`;
    html += '</div>';
    if (step.voicePromptTip) {
      html += `<div class="tip-box"><span class="box-icon">💡</span><span>${step.voicePromptTip}</span></div>`;
    }
    html += '<p class="card-sub-heading" style="margin-top:24px;">Then fill in your CLAUDE.md with this structure:</p>';
  }

  // Commands
  if (step.commands) {
    step.commands.forEach(cmd => {
      html += `<div class="cmd-block">
        <code>${escHtml(cmd)}</code>
        <button class="copy-btn" onclick="copyCmd(this, '${escAttr(cmd)}')">Copy</button>
      </div>`;
    });
  }

  // Code content block (template previews)
  if (step.codeContent) {
    html += '<div class="code-content-block"><pre>';
    step.codeContent.lines.forEach(line => {
      if (line.type === 'heading') {
        html += `<span class="code-heading">${escHtml(line.text)}</span>\n`;
      } else if (line.type === 'comment') {
        html += `<span class="code-comment">${escHtml(line.text)}</span>\n`;
      } else {
        html += escHtml(line.text) + '\n';
      }
    });
    html += '</pre></div>';
  }

  // Sub sections (for Run Claude step)
  if (step.subSections) {
    step.subSections.forEach((sub, idx) => {
      html += `<p class="card-sub-heading">${escHtml(sub.heading)}</p>`;
      html += `<div class="cmd-block" style="align-items:flex-start;">
        <code style="white-space:pre-wrap;">${escHtml(sub.example)}</code>
        <button class="copy-btn" data-copy-id="sub-${idx}" onclick="copyFromData(this)">Copy</button>
      </div>`;
    });
  }

  // Refine table
  if (step.refineTable) {
    html += '<table class="refine-table"><thead><tr><th>You say</th><th>What it does</th></tr></thead><tbody>';
    step.refineTable.forEach(row => {
      html += `<tr><td><code>${escHtml(row.say)}</code></td><td>${escHtml(row.does)}</td></tr>`;
    });
    html += '</tbody></table>';
  }

  // Memory training section
  if (step.memoryTraining) {
    html += '<p class="card-sub-heading" style="margin-top:24px;">Train Claude to Remember Your Preferences</p>';
    html += '<div class="warn-box" style="background:#eff6ff;border-color:#bfdbfe;color:#1e40af;margin-bottom:14px;">';
    html += '<span class="box-icon">🧠</span>';
    html += '<span><strong>Key insight:</strong> Every time you correct Claude and tell it to remember, it saves that preference for all future sessions. Your agent gets smarter the more you use it.</span>';
    html += '</div>';
    if (step.memoryPoints) {
      html += '<ul class="card-bullets">';
      step.memoryPoints.forEach(pt => {
        html += `<li>${pt}</li>`;
      });
      html += '</ul>';
    }
    if (step.memoryExamples) {
      html += '<p class="card-sub-heading" style="margin-top:16px;">Memory Commands You Can Use</p>';
      html += '<table class="refine-table"><thead><tr><th>You say</th><th>What it does</th></tr></thead><tbody>';
      step.memoryExamples.forEach(row => {
        html += `<tr><td><code>${escHtml(row.say)}</code></td><td>${escHtml(row.does)}</td></tr>`;
      });
      html += '</tbody></table>';
    }
  }

  // Quick launch section
  if (step.quickLaunch) {
    html += '<p class="card-sub-heading" style="margin-top:24px;">How to Open Your Writing Agent Every Time</p>';
    html += '<ul class="card-bullets">';
    html += `<li>${step.quickLaunchPoints[0]}</li>`;
    html += '</ul>';
    step.quickLaunchCommands.forEach(cmd => {
      html += `<div class="cmd-block">
        <code>${escHtml(cmd)}</code>
        <button class="copy-btn" onclick="copyCmd(this, '${escAttr(cmd)}')">Copy</button>
      </div>`;
    });
    html += '<div class="tip-box" style="margin-top:14px;"><span class="box-icon">💡</span><span><strong>Shortcut:</strong> You can also drag your folder directly into the Claude Code terminal window instead of typing the path.</span></div>';
    html += '<ul class="card-bullets" style="margin-top:14px;">';
    html += `<li>${step.quickLaunchPoints[1]}</li>`;
    html += '</ul>';
    html += `<div class="cmd-block">
      <code>${escHtml(step.quickLaunchAlias)}</code>
      <button class="copy-btn" data-copy-id="alias" onclick="copyFromData(this)">Copy</button>
    </div>`;
    html += '<ul class="card-bullets" style="margin-top:14px;">';
    html += `<li>${step.quickLaunchPoints[2]}</li>`;
    html += '</ul>';
  }

  // Folder structure
  if (step.folderStructure) {
    html += '<p class="card-sub-heading">Your Final Folder Structure</p>';
    html += '<div class="folder-structure">';
    step.folderStructure.forEach(line => {
      if (line.includes('←')) {
        const parts = line.split('←');
        html += escHtml(parts[0]) + '<span class="folder-comment">← ' + escHtml(parts[1].trim()) + '</span>\n';
      } else {
        html += escHtml(line) + '\n';
      }
    });
    html += '</div>';
  }

  // Tip
  if (step.tip) {
    html += `<div class="tip-box"><span class="box-icon">💡</span><span>${step.tip}</span></div>`;
  }

  // Warning
  if (step.warn) {
    html += `<div class="warn-box"><span class="box-icon">⚠️</span><span>${step.warn}</span></div>`;
  }

  // Divider + mark complete
  html += '<hr class="card-divider">';
  html += `<button class="mark-complete-btn ${done ? 'is-done' : ''}" onclick="toggleComplete(${step.id})">
    <span class="mcb-circle">${done ? '✓' : ''}</span>
    <span>${done ? 'Completed!' : 'Mark as complete'}</span>
  </button>`;

  card.innerHTML = html;
  card.style.animation = 'none';
  void card.offsetWidth;
  card.style.animation = '';

  // Build copy data store for buttons that use data attributes
  buildCopyData(step);
}

/* ════════════════════════════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════════════════════════════ */
function nextStep() {
  if (currentStepIndex < ALL_STEPS.length - 1) {
    currentStepIndex++;
    saveState();
    renderAll();
    document.getElementById('appMain').scrollTop = 0;
  }
}

function prevStep() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    saveState();
    renderAll();
    document.getElementById('appMain').scrollTop = 0;
  }
}

function skipStep() { nextStep(); }

function goToStep(id) {
  const idx = ALL_STEPS.findIndex(s => s.id === id);
  if (idx >= 0) {
    currentStepIndex = idx;
    saveState();
    renderAll();
    document.getElementById('appMain').scrollTop = 0;
    closeSidebar();
  }
}

function selectStage(stage) {
  const steps = stepsForStage(stage);
  if (steps.length > 0) {
    goToStep(steps[0].id);
  }
}

function updateNav() {
  document.getElementById('navBack').disabled = currentStepIndex === 0;
  const nextBtn = document.getElementById('navNext');
  if (currentStepIndex === ALL_STEPS.length - 1) {
    nextBtn.textContent = 'Finish →';
    nextBtn.onclick = () => {
      const total = ALL_STEPS.length;
      const done = ALL_STEPS.filter(s => progress[s.id]).length;
      if (done === total) {
        showScreen('successScreen');
      } else {
        const remaining = total - done;
        alert(`You still have ${remaining} step${remaining > 1 ? 's' : ''} to complete. Mark them as done or click "Skip for now" to move through them.`);
      }
    };
  } else {
    nextBtn.textContent = 'Next →';
    nextBtn.onclick = nextStep;
  }
}

/* ════════════════════════════════════════════════════════════════
   PROGRESS TRACKING
════════════════════════════════════════════════════════════════ */
function toggleComplete(id) {
  progress[id] = !progress[id];
  saveState();
  renderAll();
}

/* ════════════════════════════════════════════════════════════════
   SIDEBAR (MOBILE)
════════════════════════════════════════════════════════════════ */
function toggleSidebar() {
  const sidebar = document.getElementById('appSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('is-open');
  overlay.classList.toggle('hidden');
}

function closeSidebar() {
  document.getElementById('appSidebar').classList.remove('is-open');
  document.getElementById('sidebarOverlay').classList.add('hidden');
}

/* ════════════════════════════════════════════════════════════════
   CLIPBOARD
════════════════════════════════════════════════════════════════ */
/* Store for copy data that can't be safely inlined in onclick attributes */
const copyDataStore = {};

function buildCopyData(step) {
  if (step.subSections) {
    step.subSections.forEach((sub, idx) => {
      copyDataStore['sub-' + idx] = sub.example;
    });
  }
  if (step.quickLaunchAlias) {
    copyDataStore['alias'] = step.quickLaunchAlias;
  }
}

function copyCmd(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add('copied');
    btn.textContent = 'Copied!';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.textContent = 'Copy';
    }, 1500);
  });
}

function copyFromData(btn) {
  const id = btn.getAttribute('data-copy-id');
  const text = copyDataStore[id];
  if (text) copyCmd(btn, text);
}

/* ════════════════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════════════════ */
function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function escAttr(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
}
