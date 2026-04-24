import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // This uses the "Secret Link" you saved in Vercel Settings
  const sql = neon(process.env.DATABASE_URL);

  try {
    // --- 1. SAVING DATA (POST) ---
    if (req.method === 'POST') {
      const { name, bus, date, o, a, s, c, by } = req.body;
      
      await sql`
        INSERT INTO bus_data (driver_name, bus_number, entry_date, points_o, points_a, points_s, points_c, created_by)
        VALUES (${name}, ${bus}, ${date}, ${o}, ${a}, ${s}, ${c}, ${by})
      `;
      
      return res.status(200).json({ success: true, message: "Saved to Neon!" });
    } 
    
    // --- 2. GETTING DATA (GET) ---
    if (req.method === 'GET') {
      // This fetches the latest 50 entries to show to you and your friend
      const data = await sql`
        SELECT 
          id, 
          driver_name, 
          bus_number, 
          entry_date, 
          points_o, 
          points_a, 
          points_s, 
          points_c, 
          created_by 
        FROM bus_data 
        ORDER BY id DESC 
        LIMIT 50
      `;
      return res.status(200).json(data);
    }

    // If someone tries a different method (like PUT or DELETE)
    return res.status(405).json({ error: "Method not allowed" });

  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
