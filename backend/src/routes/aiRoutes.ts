import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { Transaction } from '../models/Transaction';
import { Investment } from '../models/Investment';
import { SIP } from '../models/SIP';
import { User } from '../models/User';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();
router.use(authMiddleware);

router.post(['/ask', '/ask-v2'], async (req: AuthRequest, res): Promise<void> => {
  try {
    const { query } = req.body;
    const userId = req.user?.userId;

    // Fetch user context
    const user = await User.findById(userId);
    const transactions = await Transaction.find({ userId }).sort({ date: -1 }).limit(50);
    const investments = await Investment.find({ userId });

    // Calculate quick stats
    const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const portfolioValue = investments.reduce((sum, i) => sum + i.currentValue, 0);

    const contextData = {
      user: {
        name: user?.name || 'User',
        profession: user?.profession,
        goals: user?.financialGoals
      },
      recentTransactions: transactions.map(t => ({ merchant: t.merchant, amount: t.amount, date: t.date, category: t.category })),
      portfolioValue,
      totalIncome,
      totalExpense
    };

    const prompt = `You are FinSight, a premium personal financial advisor AI for ${contextData.user.name}.
The user asked: "${query}"
Here is their real-time financial data context: ${JSON.stringify(contextData)}
Provide a personalized, professional, and data-driven answer. Reference their name and specific numbers or goals when relevant. Keep it under 3 sentences.`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      // Use Real LLM
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      res.json({ success: true, data: { answer: responseText } });
    } else {
      // Sophisticated Local Insight Engine
      console.warn("No GEMINI_API_KEY found. Using Local Insight Engine.");
      
      const name = contextData.user.name;
      const savings = totalIncome - totalExpense;
      const expenseRatio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
      
      // Category analysis
      const categoryTotals: Record<string, number> = {};
      transactions.forEach(t => {
        if (t.amount < 0) {
          categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
        }
      });
      
      const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
      
      let answer = `Hi ${name}! I've analyzed your financial data locally. `;
      
      const q = query.toLowerCase();
      
      if (q.includes("portfolio") || q.includes("investment") || q.includes("worth")) {
        answer += `Your current portfolio is valued at ₹${portfolioValue.toLocaleString()}. You have ${investments.length} active assets tracked.`;
      } else if (q.includes("expense") || q.includes("spend") || q.includes("category")) {
        answer += `Your total expenses stand at ₹${totalExpense.toLocaleString()}. `;
        if (topCategory) {
          answer += `Most of your spending is in "${topCategory[0]}" (₹${topCategory[1].toLocaleString()}), which is ${((topCategory[1]/totalExpense)*100).toFixed(0)}% of your total outgo.`;
        }
      } else if (q.includes("income") || q.includes("save") || q.includes("saving")) {
        answer += `This month, you've earned ₹${totalIncome.toLocaleString()} and saved ₹${savings.toLocaleString()}. Your savings rate is ${ (100 - expenseRatio).toFixed(1)}%.`;
      } else if (q.includes("sip")) {
        const sipCount = await SIP.countDocuments({ userId });
        answer += `You have ${sipCount} active SIPs scheduled. Consistency is key to building wealth!`;
      } else {
        answer += `Your savings this month are ₹${savings.toLocaleString()}. ${savings > 0 ? "You're on a great track!" : "Let's see where we can optimize your budget."}`;
      }

      res.json({ success: true, data: { answer } });
    }

  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Server error analyzing data' });
  }
});

export default router;
