import React from "react";

export function useHasMounted(): boolean {
    const [hasMounted, setHasMounted] = React.useState(false);
    React.useEffect(() => {
        setHasMounted(true);
    }, []);
    return hasMounted;
}

export default function ClientOnly({ children, ...delegated }): JSX.Element | null {
    const hasMounted = useHasMounted();
    if (!hasMounted) {
        return null;
    }
    return <div {...delegated}>{children}</div>;
}
