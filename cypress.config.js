const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://ashy-beach-00ce8fa1e.4.azurestaticapps.net',
  },
});
