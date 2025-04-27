import React from 'react';
import Navbar from "@/components/customer/home/navbar";

interface Props {
    children: React.ReactNode;
}

const Layout = ({children}: Props) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            {children}
        </div>
    );
};

export default Layout;