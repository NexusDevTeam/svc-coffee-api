import { Duration, aws_dynamodb as dynamo, aws_lambda as lambda, Stack, aws_iam as iam } from "aws-cdk-lib"
import { aws_sns as sns } from "aws-cdk-lib";
import { LambdaFunction } from "../types/types"
import path from "path";

export class LambdaSetup {
    private lambdaFunctions: LambdaFunction[];
    private stack: Stack;
    public lambdaNames: string[];

    /**
     * Initializes a new instance of the LambdaSetup class.
     * @param stack - The AWS CloudFormation stack where the Lambda functions will be deployed.
     */
    constructor(stack: Stack) {
        this.stack = stack;
        this.lambdaNames = [
            //Lambdas from entity Coffee
            "createCoffee",
            "updateCoffee",
            "getCoffeeById",
            "listAllCoffees",
            "deleteCoffee",
            "linkCoffeeToCategory",
            //Lambdas from entity Categoty
            "createCategory",
            "getCategoryById",
            "deleteCategory",
            "updateCategory",
            "listAllCategorys",
        ];
        this.lambdaFunctions = []
    }

    /**
     * Sets up Lambda functions with provided configurations.
     * @param coffeTable - The DynamoDB table that Lambda functions will interact with.
     */
    setupLambda(coffeTable: dynamo.Table, snsTopic: sns.Topic): void {

        this.lambdaNames.forEach((name: string) => {
            let config = {
                handler: `/app/${name}.handler`,
                runtime: lambda.Runtime.NODEJS_20_X,
                environment: {
                    TABLE_NAME: coffeTable.tableName,
                    SNS_TOPIC_ARN: snsTopic.topicArn,
                },
                functionName: `${name}Function`,
                timeout: Duration.minutes(5),
                code: lambda.Code.fromAsset(path.join(__dirname, "../app")),
                role: this.setupLambdaRoles(name, coffeTable, snsTopic),
            } as lambda.FunctionProps;

            let functions = this.createdLambdaFunction(name, config);
            this.lambdaFunctions.push({name: name, lambda: functions});
        });
    }

    /**
     * Retrieves the list of created Lambda functions.
     * @returns An array of LambdaFunction objects.
     */
    getLambdaSetup(): LambdaFunction[] {
        return this.lambdaFunctions;
    }

    /**
     * Configures IAM roles for Lambda functions with necessary permissions.
     * @param name - The name of the Lambda function.
     * @param coffeTable - The DynamoDB table to grant access to.
     * @returns An IAM Role with permissions to access DynamoDB and CloudWatch Logs.
     */
    private setupLambdaRoles(name: string, coffeeTable: dynamo.Table, snsTopic: sns.Topic): iam.Role {
        const snsAccess = ["updateCoffee", "updateCategory"];
    
        const inlinePolicies: { [key: string]: iam.PolicyDocument } = {
            dynamoDBAccess: new iam.PolicyDocument({
                statements: [
                    new iam.PolicyStatement({
                        actions: ["dynamodb:*"],
                        resources: [coffeeTable.tableArn],
                    }),
                ],
            }),
            logsAccess: new iam.PolicyDocument({
                statements: [
                    new iam.PolicyStatement({
                        effect: iam.Effect.ALLOW,
                        actions: ["logs:*"],
                        resources: [
                            `arn:aws:logs:${this.stack.region}:${this.stack.account}:log-group:/aws/lambda/${name}`,
                        ],
                    }),
                ],
            }),
        };
    
        if (snsAccess.includes(name)) {
            inlinePolicies.snsPublish = new iam.PolicyDocument({
                statements: [
                    new iam.PolicyStatement({
                        effect: iam.Effect.ALLOW,
                        actions: ["sns:Publish"],
                        resources: [snsTopic.topicArn],
                    }),
                ],
            });
        }
    
        // Criar Role
        const role = new iam.Role(this.stack, `${name}LambdaRole`, {
            assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
            inlinePolicies,
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
            ],
        });
    
        return role;
    }    

    /**
     * Creates a new AWS Lambda function with the specified configuration.
     * @param name - The name of the Lambda function.
     * @param config - The configuration properties for the Lambda function.
     * @returns A newly created Lambda function.
     */
    private createdLambdaFunction(name: string, config: lambda.FunctionProps): lambda.Function {
        return new lambda.Function(this.stack, `${name}ID`, config);
    }
}
