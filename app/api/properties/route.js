import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { getSession } from "next-auth/react";

// GET /api/properties
export const GET = async (request) => {
    try {
        await connectDB(); // Connect to database

        const properties = await Property.find({});

        return new Response(JSON.stringify(properties), {
            status: 200,
        });
    } catch (error) {
        return new Response("Something Went Wrong...", { status: 500 });
    }
};

// POST /api/properties
export const POST = async (request) => {
    try {
        await connectDB(); // Connect to database

        const sessionUser = await getSessionUser();

        // Handle error if no user is found in the session
        if (!sessionUser || !sessionUser.userId) {
            return new Response("Unauthorized, userId is required", {
                status: 401,
            });
        }

        const { userId } = sessionUser;

        const formData = await request.formData();


        // Acces all values from amenities and images
        const amenities = formData.getAll("amenities");
        const images = formData.getAll("images").filter((image) => image.name !== '')
            .getAll('images')
            .filter((image) => image.name !== '');


        // Create propertyData object for database
        const propertyData = {
            type: formData.get("type"),
            name: formData.get("name"),
            description: formData.get("description"),
            location: {
                street: formData.get("location.street"),
                city: formData.get("location.city"),
                state: formData.get("location.state"),
                zipcode: formData.get("location.zipcode"),
            },
            beds: formData.get("beds"),
            baths: formData.get("baths"),
            square_feet: formData.get("size"),
            amenities,
            rates: {
                weekly: formData.get("rates.weekly"),
                monthly: formData.get("rates.monthly"),
                nightly: formData.get("rates.nightly")
            },
            seller_info: {
                name: formData.get("seller_info.name"),
                email: formData.get("seller_info.email"),
                phone: formData.get("seller_info.phone"),
            },
            owner: userId,
            // images

        };

        const newProperty = new Property(propertyData);
        await newProperty.save();
        return Response.redirect(
            `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
        );
        // return new Response(JSON.stringify({ message: 'Succes' }), {
        //     status: 200,
        // });
    } catch (error) {
        return new Response("Something Went Wrong...", { status: 500 });
    }
}