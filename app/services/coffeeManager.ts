import { Logger } from "@aws-lambda-powertools/logger";
import { CoffeeModel } from "../model/coffeeModel";
import { ICoffeeDAO, CoffeeDAO } from "../repositories/cofffeeDao";

export interface ICoffeeManager {
    createCoffee(coffee: CoffeeModel): Promise<CoffeeModel>;
}

export class CoffeeManager implements ICoffeeManager {
    
    private logger: Logger;
    private coffeeDAO: ICoffeeDAO;

    constructor() {
        this.logger = new Logger({
            logLevel: "DEBUG",
            serviceName: "CoffeeManager",
        });
        this.coffeeDAO = new CoffeeDAO();
    }

    async createCoffee(coffee: CoffeeModel): Promise<CoffeeModel> {
        if(!coffee || !coffee.id ) {
            this.logger.error(`❌ - Error to create a new coffee, error: 400`);
            throw new Error(`❌ - Error to create a new coffee, error: 400`);
        }
        try {
            return await this.coffeeDAO.createCoffee(coffee);
        } catch (error: any) {
            this.logger.error(`❌ - Error to create a new coffee, error: ${error.message}`);
            throw new Error(`❌ - Error to create a new coffee, error: ${error.message}`);
        }
    }
}