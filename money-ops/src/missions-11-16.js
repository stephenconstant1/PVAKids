export const missions11to16 = [
  {
    id: 11,
    title: 'Stocks & Owning a Piece of a Company',
    topic: 'A Share Is a Small Piece of Ownership',
    location: 'OWNERSHIP EXCHANGE',
    icon: '🏢',
    brief: 'Research fictional companies, buy shares, and watch stock prices rise or fall with new information.',
    concepts: [
      'Stock',
      'Shares',
      'Ownership',
      'Why Companies Issue Stock',
      'Stock-Price Gains/Losses'
    ],
    dialogue: [
      { speaker: 'maya', text: 'A stock is a small piece of ownership in a company. Each piece is called a share.' },
      { speaker: 'jordan', text: 'Companies issue stock to raise money, but a share price can rise or fall after we buy.' }
    ],
    decision: {
      prompt: 'Research the company cards. Which company will receive your $100 investment?',
      options: [
        {
          id: 'buy-foods-shares',
          label: 'Neighborhood Foods',
          icon: '🥕',
          detail: 'Buy shares in a grocery company with steady demand, modest growth, and manageable debt.',
          effects: { cash: -100, stocks: 100 },
          feedback: 'You bought shares and became a part-owner. Steadier demand can still come with stock-price gains or losses.'
        },
        {
          id: 'buy-sunline-shares',
          label: 'Sunline Energy',
          icon: '☀️',
          detail: 'Buy shares in a growing solar company whose price has made bigger moves.',
          effects: { cash: -100, stocks: 100 },
          feedback: 'You chose more possible growth with larger price swings. A promising industry does not guarantee a gain.'
        },
        {
          id: 'buy-playworks-shares',
          label: 'PlayWorks Studio',
          icon: '🎮',
          detail: 'Buy shares in a creative company whose results depend heavily on its next game launch.',
          effects: { cash: -100, stocks: 100 },
          feedback: 'You now own shares in a launch-dependent business. Research helps, but the future price remains uncertain.'
        }
      ]
    },
    event: {
      title: 'Supplier Delay',
      prompt: 'A supplier delay sends your company’s share price down 15% in this simulation. What will you do?',
      options: [
        {
          id: 'hold-and-research',
          label: 'Hold and Research',
          icon: '🔎',
          detail: 'Keep the shares while checking whether the problem is temporary or serious.',
          effects: { stocks: -15 },
          feedback: 'Your stock is worth less today. Holding avoids a rushed sale, but the price may still rise or fall later.'
        },
        {
          id: 'sell-after-drop',
          label: 'Sell After the Drop',
          icon: '💸',
          detail: 'Sell the $100 position for its new simulated value of $85.',
          effects: { stocks: -100, cash: 85 },
          feedback: 'Selling turned the price drop into a $15 loss. A lower price does not tell the whole story by itself.'
        },
        {
          id: 'add-one-share',
          label: 'Add One Share',
          icon: '➕',
          detail: 'Accept more risk and add $25 while the original position is down.',
          effects: { cash: -25, stocks: 10 },
          feedback: 'The new share added value after the original holding fell. A lower price can fall again, so this is not a guaranteed bargain.'
        }
      ]
    },
    takeaway: 'A stock is ownership in a company. Shares can gain or lose value, so research the business and understand the risk before investing.'
  },
  {
    id: 12,
    title: 'Compound Interest & the Power of Time',
    topic: 'Money Can Earn Money Over Time',
    location: 'TIME MACHINE LAB',
    icon: '⏳',
    brief: 'Change the starting amount, monthly contribution, simulated rate of return, and years invested to see growth over time.',
    concepts: [
      'Principal',
      'Interest',
      'Interest on Interest',
      'Time',
      'Consistent Contributions',
      'Rate of Return'
    ],
    dialogue: [
      { speaker: 'sofia', text: 'Principal is the money we start with. Interest is growth earned on that money.' },
      { speaker: 'kai', text: 'With compound interest, earlier interest can earn interest too. Time and steady contributions can make a big difference.' }
    ],
    decision: {
      prompt: 'Set the time machine. Which long-term plan will you begin today?',
      options: [
        {
          id: 'start-small-now',
          label: 'Start Small Now',
          icon: '🌱',
          detail: '$60 principal + $10 monthly • 5% simulated return • 20 years',
          effects: { cash: -70, investments: 70 },
          feedback: 'You invested the principal and first contribution. Starting earlier gives compounding more time, but the simulated rate is not guaranteed.'
        },
        {
          id: 'build-consistently',
          label: 'Add Consistently',
          icon: '📅',
          detail: '$30 principal + $20 monthly • 5% simulated return • 20 years',
          effects: { cash: -50, investments: 50 },
          feedback: 'Regular contributions add new principal for possible growth. Actual returns can be higher, lower, or negative.'
        },
        {
          id: 'start-bigger-later',
          label: 'Bigger, But Later',
          icon: '⏰',
          detail: '$120 principal + $0 monthly • 5% simulated return • 10 years',
          effects: { cash: -120, investments: 120 },
          feedback: 'A larger start helps, but fewer years means less time for interest on interest. The time-machine result is only a projection.'
        }
      ]
    },
    event: {
      title: 'A Negative Year',
      prompt: 'The first simulated year has a negative return. How will you respond?',
      options: [
        {
          id: 'continue-small-contribution',
          label: 'Keep Contributing',
          icon: '🔁',
          detail: 'Add the next $10 contribution while the existing investment loses some value.',
          effects: { cash: -10, investments: 7 },
          feedback: 'The contribution outweighed this small simulated decline. Consistency helps a plan, but it cannot guarantee a positive return.'
        },
        {
          id: 'pause-and-review',
          label: 'Pause and Review',
          icon: '⏸️',
          detail: 'Make no new contribution while you review the goal, rate, and time horizon.',
          effects: { investments: -3 },
          feedback: 'The investment lost some value during the pause. Reviewing the plan can prevent a rushed choice.'
        },
        {
          id: 'withdraw-early',
          label: 'Withdraw Early',
          icon: '🚪',
          detail: 'Sell $50 of the investment after the decline and receive $47.',
          effects: { investments: -50, cash: 47 },
          feedback: 'Withdrawing locked in a $3 loss and removed money that no longer has time to compound.'
        }
      ]
    },
    takeaway: 'Compound interest is interest on principal and earlier interest. More time and consistent contributions can increase potential growth, but returns are never guaranteed.'
  },
  {
    id: 13,
    title: 'Risk, Reward & Diversification',
    topic: 'Do Not Put Everything in One Basket',
    location: 'PORTFOLIO WEATHER STATION',
    icon: '🧺',
    brief: 'Build a concentrated or diversified portfolio, then watch a market shock affect each mix differently.',
    concepts: [
      'Risk',
      'Potential Return',
      'Concentration',
      'Diversification'
    ],
    dialogue: [
      { speaker: 'jordan', text: 'One exciting stock could climb fast, but one problem could also hit our whole portfolio.' },
      { speaker: 'maya', text: 'Diversification spreads money across investments. It can reduce one-company damage, but it cannot prevent every loss.' }
    ],
    decision: {
      prompt: 'How will you divide $150 before the market-shock test?',
      options: [
        {
          id: 'high-concentration',
          label: 'One Big Basket',
          icon: '🎯',
          detail: 'Put $120 in one stock, $15 in an ETF, and $15 in another asset.',
          effects: { cash: -150, stocks: 120, etfs: 15, otherAssets: 15 },
          feedback: 'Most of the portfolio depends on one company. Concentration raises the effect of that company’s gains or losses.'
        },
        {
          id: 'three-way-diversification',
          label: 'Three Equal Baskets',
          icon: '🧩',
          detail: 'Put $50 in stocks, $50 in ETFs, and $50 in other assets.',
          effects: { cash: -150, stocks: 50, etfs: 50, otherAssets: 50 },
          feedback: 'You spread risk across several investments. Diversification reduces concentration, though the full portfolio can still fall.'
        },
        {
          id: 'lower-stock-mix',
          label: 'Lower Stock Mix',
          icon: '⚖️',
          detail: 'Put $30 in stocks, $60 in ETFs, and $60 in other assets.',
          effects: { cash: -150, stocks: 30, etfs: 60, otherAssets: 60 },
          feedback: 'You accepted less single-stock exposure and a different balance of risk and potential return.'
        }
      ]
    },
    event: {
      title: 'Energy Stock Shock',
      prompt: 'Energy stocks fall sharply while food and other industries move much less. Choose a response.',
      options: [
        {
          id: 'experience-concentrated-hit',
          label: 'Stay Concentrated',
          icon: '🌩️',
          detail: 'Keep the portfolio centered on the falling stock and absorb the larger move.',
          effects: { stocks: -36 },
          feedback: 'Concentration made one industry’s shock more powerful. Bigger potential rewards usually come with bigger risks.'
        },
        {
          id: 'experience-diversified-hit',
          label: 'Use the Mixed Portfolio',
          icon: '🌦️',
          detail: 'Let several holdings share the impact of the market shock.',
          effects: { stocks: -12, etfs: -5, otherAssets: 2 },
          feedback: 'Some holdings fell while another rose. Diversification reduced the damage, but it did not erase the loss.'
        },
        {
          id: 'rebalance-after-shock',
          label: 'Rebalance the Mix',
          icon: '🔄',
          detail: 'Move $20 from concentrated stocks into broader holdings.',
          effects: { stocks: -20, etfs: 10, otherAssets: 10 },
          feedback: 'Rebalancing restored the target mix. It manages concentration; it does not promise a better return.'
        }
      ]
    },
    takeaway: 'Risk and potential return are connected. Diversification reduces concentration by spreading money across investments, but every portfolio can lose value.'
  },
  {
    id: 14,
    title: 'ETFs, Index Funds & Building a Portfolio',
    topic: 'One Basket Can Hold Many Investments',
    location: 'PORTFOLIO WORKSHOP',
    icon: '🧺',
    brief: 'Match each fund term, choose an asset allocation, and build a portfolio from investment baskets.',
    concepts: [
      'ETF',
      'Index',
      'Index Fund',
      'Portfolio',
      'Diversification',
      'Asset Allocation'
    ],
    dialogue: [
      { speaker: 'kai', text: 'An index is a list used to measure a market. An index fund follows an index.' },
      { speaker: 'sofia', text: 'An ETF is a basket we can trade like a stock. Our asset allocation decides how we divide the whole portfolio.' }
    ],
    decision: {
      prompt: 'Choose an asset allocation for the next $120 in your portfolio.',
      options: [
        {
          id: 'broad-index-etf',
          label: 'Broad Index ETF',
          icon: '🌎',
          detail: 'Put $120 into an ETF that follows a broad fictional company index.',
          effects: { cash: -120, etfs: 120 },
          feedback: 'One ETF gave you pieces of many companies. A broad basket supports diversification but can still lose value.'
        },
        {
          id: 'mixed-asset-allocation',
          label: 'Mixed Allocation',
          icon: '🧩',
          detail: 'Put $90 in broad ETFs and $30 in other assets.',
          effects: { cash: -120, etfs: 90, otherAssets: 30 },
          feedback: 'Your asset allocation uses more than one kind of holding. The mix should connect to the goal, time, and risk.'
        },
        {
          id: 'single-sector-etf',
          label: 'One Sector ETF',
          icon: '☀️',
          detail: 'Put $120 into an ETF containing only fictional solar companies.',
          effects: { cash: -120, etfs: 120 },
          feedback: 'This ETF holds several companies, but all share one industry risk. More holdings do not always mean broad diversification.'
        }
      ]
    },
    event: {
      title: 'One Sector Falls',
      prompt: 'A technology problem hurts one industry in the simulated market. What will you do?',
      options: [
        {
          id: 'hold-broad-allocation',
          label: 'Hold the Broad Mix',
          icon: '🌐',
          detail: 'Keep the diversified allocation while its market value moves down slightly.',
          effects: { etfs: -12 },
          feedback: 'The broad fund still fell, but many holdings shared the effect. Diversification reduces some risk; it does not remove it.'
        },
        {
          id: 'rebalance-allocation',
          label: 'Rebalance',
          icon: '⚖️',
          detail: 'Move $20 from the oversized ETF position into another asset group.',
          effects: { etfs: -20, otherAssets: 20 },
          feedback: 'Rebalancing returned the portfolio to its chosen asset allocation without predicting the next market move.'
        },
        {
          id: 'sell-etf-after-drop',
          label: 'Sell After the Drop',
          icon: '💸',
          detail: 'Sell $80 of ETF holdings after the simulated loss and receive $68.',
          effects: { etfs: -80, cash: 68 },
          feedback: 'The sale locked in a $12 loss. Check the fund, goal, and time horizon before reacting to one event.'
        }
      ]
    },
    takeaway: 'An index measures a market, an index fund follows an index, and an ETF is a tradable basket. Asset allocation shapes the risk in a portfolio.'
  },
  {
    id: 15,
    title: 'The Stock Market & How Markets Work',
    topic: 'Buyers and Sellers Meet at an Exchange',
    location: 'MARKET MATCH FLOOR',
    icon: '🔔',
    brief: 'Match bids with offers and watch supply and demand move a fictional market price.',
    concepts: [
      'Buyers',
      'Sellers',
      'Exchanges',
      'Market Prices',
      'Bids',
      'Offers',
      'Supply',
      'Demand',
      'Market Movement'
    ],
    dialogue: [
      { speaker: 'maya', text: 'A bid is what a buyer will pay. An offer is what a seller will accept.' },
      { speaker: 'jordan', text: 'When they match at an exchange, a trade happens. The latest matched trade becomes the market price.' }
    ],
    decision: {
      prompt: 'The best offer is $48. Which bid will you place in this simulated exchange?',
      options: [
        {
          id: 'match-the-offer',
          label: 'Bid $48',
          icon: '🤝',
          detail: 'Match the seller’s $48 offer so the trade happens now.',
          effects: { cash: -48, stocks: 48 },
          feedback: 'The bid met the offer, so buyers and sellers completed a trade at a $48 market price.'
        },
        {
          id: 'bid-below-offer',
          label: 'Bid $45',
          icon: '⏳',
          detail: 'Offer less than the seller will accept and wait for a match.',
          effects: { cash: 0, stocks: 0 },
          feedback: 'No seller accepted the $45 bid, so no trade happened. A bid is a request, not a guaranteed purchase.'
        },
        {
          id: 'accept-higher-offer',
          label: 'Pay the New $50 Offer',
          icon: '⚡',
          detail: 'Accept the higher offer after another buyer increases demand.',
          effects: { cash: -50, stocks: 50 },
          feedback: 'More buyer demand helped move the matched market price up. The stock can still move either way next.'
        }
      ]
    },
    event: {
      title: 'Crowded Order Board',
      prompt: 'A popular product announcement brings many new buyers but few new sellers. What happens next?',
      options: [
        {
          id: 'buy-at-rising-offer',
          label: 'Buy at $60',
          icon: '⬆️',
          detail: 'Match the new $60 offer while buyer demand is high and share supply is limited.',
          effects: { cash: -60, stocks: 60 },
          feedback: 'The new trade set a higher market price. More demand than supply can push prices up, but it does not guarantee future gains.'
        },
        {
          id: 'keep-limit-bid',
          label: 'Keep a $50 Bid',
          icon: '🛡️',
          detail: 'Wait instead of matching the rising offer.',
          effects: { cash: 0, stocks: 0 },
          feedback: 'Your bid stayed open, but no seller matched it. Waiting protects cash while also risking a missed trade.'
        },
        {
          id: 'sell-to-new-buyer',
          label: 'Sell One Holding',
          icon: '📤',
          detail: 'Sell $40 of an existing holding to a buyer for $55 in the simulation.',
          effects: { stocks: -40, cash: 55 },
          feedback: 'Strong demand let you sell at a simulated gain. A different balance of buyers and sellers could move the next price down.'
        }
      ]
    },
    takeaway: 'Exchanges match buyers and sellers. Bids, offers, supply, and demand help create market prices and explain why prices move.'
  },
  {
    id: 16,
    title: 'Reading a Company — Revenue, Profit & Value',
    topic: 'Money In Minus Money Out Equals Profit',
    location: 'COMPANY ANALYSIS LAB',
    icon: '🧾',
    brief: 'Read fictional company reports and compare revenue, expenses, profit, growth, debt, and business models.',
    concepts: [
      'Revenue',
      'Expenses',
      'Profit',
      'Growth',
      'Debt',
      'Business Model',
      'Company Value'
    ],
    dialogue: [
      { speaker: 'sofia', text: 'Revenue is money a company brings in. Expenses are its costs. Revenue minus expenses equals profit.' },
      { speaker: 'kai', text: 'The highest revenue is not always the strongest company. Growth, debt, the business model, and profit also matter.' }
    ],
    decision: {
      prompt: 'Which fictional company appears strongest after you read the complete report?',
      options: [
        {
          id: 'choose-neighborhood-foods',
          label: 'Neighborhood Foods',
          icon: '🥕',
          detail: 'Revenue $1,200 • Expenses $900 • Profit $300 • Growth 8% • Debt $100',
          effects: { cash: -100, stocks: 100 },
          feedback: 'You chose steady profit, positive growth, and lower debt. These support the analysis, but they do not guarantee a higher stock price.'
        },
        {
          id: 'choose-sunline-energy',
          label: 'Sunline Energy',
          icon: '☀️',
          detail: 'Revenue $1,600 • Expenses $1,500 • Profit $100 • Growth 18% • Debt $600',
          effects: { cash: -100, stocks: 100 },
          feedback: 'Sunline has fast growth and high revenue, but thin profit and high debt add risk. Revenue alone does not show company strength.'
        },
        {
          id: 'choose-playworks-studio',
          label: 'PlayWorks Studio',
          icon: '🎮',
          detail: 'Revenue $900 • Expenses $1,000 • Profit -$100 • Growth -5% • Debt $300',
          effects: { cash: -100, stocks: 100 },
          feedback: 'Expenses exceeded revenue, creating a loss. A turnaround is possible, but this report shows greater risk today.'
        }
      ]
    },
    event: {
      title: 'New Quarterly Report',
      prompt: 'Revenue rises 10%, but expenses rise 20% and profit falls. What matters in your review?',
      options: [
        {
          id: 'compare-profit-and-costs',
          label: 'Check Profit and Costs',
          icon: '🧮',
          detail: 'Compare the new revenue with the faster-growing expenses and lower profit.',
          effects: { stocks: -8 },
          feedback: 'You read beyond the revenue headline. The simulated price dipped because investors saw weaker profit, though markets can judge reports differently.'
        },
        {
          id: 'buy-on-revenue-only',
          label: 'Buy on Revenue Alone',
          icon: '📣',
          detail: 'Add $40 because the revenue number increased, without checking expenses or debt.',
          effects: { cash: -40, stocks: 32 },
          feedback: 'The new purchase added value while the original holding fell. Revenue growth can hide rising expenses and weaker profit.'
        },
        {
          id: 'sell-one-quarter',
          label: 'Sell After One Report',
          icon: '📉',
          detail: 'Sell the $100 position for $92 after the simulated price response.',
          effects: { stocks: -100, cash: 92 },
          feedback: 'You locked in an $8 loss. One report matters, but company value also reflects the business model, debt, growth, and future expectations.'
        }
      ]
    },
    takeaway: 'Revenue is money in, expenses are money out, and profit is the difference. Company value is an estimate shaped by profit, growth, debt, the business model, and expectations.'
  }
];
