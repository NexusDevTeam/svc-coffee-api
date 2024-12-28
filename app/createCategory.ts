import { Logger } from "@aws-lambda-powertools/logger";
import { AppSyncEvent } from "./interfaces/base-interface";
import { CategoryManager, ICategoryManager } from "./services/categoryManager";
import { CategoryModel } from "./model/categoryModel";

const logger = new Logger({
    logLevel: "DEBUG",
    serviceName: "CreateCategoryHandler",
});

const categoryManager: ICategoryManager = new CategoryManager();

export async function handler(event: AppSyncEvent) {
    logger.info(`🎫 - Received event: ${JSON.stringify(event)}`);

    const { category } = event.arguments;
    if (!category) {
        logger.error(`❌ - Error to create a new category, error: 400`);
        throw new Error(`❌ - Error to create a new category, error: 400`);
    }
    return await categoryManager.createCategory(CategoryModel.fromInput(category));
}