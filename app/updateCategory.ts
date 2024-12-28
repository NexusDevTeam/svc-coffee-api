import { Logger } from "@aws-lambda-powertools/logger";
import { AppSyncEvent } from "./interfaces/base-interface";
import { CategoryManager, ICategoryManager } from "./services/categoryManager";
import { CategoryModel } from "./model/categoryModel";

const logger = new Logger({
    logLevel: "DEBUG",
    serviceName: "UpdateCategoryHandler",
});

const categoryManager: ICategoryManager = new CategoryManager();

export async function handler(event: AppSyncEvent) {
    logger.info(`🎫 - Received event: ${JSON.stringify(event)}`);
    const { category } = event.arguments;
    if (!category || !category.id) {
        logger.error(`❌ - Error to update a category, error: 400`);
        throw new Error(`❌ - Error to update a category, error: 400`);
    }
    return await categoryManager.updateCategory(CategoryModel.fromInput(category));
}