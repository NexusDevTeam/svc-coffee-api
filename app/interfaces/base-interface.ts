import { Entitys } from "../enums/base-enum";
import { CategoryInput } from "./category-interfaces";
import { Coffee, CoffeeInput } from "./coffee-interfaces";

export interface DynamoDBItem {
    PK:string,
    SK:string,
    ENTITY:Entitys
}

export interface AppSyncEvent {
    info: {
      fieldName: string;
      selectionSetList: string[];
    };
    arguments: {
        coffee: CoffeeInput,
        coffeeId: string,
        category:CategoryInput,
        categoryId:string
    };
    identity: {
      username: string;
    };
  };