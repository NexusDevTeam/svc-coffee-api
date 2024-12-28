import { Logger } from "@aws-lambda-powertools/logger";
import { AppSyncEvent } from "./interfaces/base-interface";
import { CategoryManager, ICategoryManager } from "./services/categoryManager";

const logger = new Logger({
    logLevel: "DEBUG",
    serviceName: "listAllCategoryCategoryHandler",
});

const categoryManager: ICategoryManager = new CategoryManager();

export async function handler(event: AppSyncEvent) {
    logger.info(`🎫 - Received event: ${JSON.stringify(event)}`);
    return await categoryManager.listAllCategorys();
}