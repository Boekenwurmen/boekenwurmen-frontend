// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';
import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

// Load .gitignore patterns to exclude from linting
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
	// Automatically ignore files listed in .gitignore
	includeIgnoreFile(gitignorePath),
	// Apply ESLint's recommended JavaScript rules
	js.configs.recommended,
	// Apply TypeScript ESLint's recommended rules (spread array)
	...ts.configs.recommended,
	// Apply Svelte's recommended rules (spread array)
	...svelte.configs.recommended,
	// Disable ESLint rules that conflict with Prettier
	prettier,
	// Disable Svelte-specific rules that conflict with Prettier
	...svelte.configs.prettier,
	{
		// Define global variables available in browser and Node.js
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			// ============================================
			// BASE JAVASCRIPT/TYPESCRIPT RULES
			// ============================================
			// TypeScript handles undefined variables better than ESLint
			'no-undef': 'off',

			// ============================================
			// CODE STYLE & NAMING CONVENTIONS
			// ============================================
			// Prefer camelCase but allow snake_case in object properties (for APIs)
			'camelcase': ['warn', { properties: 'never', ignoreDestructuring: true }],
			// Functions must return consistently (all paths return or none do)
			'consistent-return': 'error',
			// Use const when variables aren't reassigned
			'prefer-const': 'error',
			// No var keyword - use let or const
			'no-var': 'error',
			// Use shorthand object properties: { name } instead of { name: name }
			'object-shorthand': ['error', 'always'],
			// Use template literals instead of string concatenation
			'prefer-template': 'warn',
			// Use arrow functions for callbacks
			'prefer-arrow-callback': 'warn',
			// Avoid nested ternaries - they're hard to read
			'no-nested-ternary': 'warn',
			// Simplify unnecessary ternaries: x ? true : false → !!x
			'no-unneeded-ternary': 'error',

			// ============================================
			// BEST PRACTICES
			// ============================================
			// Only allow console.warn and console.error (remove console.log before production)
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			// Avoid alert() - use proper UI notifications
			'no-alert': 'warn',
			// Never use eval() - security risk
			'no-eval': 'error',
			// No eval-like functions (setTimeout with string, etc.)
			'no-implied-eval': 'error',
			// No new Function() constructor - similar to eval
			'no-new-func': 'error',
			// Don't reassign function parameters (except their properties)
			'no-param-reassign': ['error', { props: false }],
			// Avoid redundant return await
			'@typescript-eslint/return-await': 'error',
			// Functions marked async should actually use await
			'require-await': 'warn',
			// Disallow unused expressions except short-circuit and ternary
			'@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
			// Always use === and !== (except for null checks)
			'eqeqeq': ['error', 'always', { null: 'ignore' }],
			// Always use curly braces for if/else/for/while
			'curly': ['error', 'all'],
			// Prefer dot notation over bracket notation when possible
			'dot-notation': 'error',
			// Remove unnecessary else blocks after return
			'no-else-return': 'error',
			// Avoid lonely if inside else block - use else if
			'no-lonely-if': 'error',
			// Remove unnecessary return statements
			'no-useless-return': 'error',
			// Always reject promises with Error objects
			'prefer-promise-reject-errors': 'error',
			// Always specify radix in parseInt()
			'radix': 'error',
			// Avoid Yoda conditions: if ('red' === color) → if (color === 'red')
			'yoda': 'error',

			// ============================================
			// ERROR PREVENTION
			// ============================================
			// Catch x === x comparisons (likely a mistake)
			'no-self-compare': 'error',
			// Warn about ${...} in regular strings (should be template literal)
			'no-template-curly-in-string': 'warn',
			// Catch loops that can only run once
			'no-unreachable-loop': 'error',
			// Array methods like map/filter must return a value
			'array-callback-return': 'error',
			// Constructors shouldn't return values
			'no-constructor-return': 'error',
			// Promise executor shouldn't return values
			'no-promise-executor-return': 'error',
			// Avoid await inside loops (usually should use Promise.all)
			'no-await-in-loop': 'warn',

			// ============================================
			// TYPESCRIPT-SPECIFIC RULES
			// ============================================
			projectService: true,
			// Require explicit return types on functions (with sensible exceptions)
			'@typescript-eslint/explicit-function-return-type': ['warn', {
				allowExpressions: true,
				allowTypedFunctionExpressions: true,
				allowHigherOrderFunctions: true
			}],
			// Avoid using 'any' type - be explicit
			'@typescript-eslint/no-explicit-any': 'warn',
			// Remove unused variables (allow _prefixed names)
			'@typescript-eslint/no-unused-vars': ['error', {
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_'
			}],
			// Use inline type imports: import { type User } from './types'
			'@typescript-eslint/consistent-type-imports': ['error', {
				prefer: 'type-imports',
				fixStyle: 'inline-type-imports'
			}],
			// Use 'type' instead of 'interface' for consistency
			'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
			// Prefer T[] over Array<T> for simple types
			'@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
			// Catch conditions that are always true/false
			'@typescript-eslint/no-unnecessary-condition': 'warn',
			// Use ?? instead of || for null/undefined checks
			'@typescript-eslint/prefer-nullish-coalescing': 'warn',
			// Use optional chaining: obj?.prop instead of obj && obj.prop
			'@typescript-eslint/prefer-optional-chain': 'error',
			// Promises must be awaited or returned
			'@typescript-eslint/no-floating-promises': 'error',
			// Only await actual promises
			'@typescript-eslint/await-thenable': 'error',
			// Catch incorrect promise usage (void functions, wrong returns)
			'@typescript-eslint/no-misused-promises': 'error',

			// ============================================
			// IMPORT/EXPORT RULES
			// ============================================
			// Prevent importing from index files (can cause circular dependencies)
			'no-restricted-imports': ['error', {
				patterns: ['../**/index']
			}],
			// Sort imports alphabetically within groups
			'sort-imports': ['error', {
				ignoreCase: true,
				ignoreDeclarationSort: true,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single']
			}],

			// ============================================
			// SVELTE-SPECIFIC RULES
			// ============================================
			// Prevent target="_blank" without rel="noopener noreferrer"
			'svelte/no-target-blank': 'error',
			// Don't reassign reactive declarations
			'svelte/no-reactive-reassign': 'warn',
			// Access stores with $ prefix in components
			'svelte/require-store-reactive-access': 'warn',
			// Remove unused <!-- svelte-ignore --> comments
			'svelte/no-unused-svelte-ignore': 'warn',
			// Use class: directive instead of ternary in class attribute
			'svelte/prefer-class-directive': 'warn',
			// Use style: directive instead of inline style object
			'svelte/prefer-style-directive': 'warn',
			// Use shorthand attributes: {value} instead of value={value}
			'svelte/shorthand-attribute': 'warn',
			// Use shorthand directives: on:click instead of on:click={handleClick}
			'svelte/shorthand-directive': 'warn',
			// Remove unnecessary mustaches: {value} → value for string literals
			'svelte/no-useless-mustaches': 'warn',
			// Type the createEventDispatcher for better type safety
			'svelte/require-event-dispatcher-types': 'warn',
		}
	},
	{
		// Special configuration for Svelte files
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				// Enable type-aware linting for Svelte files
				projectService: true,
				// Tell the parser to handle .svelte files
				extraFileExtensions: ['.svelte'],
				// Use TypeScript parser for script blocks
				parser: ts.parser,
				// Pass in Svelte configuration
				svelteConfig
			}
		}
	},
	// ============================================
	// RELAXED RULES FOR SPECIFIC FILE TYPES
	// ============================================
	{
		// Test files can be more flexible with types and logging
		files: ['**/*.test.ts', '**/*.test.js', '**/*.spec.ts', '**/*.spec.js'],
		rules: {
			// Allow 'any' in tests for mocking/stubbing
			'@typescript-eslint/no-explicit-any': 'off',
			// Don't require return types in test functions
			'@typescript-eslint/explicit-function-return-type': 'off',
			// Allow console.log for debugging tests
			'no-console': 'off'
		}
	},
	{
		// Config files often need console output and flexible typing
		files: ['**/*.config.js', '**/*.config.ts', 'vite.config.*', 'svelte.config.*'],
		rules: {
			// Config files often log build information
			'no-console': 'off',
			// Config objects don't need explicit return types
			'@typescript-eslint/explicit-function-return-type': 'off'
		}
	},
	{
		// Storybook stories are more declarative and don't need strict typing
		files: ['**/*.stories.ts', '**/*.stories.js', '**/*.stories.svelte'],
		rules: {
			// Story objects infer their types from Storybook
			'@typescript-eslint/explicit-function-return-type': 'off'
		}
	}
);