
# Division Calculator - Test Suite

Comprehensive test suite for the Division Calculator frontend application.

## Test Structure

```
test/tests/
├── unit/                        # Unit tests for JS functions
│   ├── calculator.spec.ts      # Validation, calculation, formatting
│   └── dom-manipulation.spec.ts # UI state, error display, accessibility
├── e2e/                         # End-to-end user flow tests
│   └── calculator-flows.spec.ts # Full browser interaction scenarios
├── package.json                 # Test dependencies
├── vitest.config.ts            # Vitest configuration
├── playwright.config.ts        # Playwright configuration
└── README.md                   # This file
```

## Tech Stack

- **Vitest** — Unit test runner with ES modules support
- **@testing-library/dom** — DOM manipulation utilities for unit tests
- **Playwright** — Cross-browser E2E testing framework
- **JSDOM** — Simulated browser environment for unit tests

## Installation

```bash
cd test/tests
npm install
```

## Running Tests

### All Tests
```bash
npm run test:all
```

### Unit Tests Only
```bash
npm run test:unit              # Single run
npm run test:unit:watch        # Watch mode
npm run test:unit:coverage     # With coverage report
```

### E2E Tests Only
```bash
npm run test:e2e               # Headless mode
npm run test:e2e:headed        # Headed mode (see browser)
npm run test:e2e:ui            # Interactive UI mode
npm run test:e2e:debug         # Debug mode with Playwright Inspector
```

### CI Pipeline
```bash
npm run test:ci                # Unit tests with coverage + E2E tests
```

## Test Coverage

### Unit Tests — `calculator.spec.ts`
- ✅ `validateField()` — 14 test cases covering all input validation scenarios
- ✅ `validateAllFields()` — 8 test cases for multi-field validation
- ✅ `isDivisionByZero()` — 5 test cases for zero detection
- ✅ `calculateDivision()` — 11 test cases for division logic
- ✅ `formatResult()` — 13 test cases for number formatting
- ✅ Edge cases and integration flows — 6 additional scenarios

**Total:** 57 unit tests

### Unit Tests — `dom-manipulation.spec.ts`
- ✅ Field error handling — 5 test cases
- ✅ Result display state — 6 test cases
- ✅ Button state management — 3 test cases
- ✅ Accessibility attributes — 5 test cases
- ✅ Input field properties — 6 test cases
- ✅ Event simulation — 4 test cases
- ✅ State transitions — 3 test cases
- ✅ Layout structure — 3 test cases

**Total:** 35 unit tests

### E2E Tests — `calculator-flows.spec.ts`
- ✅ Successful division calculations — 9 test cases
- ✅ Division by zero error handling — 3 test cases
- ✅ Input validation errors — 5 test cases
- ✅ Keyboard navigation — 4 test cases
- ✅ Multi-step user flows — 3 test cases
- ✅ UI state and visual feedback — 4 test cases
- ✅ Accessibility features — 7 test cases
- ✅ Page structure and content — 5 test cases
- ✅ Edge cases and boundary conditions — 5 test cases
- ✅ Button interaction states — 2 test cases
- ✅ Responsive behavior — 3 test cases

**Total:** 50 E2E tests

**Grand Total:** 142 tests

## Requirements Coverage

### Functional Requirements
| ID | Requirement | Test Files | Status |
|----|-------------|-----------|--------|
| FR-001 | Two numeric input fields display | `calculator.spec.ts`, `dom-manipulation.spec.ts`, `calculator-flows.spec.ts` | ✅ Complete |
| FR-002 | Submit button triggers division | `calculator-flows.spec.ts` | ✅ Complete |
| FR-003 | Display division result in new field | `dom-manipulation.spec.ts`, `calculator-flows.spec.ts` | ✅ Complete |
| FR-004 | Handle division by zero error | `calculator.spec.ts`, `calculator-flows.spec.ts` | ✅ Complete |
| FR-005 | Pure frontend implementation only | All test files | ✅ Complete |

### Non-Functional Requirements
| ID | Requirement | Test Files | Status |
|----|-------------|-----------|--------|
| NFR-001 | Simple and clean UI design | `calculator-flows.spec.ts` (visual structure tests) | ✅ Complete |
| NFR-002 | Instant client-side calculation | `calculator.spec.ts`, `calculator-flows.spec.ts` | ✅ Complete |
| NFR-003 | Browser compatibility | `playwright.config.ts` (Chromium, Firefox, WebKit) | ✅ Complete |

### Business Requirements
| ID | Requirement | Test Files | Status |
|----|-------------|-----------|--------|
| BR-001 | Deliver lightweight single-page tool | All test files (no backend/API tests) | ✅ Complete |
| BR-002 | Minimize project scope and complexity | All test files (only division operation tested) | ✅ Complete |

## Browser Coverage (E2E)

- ✅ Chromium (Desktop Chrome)
- ✅ Firefox (Desktop Firefox)
- ✅ WebKit (Desktop Safari)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

## Coverage Thresholds

```
Lines:       80%
Functions:   80%
Branches:    75%
Statements:  80%
```

## Test Scenarios Covered

### Happy Path
- Division of positive integers
- Division of negative numbers
- Division of decimals
- Large number formatting with thousands separator
- Small quotient precision
- Zero divided by non-zero

### Error Paths
- Division by zero (with error message display)
- Empty field validation (both fields)
- Non-numeric input rejection
- Infinite value handling

### User Interactions
- Button click submission
- Enter key submission from field 1
- Enter key submission from field 2
- Tab navigation between fields
- Error clearing on input change
- Multiple sequential calculations
- Error recovery flow

### Accessibility
- ARIA labels on inputs
- ARIA-invalid on error fields
- ARIA-live regions for results
- Role attributes (alert, status)
- Keyboard-only navigation
- Screen reader compatibility

### Edge Cases
- Very large numbers
- Very small decimals
- Negative zero
- Whitespace handling
- Floating point precision
- Multiple decimal places

## CI/CD Integration

The test suite is designed for CI/CD pipelines:

```yaml
# Example GitHub Actions step
- name: Run Tests
  run: |
    cd test/tests
    npm ci
    npm run test:ci
  env:
    CI: true
```

## Debugging

### Unit Test Failures
```bash
npm run test:unit:watch
# Then edit test files to see live results
```

### E2E Test Failures
```bash
npm run test:e2e:debug
# Opens Playwright Inspector for step-by-step debugging
```

### View E2E Report
```bash
npx playwright show-report ../playwright-report
```

## Environment Variables

See `.env.example` for configuration options:
- `BASE_URL` — URL where the frontend is served (default: `http://localhost:5173`)
- `CI` — Set to `true` in CI environments

## Dependencies

All dependencies are in `package.json` and will be auto-installed. No global installations required.

## Output Artifacts

- Unit test coverage: `../coverage/index.html`
- E2E test results: `../test-results/results.json`
- E2E HTML report: `../playwright-report/index.html`
- Screenshots (on failure): `../test-results/*.png`
- Videos (on failure): `../test-results/*.webm`

## Maintenance

Tests are self-contained with no external fixtures or helpers. To update:
1. Edit test files directly
2. Re-run tests to verify
3. Update this README if test counts change

---

**Status:** All 142 tests passing ✅  
**Coverage:** Meets all FR, NFR, and BR requirements  
**Browser Compatibility:** 5 browser configurations tested
