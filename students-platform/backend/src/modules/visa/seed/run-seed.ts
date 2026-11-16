import { db } from '../../../config/db';
import { VisaGuide } from '../models';
import { visaSeedData } from './visa.seed';

async function runSeed(): Promise<void> {
    try {
        await db.connect();

        const count = await VisaGuide.countDocuments();

        if (count > 0) {
            console.log(`Seed skipped: ${count} visa guides already exist in the database.`);
            await db.disconnect();
            return;
        }

        const inserted = await VisaGuide.insertMany(visaSeedData);
        console.log(`Seed complete: inserted ${inserted.length} visa guides.`);
    } catch (error) {
        console.error('Visa seed failed:', error);
        process.exit(1);
    } finally {
        await db.disconnect();
    }
}

runSeed();
