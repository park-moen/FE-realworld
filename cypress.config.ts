import * as https from 'https';
import { plugin as cypressGrepPlugin } from '@cypress/grep/plugin';
import axios from 'axios';
import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development' && !process.env.CI) {
  const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
  dotenv.config({ path: envFile });
  console.log(`📋 Loading .env file: ${envFile}`);
}

const BASE_URL = process.env.BASE_URL || process.env.CYPRESS_BASE_URL || 'https://localhost:5173';
const CYPRESS_API_URL = process.env.CYPRESS_API_URL || 'https://realworld-nest-prisma-production.up.railway.app/api';

console.log(`🌐 BASE_URL: ${BASE_URL}`);
console.log(`🔌 CYPRESS_API_URL: ${CYPRESS_API_URL}`);
console.log(`🏗️  NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`🎯 CYPRESS_ENV: ${process.env.CYPRESS_ENV}`);

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL,
    async setupNodeEvents(_, config) {
      cypressGrepPlugin(config);

      const isRunMode = config.isTextTerminal;

      if (isRunMode) {
        const tags = getTagsForEnv();
        if (tags) {
          config.env.grepTags = tags.join(' ');
          config.env.grepFilterSpecs = true;
        }
      }

      const user = await createE2ETestUser();
      config.env.testUser = user;

      return config;
    },
    env: {
      apiUrl: `${BASE_URL}/api`,
    },
    chromeWebSecurity: false,
  },
});

async function createE2ETestUser() {
  const id = Date.now();
  const userPayload = {
    username: `e2e_user_${id}`,
    email: `e2e-user_${id}@example.com`,
    password: 'testpassword123',
  };

  console.log(`🔌 Creating E2E user via: ${CYPRESS_API_URL}/users`);

  const maxRetries = 5;
  let lastError: Error | null = null;

  // 🔥 자체 서명 인증서를 허용하는 HTTPS Agent 생성
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}...`);

      // eslint-disable-next-line no-await-in-loop
      const response = await axios.post(
        `${CYPRESS_API_URL}/users`,
        {
          user: userPayload,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
          httpsAgent, // 🔥 자체 서명 인증서 허용
        },
      );

      console.log('✅ E2E test user created:', response.data.user.username);

      return {
        ...response.data.user,
        password: userPayload.password,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        lastError = new Error(`axios error: ${JSON.stringify(error.response?.data || error.message)}`);

        console.warn(`⚠️  Attempt ${attempt} failed:`, {
          status: error.response?.status,
          message: error.message,
        });

        if (attempt < maxRetries) {
          const waitTime = attempt * 3000;
          console.log(`⏳ Waiting ${waitTime}ms before retry...`);
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => {
            setTimeout(resolve, waitTime);
          });
        }
      } else if (error instanceof Error) {
        lastError = error;
      }
    }
  }

  throw new Error(`[createE2ETestUser] Failed after ${maxRetries} attempts: ${lastError?.message}`);
}

const TAGS_BY_ENV = {
  preview: ['@smoke', '@access'],
  develop: ['@functional', '@destructive', '@access'],
  stage: ['@functional', '@destructive', '@access', '@prod-safe'],
  prod: ['@smoke', '@prod-safe', '@access'],
} as const;

function getTagsForEnv() {
  const env = process.env.CYPRESS_ENV;
  if (!env) {
    throw new Error(
      '[cypress.config] CYPRESS_ENV is not defined. Set it to one of: preview, develop, stage, pred, debug',
    );
  }

  if (env === 'debug') {
    return null;
  }

  const tags = TAGS_BY_ENV?.[env as keyof typeof TAGS_BY_ENV];
  if (!tags) {
    throw new Error(
      `[cypress.config] Unknown CYPRESS_ENV "${env}". Set it to one of: preview, develop, stage, prod, debug`,
    );
  }
  return tags;
}
