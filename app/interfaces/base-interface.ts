import { Entitys } from "../enums/base-enum";

export interface DynamoDBItem {
    PK:string,
    SK:string,
    ENTITY:Entitys
}