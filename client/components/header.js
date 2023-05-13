import React from "react";
import Link from "next/link";

const Header = ({ currentUser }) => {
    const links = [];

    if (!currentUser.currentUser) {
        links.push({ label: "Sign In", href: "/auth/signin" });
        links.push({ label: "Sign Up", href: "/auth/signup" });
    } else {
        links.push({ label: "My Orders", href: "/orders" });
        links.push({ label: "Sell Ticket", href: "/tickets/new" });
        links.push({ label: "Sign Out", href: "/auth/signout" });
    }

    const linkElements = links.map(({ label, href }) => {
        return (
            <li className="nav-item" key={href}>
                <Link className="nav-link" href={href}>
                    {label}
                </Link>
            </li>
        );
    });
    return (
        <nav className="navbar navbar-light bg-light">
            <Link className="navbar-brand" href="/">
                GitTix
            </Link>
            <div className="d-flex jsutify-content-end">
                <ul className="nav d-flex align-items-center">
                    {linkElements}
                </ul>
            </div>
        </nav>
    );
};

export default Header;
