import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';
 
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  var ObjectId = require('mongodb').ObjectId;
  const id_to_use = new ObjectId(id);
  try {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const movies = await db
        .collection("movies")
        .find({_id: id_to_use})
        .sort({ metacritic: -1 })
        .limit(10)
        .toArray();
    res.json(movies);
} catch (e) {
    console.error(e);
}
}