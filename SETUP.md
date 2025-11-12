# Quick Setup Guide

**✅ Works on both Windows and Mac!**

The script automatically detects your operating system and uses the appropriate method for API communication (PowerShell on Windows, curl on Mac).

## Step 1: Get Your Gemini API Key 

### Where to Get the API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy your API key (it will look like: `AIzaSy...`)

### Where to Put the API Key

1. Open `geminiAPI.jsxinc` in a text editor (Notepad, TextEdit, or any code editor)
2. Find this line near the top:
   ```javascript
   var GEMINI_API_KEY = "AIzaSyAEiABJLSgW0Fp8x5-BmAiWobQ27ICPvXY";
   ```
3. Replace the API key between the quotes with your own API key:
   ```javascript
   var GEMINI_API_KEY = "YOUR_API_KEY_HERE";
   ```
4. Save the file


## Step 2: Download the Script Files

Download these two files:
- `TranslateArabicToEnglish.jsx` (main script)
- `geminiAPI.jsxinc` (API helper)

**Important:** Both files must be in the same folder!

## Step 3: Install Scripts in InDesign

### Windows Installation

1. **Find your InDesign Scripts folder:**
   - Press `Win + R` to open Run dialog
   - Type `%APPDATA%` and press Enter
   - Navigate to: `Adobe\InDesign\[Version]\Scripts\Scripts Panel\User\`
   - Replace `[Version]` with your InDesign version (e.g., `Version 21.0-ME` or `Version 20.0`)

2. **Create the User folder if it doesn't exist:**
   - If the "User" folder doesn't exist, create it inside "Scripts Panel"

3. **Copy both script files:**
   - Copy `TranslateArabicToEnglish.jsx` to the User folder
   - Copy `geminiAPI.jsxinc` to the User folder
   - Both files must be in the same folder

4. **Example path:**
   ```
   C:\Users\YourName\AppData\Roaming\Adobe\InDesign\Version 21.0-ME\Scripts\Scripts Panel\User\
   ```

### Mac Installation

1. **Find your InDesign Scripts folder:**
   - Open Finder
   - Press `Cmd + Shift + G` (Go to Folder)
   - Type: `~/Library/Preferences/Adobe InDesign/[Version]/Scripts/Scripts Panel/User/`
   - Replace `[Version]` with your InDesign version

2. **Create the User folder if it doesn't exist:**
   - If the "User" folder doesn't exist, create it inside "Scripts Panel"

3. **Copy both script files:**
   - Copy `TranslateArabicToEnglish.jsx` to the User folder
   - Copy `geminiAPI.jsxinc` to the User folder
   - Both files must be in the same folder

4. **Example path:**
   ```
   ~/Library/Preferences/Adobe InDesign/Version 21.0/Scripts/Scripts Panel/User/
   ```

## Step 4: Restart InDesign

Close and restart InDesign to load the new scripts.

## Step 5: Verify Installation

1. Open InDesign
2. Open the Scripts panel: **Window > Utilities > Scripts**
3. Expand the **"User"** folder (not "Application" or "Samples")
4. You should see `TranslateArabicToEnglish.jsx` listed
5. If you see it, installation is successful!

## Step 6: Test the Script

1. Create a new InDesign document or open an existing one
2. Add some Arabic text to a text frame
3. Select the text frame or highlight the Arabic text
4. Double-click `TranslateArabicToEnglish.jsx` in the Scripts panel
5. A progress window will appear
6. The text should be translated to English while preserving formatting

## Troubleshooting

### Script doesn't appear in Scripts panel

**Problem:** Script is not visible in the Scripts panel

**Solutions:**
- Make sure both `.jsx` and `.jsxinc` files are in the same folder
- Verify you're using the "User" folder, not "Application" or "Samples"
- Restart InDesign after copying files
- Check file permissions (make sure files are not read-only)
- Verify the folder path is correct

### "No text found in selection" error

**Problem:** Script says no text is selected

**Solutions:**
- Make sure you've selected a text frame (click the frame edge) or highlighted text
- Try selecting the entire text frame instead of just text
- The script works with both partial and full text selections
- Make sure the text frame contains actual text (not empty)

### "Translation failed" error

**Problem:** Translation doesn't work

**Solutions:**
- Check your internet connection
- The API key is included in the script - you can use it as-is or replace it with your own (see Step 1)
- If you're using your own API key, make sure it's correctly set in `geminiAPI.jsxinc`
- Wait a few seconds and try again (API may be temporarily unavailable)
- Verify the text contains Arabic characters
- Check if your API key has available quota/credits at [Google AI Studio](https://makersuite.google.com/)

### Formatting not preserved

**Problem:** Translated text loses formatting

**Solutions:**
- Make sure you're selecting text within a text frame
- Each paragraph should maintain its own formatting
- Try selecting the entire text frame instead of just text
- The script preserves formatting paragraph by paragraph

### Script runs but nothing happens

**Problem:** Script executes but text doesn't change

**Solutions:**
- Check if the text is actually Arabic (script only translates Arabic)
- Verify the text frame is selected
- Check InDesign's error console for messages
- Try with a simple test case first

## Finding Your InDesign Version

To find your InDesign version:
1. Open InDesign
2. Go to **Help > About InDesign**
3. Note the version number (e.g., "21.0" or "2024")
4. Use this in the folder path

## Alternative: Run from File Menu

If you prefer not to install in the Scripts folder:

1. Place both script files in any folder
2. In InDesign: **File > Scripts > User**
3. Browse to the folder and select `TranslateArabicToEnglish.jsx`
4. Note: Both files must still be in the same folder

## Next Steps

Once installed and tested:
- Use the script regularly to translate Arabic text
- The script preserves all formatting automatically
- Each paragraph maintains its original style and color
- Progress indicator shows translation status

Enjoy translating your Arabic text to English!
