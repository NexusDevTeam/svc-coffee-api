import { Logger } from "@aws-lambda-powertools/logger";
import { AppSyncEvent } from "./interfaces/base-interface";
import { CoffeeManager, ICoffeeManager } from "./services/coffeeManager";
import { CoffeeModel } from "./model/coffeeModel";

const logger = new Logger({
    logLevel: "DEBUG",
    serviceName: "UpdateCoffeeHandler",
});

const coffeeManager: ICoffeeManager = new CoffeeManager();

export async function handler(event: AppSyncEvent) {
    logger.info(`🎫 - Received event: ${JSON.stringify(event)}`);

    const { coffee, coffeeId } = event.arguments;

    if (!coffeeId) {
        logger.error("❌ - Coffee ID is missing in the event arguments.");
        throw new Error("Coffee ID is required.");
    } 
    
    if (!coffee) {
        logger.error(`❌ - Error to updated a coffee, error: 400`);
        throw new Error(`❌ - Error to updated a coffee, error: 400`);
    }

    return await coffeeManager.updateCoffee(CoffeeModel.fromInput(coffee), coffeeId);
}