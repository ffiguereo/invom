const common = [
  '--require-module ts-node/register' // Load TypeScript module
];

const ivom_backend = [
  ...common,
  'tests/apps/ivom/backend/features/**/*.feature',
  '--require tests/apps/ivom/backend/features/step_definitions/*.steps.ts'
].join(' ');

module.exports = {
  ivom_backend
};
