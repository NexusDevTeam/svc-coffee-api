import { aws_dynamodb as dynamo, Stack, aws_ssm as ssm } from "aws-cdk-lib"
import { ParameterTier } from "aws-cdk-lib/aws-ssm";

export interface IDynamoDBSetup {
    setupDynamoDB(): void;
    getDynamoDBTable(): dynamo.Table; 
}

export class DynamoDBSetup implements IDynamoDBSetup {

    private dynamoCoffeeTable: dynamo.Table;
    private stack: Stack;

    constructor (stack: Stack) {
        this.stack = stack;
    }

    setupDynamoDB(): void {
        this.dynamoCoffeeTable = new dynamo.Table(this.stack, "CoffeeTable", {
            partitionKey: {
                name: "PK",
                type: dynamo.AttributeType.STRING,
            },
            sortKey: {
                name: "SK",
                type: dynamo.AttributeType.STRING,
            },
            billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
        });
        
        new ssm.StringParameter(this.stack, "CoffeeTableName", {
            stringValue: this.dynamoCoffeeTable.tableName,
            tier: ParameterTier.STANDARD,
            parameterName: "/aws/coffeeApi/coffeeTableName",
        });
    }
    getDynamoDBTable(): dynamo.Table {
        return this.dynamoCoffeeTable;
    }
    
}