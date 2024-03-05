import styled from "styled-components";
import { css } from "@emotion/react";
import { useState } from "react";

type Props = {
    id?: string;
    name?: string;
};

export const DwellerPortrait = (props: Props) => {
    const [isZoom, setIsZoom] = useState<boolean>(false);

    return (
        <PortraitImage>
            <img
                className={isZoom ? "zoom" : "unzoom"}
                src={`/images/dwp_${props.id}.png`}
                alt={props.name}
                onClick={() => {
                    setIsZoom(isZoom ? false : true);
                }}
            />
        </PortraitImage>
    );
};

const PortraitImage = styled.div`
    background: #000;
    img {
        margin-bottom: 0;
        &.unzoom {
            border: 1px solid #666;
            float: right;
            margin-top: 10px;
            margin-left: 10px;
            margin-bottom: 5px;
            width: 280px;
        }

        &.zoom {
            border: 1px solid #666;
            width: 100%;
            margin-top: 10px;
            margin-left: 0px;
            margin-bottom: 5px;
        }
    }
`;
