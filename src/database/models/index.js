// src/database/models/index.js
const sequelize = require('../sequelize');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const User = require('./User');
const UserAddress = require('./UserAddress');
const PasswordReset = require('./PasswordReset');
const RefreshToken = require('./RefreshToken');
const Vendor = require('./Vendor');
const Designer = require('./Designer');
const Category = require('./Category');
const FurnitureModel = require('./FurnitureModel');
const Material = require('./Material');
const Color = require('./Color');
const Fabric = require('./Fabric');
const Size = require('./Size');
const AddOn = require('./AddOn');
const SavedDesign = require('./SavedDesign');
const SavedDesignAddon = require('./SavedDesignAddon');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');
const Review = require('./Review');
const Coupon = require('./Coupon');
const CouponUsage = require('./CouponUsage');
const InventoryLog = require('./InventoryLog');
const Wishlist = require('./Wishlist');
const WishlistItem = require('./WishlistItem');
const Notification = require('./Notification');
const Consultation = require('./Consultation');

User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id' });

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id' });

UserAddress.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(UserAddress, { foreignKey: 'user_id' });

PasswordReset.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(PasswordReset, { foreignKey: 'user_id' });

RefreshToken.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(RefreshToken, { foreignKey: 'user_id' });

Vendor.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Vendor, { foreignKey: 'user_id' });

Designer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Designer, { foreignKey: 'user_id' });

Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'children' });

FurnitureModel.belongsTo(Vendor, { foreignKey: 'vendor_id', as: 'vendor' });
FurnitureModel.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Vendor.hasMany(FurnitureModel, { foreignKey: 'vendor_id' });
Category.hasMany(FurnitureModel, { foreignKey: 'category_id' });

SavedDesign.belongsTo(User, { foreignKey: 'user_id' });
SavedDesign.belongsTo(FurnitureModel, { foreignKey: 'model_id', as: 'model' });
SavedDesign.belongsTo(Material, { foreignKey: 'selected_material', as: 'material' });
SavedDesign.belongsTo(Color, { foreignKey: 'selected_color', as: 'color' });
SavedDesign.belongsTo(Fabric, { foreignKey: 'selected_fabric', as: 'fabric' });
SavedDesign.belongsTo(Size, { foreignKey: 'selected_size', as: 'size' });

SavedDesign.belongsToMany(AddOn, { through: SavedDesignAddon, foreignKey: 'saved_design_id' });
AddOn.belongsToMany(SavedDesign, { through: SavedDesignAddon, foreignKey: 'addon_id' });

Cart.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Cart, { foreignKey: 'user_id' });

CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });
CartItem.belongsTo(SavedDesign, { foreignKey: 'saved_design_id' });
Cart.hasMany(CartItem, { foreignKey: 'cart_id' });

Order.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });
Order.belongsTo(UserAddress, { foreignKey: 'address_id', as: 'address' });
User.hasMany(Order, { foreignKey: 'user_id' });

OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(OrderItem, { foreignKey: 'order_id' });

Payment.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasOne(Payment, { foreignKey: 'order_id' });

Review.belongsTo(User, { foreignKey: 'user_id' });
Review.belongsTo(FurnitureModel, { foreignKey: 'model_id' });
User.hasMany(Review, { foreignKey: 'user_id' });
FurnitureModel.hasMany(Review, { foreignKey: 'model_id' });

CouponUsage.belongsTo(Coupon, { foreignKey: 'coupon_id' });
CouponUsage.belongsTo(User, { foreignKey: 'user_id' });
CouponUsage.belongsTo(Order, { foreignKey: 'order_id' });

InventoryLog.belongsTo(Material, { foreignKey: 'material_id' });
Material.hasMany(InventoryLog, { foreignKey: 'material_id' });

Wishlist.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Wishlist, { foreignKey: 'user_id' });
WishlistItem.belongsTo(Wishlist, { foreignKey: 'wishlist_id' });
WishlistItem.belongsTo(FurnitureModel, { foreignKey: 'model_id', as: 'product' });
Wishlist.hasMany(WishlistItem, { foreignKey: 'wishlist_id' });

Notification.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Notification, { foreignKey: 'user_id' });

Consultation.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });
Consultation.belongsTo(Designer, { foreignKey: 'designer_id', as: 'designer' });
User.hasMany(Consultation, { foreignKey: 'user_id' });
Designer.hasMany(Consultation, { foreignKey: 'designer_id' });

module.exports = {
  sequelize,
  Role,
  Permission,
  RolePermission,
  User,
  UserAddress,
  PasswordReset,
  RefreshToken,
  Vendor,
  Designer,
  Category,
  FurnitureModel,
  Material,
  Color,
  Fabric,
  Size,
  AddOn,
  SavedDesign,
  SavedDesignAddon,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Review,
  Coupon,
  CouponUsage,
  InventoryLog,
  Wishlist,
  WishlistItem,
  Notification,
  Consultation
};
