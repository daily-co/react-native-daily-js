// This file resolves type conflicts between React Native and Node.js type definitions

// Use React Native definitions for these web APIs
declare const URL: any;
declare const URLSearchParams: any;
declare const AbortController: any;
declare const AbortSignal: any;
declare const FormData: any;
declare const Blob: any;
declare const Request: any;
declare const Response: any;
declare const Headers: any;
declare const WebSocket: any;
declare const FileReader: any;

// Override NodeJS namespace to avoid conflicts with React Native
declare namespace NodeJS {
  interface Process {
    // Add minimal process definitions needed
    env: any;
    platform: string;
  }
  
  // Empty interface to avoid errors with require
  interface Require {}
}

// Ensure these don't conflict
declare const process: NodeJS.Process;
declare const require: any; 