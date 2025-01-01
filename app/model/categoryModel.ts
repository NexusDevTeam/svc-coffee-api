import { randomUUID } from "crypto";
import { Entitys } from "../enums/base-enum";
import { Coffee, CoffeeInput, DynamoDBCoffeeItem } from "../interfaces/coffee-interfaces";
import { Logger } from "@aws-lambda-powertools/logger";
import { Category, CategoryInput, DynamoDBCategoryItem } from "../interfaces/category-interfaces";

const logger: Logger = new Logger({
    logLevel: "DEBUG",
    serviceName: "CategoryModel",
});

export class CategoryModel {
    id:string;
    name:string;
    description:string;
    createdAt:string;
    updatedAt:string;
    entity:Entitys;

    constructor(id?: string, name?: string, description?: string, createdAt?: string, updatedAt?: string) {
        this.id = id || randomUUID(),
        this.name = name || "",
        this.description = description || "",
        this.createdAt = createdAt || new Date().toISOString();
        this.updatedAt = updatedAt || new Date().toISOString();
        this.entity = Entitys.CATEGORY
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
    
    
    public get data() : Category {
        return {
            id: this.id,
            name: this.name,
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

    static fromItem(item: DynamoDBCategoryItem): CategoryModel {
        logger.info(`🔄 - Converting item to catefory model, ${JSON.stringify(item)}`);
        
        const { id, name, description, createdAt, updatedAt } = item.data;
        
        return new CategoryModel(id, name, description, createdAt, updatedAt);
    }

    static fromInput(input: CategoryInput): CategoryModel {
        logger.info(`🔄 - Converting input to coffee model, ${JSON.stringify(input)}`);

        const { id, name, description, createdAt, updatedAt } = input;
        
        return new CategoryModel(id, name, description, createdAt, updatedAt);
    }
}