export const missions05to10 = [
  {
    id: 5,
    title: 'Investing & Growing Your Money',
    topic: 'Build Your First Portfolio',
    location: 'INVESTMENT LAB',
    icon: '📈',
    brief: 'Put money into a mix of investments and give it time to grow.',
    concepts: [
      'Stocks',
      'Bonds',
      'Real Estate',
      'ETFs',
      'Mutual Funds',
      'Alternative Investments'
    ],
    dialogue: [
      { speaker: 'sofia', text: 'Investing can help money grow, but every investment has risk.' },
      { speaker: 'kai', text: 'Let’s start early, diversify, and think long term.' }
    ],
    decision: {
      prompt: 'How will you build your first $300 portfolio?',
      options: [
        {
          id: 'diversified-start',
          label: 'Mix It Up',
          icon: '🧺',
          detail: 'Spread $300 across stocks, ETFs, and other assets.',
          effects: { cash: -300, stocks: 75, etfs: 150, otherAssets: 75 },
          feedback: 'You diversified. A mix can reduce the effect of one investment falling.'
        },
        {
          id: 'stock-focus',
          label: 'Stock Focus',
          icon: '📊',
          detail: 'Put all $300 into stocks for more possible reward and more risk.',
          effects: { cash: -300, stocks: 300 },
          feedback: 'Stocks may rise or fall. A one-type portfolio carries more risk.'
        },
        {
          id: 'patient-start',
          label: 'Patient Start',
          icon: '🌱',
          detail: 'Invest $200 in ETFs and bonds, and keep $100 available.',
          effects: { cash: -200, etfs: 150, investments: 50 },
          feedback: 'You started small and kept cash ready. Patience is part of long-term investing.'
        }
      ]
    },
    event: {
      title: 'Market Dip',
      prompt: 'Prices fall in this fictional market. What will you do?',
      options: [
        {
          id: 'stay-informed',
          label: 'Check the Facts',
          icon: '🔎',
          detail: 'Review your goal and keep a diversified, long-term plan.',
          effects: { stocks: -15, etfs: -10, otherAssets: -5 },
          feedback: 'Your portfolio lost some value. Staying informed helps you avoid a rushed choice.'
        },
        {
          id: 'sell-in-fear',
          label: 'Sell in a Rush',
          icon: '⚠️',
          detail: 'Sell during the dip because the price movement feels scary.',
          effects: { stocks: -35, etfs: -20, cash: 40 },
          feedback: 'Selling after prices fall can lock in a loss. Market returns are never guaranteed.'
        },
        {
          id: 'rebalance',
          label: 'Rebalance',
          icon: '⚖️',
          detail: 'Move a small amount from stocks into a broader ETF mix.',
          effects: { stocks: -35, etfs: 25 },
          feedback: 'Rebalancing restored your mix, though the market dip still reduced value.'
        }
      ]
    },
    takeaway: 'Start early, diversify, think long term, understand risk, stay informed, and be patient.'
  },
  {
    id: 6,
    title: 'Oil, Gas & World Events',
    topic: 'Energy Prices Touch Everyday Life',
    location: 'ENERGY HARBOR',
    icon: '⛽',
    brief: 'Respond when a fictional world event changes energy prices and the cost of living.',
    concepts: [
      'Oil',
      'Natural Gas',
      'Energy Prices',
      'Global Supply Disruptions',
      'Transportation',
      'Cost of Living'
    ],
    dialogue: [
      { speaker: 'jordan', text: 'Why did food and transportation both get more expensive?' },
      { speaker: 'maya', text: 'Energy helps move and make things, so higher energy prices can spread.' }
    ],
    decision: {
      prompt: 'Energy prices rise. How will you adjust your monthly plan?',
      options: [
        {
          id: 'reduce-energy-use',
          label: 'Use Less Energy',
          icon: '💡',
          detail: 'Carpool, turn off unused lights, and protect your savings.',
          effects: { monthlyExpenses: -20, savings: 20 },
          feedback: 'Small changes lowered transportation and electricity costs.'
        },
        {
          id: 'trim-wants',
          label: 'Pause a Want',
          icon: '✋',
          detail: 'Move $30 from wants to cover food and heating.',
          effects: { monthlyExpenses: 15, cash: -15 },
          feedback: 'You covered the higher needs cost by making a financial tradeoff.'
        },
        {
          id: 'ignore-prices',
          label: 'Change Nothing',
          icon: '🙈',
          detail: 'Keep the old plan even though transportation and food cost more.',
          effects: { monthlyExpenses: 45, savings: -45 },
          feedback: 'The higher cost of living pulled money from savings.'
        }
      ]
    },
    event: {
      title: 'Simulated Supply Disruption',
      prompt: 'A fictional global supply disruption raises heating and delivery costs. Choose a response.',
      options: [
        {
          id: 'update-budget',
          label: 'Update the Budget',
          icon: '🗺️',
          detail: 'Plan for the new prices and delay one optional purchase.',
          effects: { monthlyExpenses: 20, cash: -20 },
          feedback: 'Your budget changed with the situation and kept needs covered.'
        },
        {
          id: 'use-emergency-fund',
          label: 'Use Emergency Money',
          icon: '🛟',
          detail: 'Use the emergency fund for the temporary price shock.',
          effects: { emergencyFund: -40, monthlyExpenses: 40 },
          feedback: 'The fund helped, but regular price changes belong in the next monthly budget.'
        },
        {
          id: 'borrow-for-costs',
          label: 'Borrow the Difference',
          icon: '💳',
          detail: 'Use debt to avoid changing the spending plan.',
          effects: { debt: 55, monthlyExpenses: 45, creditScore: -4 },
          feedback: 'Borrowing covered today’s costs but added a future payment.'
        }
      ]
    },
    takeaway: 'World events can change energy prices, transportation, food, heating, electricity, and the cost of living.'
  },
  {
    id: 7,
    title: 'Credit, Loans & Smart Borrowing',
    topic: 'Borrow With a Plan',
    location: 'CREDIT CROSSROADS',
    icon: '💳',
    brief: 'Compare ways to pay and see the long-term cost before borrowing.',
    concepts: [
      'Credit',
      'Credit Cards',
      'Auto Loans',
      'Mortgages',
      'Student Loans',
      'Good Debt vs. Risky Debt'
    ],
    dialogue: [
      { speaker: 'kai', text: 'Borrowed money is not free money. It must be paid back.' },
      { speaker: 'sofia', text: 'Let’s compare the total cost, the payment, and the purpose.' }
    ],
    decision: {
      prompt: 'You need a $400 computer for school and paid projects. How will you pay?',
      options: [
        {
          id: 'save-and-pay',
          label: 'Save, Then Buy',
          icon: '🐷',
          detail: 'Wait and pay $400 without interest.',
          effects: { cash: -200, savings: -200 },
          feedback: 'Waiting avoided debt and interest, but used money you had saved.'
        },
        {
          id: 'planned-loan',
          label: 'Small Loan',
          icon: '🏦',
          detail: 'Borrow $400 and repay $440 with planned monthly payments.',
          effects: { checking: 400, loans: 440, monthlyExpenses: 44, creditScore: 3 },
          feedback: 'The useful purchase had a plan, but borrowing added $40 to the total cost.'
        },
        {
          id: 'card-minimums',
          label: 'Card Minimums',
          icon: '🧾',
          detail: 'Charge $400 and make only small minimum payments.',
          effects: { checking: 400, debt: 520, monthlyExpenses: 25, creditScore: -8 },
          feedback: 'Small payments stretched the debt out and raised the long-term cost to $520.'
        }
      ]
    },
    event: {
      title: 'Payment Due',
      prompt: 'A loan payment is due today. What is your move?',
      options: [
        {
          id: 'pay-on-time',
          label: 'Pay On Time',
          icon: '✅',
          detail: 'Make the full planned payment by the due date.',
          effects: { checking: -44, loans: -44, creditScore: 8 },
          feedback: 'An on-time payment reduced the loan and supported strong credit.'
        },
        {
          id: 'pay-minimum',
          label: 'Pay the Minimum',
          icon: '➖',
          detail: 'Make a smaller payment and carry more of the balance.',
          effects: { checking: -25, loans: -15, monthlyExpenses: 10 },
          feedback: 'You stayed current, but the balance will take longer to repay.'
        },
        {
          id: 'miss-payment',
          label: 'Miss the Payment',
          icon: '⏰',
          detail: 'Skip the payment and accept a late fee.',
          effects: { loans: 15, monthlyExpenses: 15, creditScore: -25 },
          feedback: 'The missed payment added cost and hurt your credit score.'
        }
      ]
    },
    takeaway: 'Smart borrowing compares the purpose, payment, interest, total cost, and risk before taking on debt.'
  },
  {
    id: 8,
    title: 'Entrepreneurship & Starting a Business',
    topic: 'Turn a Need Into a Plan',
    location: 'STARTUP STUDIO',
    icon: '🚀',
    brief: 'Find a need, choose an idea, and launch a small business that creates value.',
    concepts: [
      'Find a Need',
      'Generate Ideas',
      'Research',
      'Plan',
      'Act',
      'Persist'
    ],
    dialogue: [
      { speaker: 'maya', text: 'People nearby need help. That could become a business idea.' },
      { speaker: 'jordan', text: 'We should research the need and make a plan before we spend.' }
    ],
    decision: {
      prompt: 'Which small business will you start?',
      options: [
        {
          id: 'yard-care',
          label: 'Yard Care',
          icon: '🌿',
          detail: 'Spend $60 on tools and help neighbors with outdoor work.',
          effects: { cash: -60, businessValue: 120, monthlyIncome: 80, monthlyExpenses: 20 },
          feedback: 'You found a neighborhood need and built a service around your time.'
        },
        {
          id: 'study-help',
          label: 'Study Help',
          icon: '📚',
          detail: 'Spend $30 on materials and use your skills to help students.',
          effects: { cash: -30, businessValue: 90, monthlyIncome: 60, monthlyExpenses: 10 },
          feedback: 'You turned a useful skill into a low-cost service business.'
        },
        {
          id: 'creative-kits',
          label: 'Creative Kits',
          icon: '🎨',
          detail: 'Spend $100 to make and sell activity kits from your ideas.',
          effects: { cash: -100, businessValue: 150, monthlyIncome: 90, monthlyExpenses: 35 },
          feedback: 'You created a product. Materials cost more, so sales must cover expenses.'
        }
      ]
    },
    event: {
      title: 'Slow First Week',
      prompt: 'Fewer customers arrive than planned. What will you do?',
      options: [
        {
          id: 'ask-customers',
          label: 'Research Again',
          icon: '🗣️',
          detail: 'Ask people what they need and improve the offer.',
          effects: { businessValue: 35, monthlyIncome: 20, cash: -10 },
          feedback: 'Customer research helped the business create more useful value.'
        },
        {
          id: 'small-test',
          label: 'Test One Change',
          icon: '🧪',
          detail: 'Try a smaller, lower-cost version before expanding.',
          effects: { businessValue: 20, monthlyExpenses: -10, monthlyIncome: 5 },
          feedback: 'A small test reduced costs while you learned what customers wanted.'
        },
        {
          id: 'quit-early',
          label: 'Stop Right Away',
          icon: '🛑',
          detail: 'Close after the first difficult week.',
          effects: { businessValue: -40, monthlyIncome: -20 },
          feedback: 'The first plan may need changes. Entrepreneurs learn, act, and persist.'
        }
      ]
    },
    takeaway: 'Entrepreneurs find a need, generate ideas, research, plan, act, and persist.'
  },
  {
    id: 9,
    title: 'Investing & Building Wealth',
    topic: 'Improve Your Long-Term Portfolio',
    location: 'WEALTH WORKSHOP',
    icon: '🏗️',
    brief: 'Review asset classes, balance risk and reward, and improve your portfolio.',
    concepts: [
      'Asset Classes',
      'Risk',
      'Reward',
      'Long-Term Investing',
      'Wealth Building',
      'Diversification'
    ],
    dialogue: [
      { speaker: 'sofia', text: 'Building wealth usually takes a plan and time, not one lucky pick.' },
      { speaker: 'kai', text: 'Different asset classes can react differently to the same event.' }
    ],
    decision: {
      prompt: 'How will you add $250 to your long-term portfolio?',
      options: [
        {
          id: 'asset-mix',
          label: 'Diversified Mix',
          icon: '🧩',
          detail: 'Spread the money across stocks, ETFs, and other assets.',
          effects: { cash: -250, stocks: 50, etfs: 125, otherAssets: 75 },
          feedback: 'You used several asset classes to balance risk and reward.'
        },
        {
          id: 'growth-heavy',
          label: 'Growth Heavy',
          icon: '📈',
          detail: 'Choose mostly stocks for more possible growth and bigger price swings.',
          effects: { cash: -250, stocks: 175, etfs: 75 },
          feedback: 'The portfolio has more growth potential and more short-term risk.'
        },
        {
          id: 'steady-step',
          label: 'Steady Step',
          icon: '🪜',
          detail: 'Invest $150 in a broad fund and keep $100 for future choices.',
          effects: { cash: -150, etfs: 150 },
          feedback: 'You added to the portfolio while keeping money available. Returns are not guaranteed.'
        }
      ]
    },
    event: {
      title: 'One Asset Jumps',
      prompt: 'One asset class rises quickly in this simulation. How do you react?',
      options: [
        {
          id: 'keep-allocation',
          label: 'Keep the Plan',
          icon: '🧭',
          detail: 'Stay with your diversified, long-term allocation.',
          effects: { investments: 0 },
          feedback: 'You followed the plan instead of assuming the recent winner will keep winning.'
        },
        {
          id: 'rebalance-portfolio',
          label: 'Rebalance',
          icon: '⚖️',
          detail: 'Move $20 from the larger stock position into ETFs.',
          effects: { stocks: -20, etfs: 20 },
          feedback: 'Rebalancing returned the portfolio to its chosen risk level.'
        },
        {
          id: 'chase-winner',
          label: 'Chase the Winner',
          icon: '🔥',
          detail: 'Move another $100 into the asset only because it just rose.',
          effects: { cash: -100, stocks: 100 },
          feedback: 'Recent gains do not guarantee future gains. Concentration increased your risk.'
        }
      ]
    },
    takeaway: 'Wealth building connects asset classes, diversification, risk, reward, and long-term investing.'
  },
  {
    id: 10,
    title: 'Budgeting & Goal Setting',
    topic: 'Plan Today for a Bigger Tomorrow',
    location: 'GOAL GARDEN',
    icon: '🎯',
    brief: 'Use the 50/30/20 Rule and build a SMART financial goal.',
    principle: {
      reference: 'Proverbs 21:5 (NIV)',
      text: 'The plans of the diligent lead to profit as surely as haste leads to poverty.'
    },
    concepts: [
      'Budget',
      '50/30/20 Rule',
      'Needs (50%)',
      'Wants (30%)',
      'Savings & Goals (20%)',
      'SMART: Specific, Measurable, Achievable, Relevant, Time-Bound'
    ],
    dialogue: [
      { speaker: 'jordan', text: 'A budget helps us decide how to spend, save, and give.' },
      { speaker: 'maya', text: 'The 50/30/20 Rule is a guide we can adjust for our goals.' }
    ],
    decision: {
      prompt: 'You have $200. Choose a budget for this month.',
      options: [
        {
          id: 'fifty-thirty-twenty',
          label: '50 / 30 / 20',
          icon: '🥧',
          detail: '$100 Needs • $60 Wants • $40 Savings & Goals',
          effects: { checking: -200, monthlyExpenses: 160, savings: 40 },
          feedback: 'You used the 50/30/20 Rule to give every dollar a job.'
        },
        {
          id: 'goal-sprint',
          label: 'Goal Sprint',
          icon: '🏁',
          detail: '$120 Needs • $20 Wants • $60 Savings & Goals',
          effects: { checking: -200, monthlyExpenses: 140, savings: 60 },
          feedback: 'You adjusted the guide to save faster while keeping needs covered.'
        },
        {
          id: 'wants-heavy',
          label: 'More Wants',
          icon: '🎮',
          detail: '$100 Needs • $80 Wants • $20 Savings & Goals',
          effects: { checking: -200, monthlyExpenses: 180, savings: 20 },
          feedback: 'More wants left less for your goal. A budget makes that tradeoff visible.'
        }
      ]
    },
    event: {
      title: 'Make the Goal SMART',
      prompt: 'Which goal is Specific, Measurable, Achievable, Relevant, and Time-Bound?',
      options: [
        {
          id: 'smart-goal',
          label: 'Save $120 in 6 Months',
          icon: '✅',
          detail: 'Save $20 each month for a $120 learning tablet in six months.',
          effects: { checking: -20, savings: 20 },
          feedback: 'This goal names the item, amount, monthly action, and deadline. It is SMART.'
        },
        {
          id: 'too-fast-goal',
          label: 'Save $500 Next Week',
          icon: '⚡',
          detail: 'Try to save more than this budget can support in one week.',
          effects: { savings: 0 },
          feedback: 'The goal is specific and time-bound, but it is not achievable with this budget.'
        },
        {
          id: 'vague-goal',
          label: 'Save More Someday',
          icon: '☁️',
          detail: 'Do not choose an amount, action, or deadline.',
          effects: { savings: 0 },
          feedback: 'The idea needs an amount and deadline before progress can be measured.'
        }
      ]
    },
    takeaway: 'A budget helps you make better choices. Set SMART goals, take small steps, and track progress.'
  }
];
