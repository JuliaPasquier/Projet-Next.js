
import connectDB from '@/config/database';
import Property from '@/app/models/Property';;




export const GET = async (request) => {
  try {
  await connectDB();

  const properties = await Property.find({});

  console.log(properties);

    return new Response(JSON.stringify(properties), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something Went Wrong", {
      status: 500,
    });
  }
};

