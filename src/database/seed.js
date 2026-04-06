// src/database/seed.js
// Run: node src/database/seed.js

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('./sequelize');

const Role = require('./models/Role');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Designer = require('./models/Designer');
const Category = require('./models/Category');
const Material = require('./models/Material');
const Color = require('./models/Color');
const Fabric = require('./models/Fabric');
const Size = require('./models/Size');
const AddOn = require('./models/AddOn');
const FurnitureModel = require('./models/FurnitureModel');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    // ─── 1. ROLES ───────────────────────────────────────────────
    const roleNames = ['admin', 'vendor', 'customer', 'designer'];
    const roles = {};
    for (const name of roleNames) {
      const [role] = await Role.findOrCreate({ where: { name }, defaults: { id: uuidv4(), name } });
      roles[name] = role;
    }
    console.log('✓ Roles');

    // ─── 2. USERS ────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash('Password123!', 10);

    const [adminUser] = await User.findOrCreate({
      where: { email: 'admin@furniture.com' },
      defaults: { id: uuidv4(), full_name: 'Super Admin', email: 'admin@furniture.com', password_hash: passwordHash, role_id: roles.admin.id, is_active: true, is_verified: true }
    });

    const [vendorUser1] = await User.findOrCreate({
      where: { email: 'vendor1@furniture.com' },
      defaults: { id: uuidv4(), full_name: 'Rajesh Kumar', email: 'vendor1@furniture.com', password_hash: passwordHash, phone: '9876543210', role_id: roles.vendor.id, is_active: true, is_verified: true }
    });

    const [vendorUser2] = await User.findOrCreate({
      where: { email: 'vendor2@furniture.com' },
      defaults: { id: uuidv4(), full_name: 'Priya Sharma', email: 'vendor2@furniture.com', password_hash: passwordHash, phone: '9876543211', role_id: roles.vendor.id, is_active: true, is_verified: true }
    });

    const [customerUser] = await User.findOrCreate({
      where: { email: 'customer@furniture.com' },
      defaults: { id: uuidv4(), full_name: 'Amit Patel', email: 'customer@furniture.com', password_hash: passwordHash, phone: '9876543212', role_id: roles.customer.id, is_active: true, is_verified: true }
    });

    const [designerUser] = await User.findOrCreate({
      where: { email: 'designer@furniture.com' },
      defaults: { id: uuidv4(), full_name: 'Neha Joshi', email: 'designer@furniture.com', password_hash: passwordHash, phone: '9876543213', role_id: roles.designer.id, is_active: true, is_verified: true }
    });
    console.log('✓ Users');

    // ─── 3. VENDORS ──────────────────────────────────────────────
    const [vendor1] = await Vendor.findOrCreate({
      where: { user_id: vendorUser1.id },
      defaults: { id: uuidv4(), user_id: vendorUser1.id, company_name: 'Royal Wood Furniture', gst_number: '22AAAAA0000A1Z5', is_approved: true }
    });

    const [vendor2] = await Vendor.findOrCreate({
      where: { user_id: vendorUser2.id },
      defaults: { id: uuidv4(), user_id: vendorUser2.id, company_name: 'Modern Home Decor', gst_number: '27BBBBB1111B2Y6', is_approved: true }
    });
    console.log('✓ Vendors');

    // ─── 4. DESIGNER ─────────────────────────────────────────────
    await Designer.findOrCreate({
      where: { user_id: designerUser.id },
      defaults: { id: uuidv4(), user_id: designerUser.id, bio: 'Interior designer with 8 years of experience in modern and contemporary furniture design.', experience_years: 8, rating: 4.7 }
    });
    console.log('✓ Designer');

    // ─── 5. CATEGORIES ───────────────────────────────────────────
    const catData = [
      { name: 'Sofas & Sectionals' },
      { name: 'Beds & Bedroom' },
      { name: 'Dining Tables' },
      { name: 'Office Furniture' },
      { name: 'Storage & Wardrobes' }
    ];
    const categories = {};
    for (const c of catData) {
      const [cat] = await Category.findOrCreate({ where: { name: c.name }, defaults: { id: uuidv4(), name: c.name, parent_id: null } });
      categories[c.name] = cat;
    }
    console.log('✓ Categories');

    // ─── 6. MATERIALS ────────────────────────────────────────────
    const materialData = [
      { name: 'Teak Wood', price_multiplier: 1.8, stock_quantity: 200 },
      { name: 'Sheesham Wood', price_multiplier: 1.5, stock_quantity: 150 },
      { name: 'MDF Board', price_multiplier: 1.0, stock_quantity: 500 },
      { name: 'Plywood', price_multiplier: 1.2, stock_quantity: 300 },
      { name: 'Metal Frame', price_multiplier: 1.3, stock_quantity: 250 }
    ];
    const materials = {};
    for (const m of materialData) {
      const [mat] = await Material.findOrCreate({ where: { name: m.name }, defaults: { id: uuidv4(), ...m } });
      materials[m.name] = mat;
    }
    console.log('✓ Materials');

    // ─── 7. COLORS ───────────────────────────────────────────────
    const colorData = [
      { name: 'Walnut Brown', hex_code: '#5C4033', price_modifier: 0 },
      { name: 'Ivory White', hex_code: '#FFFFF0', price_modifier: 500 },
      { name: 'Charcoal Grey', hex_code: '#36454F', price_modifier: 300 },
      { name: 'Mahogany Red', hex_code: '#C04000', price_modifier: 800 },
      { name: 'Natural Oak', hex_code: '#D2B48C', price_modifier: 200 }
    ];
    const colors = {};
    for (const c of colorData) {
      const [col] = await Color.findOrCreate({ where: { name: c.name }, defaults: { id: uuidv4(), ...c } });
      colors[c.name] = col;
    }
    console.log('✓ Colors');

    // ─── 8. FABRICS ──────────────────────────────────────────────
    const fabricData = [
      { name: 'Premium Velvet', price_multiplier: 1.4 },
      { name: 'Linen', price_multiplier: 1.1 },
      { name: 'Leather', price_multiplier: 1.9 },
      { name: 'Cotton Blend', price_multiplier: 1.0 },
      { name: 'Microfiber', price_multiplier: 1.2 }
    ];
    const fabrics = {};
    for (const f of fabricData) {
      const [fab] = await Fabric.findOrCreate({ where: { name: f.name }, defaults: { id: uuidv4(), ...f } });
      fabrics[f.name] = fab;
    }
    console.log('✓ Fabrics');

    // ─── 9. SIZES ────────────────────────────────────────────────
    const sizeData = [
      { name: 'Small (2 Seater)', width: 140, height: 85, depth: 80, price_multiplier: 0.8 },
      { name: 'Medium (3 Seater)', width: 190, height: 85, depth: 85, price_multiplier: 1.0 },
      { name: 'Large (4 Seater)', width: 240, height: 85, depth: 90, price_multiplier: 1.3 },
      { name: 'King Size', width: 180, height: 200, depth: 30, price_multiplier: 1.5 },
      { name: 'Queen Size', width: 150, height: 200, depth: 30, price_multiplier: 1.2 }
    ];
    const sizes = {};
    for (const s of sizeData) {
      const [sz] = await Size.findOrCreate({ where: { name: s.name }, defaults: { id: uuidv4(), ...s } });
      sizes[s.name] = sz;
    }
    console.log('✓ Sizes');

    // ─── 10. ADD-ONS ─────────────────────────────────────────────
    const addonData = [
      { name: 'Cup Holder', price: 800 },
      { name: 'USB Charging Port', price: 1500 },
      { name: 'Storage Drawer', price: 2500 },
      { name: 'Recliner Mechanism', price: 5000 },
      { name: 'LED Lighting', price: 3000 }
    ];
    const addons = {};
    for (const a of addonData) {
      const [addon] = await AddOn.findOrCreate({ where: { name: a.name }, defaults: { id: uuidv4(), ...a } });
      addons[a.name] = addon;
    }
    console.log('✓ Add-ons');

    // ─── 11. FURNITURE MODELS (PRODUCTS) ─────────────────────────
    const productData = [
      {
        name: 'Royal Teak Sofa',
        vendor_id: vendor1.id,
        category_id: categories['Sofas & Sectionals'].id,
        base_price: 35000,
        description: 'Handcrafted teak wood sofa with premium velvet upholstery. Perfect for living rooms.',
        is_active: true
      },
      {
        name: 'Luxe L-Shape Sectional',
        vendor_id: vendor1.id,
        category_id: categories['Sofas & Sectionals'].id,
        base_price: 65000,
        description: 'Spacious L-shaped sectional sofa ideal for large living spaces.',
        is_active: true
      },
      {
        name: 'Sheesham King Bed',
        vendor_id: vendor1.id,
        category_id: categories['Beds & Bedroom'].id,
        base_price: 45000,
        description: 'Solid sheesham wood king size bed with storage headboard.',
        is_active: true
      },
      {
        name: 'Modern Platform Bed',
        vendor_id: vendor2.id,
        category_id: categories['Beds & Bedroom'].id,
        base_price: 28000,
        description: 'Minimalist platform bed with clean lines and sturdy MDF construction.',
        is_active: true
      },
      {
        name: 'Extendable Dining Table',
        vendor_id: vendor2.id,
        category_id: categories['Dining Tables'].id,
        base_price: 22000,
        description: '6-seater extendable dining table in teak finish. Extends to seat 8.',
        is_active: true
      },
      {
        name: 'Round Glass Dining Table',
        vendor_id: vendor2.id,
        category_id: categories['Dining Tables'].id,
        base_price: 18000,
        description: 'Contemporary round dining table with tempered glass top and metal legs.',
        is_active: true
      },
      {
        name: 'Ergonomic Office Chair',
        vendor_id: vendor1.id,
        category_id: categories['Office Furniture'].id,
        base_price: 12000,
        description: 'High-back ergonomic office chair with lumbar support and adjustable armrests.',
        is_active: true
      },
      {
        name: 'Executive Office Desk',
        vendor_id: vendor2.id,
        category_id: categories['Office Furniture'].id,
        base_price: 25000,
        description: 'Large executive desk with cable management and built-in storage.',
        is_active: true
      },
      {
        name: '4-Door Wardrobe',
        vendor_id: vendor1.id,
        category_id: categories['Storage & Wardrobes'].id,
        base_price: 38000,
        description: 'Spacious 4-door wardrobe with mirror, shelves and hanging space.',
        is_active: true
      },
      {
        name: 'Sliding Door Wardrobe',
        vendor_id: vendor2.id,
        category_id: categories['Storage & Wardrobes'].id,
        base_price: 42000,
        description: 'Modern sliding door wardrobe with soft-close mechanism.',
        is_active: true
      }
    ];

    for (const p of productData) {
      await FurnitureModel.findOrCreate({
        where: { name: p.name, vendor_id: p.vendor_id },
        defaults: { id: uuidv4(), ...p, deleted_at: null }
      });
    }
    console.log('✓ Products (furniture_models)');

    // ─── SUMMARY ─────────────────────────────────────────────────
    console.log('\n✅ Seed complete! Login credentials (all use Password123!):');
    console.log('   Admin    → admin@furniture.com');
    console.log('   Vendor 1 → vendor1@furniture.com');
    console.log('   Vendor 2 → vendor2@furniture.com');
    console.log('   Customer → customer@furniture.com');
    console.log('   Designer → designer@furniture.com');

    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
