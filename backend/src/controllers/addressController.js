
import { Address } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get All User Addresses
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({
    user: req.user._id,
  }).sort({ isDefault: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: addresses.length,
    addresses,
  });
});

// Add Address
const addAddress = asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    addressLine,
    city,
    state,
    postalCode,
    country,
    isDefault,
  } = req.body;

  if (
    !fullName ||
    !phone ||
    !addressLine ||
    !city ||
    !state ||
    !postalCode
  ) {
    res.status(400);
    throw new Error("Please provide all required address fields");
  }

  const shouldBeDefault = Boolean(isDefault);

  if (shouldBeDefault) {
    await Address.updateMany(
      { user: req.user._id },
      { isDefault: false }
    );
  }

  const existingDefault = await Address.exists({
    user: req.user._id,
    isDefault: true,
  });

  const address = await Address.create({
    user: req.user._id,
    fullName,
    phone,
    addressLine,
    city,
    state,
    postalCode,
    country: country || "India",
    isDefault: shouldBeDefault || !existingDefault,
  });

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    address,
  });
});

// Update Address
const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  const allowedFields = [
    "fullName",
    "phone",
    "addressLine",
    "city",
    "state",
    "postalCode",
    "country",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      address[field] = req.body[field];
    }
  });

  if (req.body.isDefault === true) {
    await Address.updateMany(
      { user: req.user._id },
      { isDefault: false }
    );

    address.isDefault = true;
  }

  const updatedAddress = await address.save();

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    address: updatedAddress,
  });
});

// Delete Address
const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});

export {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
