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

    constructor(stack: Stack) {
        this.stack = stack;
        this.lambdaNames = []
    }

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
            } as lambda.FunctionProps

            let functions = this.createdLambdaFunction(name, config);
            this.lambdaFunctions.push({name: name, lambda: functions});
        });
    }

    getLambdaSetup(): LambdaFunction[] {
        return this.lambdaFunctions;
    }

    private setupLambdaRoles(name: string, coffeTable: dynamo.Table): iam.Role {
        let roles = new iam.Role(this.stack, `${name}LambdaRole`, {
            assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
            inlinePolicies: {
                dynamoDBAAccess: new iam.PolicyDocument({
                    statements: [new iam.PolicyStatement({
                        actions: ["dynamodb:*"],
                        resources: [coffeTable.tableArn], 
                    }
                    )]
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
        })

        return roles;
    }

    private createdLambdaFunction(name: string, config: lambda.FunctionProps): lambda.Function {
        return new lambda.Function(this.stack, `${name}ID`, config);
    }
}