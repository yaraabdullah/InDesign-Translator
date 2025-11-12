# Quick Setup Guide

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## Step 2: Configure the Script

1. Copy `config.json.example` to `config.json`
2. Open `config.json` in a text editor
3. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:

```json
{
  "apiKey": "your-actual-api-key-here"
}
```

4. Save the file

## Step 3: Place Config File

Place `config.json` in one of these locations (the script will check in this order):

**Windows:**
- `%APPDATA%\InDesignTranslator\config.json`
  - Full path example: `C:\Users\YourName\AppData\Roaming\InDesignTranslator\config.json`

**Mac:**
- `~/Library/Preferences/InDesignTranslator/config.json`

**Alternative:**
- Same folder as the script files (`TranslateArabicToEnglish.jsx` and `geminiAPI.jsxinc`)

## Step 4: Install Scripts in InDesign

### Option A: Scripts Panel (Recommended)

1. **Windows:** Copy both files to:
   ```
   C:\Program Files\Adobe\Adobe InDesign [Version]\Scripts\Scripts Panel\
   ```

2. **Mac:** Copy both files to:
   ```
   /Applications/Adobe InDesign [Version]/Scripts/Scripts Panel/
   ```

3. Restart InDesign
4. Open Scripts panel: **Window > Utilities > Scripts**
5. Find `TranslateArabicToEnglish.jsx` under "User" folder
6. Double-click to run

### Option B: Run from File Menu

1. Place both script files in any folder
2. In InDesign: **File > Scripts > User**
3. Browse to the folder and select `TranslateArabicToEnglish.jsx`

## Step 5: Test the Script

1. Open an InDesign document with Arabic text
2. Select a text frame or highlight some Arabic text
3. Run the script
4. The text should be translated to English while preserving formatting

## Troubleshooting

### "API key not found"
- Make sure `config.json` exists and has the correct format
- Check that the file is in one of the expected locations
- Verify the API key is correct (no extra spaces)

### "Translation failed"
- Check your internet connection
- Verify your API key is valid and has quota
- Check if PowerShell (Windows) or curl (Mac) is available

### Script doesn't appear in Scripts panel
- Make sure both `.jsx` and `.jsxinc` files are in the same folder
- Restart InDesign after copying files
- Check file permissions

### Formatting not preserved
- Make sure you're selecting text within a text frame
- Try selecting the entire text frame instead of just text

