import { QuizState, RoadmapType } from '../types';

export const generateRoadmapData = (answers: QuizState): RoadmapType => {
  const { status, income } = answers;

  // Logic 1: Study Permit AND income < $1,000
  if (status === 'Study Permit' && income === 'Under $1,000') {
    return [
      {
        monthNumber: 1,
        title: "Open a no-fee student bank account",
        actions: [
          { id: 'm1-a1', text: "Visit RBC or TD branch with passport and study permit" },
          { id: 'm1-a2', text: "Open chequing account" },
          { id: 'm1-a3', text: "Request a debit card" }
        ]
      },
      {
        monthNumber: 2,
        title: "Apply for the Scotiabank Scene+ Secured Visa",
        actions: [
          { id: 'm2-a1', text: "Apply online at scotiabank.com" },
          { id: 'm2-a2', text: "Transfer $300 as security deposit" },
          { id: 'm2-a3', text: "Set up autopay for minimum payment" }
        ]
      },
      {
        monthNumber: 3,
        title: "Put one small recurring charge on the card",
        actions: [
          { id: 'm3-a1', text: "Add card to Spotify or Netflix subscription" },
          { id: 'm3-a2', text: "Confirm the charge posts to your card" },
          { id: 'm3-a3', text: "Check that autopay is still active" }
        ]
      },
      {
        monthNumber: 4,
        title: "Pull your free credit reports",
        actions: [
          { id: 'm4-a1', text: "Request report from Equifax Canada at equifax.ca (free)" },
          { id: 'm4-a2', text: "Request report from TransUnion Canada at transunion.ca (free)" },
          { id: 'm4-a3', text: "Check that your secured card is listed on both" }
        ]
      },
      {
        monthNumber: 5,
        title: "Add KOHO's credit building feature",
        actions: [
          { id: 'm5-a1', text: "Download KOHO app and sign up (free)" },
          { id: 'm5-a2', text: "Add Credit Building add-on ($7/month)" },
          { id: 'm5-a3', text: "Keep utilization on Scotia card under 10%" }
        ]
      },
      {
        monthNumber: 6,
        title: "Check your score",
        actions: [
          { id: 'm6-a1', text: "Check score via Borrowell (free)" },
          { id: 'm6-a2', text: "If above 640 apply for Home Trust Preferred Visa" },
          { id: 'm6-a3', text: "If below 640 continue current plan for 3 more months" }
        ]
      }
    ];
  }

  // Logic 2: Work Permit AND income >= $3,000
  // Note: The prompt has "$3,000 – $5,000" and "$5,000+" as options for "above $3,000"
  if (status === 'Work Permit (PGWP or Employer-Sponsored)' && (income === '$3,000 – $5,000' || income === '$5,000+')) {
    return [
      {
        monthNumber: 1,
        title: "Open an RBC Newcomer account & Secured Visa",
        actions: [
          { id: 'm1-a1', text: "Visit RBC with work permit and proof of income" },
          { id: 'm1-a2', text: "Open chequing account" },
          { id: 'm1-a3', text: "Apply for RBC Secured Visa ($1,000 deposit recommended)" }
        ]
      },
      {
        monthNumber: 2,
        title: "Apply for a credit-builder loan",
        actions: [
          { id: 'm2-a1', text: "Find nearest Meridian, Desjardins, or Vancity branch" },
          { id: 'm2-a2', text: "Apply for a $1,000–$2,000 credit-builder loan" },
          { id: 'm2-a3', text: "Confirm monthly payment amount and set up autopay" }
        ]
      },
      {
        monthNumber: 3,
        title: "Set everything to autopay",
        actions: [
          { id: 'm3-a1', text: "Verify both the card and loan appear on your Equifax report" },
          { id: 'm3-a2', text: "Set full autopay on the RBC card (not just minimum)" },
          { id: 'm3-a3', text: "Set autopay on credit-builder loan" }
        ]
      },
      {
        monthNumber: 4,
        title: "Open a second secured card",
        actions: [
          { id: 'm4-a1', text: "Apply for Home Trust Secured Visa or Tangerine Money-Back card" },
          { id: 'm4-a2', text: "Keep both cards under 15% utilization" },
          { id: 'm4-a3', text: "Do not close the first card" }
        ]
      },
      {
        monthNumber: 5,
        title: "Request a credit limit increase",
        actions: [
          { id: 'm5-a1', text: "Call RBC or request online after 6 months" },
          { id: 'm5-a2', text: "Do not let them do a hard pull if possible (ask for soft pull)" },
          { id: 'm5-a3', text: "If denied, wait 3 more months" }
        ]
      },
      {
        monthNumber: 6,
        title: "Apply for a rewards credit card",
        actions: [
          { id: 'm6-a1', text: "Check score on Borrowell or Credit Karma Canada" },
          { id: 'm6-a2', text: "If above 660 apply for Tangerine World Mastercard or PC Financial Mastercard" },
          { id: 'm6-a3', text: "Set up one recurring bill on the new card" }
        ]
      }
    ];
  }

  // Logic 3: PR AND Any Income
  if (status === 'Permanent Resident' || status === 'Canadian Citizen') {
    return [
      {
        monthNumber: 1,
        title: "Leverage Newcomer Programs",
        actions: [
          { id: 'm1-a1', text: "Visit TD or RBC and mention you are a new PR" },
          { id: 'm1-a2', text: "Apply for TD Newcomer Program or RBC Newcomer Advantage" },
          { id: 'm1-a3', text: "Apply for secured card same day" }
        ]
      },
      {
        monthNumber: 2,
        title: "Stack a credit-builder loan",
        actions: [
          { id: 'm2-a1', text: "Apply for credit-builder loan at Desjardins or Meridian" },
          { id: 'm2-a2', text: "This creates two tradelines reporting simultaneously" },
          { id: 'm2-a3', text: "Set autopay on both" }
        ]
      },
      {
        monthNumber: 3,
        title: "Add a retail credit account",
        actions: [
          { id: 'm3-a1', text: "Apply for Canadian Tire Triangle Mastercard (easiest approval)" },
          { id: 'm3-a2', text: "Use it for one purchase per month" },
          { id: 'm3-a3', text: "Pay in full immediately" }
        ]
      },
      {
        monthNumber: 4,
        title: "Request limit increases",
        actions: [
          { id: 'm4-a1', text: "Request limit increase on secured card" },
          { id: 'm4-a2', text: "If Canadian Tire card has good standing request increase there too" },
          { id: 'm4-a3', text: "Keep overall utilization under 10%" }
        ]
      },
      {
        monthNumber: 5,
        title: "Check both bureaus and dispute errors",
        actions: [
          { id: 'm5-a1', text: "Pull Equifax and TransUnion reports" },
          { id: 'm5-a2', text: "Look for any accounts listed incorrectly" },
          { id: 'm5-a3', text: "File a dispute online if anything is wrong" }
        ]
      },
      {
        monthNumber: 6,
        title: "Apply for a proper rewards card",
        actions: [
          { id: 'm6-a1', text: "Check score — PR holders often hit 680–720 by month 6" },
          { id: 'm6-a2', text: "Apply for Scotiabank Gold Amex or TD Cash Back Visa" },
          { id: 'm6-a3', text: "Consider converting secured card to unsecured if offered" }
        ]
      }
    ];
  }

  // Default Fallback (Same as Logic 1)
  return [
    {
      monthNumber: 1,
      title: "Open a no-fee student bank account",
      actions: [
        { id: 'm1-a1', text: "Visit RBC or TD branch with passport and study permit" },
        { id: 'm1-a2', text: "Open chequing account" },
        { id: 'm1-a3', text: "Request a debit card" }
      ]
    },
    {
      monthNumber: 2,
      title: "Apply for the Scotiabank Scene+ Secured Visa",
      actions: [
        { id: 'm2-a1', text: "Apply online at scotiabank.com" },
        { id: 'm2-a2', text: "Transfer $300 as security deposit" },
        { id: 'm2-a3', text: "Set up autopay for minimum payment" }
      ]
    },
    {
      monthNumber: 3,
      title: "Put one small recurring charge on the card",
      actions: [
        { id: 'm3-a1', text: "Add card to Spotify or Netflix subscription" },
        { id: 'm3-a2', text: "Confirm the charge posts to your card" },
        { id: 'm3-a3', text: "Check that autopay is still active" }
      ]
    },
    {
      monthNumber: 4,
      title: "Pull your free credit reports",
      actions: [
        { id: 'm4-a1', text: "Request report from Equifax Canada at equifax.ca (free)" },
        { id: 'm4-a2', text: "Request report from TransUnion Canada at transunion.ca (free)" },
        { id: 'm4-a3', text: "Check that your secured card is listed on both" }
      ]
    },
    {
      monthNumber: 5,
      title: "Add KOHO's credit building feature",
      actions: [
        { id: 'm5-a1', text: "Download KOHO app and sign up (free)" },
        { id: 'm5-a2', text: "Add Credit Building add-on ($7/month)" },
        { id: 'm5-a3', text: "Keep utilization on Scotia card under 10%" }
      ]
    },
    {
      monthNumber: 6,
      title: "Check your score",
      actions: [
        { id: 'm6-a1', text: "Check score via Borrowell (free)" },
        { id: 'm6-a2', text: "If above 640 apply for Home Trust Preferred Visa" },
        { id: 'm6-a3', text: "If below 640 continue current plan for 3 more months" }
      ]
    }
  ];
};