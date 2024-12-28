import { Logger } from "@aws-lambda-powertools/logger";
import { AppSyncEvent } from "./interfaces/base-interface";
import { CategoryManager, ICategoryManager } from "./services/categoryManager";
import { CategoryModel } from "./model/categoryModel";

const logger = new Logger({
    logLevel: "DEBUG",
    serviceName: "DeleteCategoryHandler",
});

const categoryManager: ICategoryManager = new CategoryManager();

export async function handler(event: AppSyncEvent) {
    logger.info(`🎫 - Received event: ${JSON.stringify(event)}`);

    const { categoryId } = event.arguments;
    if (!categoryId) {
        logger.error(`❌ - Error to get a category, error: 400`);
        throw new Error(`❌ - Error to get a category, error: 400`);
    }
    return await categoryManager.deleteCategoryById(categoryId);
}