import PropertyCard from "@/components/PropertyCard";
import { fetchProperties } from "@/utils/requests";

const PropertiesPage = async () => {
    const properties = await fetchProperties();

    // Sort properties by date
    properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <section className="px-4 py-6">
            <div className="px-4 py-6 m-auto container-xl lg:container">
                {properties.length === 0 ? (
                    <p>No properties found</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {properties.map((property) => (
                            <PropertyCard
                                key={property._id}
                                property={property}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PropertiesPage;