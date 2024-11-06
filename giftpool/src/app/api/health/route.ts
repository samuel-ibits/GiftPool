// // pages/api/health.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import clientPromise from '../../../lib/mongodb';

// type HealthCheckResponse = {
//     status: string;
//     timestamp: string;
//     database?: string;
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse<HealthCheckResponse>) {
//     if (req.method === 'GET') {
//         let dbStatus = 'Healthy';

//         try {
//             // Try connecting to the database
//             const client = await clientPromise;
//             await client.db().command({ ping: 1 });
//         } catch (error) {
//             dbStatus = 'Unavailable';
//             console.log(error);
//         }

//         res.status(200).json({
//             status: 'Healthy',
//             timestamp: new Date().toISOString(),
//             database: dbStatus,
//         });
//     };
// }


// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';


export async function GET() {
    const client = await clientPromise;
    const ping = await client.db().command({ ping: 1 });
    const healthCheckResponse = {
        status: 'Healthy',
        timestamp: new Date().toISOString(),
        dbstatus: ping
    };

    return NextResponse.json(healthCheckResponse, { status: 200 });
}
