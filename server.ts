import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to instantiate Gemini AI client safely on demand
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes

// 1. AI Quote Insight & Social Caption Generator
app.post('/api/gemini/quote-insight', async (req, res) => {
  try {
    const { quote, bookTitle, author } = req.body;
    if (!quote) {
      return res.status(400).json({ error: 'Quote text is required' });
    }

    const ai = getGeminiClient();
    const prompt = `你是一位專業的說書人與閱讀社群文案大師。請針對以下來自書籍《${bookTitle || '未指定'}》（作者：${author || '未指定'}）的摘錄金句進行深度解讀與社交媒體分享包裝：

摘錄金句：「${quote}」

請以繁體中文回答，並輸出 JSON 格式，包含以下欄位：
1. "insight": 200字以內的深度思考與心靈解析，引導讀者思考其生活應用。
2. "socialCaption": 適合發布在 Instagram / Threads / 社群平台的精美分享文案（含適合的 Emoji 與 3-5 個熱門 Hashtag，如 #閱讀筆記 #佳句分享 等）。
3. "keywords": 3個代表這段話核心精髓的關鍵詞（陣列）。
4. "recommendedTheme": 建議的分享卡片風格色調 ("minimal-paper" | "dark-luxury" | "pastel-warm" | "sunset-vibe" | "emerald-zen")。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insight: { type: Type.STRING },
            socialCaption: { type: Type.STRING },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            recommendedTheme: { type: Type.STRING },
          },
          required: ['insight', 'socialCaption', 'keywords', 'recommendedTheme'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json(result);
  } catch (error: any) {
    console.error('Error generating quote insight:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate AI quote insight',
    });
  }
});

// 2. AI Reading Coach & Personal Insights
app.post('/api/gemini/reading-coach', async (req, res) => {
  try {
    const { currentStreak, totalPagesRead, completedBooks, recentBooks, totalMinutes } = req.body;

    const ai = getGeminiClient();
    const prompt = `你是一位溫馨、專業且具備啟發性的個人 AI 閱讀教練。
請根據以下使用者的當前閱讀數據進行個人化閱讀診斷與鼓勵：
- 連續閱讀天數: ${currentStreak || 0} 天
- 總累計閱讀頁數: ${totalPagesRead || 0} 頁
- 累計閱讀時間: ${totalMinutes || 0} 分鐘
- 已讀完書籍數量: ${completedBooks || 0} 本
- 最近閱讀書單: ${JSON.stringify(recentBooks || [])}

請以繁體中文回覆，輸出 JSON 格式：
1. "greeting": 一句溫暖且個人化的讚賞與獎勵。
2. "streakFeedback": 針對連續天數與閱讀習慣的深度剖析與維持心法。
3. "readingEfficiency": 關於閱讀速度與專注力的建議（例如每日建議閱讀時間或章節分配）。
4. "bookRecommendations": 根據其閱讀喜好推薦 3 本延伸好書（包含 "title", "author", "reason" 理由）。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            greeting: { type: Type.STRING },
            streakFeedback: { type: Type.STRING },
            readingEfficiency: { type: Type.STRING },
            bookRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  author: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['title', 'author', 'reason'],
              },
            },
          },
          required: ['greeting', 'streakFeedback', 'readingEfficiency', 'bookRecommendations'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json(result);
  } catch (error: any) {
    console.error('Error generating reading coach feedback:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate reading coach feedback',
    });
  }
});

// 3. AI Book Details Auto-fill / Summary
app.post('/api/gemini/book-summary', async (req, res) => {
  try {
    const { bookTitle, author } = req.body;
    if (!bookTitle) {
      return res.status(400).json({ error: 'Book title is required' });
    }

    const ai = getGeminiClient();
    const prompt = `請為書籍《${bookTitle}》（${author ? '作者：' + author : ''}）提供簡介與基礎預估資料。
請以繁體中文回答，輸出 JSON 格式：
1. "title": 規範書名
2. "author": 作者名稱
3. "category": 圖書分類 (例如: 自我成長, 心理勵志, 科幻小說, 商管財經, 文學小說, 歷史哲學)
4. "estimatedTotalPages": 預估總頁數 (數字，若不確定給予合理的出版預估如 300)
5. "summary": 150字精彩簡介與核心看點
6. "keyThemes": 3個核心主題標籤 (陣列)
7. "famousQuote": 該書最著名的佳句或靈魂金句（若有，否則提供代表該書精神的名言）`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            author: { type: Type.STRING },
            category: { type: Type.STRING },
            estimatedTotalPages: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            keyThemes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            famousQuote: { type: Type.STRING },
          },
          required: ['title', 'author', 'category', 'estimatedTotalPages', 'summary', 'keyThemes'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json(result);
  } catch (error: any) {
    console.error('Error generating book summary:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate book summary',
    });
  }
});

// Vite middleware or Static Server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
