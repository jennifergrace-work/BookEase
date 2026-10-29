require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Service = require('./models/Service');
const Availability = require('./models/Availability');
const Appointment = require('./models/Appointment');
const connectDB = require('./config/db');

const ensureUser = async (data) => {
  const existing = await User.findOne({ email: data.email.toLowerCase() });
  return existing || User.create(data);
};

const ensureService = async (data) => {
  const existing = await Service.findOne({ name: data.name });
  return existing || Service.create(data);
};

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Adding missing demo users without changing existing records...');
    const admin = await ensureUser({
      name: 'Dr. Sarah Mitchell (Admin)',
      email: 'admin@bookease.com',
      phone: '9876543210',
      password: 'Admin@123',
      role: 'Admin',
      isActive: true,
    });

    const user1 = await ensureUser({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '9123456780',
      password: 'User@123',
      role: 'User',
      isActive: true,
    });

    const user2 = await ensureUser({
      name: 'Sarah Smith',
      email: 'sarah.smith@example.com',
      phone: '9988776655',
      password: 'User@123',
      role: 'User',
      isActive: true,
    });

    console.log('[Seed] Adding missing demo services...');
    const serviceData = [
      {
        name: 'Executive Health & Wellness Check',
        description: 'A comprehensive 45-minute clinical wellness consultation including baseline vitals, metabolic screening, and personalized preventative care roadmap.',
        category: 'Healthcare',
        duration: 45,
        price: 120,
        isActive: true,
        createdBy: admin._id,
      },
      {
        name: 'Therapeutic Deep Tissue Massage',
        description: 'Targeted myofascial therapy focusing on chronic muscle tension, structural realignment, and accelerated athletic recovery.',
        category: 'Wellness & Spa',
        duration: 60,
        price: 95,
        isActive: true,
        createdBy: admin._id,
      },
      {
        name: 'Advanced Dental Hygiene & Polish',
        description: 'Precision ultrasonic scaling, enamel brightening polish, periodontal inspection, and oral cancer screening.',
        category: 'Dental Care',
        duration: 40,
        price: 85,
        isActive: true,
        createdBy: admin._id,
      },
      {
        name: 'Precision Hair Styling & Scalp Treatment',
        description: 'Master stylist consultation, deep organic scalp detox, bespoke cut, and styling using botanical conditioning formulas.',
        category: 'Salon & Beauty',
        duration: 50,
        price: 70,
        isActive: true,
        createdBy: admin._id,
      },
      {
        name: 'Personal Nutrition & Dietetics Roadmap',
        description: 'One-on-one consultation with a licensed clinical nutritionist to build tailored macronutrient plans, gut health protocols, and lifestyle tweaks.',
        category: 'Healthcare',
        duration: 30,
        price: 65,
        isActive: true,
        createdBy: admin._id,
      },
    ];
    const services = [];
    for (const data of serviceData) {
      services.push(await ensureService(data));
    }

    console.log('[Seed] Adding missing availability schedules...');
    const availabilityData = [
      {
        service: services[0]._id,
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        startTime: '09:00',
        endTime: '17:00',
        breakStart: '13:00',
        breakEnd: '14:00',
        blockedDates: ['2026-11-26', '2026-12-25'],
      },
      {
        service: services[1]._id,
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        startTime: '10:00',
        endTime: '18:00',
        breakStart: '13:30',
        breakEnd: '14:30',
        blockedDates: ['2026-12-24', '2026-12-25'],
      },
      {
        service: services[2]._id,
        workingDays: ['Monday', 'Wednesday', 'Friday'],
        startTime: '08:30',
        endTime: '16:30',
        breakStart: '12:30',
        breakEnd: '13:30',
        blockedDates: [],
      },
      {
        service: services[3]._id,
        workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        startTime: '10:00',
        endTime: '19:00',
        breakStart: '14:00',
        breakEnd: '15:00',
        blockedDates: [],
      },
      {
        service: services[4]._id,
        workingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
        startTime: '09:00',
        endTime: '16:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        blockedDates: [],
      },
    ];
    for (const data of availabilityData) {
      const existing = await Availability.findOne({ service: data.service });
      if (!existing) await Availability.create(data);
    }

    const getOffsetDate = (offset) => {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      return d.toISOString().split('T')[0];
    };

    console.log('[Seed] Adding missing sample appointments...');
    const appointmentData = [
      {
        user: user1._id,
        service: services[0]._id,
        date: getOffsetDate(2),
        timeSlot: '10:00',
        status: 'Confirmed',
        notes: 'Routine biannual checkup; request cholesterol panel check.',
      },
      {
        user: user2._id,
        service: services[1]._id,
        date: getOffsetDate(3),
        timeSlot: '11:00',
        status: 'Pending',
        notes: 'Lower lumbar tightness after marathon training.',
      },
      {
        user: user1._id,
        service: services[2]._id,
        date: getOffsetDate(-5),
        timeSlot: '09:30',
        status: 'Completed',
        notes: 'Completed full hygiene prophylaxis.',
      },
      {
        user: user2._id,
        service: services[4]._id,
        date: getOffsetDate(-2),
        timeSlot: '14:00',
        status: 'Cancelled',
        notes: 'Client rescheduled due to conflicting travel.',
      },
    ];
    for (const data of appointmentData) {
      const existing = await Appointment.findOne({
        user: data.user,
        service: data.service,
        notes: data.notes,
      });
      if (!existing) await Appointment.create(data);
    }

    console.log('----------------------------------------------------');
    console.log('[Seed Success] Missing demo users, services, schedules & appointments added.');
    console.log('Demo Credentials:');
    console.log('Admin: admin@bookease.com / Admin@123');
    console.log('User:  john.doe@example.com / User@123');
    console.log('User:  sarah.smith@example.com / User@123');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedData();
