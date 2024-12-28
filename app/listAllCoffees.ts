import { Logger } from "@aws-lambda-powertools/logger";
import { AppSyncEvent } from "./interfaces/base-interface";
import { CoffeeManager, ICoffeeManager } from "./services/coffeeManager";

const logger = new Logger({
    logLevel: "DEBUG",
    serviceName: "ListAllCoffeesHandler",
});

const coffeeManager: ICoffeeManager = new CoffeeManager();

export async function handler(event: AppSyncEvent) {
    logger.info(`🎫 - Received event: ${JSON.stringify(event)}`);

    return await coffeeManager.listAllCoffees();
}