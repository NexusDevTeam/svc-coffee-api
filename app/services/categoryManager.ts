import { Logger } from "@aws-lambda-powertools/logger";
import { CoffeeModel } from "../model/coffeeModel";
import { ICoffeeDAO, CoffeeDAO } from "../repositories/cofffeeDao";
import { CategoryModel } from "../model/categoryModel";
import { CategoryDAO, ICategoryDAO } from "../repositories/categoryDao";

export interface ICategoryManager {
  createCategory(category: CategoryModel): Promise<CategoryModel>;
  listAllCategorys(): Promise<CategoryModel[]>;
  getCategoryById(id: string): Promise<CategoryModel | null>;
  deleteCategoryById(id: string): Promise<void>;
  updateCategory(category:CategoryModel):Promise<CategoryModel>;
}

export class CategoryManager implements ICategoryManager {
  private logger: Logger;
  private categoryDAO: ICategoryDAO;

  constructor() {
    this.logger = new Logger({
      logLevel: "DEBUG",
      serviceName: "CategoryManager",
    });
    this.categoryDAO = new CategoryDAO();
  }
  /**
   * Creates a new category in the database.
   *
   * Validates the provided `CategoryModel` instance and logs any errors encountered during the creation process.
   * Utilizes the `CategoryDAO` to perform the database operation.
   *
   * @param {CategoryModel} category - The category model to be created.
   * @returns {Promise<CategoryModel>} - A promise that resolves to the created `CategoryModel`.
   * @throws {Error} - Throws an error if the category is invalid or if the creation process fails.
   */
  async createCategory(category: CategoryModel): Promise<CategoryModel> {
    if (!category || !category.id) {
      this.logger.error(`❌ - Error to create a new category, error: 400`);
      throw new Error(`❌ - Error to create a new category, error: 400`);
    }
    try {
      return await this.categoryDAO.createCategory(category);
    } catch (error: any) {
      this.logger.error(
        `❌ - Error to create a new category, error: ${error.message}`
      );
      throw new Error(
        `❌ - Error to create a new category, error: ${error.message}`
      );
    }
  }
  /**
   * Retrieves all categories from the database.
   *
   * Logs any errors encountered during the retrieval process.
   * Utilizes the `CategoryDAO` to fetch the categories.
   *
   * @returns {Promise<CategoryModel[]>} - A promise that resolves to an array of `CategoryModel` instances.
   * @throws {Error} - Throws an error if the retrieval process fails.
   */
  async listAllCategorys(): Promise<CategoryModel[]> {
    try {
      return await this.categoryDAO.listAllCategorys();
    } catch (error: any) {
      this.logger.error(
        `❌ - Error to retrieving category, error: ${error.message}`
      );
      throw new Error(
        `❌ - Error to retrieving category, error: ${error.message}`
      );
    }
  }
  /**
   * Retrieves a category by its ID from the database.
   *
   * Logs any errors encountered during the retrieval process.
   * Utilizes the `CategoryDAO` to fetch the category.
   *
   * @param {string} id - The unique identifier of the category to retrieve.
   * @returns {Promise<CategoryModel | null>} - A promise that resolves to the `CategoryModel` if found, or null if not found.
   * @throws {Error} - Throws an error if the retrieval process fails.
   */
  async getCategoryById(id: string): Promise<CategoryModel | null> {
    try {
      return await this.categoryDAO.getCategoryById(id);
    } catch (error: any) {
      this.logger.error(
        `❌ - Error to retrieving coffee, error: ${error.message}`
      );
      throw new Error(
        `❌ - Error to retrieving coffee, error: ${error.message}`
      );
    }
  }
  /**
   * Updates an existing category in the database.
   *
   * Logs any errors encountered during the update process.
   * Utilizes the `CategoryDAO` to perform the update operation.
   *
   * @param {CategoryModel} category - The category model to be updated.
   * @returns {Promise<CategoryModel>} - A promise that resolves to the updated `CategoryModel`.
   * @throws {Error} - Throws an error if the update process fails.
   */
  async updateCategory(category: CategoryModel): Promise<CategoryModel> {
    try {
      return await this.categoryDAO.updateCategory(category);
    } catch (error: any) {
      this.logger.error(
        `❌ - Error to update a new category, error: ${error.message}`
      );
      throw new Error(
        `❌ - Error to update a new category, error: ${error.message}`
      );
    }
  }
  /**
   * Deletes a category by its ID from the database.
   *
   * Logs any errors encountered during the deletion process.
   * Utilizes the `CategoryDAO` to perform the deletion operation.
   *
   * @param {string} id - The unique identifier of the category to delete.
   * @returns {Promise<void>} - A promise that resolves when the category is successfully deleted.
   * @throws {Error} - Throws an error if the deletion process fails.
   */
  async deleteCategoryById(id: string): Promise<void> {
    try {
      return await this.categoryDAO.deleteCategoryById(id);
    } catch (error: any) {
      this.logger.error(
        `❌ - Error deleting category by ID, error: ${error.message}`
      );
      throw new Error(
        `❌ - Error deleting category by ID, error: ${error.message}`
      );
    }
  }
}
