import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";


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

        //Access all values from amenities and images arrays
        const amenities = formData.getAll("amenities");
        // Handle error if no image is submitted for Cloudinary with filter(), even though the images field is required
        const images = formData
            .getAll("images")
            .filter((image) => image.name !== "");

        // Create propertyData object for database
        const propertyData = {
            type: formData.get("type"),
            name: formData.get("name"),
            description: formData.get("description"),
            description: formData.get("description"),
            location: {
                street: formData.get("location.street"),
                city: formData.get("location.city"),
                state: formData.get("location.state"),
                zipcode: formData.get("location.zipcode"),
            },
            beds: formData.get("beds"),
            baths: formData.get("baths"),
            square_feet: formData.get("square_feet"),
            amenities,
            rates: {
                weekly: formData.get("rates.weekly"),
                monthly: formData.get("rates.monthly"),
                nightly: formData.get("rates.nightly"),
            },
            seller_info: {
                name: formData.get("seller_info.name"),
                email: formData.get("seller_info.email"),
                phone: formData.get("seller_info.phone"),
            },
            owner: userId,
        };


        // Upload image(s) to Cloudinary
        const imageUploadPromises = [];
        for (const image of images) {
            // Convert image to arrayBuffer so it can be uploaded to Cloudinary
            const imageBuffer = await image.arrayBuffer();
            const imageArray = Array.from(new Uint8Array(imageBuffer));
            const imageData = Buffer.from(imageArray);

            // Convert imageArray to base64 string
            const imageBase64 = imageData.toString("base64");

            // Make request to upload image to Cloudinary
            const result = await cloudinary.uploader.upload(
                `data:image/png;base64,${imageBase64}`,
                {
                    folder: "propertypulse",
                }
            );

            // Push the result of the image upload to the imageUploadPromises array
            imageUploadPromises.push(result.secure_url);

            // Wait for all images to upload
            const uploadedImages = await Promise.all(imageUploadPromises);

            // Add uploaded images to propertyData object
            propertyData.images = uploadedImages;
        }


        const newProperty = new Property(propertyData);
        await newProperty.save();

        return Response.redirect(
            `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
        );

        // return new Response(JSON.stringify({ message: "Success" }), {
        //     status: 201,
        // });
    } catch (error) {

        console.log(error);
        return new Response("Failed to add neww property...", { status: 500 });
    }
};