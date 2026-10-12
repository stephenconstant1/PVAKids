export const missions17to22 = [
  {
    id: 17,
    title: "Market Moves",
    topic: "Supply, Demand & Why Prices Change",
    location: "Community Market",
    icon: "🏪",
    brief:
      "Shop as a consumer, then run a booth. Watch supply, demand, competition, and scarcity move prices.",
    concepts: ["supply", "demand", "competition", "scarcity"],
    dialogue: [
      {
        speaker: "maya",
        text: "Only three art kits are left, and a crowd wants them. That scarcity may push the price up."
      },
      {
        speaker: "jordan",
        text: "Let’s compare choices as shoppers before we set a fair price at our own booth."
      }
    ],
    decision: {
      prompt:
        "You need an art kit, but high demand and low supply raised its price from $25 to $45. What do you do as a consumer?",
      options: [
        {
          id: "choose-substitute",
          label: "Choose a $22 substitute",
          icon: "🔁",
          detail: "Compare quality and buy a similar kit from a competing seller.",
          effects: { cash: -22 },
          feedback:
            "Smart comparison. Competition gives buyers alternatives, and substitutes can reduce pressure on a scarce item."
        },
        {
          id: "wait-for-supply",
          label: "Wait for restock",
          icon: "⏳",
          detail: "Keep your money and check again when supply may be higher.",
          effects: { cash: 0 },
          feedback:
            "Waiting protects your cash. If supply rises or demand cools, the price may fall, though that outcome is not guaranteed."
        },
        {
          id: "buy-scarce-kit",
          label: "Pay the $45 price",
          icon: "🛍️",
          detail: "Get the scarce kit now because you need it today.",
          effects: { cash: -45 },
          feedback:
            "You met an urgent need, but scarcity cost you more. High demand with low supply often puts upward pressure on prices."
        }
      ]
    },
    event: {
      title: "Booth Owner Challenge",
      prompt:
        "Now you own the market booth. Demand jumps, your supply is low, and a competitor opens nearby. How will you respond?",
      options: [
        {
          id: "restock-fair-price",
          label: "Restock and price fairly",
          icon: "📦",
          detail: "Spend $80 on supply and keep a competitive price.",
          effects: { cash: -80, businessValue: 100, monthlyIncome: 12 },
          feedback:
            "More supply helps you serve demand. A competitive price can build repeat business, though sales can still change."
        },
        {
          id: "small-price-change",
          label: "Raise price a little",
          icon: "🏷️",
          detail: "Use a small increase while supplies are limited.",
          effects: { cash: 45, businessValue: 15, monthlyIncome: 4 },
          feedback:
            "A small price change responds to scarcity while considering competition. Customers still decide whether the value is worth it."
        },
        {
          id: "double-price",
          label: "Double the price",
          icon: "⬆️",
          detail: "Charge much more while people want the item.",
          effects: { cash: 80, businessValue: -45, monthlyIncome: -6 },
          feedback:
            "The booth makes more cash today, but customers may switch to the competitor. Demand for your booth can fall when the price feels too high."
        }
      ]
    },
    takeaway:
      "Prices react to supply, demand, competition, and scarcity. Consumers can compare or wait, while owners balance price, supply, and customer value."
  },
  {
    id: 18,
    title: "The Shrinking Basket",
    topic: "Inflation & the Changing Value of Money",
    location: "Time-Travel Grocery",
    icon: "🛒",
    brief:
      "Compare the same shopping basket across several years and protect your purchasing power as prices change.",
    concepts: [
      "inflation",
      "purchasing power",
      "price increases",
      "real value of money"
    ],
    dialogue: [
      {
        speaker: "sofia",
        text: "The basket still holds the same food, but it costs more this year. That is a clue about inflation."
      },
      {
        speaker: "kai",
        text: "My $100 balance did not shrink, but it buys less. Its purchasing power changed."
      }
    ],
    decision: {
      prompt:
        "A weekly basket rose from $80 to $92 while your income stayed the same. Which move best prepares your plan?",
      options: [
        {
          id: "build-earning-skill",
          label: "Build an earning skill",
          icon: "🧰",
          detail: "Spend $40 on training that may help you earn $10 more each month.",
          effects: { cash: -40, monthlyIncome: 10, businessValue: 10 },
          feedback:
            "Growing income can help answer price increases. Training has a cost, and the value depends on using the skill."
        },
        {
          id: "long-term-invest",
          label: "Invest for long-term goals",
          icon: "📈",
          detail: "Move $60 from cash into a diversified long-term investment.",
          effects: { cash: -60, investments: 60 },
          feedback:
            "Long-term investing may help money grow faster than inflation, but returns can rise or fall and are never guaranteed."
        },
        {
          id: "ignore-new-price",
          label: "Keep the old plan",
          icon: "🙈",
          detail: "Make no change even though the basket costs $12 more each week.",
          effects: { monthlyExpenses: 12 },
          feedback:
            "The new cost squeezes your budget. Inflation reduces the real value of money when income and planning do not keep pace."
        }
      ]
    },
    event: {
      title: "Another Price Increase",
      prompt:
        "Transportation costs rise and your basket gets $8 more expensive. What adjustment will you make?",
      options: [
        {
          id: "swap-list",
          label: "Swap two items",
          icon: "🥕",
          detail: "Choose lower-cost alternatives with similar usefulness.",
          effects: { monthlyExpenses: -8 },
          feedback:
            "Substituting thoughtfully restores some purchasing power without using debt. Check quality and needs as well as price."
        },
        {
          id: "ask-more-hours",
          label: "Earn a little more",
          icon: "🕒",
          detail: "Use extra time to add $8 to monthly income.",
          effects: { monthlyIncome: 8 },
          feedback:
            "Higher income can offset inflation, but extra work uses time. A strong plan considers both money and time."
        },
        {
          id: "charge-the-gap",
          label: "Charge every increase",
          icon: "💳",
          detail: "Use debt for the higher cost and postpone repayment.",
          effects: { cash: 8, debt: 10, monthlyExpenses: 2 },
          feedback:
            "Debt hides the gap today but adds repayment and interest. Repeating this can make inflation harder to manage."
        }
      ]
    },
    takeaway:
      "Inflation means broad price increases over time. When prices rise faster than income, money loses purchasing power and its real value falls."
  },
  {
    id: 19,
    title: "Money in Motion",
    topic: "Banks, Interest & How Money Moves",
    location: "Money Ops Bank",
    icon: "🏦",
    brief:
      "Move a paycheck through bank accounts, compare interest, and decide whether a loan is worth its total cost.",
    concepts: [
      "deposits",
      "savings accounts",
      "loans",
      "interest",
      "banking",
      "money movement"
    ],
    dialogue: [
      {
        speaker: "jordan",
        text: "A deposit moves money into an account. Checking is useful for spending, while savings can earn interest."
      },
      {
        speaker: "maya",
        text: "Banks may also lend money and charge interest. We should compare what we receive with what we repay."
      }
    ],
    decision: {
      prompt: "You receive $200 in cash. Where will you deposit it?",
      options: [
        {
          id: "split-deposit",
          label: "$50 checking, $150 savings",
          icon: "⚖️",
          detail: "Keep spending money available and place the rest in an interest-earning savings account.",
          effects: { cash: -200, checking: 50, savings: 150 },
          feedback:
            "The split supports spending and saving. Account rates, fees, access, and protections should all be compared."
        },
        {
          id: "checking-deposit",
          label: "All in checking",
          icon: "💳",
          detail: "Keep all $200 ready for bills and purchases.",
          effects: { cash: -200, checking: 200 },
          feedback:
            "Checking keeps money easy to use, but it may earn little or no interest. Easy access can also make spending tempting."
        },
        {
          id: "hold-cash",
          label: "Keep all the cash",
          icon: "💵",
          detail: "Do not make a bank deposit today.",
          effects: { cash: 0 },
          feedback:
            "Cash is immediate, but it cannot earn account interest and can be harder to replace if lost. Banking gives money other ways to move."
        }
      ]
    },
    event: {
      title: "The $100 Tool",
      prompt:
        "A tool could help you earn money. The bank offers a $100 loan with $110 total repayment. How will you get it?",
      options: [
        {
          id: "use-savings",
          label: "Use $100 savings",
          icon: "🐷",
          detail: "Buy the tool without interest, leaving less savings for emergencies.",
          effects: { savings: -100, property: 100, monthlyIncome: 8 },
          feedback:
            "You avoid loan interest, but your savings cushion becomes smaller. The tool still must produce value to justify the purchase."
        },
        {
          id: "take-bank-loan",
          label: "Accept the $100 loan",
          icon: "📝",
          detail: "Receive $100 now and owe $110 after interest.",
          effects: { cash: 100, loans: 110, monthlyIncome: 8 },
          feedback:
            "The loan moves bank money to you now, but interest raises the total repayment to $110. Income from the tool is possible, not certain."
        },
        {
          id: "wait-and-save",
          label: "Wait and save",
          icon: "📅",
          detail: "Delay the purchase and add $25 to savings first.",
          effects: { cash: -25, savings: 25 },
          feedback:
            "Waiting avoids a new loan and strengthens savings, but you delay any opportunity the tool may create."
        }
      ]
    },
    takeaway:
      "Banking moves money through deposits, savings accounts, and loans. Savers may earn interest; borrowers pay interest, so compare access, fees, rates, and total cost."
  },
  {
    id: 20,
    title: "Credit Signal",
    topic: "Credit Scores & Building Strong Credit",
    location: "Credit Control Room",
    icon: "📊",
    brief:
      "Guide a live credit-score meter by making payment, balance, and application decisions.",
    concepts: [
      "payment history",
      "credit usage",
      "length of credit",
      "new credit",
      "responsible borrowing"
    ],
    dialogue: [
      {
        speaker: "kai",
        text: "A credit score is a signal built from borrowing behavior. It is not extra money to spend."
      },
      {
        speaker: "sofia",
        text: "Payment history matters a lot, and using too much available credit can raise risk."
      }
    ],
    decision: {
      prompt:
        "An $80 card balance is due. What action will you take before the due date?",
      options: [
        {
          id: "pay-full-on-time",
          label: "Pay $80 on time",
          icon: "✅",
          detail: "Pay the full statement balance before the due date.",
          effects: { cash: -80, debt: -80, creditScore: 18 },
          feedback:
            "On-time payment strengthens payment history and lowering the balance reduces credit usage. Actual score changes vary by credit file."
        },
        {
          id: "pay-minimum-on-time",
          label: "Pay $20 on time",
          icon: "🟡",
          detail: "Meet the minimum, but carry most of the balance.",
          effects: { cash: -20, debt: -15, monthlyExpenses: 5, creditScore: 4 },
          feedback:
            "Paying on time protects payment history, but a carried balance can add interest and keep credit usage higher."
        },
        {
          id: "miss-payment",
          label: "Miss the payment",
          icon: "⚠️",
          detail: "Spend nothing now and let a late charge join the balance.",
          effects: { debt: 12, creditScore: -35 },
          feedback:
            "A missed payment can hurt payment history and add fees. The exact score impact depends on the account and credit report."
        }
      ]
    },
    event: {
      title: "New Credit Offer",
      prompt:
        "A store offers 15% off today if you open a new card. Your current card already has a balance. What do you do?",
      options: [
        {
          id: "decline-offer",
          label: "Decline for now",
          icon: "🛑",
          detail: "Avoid a new application while you manage the account you have.",
          effects: { creditScore: 0 },
          feedback:
            "Declining avoids new credit and another spending limit. Keeping an older account healthy can support length of credit."
        },
        {
          id: "pay-down-first",
          label: "Pay down current debt",
          icon: "📉",
          detail: "Use $50 to lower the balance instead of chasing the discount.",
          effects: { cash: -50, debt: -50, creditScore: 12 },
          feedback:
            "Lower credit usage can support a stronger score. A lower balance also reduces the amount that may collect interest."
        },
        {
          id: "open-and-spend",
          label: "Open it and spend $60",
          icon: "🛍️",
          detail: "Apply for new credit and add another balance for the discount.",
          effects: { cash: 9, debt: 60, creditScore: -10 },
          feedback:
            "The $9 discount is small beside $60 of new debt. New credit and higher usage can affect the score, and exact effects vary."
        }
      ]
    },
    takeaway:
      "Strong credit grows from responsible borrowing over time: protect payment history, manage credit usage, preserve length of credit, and apply for new credit thoughtfully."
  },
  {
    id: 21,
    title: "Debt Decoder",
    topic: "Debt & Interest — What Borrowing Really Costs",
    location: "Payoff Strategy Lab",
    icon: "🧮",
    brief:
      "Test payments on a $600 balance, compare payoff strategies, and uncover the total borrowing cost.",
    concepts: [
      "principal",
      "interest",
      "APR",
      "minimum payments",
      "total borrowing cost",
      "good vs. risky debt",
      "debt snowball",
      "debt avalanche"
    ],
    dialogue: [
      {
        speaker: "maya",
        text: "Principal is what was borrowed. Interest is the cost of borrowing, and APR helps show that yearly cost."
      },
      {
        speaker: "jordan",
        text: "A minimum payment keeps the account moving, but a larger payment can shorten payoff time and reduce total borrowing cost."
      }
    ],
    decision: {
      prompt:
        "Your card has $600 of principal at 24% APR. The minimum is $25. What payment do you choose this month?",
      options: [
        {
          id: "minimum-payment",
          label: "Pay the $25 minimum",
          icon: "🐢",
          detail: "Stay current, but reduce the balance slowly after interest.",
          effects: { cash: -25, debt: -13, monthlyExpenses: 12 },
          feedback:
            "The minimum keeps the payment current, but interest uses part of it. Slow payoff generally creates a higher total borrowing cost."
        },
        {
          id: "larger-payment",
          label: "Pay $75",
          icon: "🚀",
          detail: "Put more toward the balance now.",
          effects: { cash: -75, debt: -63, monthlyExpenses: 12 },
          feedback:
            "The same month of interest still applies, but more of the larger payment reduces principal. That can shorten payoff time."
        },
        {
          id: "add-new-purchase",
          label: "Pay $25, then charge $60",
          icon: "🛒",
          detail: "Make the minimum and add a want to the card.",
          effects: { cash: -25, debt: 47, monthlyExpenses: 12 },
          feedback:
            "The new purchase is larger than the principal you reduced, so debt grows. Borrowing for wants at a high APR is risky debt."
        }
      ]
    },
    event: {
      title: "Choose a Payoff Route",
      prompt:
        "You find $70 for two debts: a small low-APR balance and a larger high-APR balance. Which strategy do you use?",
      options: [
        {
          id: "snowball-route",
          label: "Debt snowball",
          icon: "❄️",
          detail: "Target the smallest balance first for a quicker payoff win.",
          effects: { cash: -70, debt: -70, monthlyExpenses: -2 },
          feedback:
            "The debt snowball can build motivation by clearing a small balance first, though it may not minimize interest."
        },
        {
          id: "avalanche-route",
          label: "Debt avalanche",
          icon: "🏔️",
          detail: "Target the highest-APR balance first to attack costly interest.",
          effects: { cash: -70, debt: -70, monthlyExpenses: -4 },
          feedback:
            "The debt avalanche usually reduces interest cost when payments and timing stay equal, but it may take longer to close an account."
        },
        {
          id: "split-route",
          label: "Split the payment",
          icon: "↔️",
          detail: "Pay $35 toward each debt after all minimums are covered.",
          effects: { cash: -70, debt: -70, monthlyExpenses: -1 },
          feedback:
            "Both balances fall, but splitting extra money may delay the main benefit of either strategy. Consistency still matters."
        }
      ]
    },
    takeaway:
      "Borrowing cost includes principal plus interest. Compare APR, minimum payments, payoff time, and total borrowing cost before deciding whether debt is useful or risky."
  },
  {
    id: 22,
    title: "Protection Plan",
    topic: "Insurance & Protecting What You Build",
    location: "Risk Response Center",
    icon: "🛡️",
    brief:
      "Build a protection plan, then respond when a surprise loss tests the choice between insured and uninsured risk.",
    concepts: [
      "risk protection",
      "auto insurance",
      "health insurance",
      "property/renters insurance",
      "life insurance",
      "premium",
      "deductible",
      "claim"
    ],
    dialogue: [
      {
        speaker: "sofia",
        text: "Insurance transfers some financial risk. We pay a premium, and covered claims still may have a deductible."
      },
      {
        speaker: "kai",
        text: "The right protection depends on what could be lost, who depends on us, the policy rules, and what we can afford."
      }
    ],
    decision: {
      prompt:
        "You rent an apartment and drive to work. Which monthly protection plan will you choose?",
      options: [
        {
          id: "auto-and-renters",
          label: "Auto + renters coverage",
          icon: "🚗",
          detail: "Pay $45 for two policies after checking limits, exclusions, and deductibles.",
          effects: { cash: -45, insuranceCosts: 45 },
          feedback:
            "This plan protects two major risks, within policy terms. A premium buys coverage, but claims may still require a deductible."
        },
        {
          id: "auto-only",
          label: "Auto coverage only",
          icon: "🚙",
          detail: "Pay $28 for required vehicle protection and keep apartment property risk yourself.",
          effects: { cash: -28, insuranceCosts: 28 },
          feedback:
            "The vehicle has protection, but belongings remain exposed. Lower premiums often mean accepting more risk elsewhere."
        },
        {
          id: "skip-coverage",
          label: "Skip both policies",
          icon: "🎲",
          detail: "Pay no premium and accept the full financial risk.",
          effects: { insuranceCosts: 0 },
          feedback:
            "You save the premium today, but an uninsured loss could be much larger. Auto coverage also may be legally required."
        }
      ]
    },
    event: {
      title: "Pipe-Burst Alert",
      prompt:
        "A pipe bursts and damages $650 of belongings. How will you handle the loss?",
      options: [
        {
          id: "covered-claim",
          label: "File a covered claim",
          icon: "📄",
          detail: "If your renters policy covers the event, pay its $100 deductible.",
          effects: { cash: -100, property: -50 },
          feedback:
            "Coverage limits the loss in this simulation after the deductible. Real claims depend on policy limits, exclusions, documentation, and approval."
        },
        {
          id: "pay-uninsured-loss",
          label: "Pay the full loss",
          icon: "💸",
          detail: "Replace damaged belongings without insurance support.",
          effects: { cash: -650, property: -150 },
          feedback:
            "Without applicable coverage, you carry the full loss. Avoiding a smaller premium created exposure to a much larger cost."
        },
        {
          id: "borrow-for-loss",
          label: "Borrow for repairs",
          icon: "🧾",
          detail: "Use $650 of borrowing because cash is not available.",
          effects: { cash: 650, debt: 710, property: -150 },
          feedback:
            "Borrowing restores cash for replacement, but $60 of financing cost raises the total burden. Loan terms would determine the real cost."
        }
      ]
    },
    takeaway:
      "Insurance is risk protection, not a promise that every loss is paid. Compare premiums, deductibles, limits, and exclusions across auto, health, property/renters, and life insurance."
  }
];
