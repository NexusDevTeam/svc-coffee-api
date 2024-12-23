import { DynamoDBItem } from "./base-interface";

export interface Coffee{
    id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface CoffeeInput{
    id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface DynamoDBCoffeeItem extends DynamoDBItem{
    data: Coffee
}