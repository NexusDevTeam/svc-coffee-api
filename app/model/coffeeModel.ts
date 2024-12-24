import { randomUUID } from "crypto";
import { Entitys } from "../enums/base-enum";
import { Coffee, CoffeeInput, DynamoDBCoffeeItem } from "../interfaces/coffee-interfaces";
import { Logger } from "@aws-lambda-powertools/logger";

const logger: Logger = new Logger({
    logLevel: "DEBUG",
    serviceName: "CoffeeModel",
});

export class CoffeeModel {
    id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    createdAt: string;
    updatedAt: string;       
    entity: Entitys;


    constructor(id?: string, name?: string, price?: number, stock?: number, description?: string, createdAt?: string, updatedAt?: string) {
        this.id = id || randomUUID(),
        this.name = name || "",
        this.price = price || 0.0,
        this.stock = stock || 0,
        this.description = description || "",
        this.createdAt = createdAt || new Date().toISOString();
        this.updatedAt = updatedAt || new Date().toISOString();
        this.entity = Entitys.COFFEE;
    }

    
    public get pk() : string {
        return `${this.entity}`;
    }

    public get sk() : string {
        return `${this.entity}#${this.id}`;
    }

    public get keys() : any{
        return {
            PK: this.pk,
            SK: this.sk,
        }
    }
    
    
    public get data() : Coffee {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            stock: this.stock,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
    
    toItem(): DynamoDBCoffeeItem {
        return {
            ...this.keys,
            data: this.data,
            ENTITY: this.entity,
        }
    }

    static fromItem(item: DynamoDBCoffeeItem): CoffeeModel {
        logger.info(`🔄 - Converting item to coffee model, ${JSON.stringify(item)}`);
        
        const { id, name, price, stock, description, createdAt, updatedAt } = item.data;
        
        return new CoffeeModel(id, name, price, stock, description, createdAt, updatedAt);
    }

    static fromInput(input: CoffeeInput): CoffeeModel {
        logger.info(`🔄 - Converting input to coffee model, ${JSON.stringify(input)}`);

        const { id, name, price, stock, description, createdAt, updatedAt } = input;
        
        return new CoffeeModel(id, name, price, stock, description, createdAt, updatedAt);
    }
}