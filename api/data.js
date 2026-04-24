import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);
  const { type } = req.query; // We use this to tell if we are talking about users or data

  try {
    // --- HANDLING USERS ---
    if (type === 'users') {
      if (req.method === 'GET') {
        const users = await sql`SELECT username, password, role FROM system_users`;
        return res.status(200).json(users);
      }
      if (req.method === 'POST') {
        const { u, p } = req.body;
        await sql`INSERT INTO system_users (username, password, role) VALUES (${u}, ${p}, 'staff')`;
        return res.status(200).json({ success: true });
      }
    }

    // --- HANDLING DRIVER DATA ---
    if (req.method === 'POST') {
      const { name, bus, date, o, a, s, c, by } = req.body;
      await sql`INSERT INTO bus_data (driver_name, bus_number, entry_date, points_o, points_a, points_s, points_c, created_by)
                VALUES (${name}, ${bus}, ${date}, ${o}, ${a}, ${s}, ${c}, ${by})`;
      return res.status(200).json({ success: true });
    } 
    
    if (req.method === 'GET') {
      const data = await sql`SELECT * FROM bus_data ORDER BY id DESC LIMIT 50`;
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
