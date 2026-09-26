import { Request, Response } from 'express';
import { GeminiService } from '../../services/geminiService';
import { WalletService } from '../wallet/wallet.service';
import { prisma } from '../../config/database';

export const handleMarketSearch = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const result = await GeminiService.verifyProductWithSearch(query);
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error: any) {
    console.error('[AI Controller Market Search] Error:', error);
    res.status(500).json({ 
      error: 'Failed to process market search request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const handleAIChat = async (req: Request, res: Response) => {
  try {
    const { messages, systemInstruction: customSystemInstruction, stream = false } = req.body;
    const userId = (req as any).user?.id || 'dev-munna-id';

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    // Fetch context for the user
    let contextInstructions = "";
    try {
      const wallet = await WalletService.getOrCreateWallet(userId);
      const escrow = await WalletService.getEscrowSummary(userId);
      
      contextInstructions = `
        USER CONTEXT:
        - User ID: ${userId}
        - Wallet Balance: ৳${wallet.balance.toLocaleString()}
        - PK Coins: ${wallet.coins}
        
        MERCHANT ESCROW:
        - Held: ৳${escrow.totalHeld.toLocaleString()}
        - Released: ৳${escrow.totalReleased.toLocaleString()}
      `;
    } catch (err) {
      console.warn('[AI Controller] Could not fetch user context:', err);
    }

    const baseInstruction = customSystemInstruction || "You are Paikar Mart AI. Speak English and Bengali.";
    const combinedInstruction = `${baseInstruction}\n\n${contextInstructions}`;

    // Define tools
    const tools = [
      {
        name: "searchProducts",
        description: "Search for products in Paikar Mart marketplace. Returns list of matching products.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search keyword" },
            category: { type: "string", description: "Category ID or name" }
          },
          required: ["query"]
        }
      }
    ];

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const streamResponse = await GeminiService.generateStreamingChatResponse(messages, combinedInstruction, tools);

      for await (const chunk of (streamResponse as any)) {
        const text = chunk.text ? chunk.text() : (chunk.content?.parts?.[0]?.text || '');
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }

        // Handle tool calls in stream if any (simplified for now)
        const calls = chunk.candidates?.[0]?.content?.parts?.filter(p => !!(p as any).functionCall);
        if (calls && (calls as any).length > 0) {
          for (const call of (calls as any)) {
            const { name, args } = call.functionCall;
            if (name === "searchProducts") {
              const products = process.env.DATABASE_URL ? await prisma.product.findMany({
                where: {
                  OR: [
                    { name: { contains: args.query, mode: 'insensitive' } },
                    { description: { contains: args.query, mode: 'insensitive' } }
                  ]
                },
                take: 5
              }) : [];
              res.write(`data: ${JSON.stringify({ 
                toolCall: name, 
                result: products.map(p => ({ id: p.id, name: p.name, title: p.name, price: Number(p.price) })) 
              })}\n\n`);
            }
          }
        }
      }
      res.write('data: [DONE]\n\n');
      return res.end();
    } else {
      const reply = await GeminiService.generateChatResponse(messages, combinedInstruction);
      res.status(200).json({ status: 'success', reply });
    }
  } catch (error: any) {
    console.error('[AI Controller] Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to process AI request' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
      res.end();
    }
  }
};
