import connectDB from "@/config/database";
import Property from "@/models/Property";

// GET /api/properties/:id
export const GET = async (request, { params }) => {
    try {
        await connectDB(); // Connect to database

        const property = await Property.findById(params.id);
        if (!property)
            return new Response("Property Not Found", { status: 40 });

        return new Response(JSON.stringify(property), {
            status: 200,
        });
    } catch (error) {
        return new Response("Something Went Wrong...", { status: 500 });
    }
};