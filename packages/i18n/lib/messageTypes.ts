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
  provider: {
    label: I18nMessage;
  };
  model: {
    label: I18nMessage;
  };
  apiKey: {
    label: I18nMessage;
  };
  temperature: {
    label: I18nMessage;
  };
  maxTokens: {
    label: I18nMessage;
  };
  alerts: {
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
  tabs?: {
    home: I18nMessage;
    settings: I18nMessage;
    help: I18nMessage;
    about: I18nMessage;
    aiFree: I18nMessage;
  };
  youtubeTab?: {
    message: string;
    title: I18nMessage;
    description: I18nMessage;
    getTranscript: I18nMessage;
    analyze: I18nMessage;
    download: I18nMessage;
  };
  aiTab?: {
    modelInfo: {
      message: string;
    };
    systemPrompt: I18nMessage;
    userPrompt: I18nMessage;
    analyzing: I18nMessage;
    analyze: I18nMessage;
    result: I18nMessage;
    analysisResult: I18nMessage;
    downloadText: I18nMessage;
    error: I18nMessage;
    apiKeyMissing: I18nMessage;
  };
  aiFreeTab?: {
    message: string;
    title: I18nMessage;
    description: I18nMessage;
    systemPrompt: I18nMessage;
    userPrompt: I18nMessage;
    analyze: I18nMessage;
    analyzing: I18nMessage;
    result: I18nMessage;
    analysisResult: I18nMessage;
    downloadText: I18nMessage;
    error: I18nMessage;
  };
  settings?: {
    apiKeyRequired: I18nMessage;
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
    description: I18nMessage;
    howToUse: {
      title: I18nMessage;
      description: I18nMessage;
    };
    quickGuide: {
      title: I18nMessage;
      description: I18nMessage;
      steps: {
        step1: I18nMessage;
        step2: I18nMessage;
        step3: I18nMessage;
        step4: I18nMessage;
        step5: I18nMessage;
      };
    };
    feedback: {
      title: I18nMessage;
      description: I18nMessage;
      placeholder: I18nMessage;
      submit: I18nMessage;
    };
  };
  aboutTab?: {
    message: string;
    title: I18nMessage;
    description: I18nMessage;
    features: {
      title: I18nMessage;
      list: {
        youtubeIntegration: I18nMessage;
        transcripts: I18nMessage;
        aiSummaries: I18nMessage;
        apiOptions: I18nMessage;
        support: I18nMessage;
      };
    };
    author: I18nMessage;
    version: I18nMessage;
    copyright: I18nMessage;
    license: I18nMessage;
    homepage: I18nMessage;
  };
};

export interface MessageTypes {
  common?: {
    supportProject: { message: string };
    languages?: {
      english?: { message: string };
      chinese?: { message: string };
      japanese?: { message: string };
      korean?: { message: string };
      spanish?: { message: string };
      french?: { message: string };
      german?: { message: string };
      italian?: { message: string };
      russian?: { message: string };
      portuguese?: { message: string };
    };
    save?: { message: string };
    loading?: { message: string };
    toggleTheme?: { message: string };
    error?: { message: string };
  };
  settings?: {
    apiKeyRequired: I18nMessage;
    title?: { message: string };
    description?: { message: string };
    provider?: {
      label?: { message: string };
    };
    model?: {
      label?: { message: string };
    };
    apiKey?: {
      label?: { message: string };
      placeholder?: { message: string };
    };
    temperature?: {
      label?: { message: string };
    };
    maxTokens?: {
      label?: { message: string };
    };
    apiKeyPlaceholder?: { message: string };
    saveButton?: { message: string };
    successMessage?: { message: string };
  };
  tabs?: {
    youtube?: { message: string };
    ai?: { message: string };
    aiFree?: { message: string };
    help?: { message: string };
    settings?: { message: string };
    about?: { message: string };
  };
  youtubeTab?: {
    title?: { message: string };
    description?: { message: string };
    getTranscript?: { message: string };
    analyze?: { message: string };
    download?: { message: string };
  };
  aiTab?: {
    title?: { message: string };
    description?: { message: string };
    systemPrompt?: { message: string };
    userPrompt?: { message: string };
    analyze?: { message: string };
    analyzing?: { message: string };
    result?: { message: string };
    analysisResult?: { message: string };
    downloadText?: { message: string };
    modelInfo?: { message: string };
    error?: { message: string };
    apiKeyMissing?: { message: string };
  };
  aiFreeTab?: {
    title?: { message: string };
    description?: { message: string };
    systemPrompt?: { message: string };
    userPrompt?: { message: string };
    analyze?: { message: string };
    analyzing?: { message: string };
    result?: { message: string };
    analysisResult?: { message: string };
    downloadText?: { message: string };
    error?: { message: string };
  };
  helpTab?: {
    title?: { message: string };
    description?: { message: string };
    howToUse?: {
      title?: { message: string };
      description?: { message: string };
    };
    quickGuide?: {
      title?: { message: string };
      description?: { message: string };
      steps?: {
        step1?: { message: string };
        step2?: { message: string };
        step3?: { message: string };
        step4?: { message: string };
        step5?: { message: string };
      };
    };
    feedback?: {
      title?: { message: string };
      description?: { message: string };
      placeholder?: { message: string };
      submit?: { message: string };
    };
  };
  aboutTab?: {
    message: string;
    title: { message: string };
    description: { message: string };
    features: {
      title: { message: string };
      list: {
        youtubeIntegration: { message: string };
        transcripts: { message: string };
        aiSummaries: { message: string };
        apiOptions: { message: string };
        support: { message: string };
      };
    };
    author: { message: string };
    version: { message: string };
    copyright: { message: string };
    license: { message: string };
    homepage: { message: string };
  };
}
