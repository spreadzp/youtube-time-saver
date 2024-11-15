export type I18nMessage = {
  message: string;
  description?: string;
};

export type LanguageMessages = {
  english: I18nMessage;
  chinese: I18nMessage;
  japanese: I18nMessage;
  korean: I18nMessage;
  spanish: I18nMessage;
  french: I18nMessage;
  german: I18nMessage;
  italian: I18nMessage;
  russian: I18nMessage;
  portuguese: I18nMessage;
};

export type TabsContent = {
  message?: string;
  youtube?: I18nMessage;
  ai?: I18nMessage;
  aiFree?: I18nMessage;
  help?: I18nMessage;
  settings?: I18nMessage;
  about?: I18nMessage;
};

export type ApiSettings = {
  title: I18nMessage;
  description: I18nMessage;
  newTitle: I18nMessage;
  apiKey: {
    label: I18nMessage;
    placeholder: I18nMessage;
  };
  modelName: {
    label: I18nMessage;
    placeholder: I18nMessage;
  };
  alerts: {
    enterKey: I18nMessage;
    success: I18nMessage;
  };
};

export type ContentI18 = {
  extensionDescription: I18nMessage;
  extensionName: I18nMessage;
  common: {
    message: string;
    save: I18nMessage;
    supportProject: I18nMessage;
    languages: LanguageMessages;
    loading: I18nMessage;
    toggleTheme?: I18nMessage;
    error?: I18nMessage;
  };
  tabs?: TabsContent;
  youtubeTab?: {
    message: string;
    title: I18nMessage;
    description: I18nMessage;
    getTranscript: I18nMessage;
    analyze: I18nMessage;
    download: I18nMessage;
  };
  aiTab?: {
    message: string;
    title: I18nMessage;
    description: I18nMessage;
    outputLanguage: I18nMessage;
    apiKey: I18nMessage;
    enterApiKey: I18nMessage;
    systemPrompt: I18nMessage;
    systemPromptPlaceholder: I18nMessage;
    userPrompt: I18nMessage;
    userPromptPlaceholder: I18nMessage;
    analyzing: I18nMessage;
    analyze: I18nMessage;
    analysisResult: I18nMessage;
    downloadText: I18nMessage;
    setApiKey: I18nMessage;
  };
  aiFreeTab?: {
    message: string;
    title: I18nMessage;
    description: I18nMessage;
  };
  settingsTab?: {
    message: string;
    title: I18nMessage;
    description: I18nMessage;
    apiSettings: ApiSettings;
  };
  helpTab?: {
    message: string;
    title: I18nMessage;
    description?: I18nMessage;
    documentation?: {
      message: string;
      title: I18nMessage;
      description: I18nMessage;
    };
    howToUse?: {
      title: I18nMessage;
      description: I18nMessage;
      steps: I18nMessage;
    };
    quickGuide?: {
      title: I18nMessage;
      steps: {
        step1: I18nMessage;
        step2: I18nMessage;
        step3: I18nMessage;
        step4: I18nMessage;
        step5: I18nMessage;
      };
    };
    feedback?: {
      message?: string;
      title: I18nMessage;
      description: I18nMessage;
      placeholder?: I18nMessage;
      submit?: I18nMessage;
    };
  };
  aboutTab?: {
    message: string;
    title: I18nMessage;
    description: I18nMessage;
    version?: I18nMessage;
    copyright?: I18nMessage;
    author?: I18nMessage;
    license?: I18nMessage;
    homepage?: I18nMessage;
    features?: {
      title: I18nMessage;
      list?: {
        youtubeIntegration: I18nMessage;
        transcripts: I18nMessage;
        aiSummaries: I18nMessage;
        apiOptions: I18nMessage;
        support: I18nMessage;
      };
    };
  };
};
