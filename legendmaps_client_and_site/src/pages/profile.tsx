import React from "react";
import { StyledPageContainer } from "../app/components/GlobalLayout/layout";
import { UserProfile } from "../app/components/Profile/UserProfile";
import Title from "../app/components/ui/Title";

const profile = () => {
    return (
        <StyledPageContainer>
            <UserProfile />
        </StyledPageContainer>
    );
};

export default profile;
