import * as React from "react";
import styled from "styled-components";
import { useRootStore } from "../../../store";
import Button from "./Button";
import Amp from "../../../assets/images/&.png";
import Logo from "../../../assets/images/logo.png";
import { breakpoints } from "../../../styles/styleUtils";
import { checkProjectOwnership } from "../../../util/web3Utils";
import { ProjectIds } from "../../../types/web3";
import { observer } from "mobx-react-lite";
import { allowlistCount } from "../../../util/api/endpoints";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
type Props = {
    content?: React.ReactNode;
    project: ProjectIds;
    projectName: string;
    imgSrc: string;
};

export const AllowlistGiveaway = observer(({ content = undefined, project, projectName, imgSrc }: Props) => {
    // const { accountStore, mapsStore: mapsContractStore } = useRootStore();
    // const [isOwner, setIsOwner] = React.useState<boolean>(false);
    // const [remaining, setRemaining] = React.useState<number>(0);
    // const [loading, setIsLoading] = React.useState<boolean>(false);
    // const [loadingCount, setIsLoadingCount] = React.useState<boolean>(false);
    // const [count, setCount] = React.useState<number>(0);

    // const loadCount = async (updateLoadingMessage: boolean = true) => {
    //   updateLoadingMessage && setIsLoadingCount(true);
    //   setCount((await allowlistCount(project)) || 0);
    //   updateLoadingMessage && setIsLoadingCount(false);
    // };

    // const loadDetails = async () => {
    //   loadCount();
    //   setIsLoading(true);
    //   if (accountStore?.user?.publicAddress) {
    //     await updateOwnerShip();
    //     await accountStore.fetchAllowlistStatus();
    //   }
    //   setIsLoading(false);
    // };

    // const updateOwnerShip = async () => {
    //   setIsOwner(
    //     await checkProjectOwnership(mapsContractStore.defaultProvider, project, accountStore.user.publicAddress),
    //   );
    // };

    // const claimList = async () => {
    //   await accountStore.claimAllowlist(project);
    //   accountStore.allowlistClaimMessage === "Success" && loadCount(false);
    // };

    // React.useEffect(() => {
    //   loadDetails();
    // }, [accountStore.user]);

    // const loadingPage = accountStore.loadingAccount || loading;

    return (
        <>
            <Content>
                <ContentText>The allowlist is closed. Adventurers presale mint is April 12th, 8am EDT.</ContentText>
                <ContentImage>
                    <LogoImage>
                        <img src={imgSrc} alt={projectName} />
                    </LogoImage>
                </ContentImage>
            </Content>
            <BannerImage>
                <Link href="/adventurers">
                    <img src={"/images/adv_landing_v1.png"} alt="adventurer mint april 12" />
                </Link>
            </BannerImage>
        </>
    );
});

const BannerImage = styled.div`
    cursor: pointer;
    display: block;
`;

const Content = styled.div`
    display: flex;
    @media (max-width: ${breakpoints.mobile}) {
        flex-direction: row-reverse;
        flex-wrap: wrap;
    }
`;

const ContentText = styled.div`
    width: calc(100% - 400px);
    padding-right: 25px;
    @media (max-width: ${breakpoints.mobile}) {
        padding-right: 0;
        margin-bottom: 15px;
        width: 100%;
    }
    span {
        display: inline-block;
        margin-bottom: 15px;
    }
`;

const ContentImage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 400px;
    @media (max-width: ${breakpoints.mobile}) {
        width: 100%;
    }
`;

const LogoImage = styled.div``;

const ErrorMessage = styled.div`
    margin-bottom: 10px;
    color: #ff0000;
`;

const SuccessMessage = styled.div`
    color: #33ff00;
    margin-bottom: 10px;
`;
