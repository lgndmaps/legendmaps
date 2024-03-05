import React from "react";

interface IProps {
    children: React.ReactNode;
    href: string;
    className: string;
    target?: string;
}

type TProps = IProps & React.HTMLAttributes<HTMLAnchorElement>;

const ExternalLink = (props: TProps) => {
    const { href, className, children } = props;
    return (
        <a
            href={href}
            className={className}
            rel="noopener noreferrer"
            target={props.target ? props.target : "_blank"}
            {...props}
        >
            {children}
        </a>
    );
};

export default ExternalLink;
