import { Logger } from "@aws-lambda-powertools/logger";
import { CoffeeModel } from "../model/coffeeModel";
import { ICoffeeDAO, CoffeeDAO } from "../repositories/cofffeeDao";
import { ICategoryDAO, CategoryDAO } from "../repositories/categoryDao";

export interface ICoffeeManager {
    createCoffee(coffee: CoffeeModel): Promise<CoffeeModel>;
    updateCoffee(coffee: CoffeeModel, id: string): Promise<CoffeeModel>
    deleteCoffee(id: string): Promise<Boolean>;
    listAllCoffees(): Promise<CoffeeModel[]>;
    getCoffeeById(id: string): Promise<CoffeeModel | null>;
    linkCoffeeToCategory(coffeeId: string, categoryId: string): Promise<boolean | null>
}

export class CoffeeManager implements ICoffeeManager {
    private logger: Logger;
    private coffeeDAO: ICoffeeDAO;
    private categoryDAO: ICategoryDAO; 

    constructor() {
        this.logger = new Logger({
            logLevel: "DEBUG",
            serviceName: "CoffeeManager",
        });
        this.coffeeDAO = new CoffeeDAO();
        this.categoryDAO = new CategoryDAO();
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

    async updateCoffee(coffee: CoffeeModel, id: string): Promise<CoffeeModel> {
        try {
            return await this.coffeeDAO.updateCoffee(coffee, id);
        } catch (error: any) {
            this.logger.error(`❌ - Error to create a coffee, error: ${error.message}`);
            throw new Error(`❌ - Error to create a coffee, error: ${error.message}`);
        }
    }

    async deleteCoffee(id: string): Promise<Boolean> {
        return await this.coffeeDAO.deleteCoffee(id);
    }

    async listAllCoffees(): Promise<CoffeeModel[]> {
        try {
            return await this.coffeeDAO.listAllCoffees();
        } catch (error: any) {
            this.logger.error(`❌ - Error to retrieving coffees, error: ${error.message}`);
            throw new Error(`❌ - Error to retrieving coffees, error: ${error.message}`);
        }
    }

    async getCoffeeById(id: string): Promise<CoffeeModel | null> {
        try {
            return await this.coffeeDAO.getCoffeeById(id);
        } catch (error: any) {
            this.logger.error(`❌ - Error to retrieving coffee, error: ${error.message}`);
            throw new Error(`❌ - Error to retrieving coffee, error: ${error.message}`);
        }
    }

    async linkCoffeeToCategory(coffeeId: string, categoryId: string): Promise<boolean | null> {
        try {
            this.logger.info(`🔄 - Init process to link coffee (${coffeeId}) to category (${categoryId})`);
    
            const coffeeResult = await this.coffeeDAO.linkCoffeeToCategory(coffeeId, categoryId);
            const categoryResult = await this.categoryDAO.linkCategoryToCoffee(categoryId, coffeeId);
    
            if (coffeeResult && categoryResult) {
                this.logger.info(`✅ - Successfully linked coffee (${coffeeId}) to category (${categoryId})`);
                return true;
            }
    
            this.logger.warn(`⚠️ - Partial success in linking coffee (${coffeeId}) to category (${categoryId})`);
            return null;
        } catch (error: any) {
            this.logger.error(`❌ - Error linking coffee (${coffeeId}) to category (${categoryId}), error: ${error.message}`);
            throw new Error(`❌ - Error linking coffee to category, error: ${error.message}`);
        }
    }
    
}