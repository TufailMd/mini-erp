import * as vendorService from "../services/vendor.service.js";

export const createVendor = async (req, res, next) => {
  try {
    const vendor = await vendorService.createVendor(req.body);
    res.status(201).json({ success: true, data: vendor });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

export const getVendors = async (req, res, next) => {
  try {
    const vendors = await vendorService.getVendors(req.query);
    res.json({ success: true, data: vendors });
  } catch (err) {
    err.status = 500;
    next(err);
  }
};

export const getVendorById = async (req, res, next) => {
  try {
    const vendor = await vendorService.getVendorById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    res.json({ success: true, data: vendor });
  } catch (err) {
    err.status = 500;
    next(err);
  }
};

export const updateVendor = async (req, res, next) => {
  try {
    const vendor = await vendorService.updateVendor(
      req.params.id,
      req.body
    );
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    res.json({ success: true, data: vendor });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

export const deleteVendor = async (req, res, next) => {
  try {
    const vendor = await vendorService.deleteVendor(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    res.json({ success: true, message: "Vendor deleted" });
  } catch (err) {
    err.status = 500;
    next(err);
  }
};
