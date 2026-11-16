import { db } from '../../../config/db';
import { Scholarship } from '../models';
import { scholarshipSeedData } from './scholarship.seed';

async function runSeed(): Promise<void> {
    try {
        await db.connect();

        const count = await Scholarship.countDocuments();

        if (count > 0) {
            console.log(`Seed skipped: ${count} scholarships already exist in the database.`);
            await db.disconnect();
            return;
        }

        const inserted = await Scholarship.insertMany(scholarshipSeedData);
        console.log(`Seed complete: inserted ${inserted.length} global scholarships.`);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    } finally {
        await db.disconnect();
    }
}

runSeed();
