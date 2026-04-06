// src/modules/customer/customizer/service.js
const { FurnitureModel, Material, Color, Fabric, Size, AddOn, SavedDesign, SavedDesignAddon } = require('../../../database/models');
const { AppError } = require('../../../middlewares/errorHandler');

const getProductOptions = async (productId) => {
  const product = await FurnitureModel.findOne({ where: { id: productId, is_active: true } });
  if (!product) throw new AppError('Product not found', 'PRODUCT_NOT_FOUND', 404);

  const [materials, colors, fabrics, sizes, addons] = await Promise.all([
    Material.findAll({ attributes: ['id', 'name', 'price_multiplier'] }),
    Color.findAll({ attributes: ['id', 'name', 'hex_code', 'price_modifier'] }),
    Fabric.findAll({ attributes: ['id', 'name', 'price_multiplier'] }),
    Size.findAll({ attributes: ['id', 'name', 'width', 'height', 'depth', 'price_multiplier'] }),
    AddOn.findAll({ attributes: ['id', 'name', 'price'] })
  ]);

  return { productId, basePrice: parseFloat(product.base_price), options: { materials, colors, fabrics, sizes, addons } };
};

const calculatePrice = async ({ model_id, material_id, color_id, fabric_id, size_id, addon_ids = [] }) => {
  const product = await FurnitureModel.findByPk(model_id);
  if (!product) throw new AppError('Product not found', 'PRODUCT_NOT_FOUND', 404);

  let price = parseFloat(product.base_price);

  if (material_id) {
    const m = await Material.findByPk(material_id);
    if (m) price *= parseFloat(m.price_multiplier);
  }
  if (fabric_id) {
    const f = await Fabric.findByPk(fabric_id);
    if (f) price *= parseFloat(f.price_multiplier);
  }
  if (size_id) {
    const s = await Size.findByPk(size_id);
    if (s) price *= parseFloat(s.price_multiplier);
  }
  if (color_id) {
    const c = await Color.findByPk(color_id);
    if (c) price += parseFloat(c.price_modifier);
  }
  if (addon_ids.length) {
    const addons = await AddOn.findAll({ where: { id: addon_ids } });
    addons.forEach(a => { price += parseFloat(a.price); });
  }

  return { calculatedPrice: parseFloat(price.toFixed(2)) };
};

const saveDesign = async (userId, { model_id, material_id, color_id, fabric_id, size_id, addon_ids = [] }) => {
  const { calculatedPrice } = await calculatePrice({ model_id, material_id, color_id, fabric_id, size_id, addon_ids });

  const design = await SavedDesign.create({
    user_id: userId, model_id,
    selected_material: material_id || null,
    selected_color: color_id || null,
    selected_fabric: fabric_id || null,
    selected_size: size_id || null,
    calculated_price: calculatedPrice
  });

  if (addon_ids.length) {
    await SavedDesignAddon.bulkCreate(addon_ids.map(addon_id => ({ saved_design_id: design.id, addon_id })));
  }

  return { design: { id: design.id, calculatedPrice, createdAt: design.created_at } };
};

const listDesigns = async (userId) => {
  const designs = await SavedDesign.findAll({
    where: { user_id: userId },
    include: [
      { model: FurnitureModel, as: 'model', attributes: ['id', 'name', 'base_image'] },
      { model: Material, as: 'material', attributes: ['id', 'name'] },
      { model: Color, as: 'color', attributes: ['id', 'name', 'hex_code'] },
      { model: Fabric, as: 'fabric', attributes: ['id', 'name'] },
      { model: Size, as: 'size', attributes: ['id', 'name'] }
    ],
    order: [['created_at', 'DESC']]
  });
  return { designs };
};

const getDesignById = async (userId, designId) => {
  const design = await SavedDesign.findOne({
    where: { id: designId, user_id: userId },
    include: [
      { model: FurnitureModel, as: 'model', attributes: ['id', 'name', 'base_image'] },
      { model: Material, as: 'material', attributes: ['id', 'name'] },
      { model: Color, as: 'color', attributes: ['id', 'name', 'hex_code'] },
      { model: Fabric, as: 'fabric', attributes: ['id', 'name'] },
      { model: Size, as: 'size', attributes: ['id', 'name'] },
      { model: AddOn, attributes: ['id', 'name', 'price'] }
    ]
  });
  if (!design) throw new AppError('Design not found', 'DESIGN_NOT_FOUND', 404);
  return { design };
};

const deleteDesign = async (userId, designId) => {
  const design = await SavedDesign.findOne({ where: { id: designId, user_id: userId } });
  if (!design) throw new AppError('Design not found', 'DESIGN_NOT_FOUND', 404);
  await SavedDesignAddon.destroy({ where: { saved_design_id: designId } });
  await design.destroy();
  return { message: 'Design deleted successfully' };
};

module.exports = { getProductOptions, calculatePrice, saveDesign, listDesigns, getDesignById, deleteDesign };
