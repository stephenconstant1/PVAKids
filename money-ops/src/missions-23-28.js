export const missions23to28 = [
  {
    id: 23,
    title: 'Paycheck Decoder',
    topic: 'Taxes & Your Paycheck',
    location: 'Payday Station',
    icon: '🧾',
    brief: 'Read a pay stub and make a plan with the money that actually arrives.',
    concepts: ['gross', 'payroll deductions', 'net', 'taxes'],
    dialogue: [
      {
        speaker: 'maya',
        text: 'Gross is all the pay you earned before anything is taken out.'
      },
      {
        speaker: 'jordan',
        text: 'Payroll deductions come out first. Net is the money that reaches you.'
      }
    ],
    decision: {
      prompt: 'Your pay stub shows $300 gross, $60 in payroll deductions, and $240 net. Which plan do you choose?',
      options: [
        {
          id: 'plan-the-net',
          label: 'Plan the $240 net',
          icon: '✅',
          detail: 'Put $60 in savings and keep $180 in checking.',
          effects: { checking: 180, savings: 60, monthlyIncome: 240, taxes: 60 },
          feedback: 'Smart plan! You used your net pay, so every dollar in the plan is really available.'
        },
        {
          id: 'spend-the-net',
          label: 'Spend all $240',
          icon: '🛍️',
          detail: 'Use the full net paycheck now and save nothing.',
          effects: { monthlyIncome: 240, monthlyExpenses: 240, taxes: 60 },
          feedback: 'The plan fits your net pay, but no money remains for a goal or surprise.'
        },
        {
          id: 'plan-the-gross',
          label: 'Plan the $300 gross',
          icon: '⚠️',
          detail: 'Promise to spend $300 even though only $240 arrives.',
          effects: { monthlyIncome: 240, monthlyExpenses: 300, debt: 60, taxes: 60 },
          feedback: 'Gross is not take-home money. Planning with it created a $60 shortage.'
        }
      ]
    },
    event: {
      title: 'Side-job surprise',
      prompt: 'You earn $100 from a side job with no payroll deductions. Taxes may still be due later. What do you do?',
      options: [
        {
          id: 'set-aside-taxes',
          label: 'Set aside $25',
          icon: '🏦',
          detail: 'Reserve $25 for taxes and save the other $75.',
          effects: { savings: 75, monthlyIncome: 100, taxes: 25 },
          feedback: 'You prepared for taxes before using the side-job money.'
        },
        {
          id: 'keep-and-track',
          label: 'Track it carefully',
          icon: '📒',
          detail: 'Reserve $20 for taxes and keep $80 in checking.',
          effects: { checking: 80, monthlyIncome: 100, taxes: 20 },
          feedback: 'Good tracking helps you remember that untaxed income may bring a later bill.'
        },
        {
          id: 'spend-everything',
          label: 'Spend all $100',
          icon: '💨',
          detail: 'Use it now without reserving money for taxes.',
          effects: { monthlyIncome: 100, monthlyExpenses: 100, debt: 25 },
          feedback: 'The money is gone, but the possible tax bill is not. You may need to borrow later.'
        }
      ]
    },
    takeaway: 'Gross is what you earn. Payroll deductions come out before net pay reaches you.'
  },
  {
    id: 24,
    title: 'Starting a Business — Problem to Opportunity',
    topic: 'Problem → Solution → Customer → Revenue → Profit',
    location: 'Opportunity Avenue',
    icon: '💡',
    brief: 'Spot a real problem and build a useful solution for a customer.',
    concepts: ['problem', 'solution', 'customer', 'revenue', 'profit'],
    dialogue: [
      {
        speaker: 'sofia',
        text: 'A strong business begins with a problem that people truly want solved.'
      },
      {
        speaker: 'kai',
        text: 'A solution helps a customer. Their payment creates revenue, and revenue left after costs is profit.'
      }
    ],
    decision: {
      prompt: 'Busy neighbors need dependable help caring for their dogs. How will you turn the problem into an opportunity?',
      options: [
        {
          id: 'booking-service',
          label: 'Build a booking service',
          icon: '🐕',
          detail: 'Offer scheduled walks and text updates. Customers pay $180 and supplies cost $40.',
          effects: { checking: 140, monthlyIncome: 180, monthlyExpenses: 40, businessValue: 120 },
          feedback: 'Problem → solution → customer → revenue → profit. You earned $140 profit after costs.'
        },
        {
          id: 'logo-first',
          label: 'Design a logo first',
          icon: '🎨',
          detail: 'Spend $80 on a logo before asking customers what help they need.',
          effects: { checking: -80, monthlyExpenses: 80, businessValue: 15 },
          feedback: 'A logo can wait. First confirm the problem, solution, and customer.'
        },
        {
          id: 'storefront-first',
          label: 'Borrow for a shop',
          icon: '🏬',
          detail: 'Take a $1,000 loan for a storefront before making a sale.',
          effects: { loans: 1000, monthlyExpenses: 300, businessValue: 50 },
          feedback: 'The large cost arrived before revenue. Test a small solution with customers first.'
        }
      ]
    },
    event: {
      title: 'Customers speak up',
      prompt: 'Your first customers ask for a reminder before every dog walk. How do you respond?',
      options: [
        {
          id: 'add-reminders',
          label: 'Add reminders',
          icon: '🔔',
          detail: 'Spend $25 to add the feature customers requested.',
          effects: { checking: 75, monthlyIncome: 100, monthlyExpenses: 25, businessValue: 90 },
          feedback: 'Listening improved the solution and gave customers more value.'
        },
        {
          id: 'ask-and-test',
          label: 'Test it with three customers',
          icon: '🧪',
          detail: 'Run a small $10 test before changing the full service.',
          effects: { checking: 40, monthlyIncome: 50, monthlyExpenses: 10, businessValue: 55 },
          feedback: 'A small test teaches you what customers want while keeping risk low.'
        },
        {
          id: 'ignore-feedback',
          label: 'Ignore the request',
          icon: '🙉',
          detail: 'Keep the service exactly the same.',
          effects: { monthlyIncome: -40, businessValue: -45 },
          feedback: 'Some customers leave when a solution no longer solves their full problem.'
        }
      ]
    },
    takeaway: 'Follow the chain: problem → solution → customer → revenue → profit.'
  },
  {
    id: 25,
    title: 'Price for Profit',
    topic: 'Pricing, Revenue, Expenses & Profit',
    location: 'Market Math Lab',
    icon: '🏷️',
    brief: 'Choose a price that customers accept and that covers every expense.',
    concepts: ['pricing', 'revenue', 'expenses', 'profit'],
    dialogue: [
      {
        speaker: 'jordan',
        text: 'Pricing decides what each customer pays. All the sales together make revenue.'
      },
      {
        speaker: 'maya',
        text: 'Expenses are business costs. Revenue minus expenses equals profit.'
      }
    ],
    decision: {
      prompt: 'Each creativity kit costs $6 to make. What price will you choose?',
      options: [
        {
          id: 'balanced-price',
          label: '$14 × 10 customers',
          icon: '⚖️',
          detail: '$140 revenue − $60 expenses = $80 profit.',
          effects: { checking: 80, monthlyIncome: 140, monthlyExpenses: 60, businessValue: 60 },
          feedback: 'This price covers expenses, earns profit, and still attracts all 10 customers.'
        },
        {
          id: 'low-price',
          label: '$7 × 10 customers',
          icon: '⬇️',
          detail: '$70 revenue − $60 expenses = $10 profit.',
          effects: { checking: 10, monthlyIncome: 70, monthlyExpenses: 60, businessValue: 20 },
          feedback: 'Customers like the low price, but only $10 remains to grow the business.'
        },
        {
          id: 'high-price',
          label: '$22 × 4 customers',
          icon: '⬆️',
          detail: '$88 revenue − $24 expenses = $64 profit.',
          effects: { checking: 64, monthlyIncome: 88, monthlyExpenses: 24, businessValue: -10 },
          feedback: 'Profit is positive, but six customers walked away. Price affects demand too.'
        }
      ]
    },
    event: {
      title: 'Supply costs rise',
      prompt: 'Materials now cost $8 per kit, and eight customers still want one. How will you adjust?',
      options: [
        {
          id: 'careful-price-rise',
          label: 'Raise the price to $16',
          icon: '📈',
          detail: '$128 revenue − $64 expenses = $64 profit.',
          effects: { checking: 64, monthlyIncome: 128, monthlyExpenses: 64, businessValue: 35 },
          feedback: 'You explained a reasonable price change and protected the product quality.'
        },
        {
          id: 'hold-price',
          label: 'Keep the $14 price',
          icon: '🤝',
          detail: '$112 revenue − $64 expenses = $48 profit.',
          effects: { checking: 48, monthlyIncome: 112, monthlyExpenses: 64, businessValue: 25 },
          feedback: 'Customers keep the old price, but the higher expenses reduce profit.'
        },
        {
          id: 'cheap-materials',
          label: 'Use cheaper materials',
          icon: '📦',
          detail: '$140 revenue − $50 expenses = $90 profit, but quality falls.',
          effects: { checking: 90, monthlyIncome: 140, monthlyExpenses: 50, businessValue: -45 },
          feedback: 'Profit rose today, but lower quality can hurt customer trust and future sales.'
        }
      ]
    },
    takeaway: 'Pricing shapes demand. Revenue − expenses = profit.'
  },
  {
    id: 26,
    title: 'Build the Brand',
    topic: 'Marketing, Customers & Building a Brand',
    location: 'Brand Builder Boulevard',
    icon: '📣',
    brief: 'Reach the right customers and earn trust with an honest message.',
    concepts: ['marketing', 'customer', 'brand'],
    dialogue: [
      {
        speaker: 'kai',
        text: 'Marketing helps the right customer discover how your product can help.'
      },
      {
        speaker: 'sofia',
        text: 'Your brand is the promise people remember. Every customer experience shapes it.'
      }
    ],
    decision: {
      prompt: 'You have $60 to market your creativity kits. Which message will build customer trust?',
      options: [
        {
          id: 'honest-demo',
          label: 'Show an honest demo',
          icon: '🎬',
          detail: 'Show families how the kit works and invite customers to share their creations.',
          effects: { checking: 180, monthlyIncome: 240, monthlyExpenses: 60, businessValue: 120 },
          feedback: 'The marketing reached likely customers and the honest demonstration strengthened the brand.'
        },
        {
          id: 'giant-ad',
          label: 'Buy one giant ad',
          icon: '🪧',
          detail: 'Borrow for a $300 ad shown to everyone, even people who do not need the kit.',
          effects: { checking: -180, loans: 250, monthlyIncome: 120, monthlyExpenses: 300, businessValue: 20 },
          feedback: 'Many people saw the ad, but weak targeting made the marketing too expensive.'
        },
        {
          id: 'wild-promise',
          label: 'Make a wild promise',
          icon: '🤩',
          detail: 'Claim the kit can make anyone a famous artist overnight.',
          effects: { checking: 250, monthlyIncome: 300, monthlyExpenses: 50, businessValue: -150 },
          feedback: 'The claim brought quick sales, but disappointed customers damaged the brand.'
        }
      ]
    },
    event: {
      title: 'A disappointed customer',
      prompt: 'One kit arrives with a broken marker. The customer posts a calm review. What do you do?',
      options: [
        {
          id: 'reply-and-replace',
          label: 'Reply and replace it',
          icon: '💬',
          detail: 'Apologize, send a $25 replacement, and explain the quality check.',
          effects: { checking: -25, monthlyExpenses: 25, monthlyIncome: 20, businessValue: 90 },
          feedback: 'A helpful response turned a mistake into customer trust.'
        },
        {
          id: 'learn-first',
          label: 'Ask, fix, and follow up',
          icon: '🛠️',
          detail: 'Spend $40 improving packaging, then ask if the new kit arrived safely.',
          effects: { checking: -40, monthlyExpenses: 40, monthlyIncome: 40, businessValue: 110 },
          feedback: 'You fixed the customer experience and improved the brand for future orders.'
        },
        {
          id: 'delete-review',
          label: 'Delete the review',
          icon: '🗑️',
          detail: 'Hide the feedback and make no change.',
          effects: { monthlyIncome: -60, businessValue: -100 },
          feedback: 'The problem stayed unsolved, and other customers trusted the brand less.'
        }
      ]
    },
    takeaway: 'Good marketing reaches the right customer. A trusted brand keeps its promise.'
  },
  {
    id: 27,
    title: 'Property Path',
    topic: 'Real Estate & Building Wealth Through Property',
    location: 'Homebuyer Harbor',
    icon: '🏠',
    brief: 'Balance a down payment, mortgage, equity, and monthly cash flow.',
    concepts: ['real estate', 'mortgage', 'down payment', 'equity', 'cash flow'],
    dialogue: [
      {
        speaker: 'maya',
        text: 'A down payment is paid first. A mortgage is a loan used to buy real estate.'
      },
      {
        speaker: 'jordan',
        text: 'Equity is the property value you own after loans. Cash flow is rent received minus monthly costs.'
      }
    ],
    decision: {
      prompt: 'A small rental home costs $120,000 and can bring in $1,200 per month. Which path do you choose?',
      options: [
        {
          id: 'strong-down-payment',
          label: 'Put 20% down',
          icon: '🔑',
          detail: 'Pay $24,000 down, borrow $96,000, and expect $200 monthly cash flow after costs.',
          effects: { savings: -24000, property: 120000, loans: 96000, monthlyIncome: 1200, monthlyExpenses: 900, insuranceCosts: 100 },
          feedback: 'Your down payment creates $24,000 in starting equity, and the rent covers monthly costs.'
        },
        {
          id: 'tiny-down-payment',
          label: 'Put 5% down',
          icon: '🪙',
          detail: 'Pay $6,000 down, borrow $114,000, and expect negative $40 monthly cash flow after costs.',
          effects: { savings: -6000, property: 120000, loans: 114000, monthlyIncome: 1200, monthlyExpenses: 1120, insuranceCosts: 120 },
          feedback: 'You bought sooner, but the larger mortgage reduced equity and pushed cash flow below zero.'
        },
        {
          id: 'prepare-first',
          label: 'Keep preparing',
          icon: '🌱',
          detail: 'Save $5,000 more while studying repairs, neighborhoods, and mortgage costs.',
          effects: { savings: 5000, monthlyExpenses: 700 },
          feedback: 'You do not own property yet, but a stronger down payment can reduce the future mortgage.'
        }
      ]
    },
    event: {
      title: 'An empty month',
      prompt: 'The home is empty for one month and needs a $600 repair. Rent is not coming in. What do you do?',
      options: [
        {
          id: 'use-property-reserve',
          label: 'Use the emergency fund',
          icon: '🧰',
          detail: 'Use $1,800 to cover the missing $1,200 rent and the $600 repair.',
          effects: { emergencyFund: -1800, monthlyIncome: -1200, monthlyExpenses: 600, property: 300 },
          feedback: 'The reserve protected the mortgage plan, and the completed repair supports the property value.'
        },
        {
          id: 'repair-with-cash',
          label: 'Repair it now with cash',
          icon: '🔧',
          detail: 'Pay the $600 repair and accept one month of negative cash flow.',
          effects: { cash: -600, monthlyIncome: -1200, monthlyExpenses: 600, property: 300 },
          feedback: 'The month hurts cash flow, but a safe home can attract the next customer sooner.'
        },
        {
          id: 'delay-the-repair',
          label: 'Delay the repair',
          icon: '⏳',
          detail: 'Keep cash today, but leave the home empty for another month.',
          effects: { monthlyIncome: -2400, property: -2000 },
          feedback: 'Skipping the repair saved cash today but cost more rent and reduced the property value.'
        }
      ]
    },
    takeaway: 'Real estate wealth depends on the mortgage, down payment, equity, and dependable cash flow.'
  },
  {
    id: 28,
    title: 'Skill-Up Career Quest',
    topic: 'Careers, Skills & Increasing Your Income',
    location: 'Career Climb Campus',
    icon: '🧗',
    brief: 'Match your strengths to a career and build skills that can increase income.',
    concepts: ['careers', 'skills', 'education', 'experience', 'income'],
    dialogue: [
      {
        speaker: 'sofia',
        text: 'Careers grow through useful skills, education, practice, and experience.'
      },
      {
        speaker: 'kai',
        text: 'Higher income can take preparation. Compare the training cost with the opportunity it creates.'
      }
    ],
    decision: {
      prompt: 'You enjoy fixing things and solving puzzles. Which career path will you explore?',
      options: [
        {
          id: 'paid-apprenticeship',
          label: 'Paid apprenticeship',
          icon: '🧰',
          detail: 'Earn $2,400 monthly while learning from an experienced technician. Tools cost $150.',
          effects: { checking: 2250, monthlyIncome: 2400, monthlyExpenses: 150, businessValue: 60 },
          feedback: 'You gain income and hands-on experience while building valuable skills.'
        },
        {
          id: 'career-certificate',
          label: 'Earn a certificate',
          icon: '🎓',
          detail: 'Spend $800 from savings, then qualify for work paying $3,000 monthly.',
          effects: { savings: -800, monthlyIncome: 3000, monthlyExpenses: 250, businessValue: 90 },
          feedback: 'Education costs money now, but the new skill can open a higher-income career path.'
        },
        {
          id: 'first-open-job',
          label: 'Take the first open job',
          icon: '🚪',
          detail: 'Start immediately at $1,800 monthly without comparing the work to your skills.',
          effects: { checking: 1650, monthlyIncome: 1800, monthlyExpenses: 150 },
          feedback: 'You earn sooner, but the job offers less skill growth and lower income.'
        }
      ]
    },
    event: {
      title: 'Training opportunity',
      prompt: 'Your employer offers advanced training after work. How will you handle the opportunity?',
      options: [
        {
          id: 'pay-for-training',
          label: 'Invest in the training',
          icon: '📚',
          detail: 'Pay $250 now and qualify for $600 more monthly income.',
          effects: { savings: -250, monthlyExpenses: 250, monthlyIncome: 600, businessValue: 100 },
          feedback: 'The short-term cost builds a skill that can increase income over time.'
        },
        {
          id: 'request-support',
          label: 'Ask for employer support',
          icon: '🤝',
          detail: 'Present a plan for how the skill will help the team and request shared costs.',
          effects: { monthlyExpenses: 100, monthlyIncome: 450, businessValue: 120 },
          feedback: 'You connected your skill growth to value for the employer and reduced your cost.'
        },
        {
          id: 'extra-shifts',
          label: 'Work extra shifts instead',
          icon: '⏱️',
          detail: 'Earn $300 more this month but postpone the new skill.',
          effects: { checking: 220, monthlyIncome: 300, monthlyExpenses: 80, businessValue: 10 },
          feedback: 'Extra shifts raise income now. Training could create larger opportunities later.'
        }
      ]
    },
    takeaway: 'Careers grow when you match your interests with skills, education, experience, and a clear income goal.'
  }
];
