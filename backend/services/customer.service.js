import Customer from "../models/customer.model.js";

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parsePaginationNumber = (value, defaultValue, minimum, maximum) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum) return defaultValue;
  if (maximum !== undefined) return Math.min(parsed, maximum);
  return parsed;
};

export const createCustomer = async (data, userId) => {
  const {
    customer_code,
    normalized_name,
    created_by,
    ...customerData
  } = data;

  return Customer.create({
    ...customerData,
    created_by: userId || null,
  });
};

export const getCustomers = async (filters = {}) => {
  const {
    search,
    customer_type,
    is_active,
    page,
    limit,
  } = filters;
  const filter = {};
  const normalizedPage = parsePaginationNumber(page, 1, 1);
  const normalizedLimit = parsePaginationNumber(limit, 20, 1, 100);

  if (search) {
    const escapedSearch = escapeRegex(search);
    filter.$or = [
      { name: { $regex: escapedSearch, $options: "i" } },
      { customer_code: { $regex: escapedSearch, $options: "i" } },
      { email: { $regex: escapedSearch, $options: "i" } },
      { phone: { $regex: escapedSearch, $options: "i" } },
      { company_name: { $regex: escapedSearch, $options: "i" } },
    ];
  }
  if (customer_type) filter.customer_type = customer_type;
  if (is_active !== undefined && is_active !== "") {
    if (is_active === true || is_active === "true") filter.is_active = true;
    if (is_active === false || is_active === "false") filter.is_active = false;
  }

  const customers = await Customer.find(filter)
    .skip((normalizedPage - 1) * normalizedLimit)
    .limit(normalizedLimit)
    .sort({ createdAt: -1 });

  const total = await Customer.countDocuments(filter);

  return { customers, total, page: normalizedPage };
};

export const getCustomerById = async (customerId) =>
  Customer.findById(customerId);

export const updateCustomer = async (customerId, data) => {
  const customer = await Customer.findById(customerId);
  if (!customer) return null;

  const {
    customer_code,
    normalized_name,
    created_by,
    ...customerData
  } = data;

  Object.assign(customer, customerData);
  await customer.save();

  return customer;
};

export const deleteCustomer = async (customerId) =>
  {
    const customer = await Customer.findById(customerId);
    if (!customer) return null;

    customer.is_active = false;
    await customer.save();

    return customer;
  };
