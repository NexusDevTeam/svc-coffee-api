import { Stack, aws_appsync as appsync, aws_iam as iam, aws_ssm as ssm } from "aws-cdk-lib";
import * as fs from "fs" 
import { LambdaFunction } from "../types/types";
import path from "path";

export class AppSyncSetup {

    private stack: Stack;
    private appsyncAPI: appsync.CfnGraphQLApi; 

    constructor(stack: Stack) {
        this.stack = stack
    }

    setupAppSync(lambdas: LambdaFunction[]): void {
        let roles = new iam.Role(this.stack, `AppSyncAPIRole`, {
            assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com"),
            inlinePolicies: {
                logsAccess: new iam.PolicyDocument({
                    statements: [
                        new iam.PolicyStatement({
                            effect: iam.Effect.ALLOW,
                            actions: ["logs:*"],
                            resources: [`arn:aws:logs:*:*:*`],
                        }),
                        new iam.PolicyStatement({
                            effect: iam.Effect.ALLOW,
                            actions: ["ssm:PutParameter"],
                            resources: [`arn:aws:ssm:*:*:parameter/aws/appsync/coffeeAPIUrl`],
                        }),
                    ],
                }),
            },
        });
        
        this.appsyncAPI = new appsync.CfnGraphQLApi(this.stack, "CoffeeApi", {
            authenticationType: appsync.AuthorizationType.API_KEY,
            name: "CoffeeAPI",
            logConfig: {
                fieldLogLevel: "ALL",
                cloudWatchLogsRoleArn: roles.roleArn,
            },
        });

        const graphqlSchema = fs.readFileSync(path.join(__dirname, "../graphql/schema.graphql"), {
            encoding: "utf-8",
        })

        const apiUrlCfn =  new appsync.CfnGraphQLSchema(this.stack, "CoffeeAPISchema", {
            apiId: this.appsyncAPI.attrApiId,
            definition: graphqlSchema,
        });
    // ---------- SSM Parameters ----------

    const apiEndpointParameter = new ssm.StringParameter(
        this.stack,
        "CoffeeApiUrl",
        {
          parameterName: "/tucanto/appsync/CoffeeApiUrl",
          stringValue: this.appsyncAPI.attrGraphQlUrl,
        }
      );
        this.setupResolvers(lambdas);
    }

    private setupResolvers(lambdas: LambdaFunction[]): void {
        const ignoreLambdas: string[] = [];

        lambdas.forEach(({ name, lambda }) => {
            let roles = new iam.Role(this.stack, `${name}APIRole`, {
                assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com"),
                inlinePolicies: {
                    logsAccess: new iam.PolicyDocument({
                        statements: [new iam.PolicyStatement({
                            effect: iam.Effect.ALLOW,
                            actions: ["lambda:InvokeFunction"],
                            resources: [lambda.functionArn]
                        }), new iam.PolicyStatement({
                            actions: [`appsync:GraphQL`],
                            resources: [`arn:aws:appsync:${this.stack.region}:${this.stack.account}:apis/${this.appsyncAPI}/types/Querys/fields/${name}`]
                        })]
                    })
                },
            });

            let dataSources = new appsync.CfnDataSource(this.stack, `${name}DataSources`, {
                apiId: this.appsyncAPI.attrApiId,
                name: `${name}DataSource`,
                type: "AWS_LAMBDA",
                lambdaConfig: {
                    lambdaFunctionArn: lambda.functionArn,
                },
                serviceRoleArn: roles.roleArn,
            });

            new appsync.CfnResolver(this.stack, `${name}Resolver`, {
                apiId: this.appsyncAPI.attrApiId,
                fieldName: name,
                dataSourceName: dataSources.name,
                typeName: name.startsWith("get") || name.startsWith("list")
                ? "Query"
                : "Mutation",
                requestMappingTemplate: appsync.MappingTemplate.lambdaRequest().renderTemplate(),
                responseMappingTemplate: appsync.MappingTemplate.lambdaResult().renderTemplate(),
            }).addDependency(dataSources);
        });
    }
}