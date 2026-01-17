import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    await prisma.comment.deleteMany()
    await prisma.personRelation.deleteMany()
    await prisma.person.deleteMany()
    await prisma.userFamily.deleteMany()
    await prisma.family.deleteMany()
    await prisma.session.deleteMany()
    await prisma.user.deleteMany()

    console.log('✅ Cleaned database')

    const adminPassword = await bcrypt.hash('admin123', 10)
    const userPassword = await bcrypt.hash('user123', 10)

    const admin = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            passwordHash: adminPassword,
            name: 'Admin User',
        },
    })

    const regularUser = await prisma.user.create({
        data: {
            email: 'user@example.com',
            passwordHash: userPassword,
            name: 'Regular User',
        },
    })

    console.log('✅ Created users')

    const family = await prisma.family.create({
        data: {
            name: 'González Family',
        },
    })

    console.log('✅ Created family')

    await prisma.userFamily.create({
        data: {
            userId: admin.id,
            familyId: family.id,
            role: 'ADMIN',
        },
    })

    await prisma.userFamily.create({
        data: {
            userId: regularUser.id,
            familyId: family.id,
            role: 'USER',
        },
    })

    console.log('✅ Added users to family')

    const grandpa = await prisma.person.create({
        data: {
            familyId: family.id,
            firstName: 'Carlos',
            lastName1: 'González',
            lastName2: 'Pérez',
            isAlive: false,
            birthDate: new Date('1930-05-15'),
            deathDate: new Date('2010-12-20'),
            profession: 'Doctor',
            description: 'Fundador de la familia, médico respetado',
            photos: ['https://example.com/carlos.jpg'],
        },
    })

    const grandma = await prisma.person.create({
        data: {
            familyId: family.id,
            firstName: 'María',
            lastName1: 'Rodríguez',
            lastName2: 'López',
            isAlive: false,
            birthDate: new Date('1935-08-22'),
            deathDate: new Date('2015-03-10'),
            profession: 'Maestra',
            description: 'Maestra de escuela primaria',
            photos: ['https://example.com/maria.jpg'],
        },
    })

    const father = await prisma.person.create({
        data: {
            familyId: family.id,
            firstName: 'Juan',
            lastName1: 'González',
            lastName2: 'Rodríguez',
            isAlive: true,
            birthDate: new Date('1960-03-10'),
            profession: 'Ingeniero',
            description: 'Ingeniero civil especializado en puentes',
            photos: ['https://example.com/juan.jpg', 'https://example.com/juan2.jpg'],
        },
    })

    const mother = await prisma.person.create({
        data: {
            familyId: family.id,
            firstName: 'Ana',
            lastName1: 'Martínez',
            lastName2: 'García',
            isAlive: true,
            birthDate: new Date('1962-11-25'),
            profession: 'Arquitecta',
            description: 'Arquitecta especializada en diseño sostenible',
            photos: ['https://example.com/ana.jpg'],
        },
    })

    const son = await prisma.person.create({
        data: {
            familyId: family.id,
            firstName: 'Pedro',
            lastName1: 'González',
            lastName2: 'Martínez',
            isAlive: true,
            birthDate: new Date('1990-07-18'),
            profession: 'Programador',
            description: 'Desarrollador de software',
            photos: [
                'https://example.com/pedro.jpg',
                'https://example.com/pedro2.jpg',
                'https://example.com/pedro3.jpg',
            ],
        },
    })

    console.log('✅ Created persons')

    await prisma.personRelation.create({
        data: {
            parentId: grandpa.id,
            childId: father.id,
            familyId: family.id,
        },
    })

    await prisma.personRelation.create({
        data: {
            parentId: grandma.id,
            childId: father.id,
            familyId: family.id,
        },
    })

    await prisma.personRelation.create({
        data: {
            parentId: father.id,
            childId: son.id,
            familyId: family.id,
        },
    })

    await prisma.personRelation.create({
        data: {
            parentId: mother.id,
            childId: son.id,
            familyId: family.id,
        },
    })

    console.log('✅ Created relations')

    await prisma.comment.create({
        data: {
            userId: admin.id,
            personId: grandpa.id,
            text: 'Un hombre notable que dedicó su vida a ayudar a los demás',
        },
    })

    await prisma.comment.create({
        data: {
            userId: regularUser.id,
            personId: father.id,
            text: 'Recuerdo sus historias sobre la construcción del puente',
        },
    })

    await prisma.comment.create({
        data: {
            userId: admin.id,
            personId: son.id,
            text: 'Siguiendo los pasos de innovación de la familia',
        },
    })

    console.log('✅ Created comments')

    console.log('\n🎉 Seed completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`  - Users: 2 (admin@example.com / admin123, user@example.com / user123)`)
    console.log(`  - Families: 1 (González Family)`)
    console.log(`  - Persons: 5`)
    console.log(`  - Relations: 4`)
    console.log(`  - Comments: 3`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
