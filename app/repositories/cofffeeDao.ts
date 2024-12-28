import { Logger } from "@aws-lambda-powertools/logger";
import { CoffeeModel } from "../model/coffeeModel";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBCoffeeItem } from "../interfaces/coffee-interfaces";
import { Entitys } from "../enums/base-enum";

export interface ICoffeeDAO {
    createCoffee(coffee: CoffeeModel): Promise<CoffeeModel>;
    listAllCoffees(): Promise<CoffeeModel[]>;
    getCoffeeById(id: string): Promise<CoffeeModel | null>;
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

            if (result.$metadata.httpStatusCode !== 200) {
                throw new Error(`Error to create a new coffee getted status code ${result.$metadata.httpStatusCode}`);
            }

            this.logger.info(`✅ - Created coffee in dynamoDB with Sucess`);
            return coffee;

        } catch (error: any) {
            this.logger.error(`❌ - Error to create a new coffee, error: ${error.message}`);
            throw new Error(`❌ - Error to create a new coffee, error: ${error.message}`);
        }
    }

    async listAllCoffees(): Promise<CoffeeModel[]> {
        this.logger.info(`🔄 - Init process to list all coffees from DynamoDB`);

        const command = new QueryCommand({
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
            ExpressionAttributeValues: {
                ":pk": Entitys.COFFEE,
                ":sk": Entitys.COFFEE,
            }
        });

        try {
            this.logger.info(`🔄 - Send QueryCommand: ${JSON.stringify(command)}`);
            const result = await this.ddb.send(command);

            if (result.$metadata.httpStatusCode !== 200) {
                throw new Error(`Error retrieving coffees, status code: ${result.$metadata.httpStatusCode}`);
            }

            const coffees = result.Items?.map(item => CoffeeModel.fromItem(item as unknown as DynamoDBCoffeeItem)) || [];
            this.logger.info(`✅ - Retrieved ${coffees.length} coffees from DynamoDB`);
            return coffees;
        } catch (error: any) {
            this.logger.error(`❌ - Error retrieving coffees, error: ${error.message}`);
            throw new Error(`❌ - Error retrieving coffees, error: ${error.message}`);
        }
    }

    async getCoffeeById(id: string): Promise<CoffeeModel | null> {
        this.logger.info(`🔄 - Init process to get coffee by ID: ${id}`);

        const command = new QueryCommand({
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
            ExpressionAttributeValues: {
                ":pk": Entitys.COFFEE,
                ":sk": `${Entitys.COFFEE}#${id}`,
            }
        });

        try {
            this.logger.info(`🔄 - Send QueryCommand: ${JSON.stringify(command)}`);

            const result = await this.ddb.send(command);

            if (result.$metadata.httpStatusCode !== 200) {
                throw new Error(`Error retrieving coffee, status code: ${result.$metadata.httpStatusCode}`);
            }

            const coffee = result.Items ? CoffeeModel.fromItem(result.Items[0] as unknown as DynamoDBCoffeeItem) : null;
            this.logger.info(`✅ - Retrieved coffee with ID: ${id}`);
            return coffee;
        } catch (error: any) {
            this.logger.error(`❌ - Error retrieving coffee by ID, error: ${error.message}`);
            throw new Error(`❌ - Error retrieving coffee by ID, error: ${error.message}`);
        }
    }
}