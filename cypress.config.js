const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://jira.ivorreic.com/project/board",
    env: {
      baseUrl: "https://jira.ivorreic.com/",
      authToken: "will-be-set-by-testfile", // Added 08.11.2024 ola-vi
      
    },
    defaultCommandTimeout: 65000, //oli 30000
    requestTimeout: 65000, //oli 20000

    testIsolation: true  //By default its true and should be mostly true! 
  },
});
