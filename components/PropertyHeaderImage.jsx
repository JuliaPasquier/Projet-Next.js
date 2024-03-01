import Image from "next/image";

const PropertyHeaderImage = ({ image }) => {
    return (
        <>
            <section>
                <div className="m-auto container-xl">
                    <div className="grid grid-cols-1">
                        <Image
                            src={image}
                            alt=""
                            width={0}
                            height={0}
                            sizes="100vw"
                            priority={true}
                            className="object-cover h-[400px] w-full"
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default PropertyHeaderImage;