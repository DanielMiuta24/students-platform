import mongoose from 'mongoose';
import { CategoryModel } from '../modules/category/models/category.model';
import { db } from '../config/db';

interface CategorySeed {
  name: string;
  slug: string;
  description: string;
  icon?: string;
  isActive: boolean;
  order: number;
}

const categories: CategorySeed[] = [
  {
    name: 'Scholarships',
    slug: 'scholarships',
    description: 'Find and discuss scholarship opportunities, funding options, and financial aid for students.',
    icon: '💰',
    isActive: true,
    order: 1,
  },
  {
    name: 'Universities',
    slug: 'universities',
    description: 'Discussions about universities, college rankings, campus life, and choosing the right institution.',
    icon: '🎓',
    isActive: true,
    order: 2,
  },
  {
    name: 'Study Abroad',
    slug: 'study-abroad',
    description: 'Everything about studying abroad, exchange programs, international education, and cultural experiences.',
    icon: '✈️',
    isActive: true,
    order: 3,
  },
  {
    name: 'Visa',
    slug: 'visa',
    description: 'Student visa information, application processes, requirements, and immigration matters.',
    icon: '📋',
    isActive: true,
    order: 4,
  },
  {
    name: 'Student Life',
    slug: 'student-life',
    description: 'Campus activities, student organizations, social life, housing, and everyday student experiences.',
    icon: '🎉',
    isActive: true,
    order: 5,
  },
  {
    name: 'Applications',
    slug: 'applications',
    description: 'University applications, admission essays, recommendation letters, and application strategies.',
    icon: '📝',
    isActive: true,
    order: 6,
  },
];

async function seedCategories() {
  try {
    console.log('🌱 Starting category seeding...\n');

    await db.connect();
    console.log('✅ Connected to database\n');

    const existingCount = await CategoryModel.countDocuments();

    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing categories in database`);
      console.log('Do you want to:');
      console.log('  1. Skip seeding (keep existing)');
      console.log('  2. Clear and reseed all categories');
      console.log('  3. Add only missing categories\n');

      const choice = process.env.SEED_MODE || '3';

      switch (choice) {
        case '1':
          console.log('✅ Skipping seeding. Existing categories preserved.');
          await db.disconnect();
          return;

        case '2':
          console.log('🗑️  Clearing existing categories...');
          await CategoryModel.deleteMany({});
          console.log('✅ Existing categories cleared\n');
          break;

        case '3':
        default:
          console.log('➕ Will add only missing categories\n');
          break;
      }
    }

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const categoryData of categories) {
      try {
        const existing = await CategoryModel.findOne({ slug: categoryData.slug });

        if (existing) {
          console.log(`⏭️  Skipped: "${categoryData.name}" (already exists)`);
          skipped++;
          continue;
        }

        const category = await CategoryModel.create(categoryData);
        console.log(`✅ Created: "${category.name}" (id: ${category._id})`);
        created++;

      } catch (error: any) {
        console.error(`❌ Error creating "${categoryData.name}":`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`   Created: ${created}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Errors:  ${errors}`);
    console.log(`   Total:   ${categories.length}\n`);

    if (created > 0) {
      console.log('✨ Category seeding completed successfully!\n');
    } else if (skipped === categories.length) {
      console.log('✅ All categories already exist. No changes made.\n');
    }

    const allCategories = await CategoryModel.find()
      .sort({ order: 1 })
      .select('name slug isActive order');

    console.log('📋 Current categories in database:');
    allCategories.forEach((cat, index) => {
      const status = cat.isActive ? '🟢' : '🔴';
      console.log(`   ${index + 1}. ${status} ${cat.name} (${cat.slug}) - Order: ${cat.order}`);
    });
    console.log();

  } catch (error: any) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await db.disconnect();
    console.log('👋 Disconnected from database');
  }
}

if (require.main === module) {
  seedCategories()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

export { seedCategories };
