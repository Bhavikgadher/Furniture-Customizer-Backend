// src/modules/customer/consultations/service.js
const { Consultation, Designer, User } = require('../../../database/models');
const { AppError } = require('../../../middlewares/errorHandler');

const listDesigners = async () => {
  const designers = await Designer.findAll({
    include: [{ model: User, as: 'user', attributes: ['full_name', 'email'] }],
    order: [['rating', 'DESC']]
  });
  return {
    designers: designers.map(d => ({
      id: d.id, name: d.user?.full_name, bio: d.bio,
      experienceYears: d.experience_years, rating: parseFloat(d.rating)
    }))
  };
};

const bookConsultation = async (userId, { designer_id, scheduled_at, notes }) => {
  const designer = await Designer.findByPk(designer_id);
  if (!designer) throw new AppError('Designer not found', 'DESIGNER_NOT_FOUND', 404);

  const consultation = await Consultation.create({ user_id: userId, designer_id, scheduled_at, notes, status: 'pending' });
  return { consultation: { id: consultation.id, designerId: designer_id, scheduledAt: consultation.scheduled_at, status: consultation.status } };
};

const listConsultations = async (userId) => {
  const consultations = await Consultation.findAll({
    where: { user_id: userId },
    include: [{ model: Designer, as: 'designer', include: [{ model: User, as: 'user', attributes: ['full_name'] }] }],
    order: [['created_at', 'DESC']]
  });
  return { consultations };
};

const getConsultationById = async (userId, consultationId) => {
  const consultation = await Consultation.findOne({
    where: { id: consultationId, user_id: userId },
    include: [{ model: Designer, as: 'designer', include: [{ model: User, as: 'user', attributes: ['full_name', 'email'] }] }]
  });
  if (!consultation) throw new AppError('Consultation not found', 'CONSULTATION_NOT_FOUND', 404);
  return { consultation };
};

const cancelConsultation = async (userId, consultationId) => {
  const consultation = await Consultation.findOne({ where: { id: consultationId, user_id: userId } });
  if (!consultation) throw new AppError('Consultation not found', 'CONSULTATION_NOT_FOUND', 404);
  if (consultation.status === 'completed') throw new AppError('Cannot cancel a completed consultation', 'CANNOT_CANCEL', 400);
  await consultation.update({ status: 'cancelled' });
  return { message: 'Consultation cancelled successfully' };
};

module.exports = { listDesigners, bookConsultation, listConsultations, getConsultationById, cancelConsultation };
