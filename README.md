# Veriam Customer Front-End
This is the front-end application for the Veriam Customer portal.

## Project setup

### Clone the repository with submodules

```bash
git clone --recurse-submodules git@gitlab.com:metricsmatter/it/dev/frontend/sc_front.git
```

### Install dependencies and run setup script

```bash
npm install
npm run setup
```

### Compiles and hot-reloads for development

```bash
npm run dev
```

### Compiles and minifies for production

```bash
npm run build
```

## Schemas

### IAM
```bash
npx openapi-typescript http://localhost/iam/openapi.json -o src/iam/iam.schemas.ts
```

### Onboarding
```bash
npx openapi-typescript http://localhost/onboarding/onboarding/openapi.json -o src/onboarding/onboarding.schemas.ts
```

### Events
```bash
npx openapi-typescript http://localhost/events/events/openapi.json -o src/events/events.schemas.ts
```

### Policies
```bash
npx openapi-typescript http://localhost/policies/policies/openapi.json -o src/policies/policies.schemas.ts
```

### Contracting
```bash
npx openapi-typescript http://localhost/contracting/contracting/openapi.json -o src/contracting/contracting.schemas.ts
```

### Billing and Invoicing
```bash
npx openapi-typescript http://localhost/billing_and_invoicing/billing_and_invoicing/openapi.json -o src/billing_and_invoicing/billing_and_invoicing.schemas.ts
```

### Configuration
```bash
npx openapi-typescript http://localhost/configuration/configuration/openapi.json -o src/configuration/configuration.schemas.ts
```

## Testing

### Development
When you are developing a new feature or checking an existing feature you can open the Cypress app on your machine, select the sc_front project and run the specific feature file.

### Regression
When making a change likely to have impact on several parts of the app you should run the full regression on your machine using (if you want to check the coverage remove the prefix flag):

```shell
CYPRESS_COVERAGE=false npm run tests:chrome
```

You can also run the tests in parallel for reduced execution time (~40%):

```shell
CYPRESS_COVERAGE=false npm run tests:chrome:parallel
```

## Visual Regression
We use the visual regression plugin to detect unexpected changes in the UI with a threshold of 10% (more than this will cause the build to fail).

When there are indeed valid changes then we need to rebase the visual baseline in CI with the job `snapshots_rebase_sc_front`.
Then we need to download the images from `cypress/snapshots/base` and update the repo.
