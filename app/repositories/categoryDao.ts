import { Logger } from "@aws-lambda-powertools/logger";
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Entitys } from "../enums/base-enum";
import { CategoryModel } from "../model/categoryModel";
import { DynamoDBCategoryItem } from "../interfaces/category-interfaces";

export interface ICategoryDAO {
    createCategory(category: CategoryModel): Promise<CategoryModel>;
    listAllCategorys(): Promise<CategoryModel[]>;
    getCategoryById(id: string): Promise<CategoryModel | null>;
    deleteCategoryById(id: string): Promise<void>;
    updateCategory(category:CategoryModel):Promise<CategoryModel>;
}

export class CategoryDAO implements ICategoryDAO {

    private logger: Logger;
    private ddbClient: DynamoDBClient;
    private ddb: DynamoDBDocumentClient;

    constructor() {
        this.logger = new Logger({
            logLevel: "DEBUG",
            serviceName: "CategoryDAO",
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
    /**
     * Creates a new category in DynamoDB using the provided CategoryModel instance.
     * Logs the process of sending a PutCommand to the database and handles potential errors.
     * 
     * @param category - The CategoryModel instance to be created in the database.
     * @returns A promise that resolves to the created CategoryModel instance.
     * @throws An error if the creation process fails or if the HTTP status code is not 200.
     */
    async createCategory(category: CategoryModel): Promise<CategoryModel> {
        this.logger.info(`🔄 - Init process to create a category in dynamoDB, ${JSON.stringify(category)}`);

        const command = new PutCommand({
            TableName: process.env.TABLE_NAME,
            Item: category.toItem(),
        });

        try {
            this.logger.info(`🔄 - Send PutCommand: ${JSON.stringify(command)}`);
            const result = await this.ddb.send(command);

            if (result.$metadata.httpStatusCode !== 200) {
                throw new Error(`❌ Error to create a new coffee getted status code ${result.$metadata.httpStatusCode}`);
            }

            this.logger.info(`✅ - Created category in dynamoDB with Sucess`);
            return category;

        } catch (error: any) {
            this.logger.error(`❌ - Error to create a new category, error: ${error.message}`);
            throw new Error(`❌ - Error to create a new category, error: ${error.message}`);
        }
    }
    /**
     * Creates a new category in DynamoDB using the provided CategoryModel instance.
     * Logs the process of sending a PutCommand to the database and handles potential errors.
     * 
     * @param category - The CategoryModel instance to be created in the database.
     * @returns A promise that resolves to the created CategoryModel instance.
     * @throws An error if the creation process fails or if the HTTP status code is not 200.
     */
    async listAllCategorys(): Promise<CategoryModel[]> {
        this.logger.info(`🔄 - Init process to list all category from DynamoDB`);

        const command = new QueryCommand({
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
            ExpressionAttributeValues: {
                ":pk": Entitys.CATEGORY,
                ":sk": Entitys.CATEGORY,
            }
        });

        try {
            this.logger.info(`🔄 - Send QueryCommand: ${JSON.stringify(command)}`);
            const result = await this.ddb.send(command);

            if (result.$metadata.httpStatusCode !== 200) {
                throw new Error(
                  `❌ Error retrieving category, status code: ${result.$metadata.httpStatusCode}`
                );
            }

            const category = result.Items?.map(item => CategoryModel.fromItem(item as unknown as DynamoDBCategoryItem)) || [];
            this.logger.info(`✅ - Retrieved ${category.length} category from DynamoDB`);
            return category;
        } catch (error: any) {
            this.logger.error(`❌ - Error retrieving category, error: ${error.message}`);
            throw new Error(`❌ - Error retrieving category, error: ${error.message}`);
        }
    }
    /**
     * Retrieves a category by its ID from the DynamoDB table.
     * 
     * @param id - The unique identifier of the category to retrieve.
     * @returns A promise that resolves to a CategoryModel instance if found, or null if not found.
     * @throws An error if the retrieval process fails.
     */
    async getCategoryById(id: string): Promise<CategoryModel | null> {
        this.logger.info(`🔄 - Init process to get category by ID: ${id}`);

        const command = new QueryCommand({
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
            ExpressionAttributeValues: {
                ":pk": Entitys.CATEGORY,
                ":sk": `${Entitys.CATEGORY}#${id}`,
            }
        });

        try {
            this.logger.info(`🔄 - Send QueryCommand: ${JSON.stringify(command)}`);

            const result = await this.ddb.send(command);

            if (result.$metadata.httpStatusCode !== 200) {
                throw new Error(`❌ Error retrieving category, status code: ${result.$metadata.httpStatusCode}`);
            }

            const category = result.Items ? CategoryModel.fromItem(result.Items[0] as unknown as DynamoDBCategoryItem) : null;
            this.logger.info(`✅ - Retrieved category with ID: ${id}`);
            return category;
        } catch (error: any) {
            this.logger.error(`❌ - Error retrieving category by ID, error: ${error.message}`);
            throw new Error(`❌ - Error retrieving category by ID, error: ${error.message}`);
        }
    }
    /**
     * Deletes a category from the database by its ID.
     * 
     * Logs the initiation, success, and any errors encountered during the deletion process.
     * Utilizes the DeleteCommand to remove the category from the DynamoDB table.
     * 
     * @param id - The unique identifier of the category to be deleted.
     * @returns A promise that resolves when the category is successfully deleted.
     * @throws An error if the deletion process fails.
     */
    async deleteCategoryById(id: string): Promise<void> {
        this.logger.info(`🔄 - Init process to delete category by ID: ${id}`);
        const command = new DeleteCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                PK: Entitys.CATEGORY,
                SK: `${Entitys.CATEGORY}#${id}`,
            }
        });
        try {
            this.logger.info(`🔄 - Send DeleteCommand: ${JSON.stringify(command)}`);
            await this.ddb.send(command);
            this.logger.info(`✅ - Deleted category with ID: ${id}`);
        } catch (error: any) {
            this.logger.error(`❌ - Error deleting category by ID, error: ${error.message}`);
            throw new Error(`❌ - Error deleting category by ID, error: ${error.message}`);
        }
    }
    /**
     * Updates a category in DynamoDB using the provided CategoryModel instance.
     * Logs the process of sending a PutCommand to DynamoDB and handles potential errors.
     *
     * @param {CategoryModel} category - The category model to be updated in the database.
     * @returns {Promise<CategoryModel>} - A promise that resolves to the updated CategoryModel.
     * @throws {Error} - Throws an error if the update operation fails.
     */
    async updateCategory(category:CategoryModel):Promise<CategoryModel>{
        this.logger.info(`🔄 - Init process to update category in dynamoDB, ${JSON.stringify(category)}`)
        const command = new PutCommand({
            TableName: process.env.TABLE_NAME,
            Item: category.toItem(),
        });
        try {
            this.logger.info(`🔄 - Send PutCommand: ${JSON.stringify(command)}`);
            const result = await this.ddb.send(command);
            if (result.$metadata.httpStatusCode !== 200) {
                throw new Error(`❌ Error to update a new coffee getted status code ${result.$metadata.httpStatusCode}`);
            }
            this.logger.info(`✅ - Updated category in dynamoDB with Sucess`);
            return category;
        } catch (error: any) {
            this.logger.error(`❌ - Error to update a new coffee, error: ${error.message}`);
            throw new Error(`❌ - Error to update a new coffee, error: ${error.message}`);
        }
    }
}