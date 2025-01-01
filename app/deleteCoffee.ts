import { Logger } from "@aws-lambda-powertools/logger";
import { AppSyncEvent } from "./interfaces/base-interface";
import { CoffeeManager, ICoffeeManager } from "./services/coffeeManager";

const logger = new Logger({
    logLevel: "DEBUG",
    serviceName: "DeleteCoffeeHandler",
});

const coffeeManager: ICoffeeManager = new CoffeeManager();

export async function handler(event: AppSyncEvent) {
    logger.info(`🎫 - Received event: ${JSON.stringify(event)}`);

    const coffeeId = event.arguments.coffeeId; 

    if (!coffeeId) {
        logger.error("❌ - Coffee ID is missing in the event arguments.");
        throw new Error("Coffee ID is required.");
    }

    try {
        const isDeleted = await coffeeManager.deleteCoffee(coffeeId);
        return isDeleted;
    } catch (error: any) {
        logger.error(`❌ - Error deleting coffee with ID ${coffeeId}, error: ${error.message}`);
        throw new Error(`Error deleting coffee with ID ${coffeeId}: ${error.message}`);    
    }
}