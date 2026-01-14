# AI Resume Generator Setup

## Overview
The AI Resume Generator enhances your resume using **Raxcore AI** by:
- Creating professional summaries
- Improving job descriptions with metrics
- Optimizing content for ATS systems
- Adding action-oriented achievements

## Setup - Using Raxcore AI

1. **Get your Raxcore API Key:**
   - Visit Raxcore AI platform
   - Sign up or log in to your account
   - Navigate to API keys section
   - Generate a new API key
   - Copy the key

2. **Add to your project:**
   - Open `.env` file in your project root
   - Replace `your-raxcore-api-key-here` with your actual key:
     ```
     VITE_RAXCORE_API_KEY=your-actual-key-here
     ```
   - If Raxcore uses a different API endpoint, update:
     ```
     VITE_RAXCORE_API_URL=https://api.raxcore.com/v1/chat/completions
     ```
   - Save the file
   - Restart your dev server (`npm run dev`)

3. **Test it:**
   - Open any resume editor
   - Fill in some work experience
   - Click "Generate with AI"
   - Your resume will be enhanced with Raxcore AI!

## Fallback Mode

If no API key is provided or the API fails, the system automatically uses mock data. This is perfect for:
- Testing the UI without an API key
- Development without costs
- Demo purposes
- When API is temporarily unavailable

## How It Works

1. **User fills profile:**
   - Personal info
   - Education
   - Work experience
   - Skills
   - Projects
   - Career goals (optional)

2. **Clicks "Generate with AI"**

3. **System processes:**
   - Validates data completeness
   - Sends structured prompt to AI
   - AI generates enhanced content
   - Updates resume sections automatically

4. **User gets:**
   - Professional summary
   - Enhanced job descriptions
   - Quantified achievements
   - ATS-optimized wording

## Features

✅ **Smart Validation:** Checks if user has enough data before generating
✅ **Progress Tracking:** Shows real-time generation status
✅ **Automatic Updates:** Directly updates resume sections
✅ **Fallback System:** Uses mock data if API fails
✅ **Error Handling:** Graceful failure with user feedback

## Usage

1. Fill in at least:
   - Personal information
   - One work experience entry
   - Some skills

2. Click the purple "Generate with AI" card at the top of the editor

3. Wait 5-10 seconds for generation

4. Review and edit the AI-generated content as needed

## Customization

Edit `src/lib/aiService.js` to:
- Change AI model (GPT-4, Claude, etc.)
- Adjust temperature for creativity
- Modify prompt structure
- Add more enhancement types

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to git
- API keys should be kept secret
- Consider using Supabase Edge Functions for production
- Edge Functions keep API keys server-side (more secure)

## Future Enhancements

Planned features:
- Multiple writing styles (formal, creative, technical)
- Industry-specific optimization
- A/B testing different versions
- LinkedIn profile integration
- Cover letter generation
