import { DynamoDBItem } from "./base-interface";

export interface Category{
    id:string,
    name:string,
    description:string,
    createdAt:string,
    updatedAt:string,
}

export interface CategoryInput{
    id:string,
    name:string,
    description:string,
    createdAt:string,
    updatedAt:string,
}

export interface DynamoDBCategoryItem extends DynamoDBItem{
    data: Category
}