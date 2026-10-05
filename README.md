# QA Upskill - Playwright Block 4

Playwright test automation project created for the Block 4 hands-on challenge.

The tested application is based on the [QA Upskill starter project](https://github.com/MarcusPawlowski/qaupskill). It contains:

- an Astro and React frontend;
- an Express REST API;
- a SQLite database;
- Swagger API documentation.

## Challenge scope

The test suite implements the following requirements:

1. A `LoginPage` Page Object with `navigate()` and `login()` methods.
2. A custom Playwright fixture that injects `LoginPage`.
3. A `beforeAll` hook that creates a test user through the API.
4. A `beforeEach` hook that logs in through the UI.
5. A test tagged `@smoke` that verifies the dashboard is visible after login.
6. An `afterAll` hook that deletes the test user through the API.
7. A `mobile-chrome` Playwright project.

The project also includes both bonus requirements:

- authentication setup with reusable `storageState`;
- a GitHub Actions workflow that uploads the Playwright HTML report as an artifact.

## Project structure

```text
e2e/
|-- fixtures/
|   `-- test.fixture.ts
|-- helpers/
|   `-- api.helper.ts
|-- pages/
|   `-- LoginPage.ts
`-- tests/
    |-- auth.setup.ts
    |-- authenticated-dashboard.spec.ts
    `-- dashboard.spec.ts

.github/
`-- workflows/
    `-- playwright.yml

playwright.config.ts
```

## Main test flow

The dashboard smoke test uses API setup and cleanup:

1. `beforeAll` authenticates the administrator through `POST /auth/login`.
2. `beforeAll` creates a test user through `POST /people`.
3. `beforeEach` logs in as the created user through the UI using the `LoginPage` fixture.
4. The `@smoke` test verifies that the authenticated dashboard and Logout button are visible.
5. `afterAll` removes the test user through `DELETE /people/:id`.

The API paths differ from the generic `/api/users` example in the workshop presentation because this application exposes user management under `/people`.

## Requirements

- Node.js;
- npm;
- Chromium installed through Playwright.

## Installation

Install the project dependencies:

```bash
npm install
```

Install Chromium:

```bash
npx playwright install chromium
```

Create a local environment file.

PowerShell:

```powershell
Copy-Item .env.example .env
```

Bash:

```bash
cp .env.example .env
```

The `.env` file is ignored by Git.

## Running the application manually

```bash
npm run dev
```

Available services:

- frontend: `http://localhost:4321`;
- API: `http://localhost:4000`;
- Swagger: `http://localhost:4000/docs`;
- API health check: `http://localhost:4000/health`.

Playwright can also start the frontend and API automatically through the `webServer` configuration.

## Running the tests

Run the complete test suite:

```bash
npx playwright test
```

Run only tests tagged `@smoke`:

```bash
npx playwright test --grep @smoke
```

Run the desktop project:

```bash
npx playwright test --project=desktop-chrome
```

Run the mobile project:

```bash
npx playwright test --project=mobile-chrome
```

Run the authenticated project with reusable storage state:

```bash
npx playwright test --project=authenticated-chrome
```

Run tests in headed mode:

```bash
npx playwright test --headed
```

## Authentication state

The `setup` project logs in as the bootstrap administrator and saves the browser state to:

```text
playwright/.auth/admin.json
```

The `authenticated-chrome` project depends on `setup` and loads this file through `storageState`. Its test therefore begins with an authenticated session without repeating the login steps.

The authentication state file is ignored by Git because it contains session data.

## Reports and CI

Open the latest local HTML report:

```bash
npx playwright show-report
```

The GitHub Actions workflow runs the complete test suite on pushes and pull requests targeting `main`.

The HTML report is uploaded as the `playwright-report` artifact and retained for 30 days.
