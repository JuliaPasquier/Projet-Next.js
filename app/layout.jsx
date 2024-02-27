import "@/assets/styles/tailwind.css";

import AuthProvider from '@/components/AuthProvider';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';


export const metadata = {
    title: "PropertyPulse | Find The Perfect Rental",
    description:
        "Find your dream rental property with PropertyPulse. We have a wide range of properties to choose from.",
};

const MainLayout = ({ children }) => {
    return (
        <AuthProvider>
            <html lang="en">
                <body>
                    <Navbar />
                    <main>{children}</main>
                    <Footer />
                </body>
            </html>
        </AuthProvider>
    );
};

export default MainLayout;