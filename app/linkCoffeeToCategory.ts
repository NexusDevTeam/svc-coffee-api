import { Logger } from "@aws-lambda-powertools/logger";
import { AppSyncEvent } from "./interfaces/base-interface";
import { CoffeeManager, ICoffeeManager } from "./services/coffeeManager";

const logger = new Logger({
    logLevel: "DEBUG",
    serviceName: "LinkCoffeeToCategoryHandler",
});

const coffeeManager: ICoffeeManager = new CoffeeManager();

export async function handler(event: AppSyncEvent) {
    logger.info(`🎫 - Received event: ${JSON.stringify(event)}`);

    const coffeeId = event.arguments.coffeeId; 
    const categoryId = event.arguments.categoryId; 

    if (!coffeeId || !categoryId) {
        logger.error('❌ - Missing required parameters: coffeeId or categoryId');
        throw new Error('Missing required parameters: coffeeId or categoryId');
    }

    try {
        const wasLink = await coffeeManager.linkCoffeeToCategory(coffeeId, categoryId);
        return wasLink;
    } catch (error: any) {
        logger.error(`❌ - Error linking coffee to category, error: ${error.message}`);
        throw new Error(`Error linking coffee with ID ${coffeeId} to category with ID ${categoryId}`);
    }
}
