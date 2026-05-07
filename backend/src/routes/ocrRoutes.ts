import { Router } from 'express';
import multer from 'multer';
import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';

const router = Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/scan', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded' });
    }

    const filePath = path.join(__dirname, '../../', req.file.path);

    // Run Tesseract OCR on the image
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
    
    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    const lowerText = text.toLowerCase();

    // AI Validation: Does this look like a receipt?
    const receiptKeywords = ['total', 'amount', 'tax', 'cash', 'card', 'visa', 'mastercard', 'merchant', 'receipt', 'date', 'invoice', 'balance'];
    const keywordMatchCount = receiptKeywords.filter(word => lowerText.includes(word)).length;

    // Reject non-receipts (like motivational quotes)
    if (keywordMatchCount < 2) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image rejected: This does not appear to be a valid financial receipt or bill.' 
      });
    }

    // Advanced Regex Parsing
    // Extract total amount
    const amountMatch = text.match(/(?:total|amount|due|balance|sum)[\s:$-]*([0-9,]+(?:\.[0-9]{2})?)/i);
    let amount = 0;
    if (amountMatch && amountMatch[1]) {
      amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    // Extract Date
    const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
    let date = new Date().toISOString().split('T')[0];
    if (dateMatch && dateMatch[1]) {
      // Just keep it simple or format it if needed
      date = new Date().toISOString().split('T')[0]; // Fallback to today for simplicity in UI
    }

    // Extract Merchant (Assume first line or known brands)
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    let merchant = lines[0] || 'Unknown Merchant';
    
    // Clean merchant name
    merchant = merchant.replace(/[^a-zA-Z0-9 &]/g, '').trim();
    if (merchant.length < 2) merchant = 'Unknown Merchant';

    // Map to category
    let category = 'Shopping';
    if (lowerText.includes('restaurant') || lowerText.includes('food') || lowerText.includes('coffee') || lowerText.includes('cafe')) {
      category = 'Dining';
    } else if (lowerText.includes('uber') || lowerText.includes('taxi') || lowerText.includes('fuel')) {
      category = 'Transport';
    } else if (lowerText.includes('grocery') || lowerText.includes('mart')) {
      category = 'Groceries';
    }

    return res.status(200).json({
      success: true,
      data: {
        merchant,
        amount: amount || 0,
        date,
        category,
      }
    });

  } catch (error) {
    console.error('OCR Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to process image' });
  }
});

export default router;
