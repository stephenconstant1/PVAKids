// Shared lesson language. Week 1 and Week 10 use the supplied poster wording.
// The remaining short KJV passages provide a complete, public-domain scripture
// card for every lesson while keeping the activity screen readable for children.
const entries = [
 [1,['Your Time','Your Skills','Your Ideas','Creating Value'],['Colossians 3:23 (NIV)','Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.']],
 [2,['Earned Income','Business Income','Freelance Income','Creative Income'],['Proverbs 14:23 (KJV)','In all labour there is profit: but the talk of the lips tendeth only to penury.']],
 [3,['Pay Yourself First','Save First','Spend Second','Emergency Fund'],['Proverbs 21:20 (KJV)','There is treasure to be desired and oil in the dwelling of the wise; but a foolish man spendeth it up.']],
 [4,['Budget','Needs','Wants','Savings','50/30/20 Rule'],['Luke 14:28 (KJV)','Which of you, intending to build a tower, sitteth not down first, and counteth the cost?']],
 [5,['Stocks','Bonds','Real Estate','ETFs','Mutual Funds','Diversification'],['Proverbs 13:11 (KJV)','He that gathereth by labour shall increase.']],
 [6,['Oil','Natural Gas','Energy Prices','Global Supply','Cost of Living'],['Proverbs 27:12 (KJV)','A prudent man foreseeth the evil, and hideth himself.']],
 [7,['Credit','Credit Cards','Loans','Mortgages','Good Debt','Risky Debt'],['Proverbs 22:7 (KJV)','The borrower is servant to the lender.']],
 [8,['Find a Need','Generate Ideas','Research','Plan','Act','Persist'],['Proverbs 22:29 (KJV)','Seest thou a man diligent in his business? he shall stand before kings.']],
 [9,['Asset Classes','Risk','Reward','Long-Term Investing','Diversification'],['Proverbs 13:22 (KJV)',"A good man leaveth an inheritance to his children's children."]],
 [10,['Budget','50/30/20 Rule','Needs (50%)','Wants (30%)','Savings & Goals (20%)','SMART Goals'],['Proverbs 21:5 (NIV)','The plans of the diligent lead to profit as surely as haste leads to poverty.']],
 [11,['Stock','Shares','Ownership','Company','Price Gains','Price Losses'],['Ecclesiastes 11:1 (KJV)','Cast thy bread upon the waters: for thou shalt find it after many days.']],
 [12,['Principal','Interest','Interest on Interest','Time','Contributions','Rate of Return'],['Matthew 25:21 (KJV)','Thou hast been faithful over a few things, I will make thee ruler over many things.']],
 [13,['Risk','Potential Return','Concentration','Diversification'],['Ecclesiastes 11:2 (KJV)','Give a portion to seven, and also to eight; for thou knowest not what evil shall be upon the earth.']],
 [14,['ETF','Index','Index Fund','Portfolio','Diversification','Asset Allocation'],['Ecclesiastes 11:2 (KJV)','Give a portion to seven, and also to eight; for thou knowest not what evil shall be upon the earth.']],
 [15,['Buyers','Sellers','Exchanges','Market Prices','Bids','Offers','Supply','Demand'],['Proverbs 14:15 (KJV)','The prudent man looketh well to his going.']],
 [16,['Revenue','Expenses','Profit','Growth','Debt','Business Model','Company Value'],['Proverbs 27:23 (KJV)','Be thou diligent to know the state of thy flocks, and look well to thy herds.']],
 [17,['Supply','Demand','Competition','Scarcity'],['Proverbs 11:26 (KJV)','He that withholdeth corn, the people shall curse him: but blessing shall be upon the head of him that selleth it.']],
 [18,['Inflation','Purchasing Power','Price Increases','Real Value of Money'],['Isaiah 55:2 (KJV)','Wherefore do ye spend money for that which is not bread?']],
 [19,['Deposits','Savings Accounts','Loans','Interest','Banking','Money Movement'],['Matthew 25:27 (KJV)','Thou oughtest therefore to have put my money to the exchangers.']],
 [20,['Payment History','Credit Usage','Credit Age','New Credit','Responsible Borrowing'],['Proverbs 22:1 (KJV)','A good name is rather to be chosen than great riches.']],
 [21,['Principal','Interest','APR','Minimum Payments','Total Cost','Debt Snowball','Debt Avalanche'],['Proverbs 22:7 (KJV)','The borrower is servant to the lender.']],
 [22,['Risk Protection','Premium','Deductible','Claim','Auto','Health','Property','Life Insurance'],['Proverbs 27:12 (KJV)','A prudent man foreseeth the evil, and hideth himself.']],
 [23,['Gross Pay','Payroll Deductions','Net Pay','Taxes'],['Romans 13:7 (KJV)','Render therefore to all their dues: tribute to whom tribute is due.']],
 [24,['Problem','Solution','Customer','Revenue','Profit'],['Ephesians 4:28 (KJV)','Let him labour, working with his hands the thing which is good.']],
 [25,['Pricing','Revenue','Expenses','Profit'],['Luke 14:28 (KJV)','Sitteth not down first, and counteth the cost.']],
 [26,['Marketing','Customer','Brand'],['Proverbs 22:1 (KJV)','A good name is rather to be chosen than great riches.']],
 [27,['Real Estate','Mortgage','Down Payment','Equity','Cash Flow'],['Proverbs 24:3 (KJV)','Through wisdom is an house builded; and by understanding it is established.']],
 [28,['Careers','Skills','Education','Experience','Income'],['Proverbs 22:29 (KJV)','Seest thou a man diligent in his business? he shall stand before kings.']],
 [29,['Giving','Generosity','Community Impact','Purpose'],['2 Corinthians 9:7 (KJV)','God loveth a cheerful giver.']],
 [30,['Financial Independence','Lifestyle Costs','Future Income','Freedom'],['Proverbs 16:9 (KJV)',"A man's heart deviseth his way: but the LORD directeth his steps."]],
 [31,['Income Plan','Emergency Fund','Debt Plan','Investing Plan','Protection','Goals'],['Proverbs 21:5 (KJV)','The thoughts of the diligent tend only to plenteousness.']],
 [32,['Income','Budget','Savings','Credit','Debt','Investing','Taxes','Insurance','Giving','Goals'],['Proverbs 16:3 (KJV)','Commit thy works unto the LORD, and thy thoughts shall be established.']]
];

export const curriculumMeta = Object.fromEntries(entries.map(([id,terms,[reference,text]])=>[id,{terms,scripture:{reference,text}}]));
