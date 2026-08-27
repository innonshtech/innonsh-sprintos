import { PrismaClient } from '@prisma/client';

async function testConnection() {
  console.log('Testing DB connections...');

  // Test 1: Port 6543 on db.nkubwbvveyglonxpmveu.supabase.co
  const url1 = "postgresql://postgres:sprintos%40innonsh@db.nkubwbvveyglonxpmveu.supabase.co:6543/postgres?pgbouncer=true&connection_limit=10";
  const client1 = new PrismaClient({ datasources: { db: { url: url1 } } });

  try {
    const count = await client1.user.count();
    console.log('✅ Port 6543 SUCCESS! User count:', count);
  } catch (err: any) {
    console.error('❌ Port 6543 failed:', err.message);
  } finally {
    await client1.$disconnect();
  }

  // Test 2: Direct Port 5432
  const url2 = "postgresql://postgres:sprintos%40innonsh@db.nkubwbvveyglonxpmveu.supabase.co:5432/postgres";
  const client2 = new PrismaClient({ datasources: { db: { url: url2 } } });

  try {
    const count2 = await client2.user.count();
    console.log('✅ Port 5432 SUCCESS! User count:', count2);
  } catch (err: any) {
    console.error('❌ Port 5432 failed:', err.message);
  } finally {
    await client2.$disconnect();
  }
}

testConnection();
