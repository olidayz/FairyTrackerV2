export const seedStageDefinitions = [
  { id: 1, slug: 'night-1', label: 'Night Stage 1', dayPart: 'night', unlockOffsetMinutes: 0, orderIndex: 1 },
  { id: 2, slug: 'night-2', label: 'Night Stage 2', dayPart: 'night', unlockOffsetMinutes: 0, orderIndex: 2 },
  { id: 3, slug: 'night-3', label: 'Night Stage 3', dayPart: 'night', unlockOffsetMinutes: 0, orderIndex: 3 },
  { id: 4, slug: 'morning-1', label: 'Morning Stage 1', dayPart: 'morning', unlockOffsetMinutes: 360, orderIndex: 4 },
  { id: 5, slug: 'morning-2', label: 'Morning Stage 2', dayPart: 'morning', unlockOffsetMinutes: 360, orderIndex: 5 },
  { id: 6, slug: 'morning-3', label: 'Morning Stage 3', dayPart: 'morning', unlockOffsetMinutes: 360, orderIndex: 6 },
];

export const seedStageContent = [
  {
    id: 1,
    stageDefinitionId: 2,
    videoUrl: 'https://ouzecxgghjnxfabalbet.supabase.co/storage/v1/object/public/stage-content/1763768947735-nm7xh.mp4',
    imageUrl: null,
    messageText: "[Name], wasn't that FairyCam flight amazing? | even snapped a little selfie while I was up there! I'll keep sending tiny updates so you can follow my whole trip from Fairy Land to your home. The journey takes the whole night, and you'll get to see everything when the sun comes up. It's like a secret adventure waiting for you in the morning! And [Name]... brush your teeth and drift off to sleep. I need you snoozing for the magic to work.",
    frontImageUrl: '/objects/uploads/4fd892fb-6df2-4877-87cb-8ae0ae5973de',
    locationText: 'IN THE SKY',
    statusText: 'FLYING',
    selfieImageUrl: '/objects/uploads/8105e8f5-cd07-4f49-af68-dbef242193b7.webp',
    title: 'IN THE SKIES'
  },
  {
    id: 2,
    stageDefinitionId: 1,
    videoUrl: 'https://ouzecxgghjnxfabalbet.supabase.co/storage/v1/object/public/stage-content/1763768883497-2g2hno.mp4',
    imageUrl: null,
    messageText: "[Name], congrats on losing your tooth! I'm getting everything ready for tonight's big mission. Addresses, gifts, flight plan... there's so much to prepare! We'll be starting our big adventure soon. Hope you're as excited as I am [name]!",
    frontImageUrl: '/objects/uploads/022c16ce-c400-4dfe-b8bb-97f696634e99',
    locationText: 'FairyLand',
    statusText: 'Getting Ready',
    selfieImageUrl: '/objects/uploads/5e9bbdb7-2cec-4e73-a5c3-ec4dcac50366.webp',
    title: 'ADVENTURE BEGINS'
  },
  {
    id: 3,
    stageDefinitionId: 3,
    videoUrl: 'https://ouzecxgghjnxfabalbet.supabase.co/storage/v1/object/public/stage-content/1763769139000-orljup.mp4',
    imageUrl: null,
    messageText: "I really shouldn't text and fly... but I just had to tell you I made it out of the pyramid safely! How cool was that carving of me from all those years ago? I've been picking up teeth for a very, very long time! I've still got a gazillion more stops tonight, so I better keep moving. I'll check in again soon, [Name]!",
    frontImageUrl: '/objects/uploads/7b60bfa5-f99b-4fea-8350-f7f5ffc0ad59',
    locationText: '𓎼𓇌𓊪𓏏',
    statusText: '𓃭𓋴𓏏',
    selfieImageUrl: '/objects/uploads/ce23acc7-956d-4699-b9cd-16ff4e3c239e.webp',
    title: 'PYRAMID PIT STOP'
  },
  {
    id: 4,
    stageDefinitionId: 4,
    videoUrl: 'https://ouzecxgghjnxfabalbet.supabase.co/storage/v1/object/public/stage-content/1763769295835-20lu0g.mp4',
    imageUrl: null,
    messageText: "A bird flew by and knocked my drink right over... He even tried to get into my selfie ! I'll grab some water later. So many teeth to pick up tonight. Your turn soon [name]!",
    frontImageUrl: '/objects/uploads/c8068729-fba4-4615-beaf-2acae657e445',
    locationText: 'United States of America',
    statusText: 'THIRSTY',
    selfieImageUrl: '/objects/uploads/d01f3bd8-0db8-4801-8b74-48a8e012e31b.webp',
    title: 'PIGEON PROBLEM'
  },
  {
    id: 5,
    stageDefinitionId: 5,
    videoUrl: 'https://ouzecxgghjnxfabalbet.supabase.co/storage/v1/object/public/stage-content/1763769233072-hm01n6.mp4',
    imageUrl: null,
    messageText: "That dog was SO cute, [name]. Sometimes dogs get a little nervous around fairies and try to chase us, but this one just wanted to play. I grabbed a silly picture of the two of us... he posed better than I did!",
    frontImageUrl: '/objects/uploads/5f9408d2-ec4c-44a4-8124-76d8bda75e6f',
    locationText: 'Your Neighborhood',
    statusText: 'Missing the Dog',
    selfieImageUrl: '/objects/uploads/e4b25762-b73b-4a7c-94ff-258c4ca6bb68.webp',
    title: 'PUP ENCOUNTER'
  },
  {
    id: 6,
    stageDefinitionId: 6,
    videoUrl: '/objects/uploads/9317019f-d93b-4d8a-9a6c-765246c0096d.mp4',
    imageUrl: null,
    messageText: "Did you peek under your pillow yet [name] ? I hope you love your surprise! I'll fly back the moment your next tooth gets wiggly. We've got more adventures waiting for us. Oh also I saw this huge plane on my flight back, I just had to take a pic!",
    frontImageUrl: '/objects/uploads/cd8ce1ca-4b49-4c6f-8817-a8231481124b',
    locationText: 'FairyLand',
    statusText: 'SUPER HAPPY',
    selfieImageUrl: '/objects/uploads/8b3b7661-cff6-4cab-ac60-a5b333ca8361.webp',
    title: 'MISSION COMPLETE'
  }
];

export const seedEmailTemplates = [
  {
    id: 1,
    slug: 'tracking-link',
    name: 'Tracking Link Email',
    subject: '🧚‍♀️ It\'s Happening! Track Kiki Live',
    preheader: 'Kiki is on her way to your home!',
    headline: 'Kiki is Airborne!',
    bodyText: 'The Fairyland Control Center has confirmed lift-off. We\'ve detected magical signals near {{child_name}}\'s Room.',
    ctaText: 'Track Kiki Live',
    ctaUrl: '{{tracker_url}}',
    footerText: '© 2024 The Office of the Tooth Fairy. All rights reserved.|Sent from Fairyland Connection Node #492'
  },
  {
    id: 2,
    slug: 'morning-unlock',
    name: 'Morning Unlock Email',
    subject: '✨ Mission Complete! See Kiki\'s Visit',
    preheader: 'Good news from the Tooth Fairy!',
    headline: 'Mission Complete!',
    bodyText: 'Good morning! Kiki visited {{child_name}}\'s Room last night while the house was sleeping.',
    ctaText: 'See The Magic',
    ctaUrl: '{{tracker_url}}',
    footerText: '© 2024 The Office of the Tooth Fairy. All rights reserved.|Sent from Fairyland'
  }
];
