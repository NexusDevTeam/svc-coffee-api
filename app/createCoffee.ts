import { Logger } from "@aws-lambda-powertools/logger";
import { AppSyncEvent } from "./interfaces/base-interface";
import { CoffeeManager, ICoffeeManager } from "./services/coffeeManager";
import { CoffeeModel } from "./model/coffeeModel";

const logger = new Logger({
    logLevel: "DEBUG",
    serviceName: "CreateCoffeeHandler",
});

const coffeeManager: ICoffeeManager = new CoffeeManager();

export async function handler(event: AppSyncEvent) {
    logger.info(`🎫 - Received event: ${JSON.stringify(event)}`);

    const { coffee } = event.arguments;
    return await coffeeManager.createCoffee(CoffeeModel.fromInput(coffee));
}