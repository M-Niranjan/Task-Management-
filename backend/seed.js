const mongoose = require('mongoose');

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://niranjanmathapati65_db_user:k1N8zVLszsbmddLl@cluster0.fw4faax.mongodb.net/taskmanager?appName=Cluster0';

// Define Schemas
const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    priority: { type: String, default: 'none' },
    lead: { type: Object },
    dueDate: { type: String },
    createdBy: { type: Object },
  },
  { timestamps: true },
);

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: 'todo' },
    priority: { type: String, default: 'none' },
    members: { type: Array, default: [] },
    labels: { type: Array, default: [] },
    dueDate: { type: String },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    subtasks: { type: Array, default: [] },
    comments: { type: Array, default: [] },
    createdBy: { type: Object },
    reporter: { type: Object },
    teams: { type: Array, default: [] },
    resources: { type: String },
    viewerCount: { type: Number, default: 1 },
  },
  { timestamps: true },
);

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

// Sample members
const members = {
  admin: { _id: 'u1', name: 'Dexter Morgan', email: 'dexter@pyramid.app', initials: 'DX' },
  designer: { _id: 'u2', name: 'Sophia Chen', email: 'sophia@design.co', initials: 'SC' },
  leadDev: { _id: 'u3', name: 'Marcus Brody', email: 'marcus@dev.io', initials: 'MB' },
  qa: { _id: 'u4', name: 'Elena Rostova', email: 'elena@qa.team', initials: 'ER' },
};

async function seed() {
  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to database.');

  console.log('🧹 Clearing existing demo data...');
  await Project.deleteMany({});
  await Task.deleteMany({});

  console.log('🌱 Seeding Projects...');
  const createdProjects = await Project.insertMany([
    {
      name: 'Design System & Homepage',
      priority: 'high',
      lead: members.designer,
      dueDate: new Date('2026-09-15').toISOString(),
      createdBy: members.admin,
    },
    {
      name: 'Authentication & Security',
      priority: 'urgent',
      lead: members.leadDev,
      dueDate: new Date('2026-09-20').toISOString(),
      createdBy: members.admin,
    },
    {
      name: 'Payment Gateway Integration',
      priority: 'medium',
      lead: members.leadDev,
      dueDate: new Date('2026-10-05').toISOString(),
      createdBy: members.admin,
    },
    {
      name: 'Mobile App Beta Launch',
      priority: 'low',
      lead: members.qa,
      dueDate: new Date('2026-10-25').toISOString(),
      createdBy: members.admin,
    },
  ]);

  const [p1, p2, p3, p4] = createdProjects;

  console.log('🌱 Seeding Tasks...');
  const tasksData = [
    // --- To Do ---
    {
      title: 'Write API Documentation & Specs',
      description: 'Create clear, comprehensive documentation for the backend REST APIs and Swagger schema definitions.',
      status: 'todo',
      priority: 'high',
      members: [members.admin, members.leadDev],
      labels: ['Documentation', 'Development'],
      dueDate: new Date('2026-08-30').toISOString(),
      projectId: p2._id,
      subtasks: [
        { _id: 's1', title: 'Document Auth endpoints', priority: 'high', status: 'todo' },
        { _id: 's2', title: 'Document Tasks endpoints', priority: 'medium', status: 'todo' },
        { _id: 's3', title: 'Export Postman Collection', priority: 'low', status: 'todo' },
      ],
      comments: [
        {
          _id: 'c1',
          author: members.admin,
          content: 'Let’s make sure all headers and token requirements are documented.',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
      ],
    },
    {
      title: 'Implement Search & Multi-Filter Function',
      description: 'Add fuzzy title searching and label filtering across task list and Kanban board views.',
      status: 'todo',
      priority: 'medium',
      members: [members.leadDev],
      labels: ['Development', 'Feature'],
      dueDate: new Date('2026-09-02').toISOString(),
      projectId: p1._id,
      subtasks: [],
      comments: [],
    },
    {
      title: 'Design System Dark Mode Contrast Audit',
      description: 'Verify accessibility and contrast ratios across all 6 dynamic color modes in Dark theme.',
      status: 'todo',
      priority: 'low',
      members: [members.designer],
      labels: ['Design', 'Research'],
      dueDate: new Date('2026-09-05').toISOString(),
      projectId: p1._id,
      subtasks: [],
      comments: [],
    },

    // --- Doing ---
    {
      title: 'Build Interactive Kanban Drag & Drop',
      description: 'Enable smooth drag-and-drop column transitions with optimistic UI state updates.',
      status: 'doing',
      priority: 'urgent',
      members: [members.leadDev, members.designer],
      labels: ['Development', 'Design'],
      dueDate: new Date('2026-08-25').toISOString(),
      projectId: p1._id,
      subtasks: [
        { _id: 's4', title: 'Implement drag event handlers', priority: 'urgent', status: 'completed' },
        { _id: 's5', title: 'Add drop animation effects', priority: 'high', status: 'doing' },
      ],
      comments: [
        {
          _id: 'c2',
          author: members.designer,
          content: 'Smooth 150ms spring transitions look best for card movement.',
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        },
      ],
    },
    {
      title: 'Stripe Webhook Handler & Event Ingestion',
      description: 'Set up resilient webhook endpoint for payment confirmation and customer subscription lifecycle events.',
      status: 'doing',
      priority: 'high',
      members: [members.leadDev],
      labels: ['Development', 'Backend'],
      dueDate: new Date('2026-09-10').toISOString(),
      projectId: p3._id,
      subtasks: [],
      comments: [],
    },

    // --- Completed ---
    {
      title: 'Configure MongoDB Atlas & Vercel Serverless Integration',
      description: 'Deploy NestJS serverless function with CORS headers, resilient connection pool, and IPv4 resolution.',
      status: 'completed',
      priority: 'urgent',
      members: [members.admin, members.leadDev],
      labels: ['Deployment', 'Backend'],
      dueDate: new Date('2026-08-20').toISOString(),
      projectId: p2._id,
      subtasks: [
        { _id: 's6', title: 'Configure vercel.json serverless builds', priority: 'high', status: 'completed' },
        { _id: 's7', title: 'Whitelist 0.0.0.0/0 on MongoDB Atlas', priority: 'urgent', status: 'completed' },
      ],
      comments: [
        {
          _id: 'c3',
          author: members.admin,
          content: 'Verified live and fully functioning!',
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      title: 'Guest Authentication & JWT Session Flow',
      description: 'Enable instantaneous 1-click guest login with auto-generated credentials and JWT signed tokens.',
      status: 'completed',
      priority: 'high',
      members: [members.admin],
      labels: ['Development', 'Security'],
      dueDate: new Date('2026-08-20').toISOString(),
      projectId: p2._id,
      subtasks: [],
      comments: [],
    },
    {
      title: 'Design 6 Accent Color Themes (Amber, Emerald, Rose, etc.)',
      description: 'Create curated color tokens and CSS variable mappings across light and dark modes.',
      status: 'completed',
      priority: 'medium',
      members: [members.designer],
      labels: ['Design'],
      dueDate: new Date('2026-08-18').toISOString(),
      projectId: p1._id,
      subtasks: [],
      comments: [],
    },

    // --- On Hold ---
    {
      title: 'Native Mobile Push Notifications',
      description: 'Set up Apple APNs and Firebase Cloud Messaging for real-time task assignment alerts.',
      status: 'on_hold',
      priority: 'medium',
      members: [members.qa],
      labels: ['Testing', 'Feature'],
      dueDate: new Date('2026-10-12').toISOString(),
      projectId: p4._id,
      subtasks: [],
      comments: [
        {
          _id: 'c4',
          author: members.qa,
          content: 'Waiting for Apple Developer Account approval before proceeding.',
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        },
      ],
    },
  ];

  await Task.insertMany(tasksData);

  console.log(`🎉 Successfully seeded:`);
  console.log(`   📁 ${createdProjects.length} Projects`);
  console.log(`   📝 ${tasksData.length} Tasks with subtasks & comments`);

  await mongoose.disconnect();
  console.log('🔒 Database connection closed.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
