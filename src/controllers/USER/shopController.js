const mongoose = require("mongoose");
const LaundryShop = require("../../models/laundryShopModel.js");
const ProviderService = require("../../models/providerServiceModel.js");
const Review = require("../../models/reviewModel.js");
const Order = require("../../models/orderModel.js");

const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const priceTier = (avg) => {
  if (!avg) return null;
  if (avg < 30) return "$";
  if (avg < 70) return "$$";
  return "$$$";
};

const getShops = async (req, res) => {
  try {
    let {
      lat, lng,
      max_distance = 15,
      services, price_range, fast_delivery,
      sort_by = "rating",
      page = 1, limit = 10,
      search,
    } = req.query;

    if (search && (!lat || !lng)) {
      try {
        const Address = mongoose.models["Address"] || mongoose.model("Address");
        const foundAddress = await Address.findOne({
          address: { $regex: search, $options: "i" }
        });
        if (foundAddress?.lat && foundAddress?.lng) {
          lat = foundAddress.lat;
          lng = foundAddress.lng;
        }
      } catch (_) {
        // Address model not loaded — fall back to text search only
      }
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxDist = parseFloat(max_distance);

    // Only show admin-verified shops that are not suspended
    const matchStage = {
      is_verified:  true,
      is_suspended: { $ne: true },
    };

    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } }
      ];
    }

    let shopIdsWithServices = null;
    if (services) {
      const serviceIds = services.split(",").map((s) => new mongoose.Types.ObjectId(s.trim()));
      const providerServices = await ProviderService.find({
        service: { $in: serviceIds },
        is_active: true,
      }).distinct("provider");
      shopIdsWithServices = providerServices;
    }

    if (shopIdsWithServices) {
      matchStage._id = { $in: shopIdsWithServices };
    }

    const shops = await LaundryShop.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "reviews", localField: "_id", foreignField: "provider", as: "reviews",
        },
      },
      {
        $addFields: {
          avg_rating: { $avg: "$reviews.rating" },
          review_count: { $size: "$reviews" },
        },
      },
      {
        $lookup: {
          from: "providerservices", localField: "_id", foreignField: "provider", as: "provider_services",
        },
      },
      {
        $addFields: {
          avg_price: { $avg: "$provider_services.price" },
          service_ids: "$provider_services.service",
        },
      },
      {
        $lookup: {
          from: "services", localField: "service_ids", foreignField: "_id", as: "services_offered",
        },
      },
      { $project: { reviews: 0, provider_services: 0, service_ids: 0 } },
    ]);

    let enriched = shops.map((shop) => {
      const distance =
        !isNaN(userLat) && !isNaN(userLng) && shop.lat && shop.lng
          ? haversine(userLat, userLng, shop.lat, shop.lng)
          : null;
      return {
        ...shop,
        distance_km: distance !== null ? parseFloat(distance.toFixed(1)) : null,
        price_tier: priceTier(shop.avg_price),
        avg_rating: shop.avg_rating ? parseFloat(shop.avg_rating.toFixed(1)) : null,
        fast_delivery_available: distance !== null ? distance <= 15 : false,
      };
    });

    if (!isNaN(userLat) && !isNaN(userLng)) {
      enriched = enriched.filter(
        (s) => s.distance_km !== null && s.distance_km <= maxDist
      );
    }

    const priceMap = { economy: "$", medium: "$$", luxury: "$$$" };
    if (price_range && priceMap[price_range]) {
      enriched = enriched.filter((s) => s.price_tier === priceMap[price_range]);
    }

    if (fast_delivery === "true") {
      enriched = enriched.filter((s) => s.fast_delivery_available === true);
    }

    if (sort_by === "rating") {
      enriched.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
    } else if (sort_by === "reviews") {
      enriched.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
    } else if (sort_by === "distance") {
      enriched.sort((a, b) => (a.distance_km ?? Infinity) - (b.distance_km ?? Infinity));
    } else if (sort_by === "price_asc") {
      enriched.sort((a, b) => (a.avg_price || 0) - (b.avg_price || 0));
    } else if (sort_by === "price_desc") {
      enriched.sort((a, b) => (b.avg_price || 0) - (a.avg_price || 0));
    }

    const total = enriched.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const paginated = enriched.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({ total, page: pageNum, pages: Math.ceil(total / limitNum), shops: paginated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getShopById = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.query;

    const shop = await LaundryShop.findById(id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const providerServices = await ProviderService.find({
      provider: shop._id,
      is_active: true,
    }).populate({ path: "service", populate: { path: "parent", select: "name" } });

    const reviews = await Review.find({ provider: shop._id })
      .populate("customer", "fullName name")
      .sort({ createdAt: -1 })
      .limit(10);

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : null;

    const avgPrice =
      providerServices.length > 0
        ? providerServices.reduce((s, ps) => s + ps.price, 0) / providerServices.length
        : null;

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const distance =
      !isNaN(userLat) && !isNaN(userLng) && shop.lat && shop.lng
        ? parseFloat(haversine(userLat, userLng, shop.lat, shop.lng).toFixed(1))
        : null;

    res.json({
      shop: {
        ...shop.toObject(),
        distance_km: distance,
        avg_rating: avgRating ? parseFloat(avgRating.toFixed(1)) : null,
        review_count: reviews.length,
        price_tier: priceTier(avgPrice),
        fast_delivery_available: distance !== null ? distance <= 15 : false,
      },
      services: providerServices,
      reviews,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createShop = async (req, res) => {
  try {
    const { name, description, address, lat, lng } = req.body;

    const existing = await LaundryShop.findOne({ user: req.user._id });
    if (existing) return res.status(409).json({ message: "You already have a shop" });

    const shop = await LaundryShop.create({
      user: req.user._id,
      name, description, address, lat, lng,
    });

    res.status(201).json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateShop = async (req, res) => {
  try {
    const shop = await LaundryShop.findOne({ _id: req.params.id, user: req.user._id });
    if (!shop) return res.status(404).json({ message: "Shop not found or not yours" });

    const { name, description, address, lat, lng } = req.body;
    Object.assign(shop, { name, description, address, lat, lng });
    await shop.save();

    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getShopServices = async (req, res) => {
  try {
    const services = await ProviderService.find({
      provider: req.params.id,
      is_active: true,
    }).populate({ path: "service", populate: { path: "parent", select: "name" } });

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addShopService = async (req, res) => {
  try {
    const shop = await LaundryShop.findOne({ _id: req.params.id, user: req.user._id });
    if (!shop) return res.status(404).json({ message: "Shop not found or not yours" });

    const { service, price } = req.body;
    if (!service || !price) return res.status(400).json({ message: "service and price required" });

    const ps = await ProviderService.findOneAndUpdate(
      { provider: shop._id, service },
      { price, is_active: true },
      { upsert: true, new: true }
    ).populate("service");

    res.status(201).json(ps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeShopService = async (req, res) => {
  try {
    const shop = await LaundryShop.findOne({ _id: req.params.id, user: req.user._id });
    if (!shop) return res.status(404).json({ message: "Shop not found or not yours" });

    await ProviderService.findByIdAndUpdate(req.params.psId, { is_active: false });
    res.json({ message: "Service deactivated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getShopReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const reviews = await Review.find({ provider: req.params.id })
      .populate("customer", "fullName name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ provider: req.params.id });
    res.json({ total, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyShop = async (req, res) => {
  try {
    const shop = await LaundryShop.findOne({ user: req.user._id });
    if (!shop) return res.status(404).json({ message: "No shop found for this provider" });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getShopDashboard = async (req, res) => {
  try {
    const shopId = req.params.id;
    const shop = await LaundryShop.findOne({ _id: shopId, user: req.user._id });
    if (!shop) return res.status(404).json({ message: "Shop not found or not yours" });

    const [totalOrders, pendingOrders, completedOrders, totalRevenue, avgRating] =
      await Promise.all([
        Order.countDocuments({ provider: shopId }),
        Order.countDocuments({ provider: shopId, status: { $in: ["pending", "accepted"] } }),
        Order.countDocuments({ provider: shopId, status: "delivered" }),
        Order.aggregate([
          { $match: { provider: new mongoose.Types.ObjectId(shopId), status: "delivered" } },
          { $group: { _id: null, total: { $sum: "$total_price" } } },
        ]),
        Review.aggregate([
          { $match: { provider: new mongoose.Types.ObjectId(shopId) } },
          { $group: { _id: null, avg: { $avg: "$rating" } } },
        ]),
      ]);

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      avgRating: avgRating[0]?.avg ? parseFloat(avgRating[0].avg.toFixed(1)) : null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getShops, getShopById, createShop, updateShop, getShopServices, addShopService, removeShopService, getShopReviews, getMyShop, getShopDashboard };