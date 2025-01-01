import { Logger } from "@aws-lambda-powertools/logger";
import { CoffeeModel } from "../model/coffeeModel";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBCoffeeItem } from "../interfaces/coffee-interfaces";
import { Entitys } from "../enums/base-enum";

export interface ICoffeeDAO {
    createCoffee(coffee: CoffeeModel): Promise<CoffeeModel>;
    updateCoffee(coffee: CoffeeModel, id: string): Promise<CoffeeModel>
    deleteCoffee(id: string): Promise<Boolean>;
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

    // Mutations

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

    async updateCoffee(coffee: CoffeeModel, id: string): Promise<CoffeeModel> {
        this.logger.info(`🔄 - Init process to update coffee by ID: ${id}, ${JSON.stringify(coffee)}`,);

        coffee.updatedAt = new Date().toISOString();

        const command = new PutCommand({
            TableName: process.env.TABLE_NAME,
            Item: coffee.toItem(),
        });

        try {
            const result = await this.ddb.send(command);

            if (result.$metadata.httpStatusCode !== 200) {
                throw new Error(`Error to updated a coffee getted status code ${result.$metadata.httpStatusCode}`);
            }

            this.logger.info(`✅ - Updated coffee in dynamoDB with Sucess`);
            return coffee;
        } catch (error: any) {
            this.logger.error(`❌ - Error to updated a coffee, error: ${error.message}`);
            throw new Error(`❌ - Error to updated a coffee, error: ${error.message}`);
        }
    }

    async deleteCoffee(id: string): Promise<Boolean> {
        this.logger.info(`🔄 - Init process to delete coffee by ID: ${id}`);

        const command = new DeleteCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                PK: Entitys.COFFEE,
                SK: `${Entitys.COFFEE}#${id}`,
            }
        });

        try {
            this.logger.info(`🔄 - Send DeleteCommand: ${JSON.stringify(command)}`);

            const result = await this.ddb.send(command);

            if (result.$metadata.httpStatusCode !== 200) {
                throw new Error(`Error deleting coffee, status code: ${result.$metadata.httpStatusCode}`);
            }

            this.logger.info(`✅ - Deleted coffee with ID: ${id}`);
            return true
        } catch (error: any) {
            this.logger.error(`❌ - Error deleting coffee by ID, error: ${error.message}`);
            return false;
        }
    }

    // Querys

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