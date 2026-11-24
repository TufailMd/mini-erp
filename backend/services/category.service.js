import Category from "../models/category.model.js";

export const createCategory = async (categoryData) =>
  Category.create(categoryData);

export const getCategories = async () =>
  Category.find().populate("parent_category_id");

export const getCategoryById = async (id) =>
  Category.findById(id).populate("parent_category_id");

export const updateCategory = async (id, categoryData) =>
  Category.findByIdAndUpdate(id, categoryData, {
    new: true,
    runValidators: true,
  });

export const deleteCategory = async (id) =>
  Category.findByIdAndDelete(id);
