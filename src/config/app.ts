/**
 * Application configuration
 * Update this file when releasing new versions
 */

export const appConfig = {
  // Application version - update this when releasing
  version: '0.1.0',

  // Application metadata
  name: 'CamLife',
  description: 'A platform focused on photography sharing and exploration',

  // Developer information
  developer: {
    name: 'sun0225SUN',
    role: 'Main Developer',
  },

  // Repository information
  repository: {
    url: 'https://github.com/sun0225SUN/camlife',
    platform: 'GitHub',
  },

  // License information
  license: {
    type: 'GPL-3.0',
    description: 'Project open source license information',
  },

  // Project tagline
  tagline: 'Capture life through the Camera',
} as const

export type AppConfig = typeof appConfig
