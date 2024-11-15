// isTiming = true
export const userTimingPrompt = `
Break down the video content into bullet points in English. 
Under each bullet point, describe what the point is about and mark the time when this point starts, using the "offset" value in seconds. 
If the text is less than 5 sentences, summarize it to 2 sentences. 
If the text is longer, summarize it to 5-6 sentences. 
At the end, make conclusions in 3 sentences. 
If you encounter &amp;#39;, it is an apostrophe.
`;

export const systemTimingPrompt = `
Analyze the data of this YouTube video. 
The "text" field contains the video text, the "lang" field contains the language of the text, the "offset" field contains the time in seconds where this text starts in the video. 
For example, 2973.24 seconds is 49 minutes and 55 seconds. 
The "duration" field contains the duration, the "length" field contains the length of the "text" field lines. 
The "title" field contains the video title, the "videoId" field contains the video ID, the "url" field contains the video link, the "description" field contains the video description, the "datePublished" field contains the video publication date, and the "genre" field contains the video genre.
`;

export const systemPrompt = `
Analyze the data of this YouTube video. 
The "text" field contains the video text, the "lang" field contains the language of the text, the "length" field contains the length of the "text" field lines. 
The "title" field contains the video title, the "videoId" field contains the video ID, the "url" field contains the video link, the "description" field contains the video description, the "datePublished" field contains the video publication date, and the "genre" field contains the video genre.
`;

// New prompts for more detailed analysis
export const userDetailedPrompt = `
Provide a detailed analysis of the video in English. 
Break down the content into bullet points, under each bullet point describe what the point is about. 
Summarize each point in 5-6 sentences. 
If you encounter &amp;#39;, it is an apostrophe. 
Also, provide additional information: 
1. Key moments of the video.
2. Important quotes or statements.
3. Make conclusions in 3-6 sentences.
4. Use English language.
`;

export const systemDetailedPrompt = `
Analyze the data of this YouTube video. 
The "text" field contains the video text, the "lang" field contains the language of the text, the "length" field contains the length of the "text" field lines. 
The "title" field contains the video title, the "videoId" field contains the video ID, the "url" field contains the video link, the "description" field contains the video description, the "datePublished" field contains the video publication date, and the "genre" field contains the video genre.
`;

export const systemPromptWithLanguage = (language: string) => `
Prepare responses for analysis in ${language} language.
`;
export const userPromptWithLanguage = (language: string) => `
Break down the video content into bullet points in ${language} language. `;

export const userDefaultPrompt = () => ` 
Break down the content into bullet points, under each bullet point describe what the point is about. 
Summarize each point in 5-6 sentences. 
If you encounter &amp;#39;, it is an apostrophe. 
Also, provide additional information: 
1. Key moments of the video.
2. Important quotes or statements.
3. Make conclusions in 3-6 sentences. 
`;

export const systemDefaultPrompt = () => `
Be helpful AI assistant.Analyze the text of this YouTube video.`;
