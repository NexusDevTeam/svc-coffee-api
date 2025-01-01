import { Duration, aws_dynamodb as dynamo, aws_lambda as lambda, Stack, aws_iam as iam } from "aws-cdk-lib"
import { LambdaFunction } from "../types/types"
import path from "path";

export interface ILambdaSetup {
    setupLambda(coffeTable: dynamo.Table): void,
    getLambdaSetup(): LambdaFunction[],
}

export class LambdaSetup implements ILambdaSetup {
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
            "createCoffee",
            "updateCoffee",
            "getCoffeeById",
            "listAllCoffees",
            // "deleteCoffee",
            //Lambdas from entity
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
    setupLambda(coffeTable: dynamo.Table): void {

        this.lambdaNames.forEach((name: string) => {
            let config = {
                handler: `/app/${name}.handler`,
                runtime: lambda.Runtime.NODEJS_20_X,
                environment: {
                    TABLE_NAME: coffeTable.tableName,
                },
                functionName: `${name}Function`,
                timeout: Duration.minutes(5),
                code: lambda.Code.fromAsset(path.join(__dirname, "../app")),
                role: this.setupLambdaRoles(name, coffeTable),
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
    private setupLambdaRoles(name: string, coffeTable: dynamo.Table): iam.Role {
        let roles = new iam.Role(this.stack, `${name}LambdaRole`, {
            assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
            inlinePolicies: {
                dynamoDBAAccess: new iam.PolicyDocument({
                    statements: [new iam.PolicyStatement({
                        actions: ["dynamodb:*"],
                        resources: [coffeTable.tableArn],
                    })]
                }),
                logsAccess: new iam.PolicyDocument({
                    statements: [new iam.PolicyStatement({
                        effect: iam.Effect.ALLOW,
                        actions: ["logs:*"],
                        resources: [`arn:aws:logs:${this.stack.region}:${this.stack.account}:log-group:/aws/lambda/${name}`]
                    })]
                })
            },
            managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")]
        });

        return roles;
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
