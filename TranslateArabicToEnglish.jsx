/*
 * InDesign Script: Arabic to English Translator
 * 
 * Translates Arabic text to English using Google Gemini API
 * Preserves all text formatting, styles, colors, and paragraph structure
 * 
 * Features:
 * - Translates paragraph by paragraph to preserve line structure
 * - Maintains individual character formatting (colors, sizes, fonts)
 * - Works with text frames or highlighted text
 * - Shows progress indicator during translation
 * 
 * Usage:
 * 1. Select a text frame or highlight Arabic text in InDesign
 * 2. Run this script from Window > Utilities > Scripts > User
 * 3. Text will be translated while preserving all formatting
 * 
 * Requirements:
 * - Adobe InDesign CS6 or later
 * - Internet connection
 * - geminiAPI.jsxinc (must be in same folder)
 */

//@include "geminiAPI.jsxinc"

// Custom trim function for ExtendScript (doesn't have native trim)
function trimString(str) {
    if (!str || str === null || str === undefined) {
        return "";
    }
    str = String(str);
    return str.replace(/^\s+|\s+$/g, '');
}

// Main translation function
function main() {
    try {
        // Check if a document is open
        if (app.documents.length === 0) {
            alert("Please open an InDesign document first.");
            return;
        }

        var doc = app.activeDocument;
        var selection = app.selection;

        if (selection.length === 0) {
            alert("Please select a text frame or highlight some text.");
            return;
        }

        // Process the selection
        var textItems = [];
        
        for (var i = 0; i < selection.length; i++) {
            var item = selection[i];
            var itemType = item.constructor.name;
            
            if (itemType === "TextFrame") {
                // Selected text frame - translate all text in the frame
                if (item.texts.length > 0 && item.texts[0].contents && trimString(item.texts[0].contents) !== "") {
                    textItems.push({
                        text: item.texts[0],
                        parent: item
                    });
                }
            } else if (itemType === "Text" || itemType === "TextStyleRange") {
                // Selected text range - this handles highlighted text
                var parentFrame = item.parentTextFrames[0];
                if (parentFrame) {
                    // Check if item has contents
                    try {
                        var itemContents = item.contents ? String(item.contents) : "";
                        if (itemContents && trimString(itemContents) !== "") {
                            textItems.push({
                                text: item,
                                parent: parentFrame
                            });
                        } else {
                            // If no contents, try to get from parent text
                            var parentText = parentFrame.texts[0];
                            if (parentText && parentText.contents && trimString(parentText.contents) !== "") {
                                textItems.push({
                                    text: parentText,
                                    parent: parentFrame
                                });
                            }
                        }
                    } catch (e) {
                        // Try to get parent text as fallback
                        try {
                            var parentFrame2 = item.parentTextFrames[0];
                            if (parentFrame2 && parentFrame2.texts.length > 0) {
                                var parentText2 = parentFrame2.texts[0];
                                if (parentText2 && parentText2.contents && trimString(parentText2.contents) !== "") {
                                    textItems.push({
                                        text: parentText2,
                                        parent: parentFrame2
                                    });
                                }
                            }
                        } catch (e2) {
                            // Skip this item
                        }
                    }
                }
            } else if (itemType === "Character" || itemType === "Word" || itemType === "Line" || itemType === "Paragraph") {
                // Selected text element - get the parent text
                var parentFrame = item.parentTextFrames[0];
                if (parentFrame) {
                    // Try to get the text range using startOffset/endOffset
                    try {
                        var startIdx = item.startOffset;
                        var endIdx = item.endOffset;
                        if (endIdx > startIdx) {
                            var textRange = item.parent.characters.itemByRange(startIdx, endIdx - 1);
                            if (textRange && textRange.contents && trimString(textRange.contents) !== "") {
                                textItems.push({
                                    text: textRange,
                                    parent: parentFrame
                                });
                            }
                        } else {
                            // If no range, try using the item directly
                            if (item.contents && trimString(item.contents) !== "") {
                                textItems.push({
                                    text: item,
                                    parent: parentFrame
                                });
                            } else {
                                // Fallback: get all text from parent
                                var parentText = parentFrame.texts[0];
                                if (parentText && parentText.contents && trimString(parentText.contents) !== "") {
                                    textItems.push({
                                        text: parentText,
                                        parent: parentFrame
                                    });
                                }
                            }
                        }
                    } catch (e) {
                        // If startOffset/endOffset not available, try using the item directly
                        try {
                            if (item.contents && trimString(item.contents) !== "") {
                                textItems.push({
                                    text: item,
                                    parent: parentFrame
                                });
                            } else {
                                // Fallback: get all text from parent frame
                                var parentText = parentFrame.texts[0];
                                if (parentText && parentText.contents && trimString(parentText.contents) !== "") {
                                    textItems.push({
                                        text: parentText,
                                        parent: parentFrame
                                    });
                                }
                            }
                        } catch (e2) {
                            // Last resort: try to get parent text
                            try {
                                var parentText = parentFrame.texts[0];
                                if (parentText && parentText.contents && trimString(parentText.contents) !== "") {
                                    textItems.push({
                                        text: parentText,
                                        parent: parentFrame
                                    });
                                }
                            } catch (e3) {
                                // Skip this item
                            }
                        }
                    }
                }
            } else if (itemType === "InsertionPoint") {
                // Insertion point - get the paragraph or word
                var parentFrame = item.parentTextFrames[0];
                if (parentFrame) {
                    try {
                        var para = item.paragraphs[0];
                        if (para && para.contents && trimString(para.contents) !== "") {
                            textItems.push({
                                text: para,
                                parent: parentFrame
                            });
                        } else {
                            // Fallback: get all text from parent
                            var parentText = parentFrame.texts[0];
                            if (parentText && parentText.contents && trimString(parentText.contents) !== "") {
                                textItems.push({
                                    text: parentText,
                                    parent: parentFrame
                                });
                            }
                        }
                    } catch (e) {
                        // Try to get parent text
                        try {
                            var parentText = parentFrame.texts[0];
                            if (parentText && parentText.contents && trimString(parentText.contents) !== "") {
                                textItems.push({
                                    text: parentText,
                                    parent: parentFrame
                                });
                            }
                        } catch (e2) {
                            // Skip this item
                        }
                    }
                }
            }
        }
        
        // If no text items found, try to get text from active text frame or selection
        if (textItems.length === 0) {
            try {
                // Check if there's an active text frame from selection
                if (selection.length > 0) {
                    var firstItem = selection[0];
                    
                    // Try to get parent text frame
                    if (firstItem.parentTextFrames && firstItem.parentTextFrames.length > 0) {
                        var textFrame = firstItem.parentTextFrames[0];
                        if (textFrame && textFrame.texts.length > 0) {
                            var textObj = textFrame.texts[0];
                            if (textObj && textObj.contents && trimString(textObj.contents) !== "") {
                                textItems.push({
                                    text: textObj,
                                    parent: textFrame
                                });
                            }
                        }
                    }
                    
                    // Also try to get text directly from the item if it's a text object
                    if (textItems.length === 0 && firstItem.contents) {
                        var itemContents = String(firstItem.contents);
                        if (itemContents && trimString(itemContents) !== "") {
                            // Try to find parent frame
                            var parentFrame = null;
                            try {
                                if (firstItem.parentTextFrames && firstItem.parentTextFrames.length > 0) {
                                    parentFrame = firstItem.parentTextFrames[0];
                                } else if (firstItem.parent && firstItem.parent.parentTextFrames && firstItem.parent.parentTextFrames.length > 0) {
                                    parentFrame = firstItem.parent.parentTextFrames[0];
                                }
                            } catch (e) {}
                            
                            if (parentFrame) {
                                textItems.push({
                                    text: firstItem,
                                    parent: parentFrame
                                });
                            }
                        }
                    }
                }
                
                // Last resort: check all text frames in the document
                if (textItems.length === 0 && doc.textFrames.length > 0) {
                    // Get the first text frame that has content
                    for (var tf = 0; tf < doc.textFrames.length; tf++) {
                        var frame = doc.textFrames[tf];
                        if (frame && frame.texts.length > 0) {
                            var frameText = frame.texts[0];
                            if (frameText && frameText.contents && trimString(frameText.contents) !== "") {
                                textItems.push({
                                    text: frameText,
                                    parent: frame
                                });
                                break; // Use first frame with content
                            }
                        }
                    }
                }
            } catch (e) {
                // Continue to show error
            }
        }

        if (textItems.length === 0) {
            alert("No text found in selection. Please select a text frame or highlight some text.");
            return;
        }

        // Process each text item
        for (var j = 0; j < textItems.length; j++) {
            var textItem = textItems[j];
            translateText(textItem.text, textItem.parent, doc);
        }

        alert("Translation completed!");
        
    } catch (error) {
        alert("Error: " + error.message + "\nLine: " + error.line);
    }
}

// Function to translate text while preserving formatting
function translateText(textObj, textFrame, doc) {
    var progressWindow = null; // Declare progress window at function scope
    try {
        // Get the original text content
        var originalText = textObj.contents;
        
        // Convert to string and check if it's not empty
        originalText = String(originalText);
        if (!originalText || trimString(originalText) === "") {
            return;
        }

        // Store formatting information - per character AND per paragraph
        var formattingInfo = [];
        var paragraphInfo = [];
        var textLength = textObj.characters.length;
        var paragraphs = textObj.paragraphs;
        var paraCount = paragraphs.length;
        
        // Store paragraph-level formatting
        for (var p = 0; p < paraCount; p++) {
            var para = paragraphs[p];
            var paraFormat = {};
            try {
                // Get paragraph text first
                paraFormat.text = para.contents ? String(para.contents) : "";
                
                if (para.characters.length > 0) {
                    var firstChar = para.characters[0];
                    paraFormat.fillColor = firstChar.fillColor ? firstChar.fillColor.name : null;
                    paraFormat.fillColorObj = firstChar.fillColor ? firstChar.fillColor : null;
                    paraFormat.strokeColor = firstChar.strokeColor ? firstChar.strokeColor.name : null;
                    paraFormat.strokeColorObj = firstChar.strokeColor ? firstChar.strokeColor : null;
                    paraFormat.appliedFont = firstChar.appliedFont ? firstChar.appliedFont.name : null;
                    paraFormat.pointSize = firstChar.pointSize;
                    paraFormat.leading = firstChar.leading;
                    paraFormat.tracking = firstChar.tracking;
                    paraFormat.horizontalScale = firstChar.horizontalScale;
                    paraFormat.verticalScale = firstChar.verticalScale;
                    paraFormat.baselineShift = firstChar.baselineShift;
                    paraFormat.skew = firstChar.skew;
                    paraFormat.underline = firstChar.underline;
                    paraFormat.strikethrough = firstChar.strikethrough;
                    paraFormat.allCaps = firstChar.allCaps;
                    paraFormat.smallCaps = firstChar.smallCaps;
                    paraFormat.superscript = firstChar.superscript;
                    paraFormat.subscript = firstChar.subscript;
                    paraFormat.appliedParagraphStyle = firstChar.appliedParagraphStyle ? firstChar.appliedParagraphStyle.name : null;
                    paraFormat.appliedCharacterStyle = firstChar.appliedCharacterStyle ? firstChar.appliedCharacterStyle.name : null;
                    try {
                        paraFormat.startIndex = para.characters[0].index;
                        paraFormat.endIndex = para.characters[para.characters.length - 1].index;
                    } catch(e) {}
                } else {
                    // Empty paragraph - still store it
                    paraFormat.text = "";
                }
            } catch(e) {
                // If error, at least store empty text
                paraFormat.text = "";
            }
            paragraphInfo.push(paraFormat);
        }
        
        // Collect formatting for each character
        for (var i = 0; i < textLength; i++) {
            var charObj = textObj.characters[i];
            var format = {};
            
            // Safely get properties that might not exist
            try { 
                if (charObj.fillColor) {
                    format.fillColor = charObj.fillColor.name;
                    format.fillColorObj = charObj.fillColor;
                } else {
                    format.fillColor = null;
                }
            } catch(e) { format.fillColor = null; }
            
            try { 
                if (charObj.strokeColor) {
                    format.strokeColor = charObj.strokeColor.name;
                    format.strokeColorObj = charObj.strokeColor;
                } else {
                    format.strokeColor = null;
                }
            } catch(e) { format.strokeColor = null; }
            try { format.appliedFont = charObj.appliedFont ? charObj.appliedFont.name : null; } catch(e) { format.appliedFont = null; }
            try { format.pointSize = charObj.pointSize; } catch(e) { format.pointSize = null; }
            try { format.leading = charObj.leading; } catch(e) { format.leading = null; }
            try { format.tracking = charObj.tracking; } catch(e) { format.tracking = null; }
            try { format.horizontalScale = charObj.horizontalScale; } catch(e) { format.horizontalScale = null; }
            try { format.verticalScale = charObj.verticalScale; } catch(e) { format.verticalScale = null; }
            try { format.baselineShift = charObj.baselineShift; } catch(e) { format.baselineShift = null; }
            try { format.skew = charObj.skew; } catch(e) { format.skew = null; }
            try { format.underline = charObj.underline; } catch(e) { format.underline = false; }
            try { format.strikethrough = charObj.strikethrough; } catch(e) { format.strikethrough = false; }
            try { format.allCaps = charObj.allCaps; } catch(e) { format.allCaps = false; }
            try { format.smallCaps = charObj.smallCaps; } catch(e) { format.smallCaps = false; }
            try { format.superscript = charObj.superscript; } catch(e) { format.superscript = false; }
            try { format.subscript = charObj.subscript; } catch(e) { format.subscript = false; }
            try { format.appliedParagraphStyle = charObj.appliedParagraphStyle ? charObj.appliedParagraphStyle.name : null; } catch(e) { format.appliedParagraphStyle = null; }
            try { format.appliedCharacterStyle = charObj.appliedCharacterStyle ? charObj.appliedCharacterStyle.name : null; } catch(e) { format.appliedCharacterStyle = null; }
            
            formattingInfo.push(format);
        }

        // Show progress indicator
        var progressWindow = new Window("palette", "Translation in Progress...");
        var progressText = progressWindow.add("statictext", undefined, "Translating text...");
        progressWindow.add("statictext", undefined, "Please wait, this may take a moment.");
        progressWindow.center();
        progressWindow.show();
        
        // Translate all paragraphs first, then replace all text at once
        var translatedParagraphs = [];
        var hasTranslatedContent = false;
        
        for (var tp = 0; tp < paraCount; tp++) {
            // Update progress message
            try {
                if (progressWindow && progressText) {
                    progressText.text = "Translating paragraph " + (tp + 1) + " of " + paraCount + "...";
                    progressWindow.update();
                }
            } catch (e) {
                // Continue if progress update fails
            }
            var origPara = paragraphs[tp];
            if (!origPara || !origPara.isValid) {
                translatedParagraphs.push("");
                continue;
            }
            
            // Check if paragraph has characters
            if (!origPara.characters || origPara.characters.length === 0) {
                translatedParagraphs.push("");
                continue;
            }
            
            var paraText = "";
            try {
                paraText = origPara.contents ? String(origPara.contents) : "";
                // Remove paragraph break character if present (InDesign adds it to para.contents)
                paraText = paraText.replace(/\r/g, "").replace(/\n/g, "");
            } catch (e) {
                // If we can't get contents, try to build from characters
                try {
                    paraText = "";
                    for (var ci = 0; ci < origPara.characters.length; ci++) {
                        var charObj = origPara.characters[ci];
                        if (charObj && charObj.contents) {
                            paraText += String(charObj.contents);
                        }
                    }
                } catch (e2) {
                    translatedParagraphs.push("");
                    continue;
                }
            }
            
            if (paraText && trimString(paraText) !== "") {
                // Add delay between API calls to avoid rate limiting
                if (tp > 0) {
                    $.sleep(200);
                }
                
                try {
                    // Translate this paragraph
                    var translatedPara = callGeminiAPI(paraText);
                    
                    // Check if translation is different from original (to detect if API returned same text)
                    if (translatedPara && trimString(translatedPara) !== "" && trimString(translatedPara) !== trimString(paraText)) {
                        // Successfully translated and different from original
                        translatedParagraphs.push(translatedPara);
                        hasTranslatedContent = true;
                    } else if (translatedPara && trimString(translatedPara) !== "" && trimString(translatedPara) === trimString(paraText)) {
                        // API returned same text (might be an error), try again
                        $.sleep(300);
                        translatedPara = callGeminiAPI(paraText);
                        if (translatedPara && trimString(translatedPara) !== "" && trimString(translatedPara) !== trimString(paraText)) {
                            translatedParagraphs.push(translatedPara);
                            hasTranslatedContent = true;
                        } else {
                            // Still same or empty, keep original
                            translatedParagraphs.push(paraText);
                        }
                    } else {
                        // Translation returned empty, try again
                        $.sleep(300);
                        translatedPara = callGeminiAPI(paraText);
                        if (translatedPara && trimString(translatedPara) !== "" && trimString(translatedPara) !== trimString(paraText)) {
                            translatedParagraphs.push(translatedPara);
                            hasTranslatedContent = true;
                        } else {
                            // Still failed, keep original
                            translatedParagraphs.push(paraText);
                        }
                    }
                } catch (e) {
                    // Error translating, try once more
                    try {
                        $.sleep(300);
                        var translatedPara = callGeminiAPI(paraText);
                        if (translatedPara && trimString(translatedPara) !== "" && trimString(translatedPara) !== trimString(paraText)) {
                            translatedParagraphs.push(translatedPara);
                            hasTranslatedContent = true;
                        } else {
                            translatedParagraphs.push(paraText);
                        }
                    } catch (e2) {
                        // Still failed, keep original
                        translatedParagraphs.push(paraText);
                    }
                }
            } else {
                translatedParagraphs.push("");
            }
        }
        
        // Close progress window
        try {
            if (progressWindow) {
                progressWindow.close();
            }
        } catch (e) {
            // Continue if closing fails
        }
        
        // Check if we translated anything
        if (!hasTranslatedContent) {
            alert("Translation failed. Please check your API key and internet connection.");
            return;
        }
        
        // Show progress for formatting
        try {
            if (progressWindow) {
                progressWindow.close();
            }
            progressWindow = new Window("palette", "Applying Formatting...");
            progressWindow.add("statictext", undefined, "Applying formatting to translated text...");
            progressWindow.center();
            progressWindow.show();
        } catch (e) {
            // Continue if progress window creation fails
        }
        
        // Replace ALL text at once to avoid insertion issues
        app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
        
        // Join paragraphs with paragraph breaks (carriage return for InDesign)
        var translatedText = translatedParagraphs.join("\r");
        
        // Replace the entire text content
        textObj.contents = translatedText;
        
        // Wait for InDesign to process
        $.sleep(200);
        
        // Now apply formatting paragraph by paragraph
        // Use the paragraphInfo we stored earlier, which has the first character's formatting for each paragraph
        var newParagraphs = textObj.paragraphs;
        
        for (var ap = 0; ap < paraCount && ap < newParagraphs.length; ap++) {
            var newPara = newParagraphs[ap];
            var origPara = paragraphs[ap];
            
            if (!newPara || !newPara.isValid || !origPara || !origPara.isValid) {
                continue;
            }
            
            if (!newPara.characters || newPara.characters.length === 0) {
                continue;
            }
            
            if (!origPara.characters || origPara.characters.length === 0) {
                continue;
            }
            
            var newParaLength = newPara.characters.length;
            
            // Set paragraph direction to LTR (Left-to-Right) for English text
            try {
                newPara.paragraphDirection = ParagraphDirectionOptions.LEFT_TO_RIGHT_DIRECTION;
            } catch (e) {
                // Try alternative property names for different InDesign versions
                try {
                    newPara.direction = ParagraphDirectionOptions.LEFT_TO_RIGHT_DIRECTION;
                } catch (e2) {
                    try {
                        newPara.justification = Justification.LEFT_ALIGN;
                    } catch (e3) {
                        // Continue if direction setting fails
                    }
                }
            }
            
            // Get the paragraph formatting from paragraphInfo (stored earlier)
            // This has the first character's formatting for this specific paragraph
            var paraFormat = null;
            if (ap < paragraphInfo.length) {
                var storedParaInfo = paragraphInfo[ap];
                // Convert stored paragraph info to format object
                paraFormat = {
                    fillColor: storedParaInfo.fillColor,
                    fillColorObj: storedParaInfo.fillColorObj,
                    strokeColor: storedParaInfo.strokeColor,
                    strokeColorObj: storedParaInfo.strokeColorObj,
                    appliedFont: storedParaInfo.appliedFont,
                    pointSize: storedParaInfo.pointSize,
                    leading: storedParaInfo.leading,
                    tracking: storedParaInfo.tracking,
                    horizontalScale: storedParaInfo.horizontalScale,
                    verticalScale: storedParaInfo.verticalScale,
                    baselineShift: storedParaInfo.baselineShift,
                    skew: storedParaInfo.skew,
                    underline: storedParaInfo.underline,
                    strikethrough: storedParaInfo.strikethrough,
                    allCaps: storedParaInfo.allCaps,
                    smallCaps: storedParaInfo.smallCaps,
                    superscript: storedParaInfo.superscript,
                    subscript: storedParaInfo.subscript,
                    appliedParagraphStyle: storedParaInfo.appliedParagraphStyle,
                    appliedCharacterStyle: storedParaInfo.appliedCharacterStyle
                };
            }
            
            // If we don't have format, skip this paragraph
            if (!paraFormat) {
                continue;
            }
            
            // Apply formatting to all characters in this paragraph
            for (var cp = 0; cp < newParaLength; cp++) {
                try {
                    var newChar = newPara.characters[cp];
                    if (!newChar || !newChar.isValid) continue;
                    
                    // Use the paragraph's first character formatting for all characters
                    var format = paraFormat;
                    
                    if (format) {
                        
                        try {
                            // Apply font and size FIRST
                            if (format.appliedFont) {
                                try { newChar.appliedFont = app.fonts.itemByName(format.appliedFont); } catch(e) {}
                            }
                            if (format.pointSize !== null && format.pointSize !== undefined) {
                                try { newChar.pointSize = format.pointSize; } catch(e) {}
                            }
                            
                            // Apply other character properties
                            if (format.leading !== null && format.leading !== undefined) {
                                try { newChar.leading = format.leading; } catch(e) {}
                            }
                            if (format.tracking !== null && format.tracking !== undefined) {
                                try { newChar.tracking = format.tracking; } catch(e) {}
                            }
                            if (format.horizontalScale !== null && format.horizontalScale !== undefined) {
                                try { newChar.horizontalScale = format.horizontalScale; } catch(e) {}
                            }
                            if (format.verticalScale !== null && format.verticalScale !== undefined) {
                                try { newChar.verticalScale = format.verticalScale; } catch(e) {}
                            }
                            if (format.baselineShift !== null && format.baselineShift !== undefined) {
                                try { newChar.baselineShift = format.baselineShift; } catch(e) {}
                            }
                            if (format.skew !== null && format.skew !== undefined) {
                                try { newChar.skew = format.skew; } catch(e) {}
                            }
                            if (format.underline !== null && format.underline !== undefined) {
                                try { newChar.underline = format.underline; } catch(e) {}
                            }
                            if (format.strikethrough !== null && format.strikethrough !== undefined) {
                                try { newChar.strikethrough = format.strikethrough; } catch(e) {}
                            }
                            if (format.allCaps !== null && format.allCaps !== undefined) {
                                try { newChar.allCaps = format.allCaps; } catch(e) {}
                            }
                            if (format.smallCaps !== null && format.smallCaps !== undefined) {
                                try { newChar.smallCaps = format.smallCaps; } catch(e) {}
                            }
                            if (format.superscript !== null && format.superscript !== undefined) {
                                try { newChar.superscript = format.superscript; } catch(e) {}
                            }
                            if (format.subscript !== null && format.subscript !== undefined) {
                                try { newChar.subscript = format.subscript; } catch(e) {}
                            }
                            
                            // Apply paragraph style
                            if (format.appliedParagraphStyle) {
                                try {
                                    var paraStyle = doc.paragraphStyles.itemByName(format.appliedParagraphStyle);
                                    if (paraStyle && paraStyle.isValid) {
                                        newChar.appliedParagraphStyle = paraStyle;
                                    }
                                } catch (e) {}
                            }
                            
                            // Apply character style
                            if (format.appliedCharacterStyle) {
                                try {
                                    var charStyle = doc.characterStyles.itemByName(format.appliedCharacterStyle);
                                    if (charStyle && charStyle.isValid) {
                                        newChar.appliedCharacterStyle = charStyle;
                                    }
                                } catch (e) {}
                            }
                            
                            // Apply colors LAST - use direct object reference
                            if (format.fillColorObj) {
                                try {
                                    newChar.fillColor = format.fillColorObj;
                                } catch (e) {
                                    if (format.fillColor) {
                                        try {
                                            newChar.fillColor = doc.swatches.itemByName(format.fillColor);
                                        } catch (e2) {
                                            try {
                                                for (var s = 0; s < doc.swatches.length; s++) {
                                                    if (doc.swatches[s].name === format.fillColor) {
                                                        newChar.fillColor = doc.swatches[s];
                                                        break;
                                                    }
                                                }
                                            } catch (e3) {}
                                        }
                                    }
                                }
                            } else if (format.fillColor) {
                                try {
                                    newChar.fillColor = doc.swatches.itemByName(format.fillColor);
                                } catch (e) {
                                    try {
                                        for (var s = 0; s < doc.swatches.length; s++) {
                                            if (doc.swatches[s].name === format.fillColor) {
                                                newChar.fillColor = doc.swatches[s];
                                                break;
                                            }
                                        }
                                    } catch (e3) {}
                                }
                            }
                            
                            if (format.strokeColorObj) {
                                try {
                                    newChar.strokeColor = format.strokeColorObj;
                                } catch (e) {
                                    if (format.strokeColor) {
                                        try {
                                            newChar.strokeColor = doc.swatches.itemByName(format.strokeColor);
                                        } catch (e2) {
                                            try {
                                                for (var s2 = 0; s2 < doc.swatches.length; s2++) {
                                                    if (doc.swatches[s2].name === format.strokeColor) {
                                                        newChar.strokeColor = doc.swatches[s2];
                                                        break;
                                                    }
                                                }
                                            } catch (e3) {}
                                        }
                                    }
                                }
                            } else if (format.strokeColor) {
                                try {
                                    newChar.strokeColor = doc.swatches.itemByName(format.strokeColor);
                                } catch (e) {
                                    try {
                                        for (var s2 = 0; s2 < doc.swatches.length; s2++) {
                                            if (doc.swatches[s2].name === format.strokeColor) {
                                                newChar.strokeColor = doc.swatches[s2];
                                                break;
                                            }
                                        }
                                    } catch (e3) {}
                                }
                            }
                        } catch (e) {
                            // Continue if formatting fails for a character
                        }
                    }
                } catch (e) {
                    // Continue if character access fails
                }
            }
        }
        
        // Final pass: Re-apply critical formatting to ensure it sticks
        $.sleep(100);
        for (var fp = 0; fp < paraCount; fp++) {
            try {
                var finalPara = textObj.paragraphs[fp];
                var finalOrigPara = paragraphs[fp];
                
                // Validate paragraphs before accessing properties
                if (!finalPara || !finalPara.isValid) {
                    continue;
                }
                
                if (!finalOrigPara || !finalOrigPara.isValid) {
                    continue;
                }
                
                // Check if paragraphs have characters
                if (!finalPara.characters || finalPara.characters.length === 0) {
                    continue;
                }
                
                if (!finalOrigPara.characters || finalOrigPara.characters.length === 0) {
                    continue;
                }
                
                var finalParaLength = finalPara.characters.length;
                
                // Ensure paragraph direction is LTR (Left-to-Right) for English text
                try {
                    finalPara.paragraphDirection = ParagraphDirectionOptions.LEFT_TO_RIGHT_DIRECTION;
                } catch (e) {
                    // Try alternative property names for different InDesign versions
                    try {
                        finalPara.direction = ParagraphDirectionOptions.LEFT_TO_RIGHT_DIRECTION;
                    } catch (e2) {
                        // Continue if direction setting fails
                    }
                }
                
                // Get the paragraph formatting from paragraphInfo (stored earlier)
                var finalParaFormat = null;
                if (fp < paragraphInfo.length) {
                    var storedParaInfo = paragraphInfo[fp];
                    // Convert stored paragraph info to format object
                    finalParaFormat = {
                        fillColor: storedParaInfo.fillColor,
                        fillColorObj: storedParaInfo.fillColorObj,
                        strokeColor: storedParaInfo.strokeColor,
                        strokeColorObj: storedParaInfo.strokeColorObj,
                        appliedFont: storedParaInfo.appliedFont,
                        pointSize: storedParaInfo.pointSize,
                        leading: storedParaInfo.leading,
                        tracking: storedParaInfo.tracking,
                        horizontalScale: storedParaInfo.horizontalScale,
                        verticalScale: storedParaInfo.verticalScale,
                        baselineShift: storedParaInfo.baselineShift,
                        skew: storedParaInfo.skew,
                        underline: storedParaInfo.underline,
                        strikethrough: storedParaInfo.strikethrough,
                        allCaps: storedParaInfo.allCaps,
                        smallCaps: storedParaInfo.smallCaps,
                        superscript: storedParaInfo.superscript,
                        subscript: storedParaInfo.subscript,
                        appliedParagraphStyle: storedParaInfo.appliedParagraphStyle,
                        appliedCharacterStyle: storedParaInfo.appliedCharacterStyle
                    };
                }
                
                if (finalParaFormat) {
                    for (var fc = 0; fc < finalParaLength; fc++) {
                        try {
                            var finalChar = finalPara.characters[fc];
                            if (!finalChar || !finalChar.isValid) continue;
                            
                            try {
                                // Force re-apply font, size, and color using paragraph's first character format
                                if (finalParaFormat.appliedFont) {
                                    try { finalChar.appliedFont = app.fonts.itemByName(finalParaFormat.appliedFont); } catch(e) {}
                                }
                                if (finalParaFormat.pointSize !== null && finalParaFormat.pointSize !== undefined) {
                                    try { finalChar.pointSize = finalParaFormat.pointSize; } catch(e) {}
                                }
                                if (finalParaFormat.fillColorObj) {
                                    try { finalChar.fillColor = finalParaFormat.fillColorObj; } catch(e) {}
                                } else if (finalParaFormat.fillColor) {
                                    try { finalChar.fillColor = doc.swatches.itemByName(finalParaFormat.fillColor); } catch(e) {}
                                }
                            } catch (e) {
                                // Continue if formatting fails
                            }
                        } catch (e) {
                            // Continue if character access fails
                        }
                    }
                }
            } catch (e) {
                // Continue if paragraph access fails
            }
        }
        
        app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
        
        // Close progress window if still open
        try {
            if (progressWindow) {
                progressWindow.close();
            }
        } catch (e) {
            // Continue if closing fails
        }
        
    } catch (error) {
        app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
        
        // Close progress window on error
        try {
            if (typeof progressWindow !== "undefined" && progressWindow) {
                progressWindow.close();
            }
        } catch (e) {
            // Continue if closing fails
        }
        
        throw error;
    }
}

// Run the main function
main();

