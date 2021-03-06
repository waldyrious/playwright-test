# 🎭 End-to-end tests with Playwright [![npm version](https://img.shields.io/npm/v/@playwright/test.svg?style=flat)](https://www.npmjs.com/package/@playwright/test)

Zero config cross-browser end-to-end testing for web apps. Browser automation with [Playwright](https://playwright.dev), Jest-like assertions and support for TypeScript.

- [Get started](#get-started)
  - [Installation](#installation)
  - [Write a test](#write-a-test)
  - [Run the test](#run-the-test)
- [Examples](#examples)
  - [Multiple pages](#multiple-pages)
  - [Mobile emulation](#mobile-emulation)
  - [Network mocking](#network-mocking)

## Get started

### Installation

```sh
npm i -D @playwright/test
```

### Write a test

Create `foo.spec.ts` to define your test. The test function uses the [`page`](https://playwright.dev/#path=docs%2Fapi.md&q=class-page) argument for browser automation.

```js
import { it, expect } from '@playwright/test';

it('is a basic test with the page', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  const name = await page.innerText('.home-navigation');
  expect(name).toBe('🎭 Playwright');
});
```

#### Default arguments

The test runner provides browser primitives as arguments to your test functions. Test functions can use one or more of these arguments.

- `page`: Instance of [Page](https://playwright.dev/#path=docs%2Fapi.md&q=class-page). Each test gets a new isolated page to run the test.
- `context`: Instance of [BrowserContext][browser-context]. Each test gets a new isolated context to run the test. The `page` object belongs to this context.
  - `contextOptions`: Default options passed to context creation.
- `browser`: Instance of [Browser](https://playwright.dev/#path=docs%2Fapi.md&q=class-browser). Browsers are shared across tests to optimize resources. Each worker process gets a browser instance.
  - `browserOptions`: Default options passed to browser creation.

#### Specs and assertions

- Use `it` and `describe` to write test functions. Run a single test with `it.only` and skip a test with `it.skip`.
- For assertions, use the [`expect` API](https://jestjs.io/docs/en/expect).

```js
const { it, describe } = require('@playwright/test');

describe('feature foo', () => {
  it('is working correctly', async ({ page }) => {
    // Test function
  });
});
```

### Run the test

Tests can be run on single or multiple browsers and with flags to generate screenshot on test failures.

```sh
# Run all tests across Chromium, Firefox and WebKit
npx folio

# Run tests on a single browser
npx folio --param browserName=chromium

# Run all tests in headful mode
npx folio --param headful

# Save screenshots on failure in test-results directory
npx folio --param screenshotOnFailure

# Record videos
npx folio --param video

# See all options
npx folio --help
```

Test runner CLI can be customized with [test parameters](docs/parameters.md).

#### Configure NPM scripts

Save the run command as an NPM script.

```json
{
  "scripts": {
    "test": "npx folio --param screenshotOnFailure"
  }
}
```

-----------

## Examples

### Multiple pages

The default `context` argument is a [BrowserContext][browser-context]. Browser contexts are isolated execution environments that can host multiple pages. See [multi-page scenarios][multi-page] for more examples.

```js
import { it } from '@playwright/test';

it('tests on multiple web pages', async ({ context }) => {
  const pageFoo = await context.newPage();
  const pageBar = await context.newPage();
  // Test function
});
```

### Mobile emulation

The `contextOptions` fixture defines default options used for context creation. This fixture can be overriden to configure mobile emulation in the default `context`.

```js
import { folio } from '@playwright/test';
import { devices } from 'playwright';

const fixtures = folio.extend();
fixtures.contextOptions.override(async ({ contextOptions }, runTest) => {
  await runTest({
    ...contextOptions,
    ...devices['iPhone 11']
  });
});
const { it, describe, extend } = fixtures.build();

it('uses mobile emulation', async ({ context }) => {
  // Test function
});
```

### Network mocking

Define a custom argument that mocks networks call for a browser context.

```js
// In fixtures.ts
import { folio as base } from '@playwright/test';
import { BrowserContext } from 'playwright';

// Extend base fixtures with a new test-level fixture
const fixtures = base.extend<{ mockedContext: BrowserContext }>();

fixtures.mockedContext.init(async ({ context }, runTest) => {
  // Modify existing `context` fixture to add a route
  context.route(/.css/, route => route.abort());
  // Pass fixture to test functions
  runTest(context);
});

export folio = fixtures.build();
```

```js
// In foo.spec.ts
import { folio } from './fixtures';
const { it, expect } = folio;

it('loads pages without css requests', async ({ mockedContext }) => {
  const page = await mockedContext.newPage();
  await page.goto('https://stackoverflow.com');
  // Test function code
});
```

[browser-opts]: https://playwright.dev/#path=docs%2Fapi.md&q=browsertypelaunchoptions
[context-opts]: https://playwright.dev/#path=docs%2Fapi.md&q=browsernewcontextoptions
[multi-page]: https://playwright.dev/#path=docs%2Fmulti-pages.md&q=
