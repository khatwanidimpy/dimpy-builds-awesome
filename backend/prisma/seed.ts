import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            username: 'admin'
        }
    });

    if (!existingUser) {
        // Hash the admin password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash('admin123', saltRounds);

        // Create admin user
        const adminUser = await prisma.user.create({
            data: {
                username: 'admin',
                password_hash: passwordHash,
                email: 'admin@example.com',
                role: 'admin'
            }
        });

        console.log('✅ Admin user created successfully');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('⚠️  Remember to change these credentials in production!');
    } else {
        console.log('ℹ️  Admin user already exists');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });