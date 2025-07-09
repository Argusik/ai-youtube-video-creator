
export interface Scene {
  scene: string;
  narration: string;
  visual_prompt: string;
}

export interface ScriptResponse {
    titles: string[];
    script: Scene[];
}

export interface Short {
  title: string;
  narration: string;
  visual_prompt: string;
}

export interface ShortsResponse {
    shorts: Short[];
}
