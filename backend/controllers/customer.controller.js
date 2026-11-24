import * as customerService from "../services/customer.service.js";

export const createCustomer = async (req, res, next) => {
  try {
    const {
      customer_code,
      normalized_name,
      created_by,
      ...customerData
    } = req.body;

    const customer = await customerService.createCustomer(
      customerData,
      req.user?._id
    );
    res.status(201).json({ success: true, data: customer });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    const { customers, total, page } =
      await customerService.getCustomers(req.query);
    res.json({ success: true, data: customers, total, page: Number(page) });
  } catch (err) {
    err.status = 500;
    next(err);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    res.json({ success: true, data: customer });
  } catch (err) {
    err.status = 500;
    next(err);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const {
      customer_code,
      normalized_name,
      created_by,
      ...customerData
    } = req.body;

    const customer = await customerService.updateCustomer(
      req.params.id,
      customerData
    );
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    res.json({ success: true, data: customer });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.deleteCustomer(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    res.json({
      success: true,
      message: "Customer deactivated successfully",
    });
  } catch (err) {
    err.status = 500;
    next(err);
  }
};
