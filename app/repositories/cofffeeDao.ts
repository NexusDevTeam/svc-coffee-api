import { Logger } from "@aws-lambda-powertools/logger";
import { CoffeeModel } from "../model/coffeeModel";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export interface ICoffeeDAO {
    createCoffee(coffee: CoffeeModel): Promise<CoffeeModel>;
}

export class CoffeeDAO implements ICoffeeDAO {
    
    private logger: Logger;
    private ddbClient: DynamoDBClient;
    private ddb: DynamoDBDocumentClient;

    constructor() {
        this.logger = new Logger({
            logLevel: "DEBUG",
            serviceName: "CoffeeDAO",
        });
        this.ddbClient = new DynamoDBClient({
            region: "us-east-1",
        });
        this.ddb = DynamoDBDocumentClient.from(this.ddbClient, {
            marshallOptions: {
                removeUndefinedValues: true,
            }
        })
    }

    async createCoffee(coffee: CoffeeModel): Promise<CoffeeModel> {
        this.logger.info(`🔄 - Init process to create coffee in dynamoDB, ${JSON.stringify(coffee)}`);

        const command = new PutCommand({
            TableName: process.env.TABLE_NAME,
            Item: coffee.toItem(),
        });

        try {
            this.logger.info(`🔄 - Send PutCommand: ${JSON.stringify(command)}`);
            const result = await this.ddb.send(command);

            if(result.$metadata.httpStatusCode !== 200) {
                throw new Error(`Error to create a new coffee getted status code ${result.$metadata.httpStatusCode}`);
            }

            this.logger.info(`✅ - Created coffee in dynamoDB with Sucess`);
            return coffee;
            
        } catch (error: any) {
            this.logger.error(`❌ - Error to create a new coffee, error: ${error.message}`);
            throw new Error(`❌ - Error to create a new coffee, error: ${error.message}`);
        }
    }
}