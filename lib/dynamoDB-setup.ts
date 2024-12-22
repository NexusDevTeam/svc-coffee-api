import { aws_dynamodb as dynamo, Stack} from "aws-cdk-lib"

export interface IDynamoDBSetup {
    setupDynamoDB(): void;
    getDynamoDBTable(): dynamo.Table; 
}
/**
 * Represents a setup for a DynamoDB table named "CoffeeTable".
 * This class handles the creation and retrieval of the DynamoDB table.
 * The table is set up with a primary key consisting of "PK" (string) and "SK" (string),
 * and utilizes the PAY_PER_REQUEST billing mode for cost-effectiveness.
 */
export class DynamoDBSetup implements IDynamoDBSetup {

    private dynamoCoffeeTable: dynamo.Table;
    private stack: Stack;

    constructor (stack: Stack) {
        this.stack = stack;
    }
    /**
     * Sets up the DynamoDB table named "CoffeeTable".
     * Defines a primary key consisting of "PK" (string) and "SK" (string).
     * Uses PAY_PER_REQUEST billing mode for cost-effectiveness.
     * The table is stored in the provided `stack`.
     */
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
    /**
     * Retrieves the DynamoDB table instance.
     *
     * @returns {dynamo.Table} The `dynamo.Table` object representing the "CoffeeTable" DynamoDB table.
     */
    getDynamoDBTable(): dynamo.Table {
        return this.dynamoCoffeeTable;
    }
    
}