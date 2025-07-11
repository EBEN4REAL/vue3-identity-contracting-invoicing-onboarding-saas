import { Given } from "cypress-cucumber-preprocessor/steps";

Given(
  "the Stripe retrievePaymentIntent request has been intercepted with status {string}",
  (status: string): void => {
    cy.intercept("POST", "**/retrieve", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          paymentIntent: {
            id: "pi_mock_id",
            status: status,
            amount: 1000,
            currency: "usd",
          },
        },
      });
    }).as("retrievePaymentIntent");
  },
);
