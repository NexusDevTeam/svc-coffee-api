import { Logger } from "@aws-lambda-powertools/logger";
import { AppSyncEvent } from "./interfaces/base-interface";
import { CoffeeManager, ICoffeeManager } from "./services/coffeeManager";

const logger = new Logger({
    logLevel: "DEBUG",
    serviceName: "GetCoffeeByIdHandler",
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
        const coffee = await coffeeManager.getCoffeeById(coffeeId);
        return coffee;
    } catch (error: any) {
        logger.error(`❌ - Error retrieving coffee with ID ${coffeeId}, error: ${error.message}`);
        throw new Error(`Error retrieving coffee with ID ${coffeeId}`);
    }
}