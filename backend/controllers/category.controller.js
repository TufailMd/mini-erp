import * as categoryService from "../services/category.service.js";

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    err.status = 500;
    next(err);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, data: category });
  } catch (err) {
    err.status = 500;
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, data: category });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    err.status = 500;
    next(err);
  }
};