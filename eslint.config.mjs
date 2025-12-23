/**
 * ESLint Flat Config (v9+)
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import { configs, plugins } from 'eslint-config-airbnb-extended';
import { rules as prettierConfigRules } from 'eslint-config-prettier';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import prettierPlugin from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

const jsConfig = [
  // ESLint 권장 규칙 적용
  {
    name: 'js/config',
    ...js.configs.recommended,
  },
  // 코드 스타일 관련 플러그인
  plugins.stylistic,
  // Import 문 정렬 및 검증을 위한 플러그인
  plugins.importX,
  // Airbnb 기본 권장 설정
  ...configs.base.recommended,
];

const reactConfig = [
  // React 관련 규칙 플러그인
  plugins.react,
  // React Hooks 규칙 플러그인
  plugins.reactHooks,
  // JSX 접근성(a11y) 검사 플러그인
  plugins.reactA11y,
  // Airbnb React 권장 설정
  ...configs.react.recommended,
];

const typescriptConfig = [
  // TypeScript ESLint 플러그인
  plugins.typescriptEslint,
  // Airbnb TypeScript 기본 설정
  ...configs.base.typescript,
  // Airbnb React + TypeScript 설정
  ...configs.react.typescript,

  // 기본 설정: src 파일은 tsconfig.json (참조를 통해 tsconfig.app.json 사용)
  {
    name: 'typescript/import-resolver',
    files: ['src/**/*.{ts,tsx}'], // src 파일에만 적용
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: ['./tsconfig.json'], // src용 tsconfig
        }),
      ],
    },
  },

  // E2E 전용 설정: e2e 파일은 tsconfig.node.json 사용
  {
    name: 'typescript/import-resolver-e2e',
    files: ['e2e/**/*.{ts,js}', 'playwright.config.ts'], // e2e 파일에만 적용
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: ['./tsconfig.node.json'], // e2e용 tsconfig
        }),
      ],
    },
  },
];

const prettierConfig = [
  // Prettier Plugin
  {
    name: 'prettier/plugin/config',
    plugins: {
      prettier: prettierPlugin,
    },
  },
  // Prettier Config
  {
    name: 'prettier/config',
    rules: {
      ...prettierConfigRules,
      'prettier/prettier': 'error',
    },
  },
];

const allowEmptyInterfaceForStoreFile = [
  {
    name: 'custom/store-empty-interface',
    files: ['src/shared/store.ts', 'src/entities/**/*.{js,ts,jsx,tsx}'],
    rules: {
      // 빈 인터페이스 선언 허용
      // 이유: RTK의 동적 슬라이스 로딩 패턴 적용을 위해서는 빈 interface가 필요함.
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
    },
  },
];

const customRulesConfig = [
  {
    name: 'custom/rules',
    rules: {
      // 함수에서 일관된 return을 강제하지 않음
      // 이유: 조건부 로직에서 early return 패턴 허용
      'consistent-return': 'off',

      // default export를 선호하지 않음
      // 이유: named export가 리팩토링과 tree-shaking에 더 유리
      'import-x/prefer-default-export': 'off',

      // Prettier 규칙 위반을 경고로 처리
      // 이유: 개발 중에는 경고만 표시하고 CI에서 에러로 처리
      'prettier/prettier': 'warn',

      // React 17+에서는 JSX Transform으로 인해 불필요
      // 이유: React를 import하지 않아도 JSX 사용 가능
      'react/react-in-jsx-scope': 'off',

      // 파라미터 재할당 허용
      // 이유: Immer, Redux Toolkit 등에서 draft 객체 수정 시 필요
      'no-param-reassign': 'off',

      // React 컴포넌트의 defaultProps 강제하지 않음
      // 이유: TypeScript의 optional parameter로 대체 가능
      'react/require-default-props': 'off',

      // 정의 전 사용 검사 비활성화 (TypeScript용)
      // 이유: TypeScript 컴파일러가 이미 검사하므로 중복
      '@typescript-eslint/no-use-before-define': 'off',

      // import 확장자 검사 비활성화
      // 이유: TypeScript와 번들러가 자동으로 처리
      'import-x/extensions': 'off',

      // JSX props spreading 허용
      // 이유: HOC 패턴이나 wrapper 컴포넌트에서 필요
      'react/jsx-props-no-spreading': 'off',

      // Import 문 정렬 규칙 (FSD 구조에 맞춘 설정)
      'import-x/order': [
        'error',
        {
          // FSD(Feature-Sliced Design) 레이어 순서 정의
          pathGroups: [
            // React를 최상단에 배치
            { pattern: 'react', group: 'builtin' },
            // FSD 레이어 순서: shared -> entities -> features -> widgets -> pages
            { pattern: '~shared/**', group: 'internal', position: 'before' },
            { pattern: '~entities/**', group: 'internal', position: 'before' },
            { pattern: '~features/**', group: 'internal', position: 'before' },
            { pattern: '~widgets/**', group: 'internal', position: 'before' },
            { pattern: '~pages/**', group: 'internal', position: 'before' },
          ],
          // builtin 패턴은 pathGroups에서 제외
          pathGroupsExcludedImportTypes: ['builtin'],
          // import 그룹 순서: builtin -> external -> internal -> parent -> sibling -> index
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          // import 그룹 간 빈 줄 없음
          'newlines-between': 'never',
          // 알파벳 순서로 정렬 (대소문자 구분 없음)
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
];

// 설정 파일에 대한 예외 규칙
const environmentConfig = [
  {
    name: 'custom/environment-config',
    files: ['./eslint.config.mjs'],
    rules: {
      'no-underscore-dangle': 'off',
    },
  },
];

// 테스트 파일 및 설정 파일에 대한 예외 규칙
const testFilesOverrides = [
  {
    name: 'custom/test-overrides',
    // 테스트 관련 파일 및 E2E 설정 파일
    files: ['src/shared/lib/test/**/*.{js,ts,jsx,tsx}', 'src/**/*.{js,ts,jsx,tsx}', 'playwright.config.ts', 'e2e/**'],
    rules: {
      // devDependencies import 허용
      // 이유: 테스트 파일에서는 테스트 라이브러리 import 필요
      'import-x/no-extraneous-dependencies': 'off',
    },
  },
];

export default [
  // .gitignore에 명시된 파일/폴더를 ESLint에서 제외
  includeIgnoreFile(gitignorePath),
  // JavaScript 기본 설정
  ...jsConfig,
  // React 설정
  ...reactConfig,
  // TypeScript 설정
  ...typescriptConfig,
  // Prettier 설정
  ...prettierConfig,
  // Custom 규칙
  ...customRulesConfig,
  // Store 규칙
  ...allowEmptyInterfaceForStoreFile,
  // 설정 파일 예외 규칙
  ...environmentConfig,
  // 테스트 파일 예외 규칙
  ...testFilesOverrides,
];
