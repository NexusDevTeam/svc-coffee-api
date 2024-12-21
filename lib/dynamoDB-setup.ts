import { aws_dynamodb as dynamo, Stack} from "aws-cdk-lib"

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
    }
    getDynamoDBTable(): dynamo.Table {
        return this.dynamoCoffeeTable;
    }
    
}