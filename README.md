
# ☕ Svc Coffee API Project

Welcome to the **Svc Coffee API** project! This project is a Cloud Development Kit (CDK) application written in TypeScript, designed to deploy AWS infrastructure for a coffee service API. Below you'll find information about the technologies used, the project structure, and how to get started.

## 📚 Technologies Used

- **AWS CDK**: A framework for defining cloud infrastructure in code and provisioning it through AWS CloudFormation.
- **TypeScript**: A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- **Jest**: A delightful JavaScript testing framework with a focus on simplicity.
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.

## 📂 Project Structure

Here's a quick overview of the project's folder structure:

```
/svc-coffee-api
├── bin
│   └── svc-coffee-api.ts       # Entry point for the CDK app
├── lib
│   └── svc-coffee-api-stack.ts # Defines the AWS infrastructure stack
├── test
│   └── svc-coffee-api.test.ts  # Unit tests for the stack
├── README.md                   # Project documentation
├── package.json                # Project metadata and dependencies
├── tsconfig.json               # TypeScript configuration
└── cdk.json                    # CDK configuration
```

## 🚀 Getting Started

To get started with the project, follow these steps:

1. **Install Dependencies**: Ensure you have Node.js and npm installed. Then, run the following command to install the project dependencies:

   ```bash
   npm install
   ```

2. **Build the Project**: Compile the TypeScript code to JavaScript using:

   ```bash
   npm run build
   ```

3. **Watch for Changes**: Continuously compile the project as you make changes:

   ```bash
   npm run watch
   ```

4. **Run Tests**: Execute the unit tests using Jest:

   ```bash
   npm run test
   ```

5. **Deploy the Stack**: Deploy the AWS infrastructure defined in the stack to your AWS account:

   ```bash
   npx cdk deploy
   ```

6. **View Differences**: Compare the deployed stack with your current code:

   ```bash
   npx cdk diff
   ```

7. **Synthesize CloudFormation Template**: Generate the CloudFormation template for your stack:

   ```bash
   npx cdk synth
   ```

## 🌍 Environment Configuration

The stack is currently set to deploy in the `us-east-1` region. You can customize the deployment environment by modifying the `env` property in the `bin/svc-coffee-api.ts` file.

## 📄 Additional Information

For more details on how to work with AWS CDK, refer to the [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/latest/guide/home.html).

Feel free to contribute to this project by submitting issues or pull requests. Happy coding! 🎉

---

This README provides a comprehensive overview of the Svc Coffee API project, including its technologies, structure, and usage instructions.
