import Vendor from "../models/vendor.model.js";

export const createVendor = async (vendorData) =>
  Vendor.create(vendorData);

export const getVendors = async (query) => {
  const { search } = query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { responsible_person: { $regex: search, $options: "i" } },
    ];
  }

  return Vendor.find(filter).sort({ createdAt: -1 });
};

export const getVendorById = async (id) =>
  Vendor.findById(id);

export const updateVendor = async (id, vendorData) =>
  Vendor.findByIdAndUpdate(id, vendorData, {
    new: true,
    runValidators: true,
  });

export const deleteVendor = async (id) =>
  Vendor.findByIdAndDelete(id);
