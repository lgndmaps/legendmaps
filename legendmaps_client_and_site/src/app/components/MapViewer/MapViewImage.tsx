import {HoverTileD, IMapD} from "../../../types/mapTypes";
import styled from "styled-components";
import settings from "../../../settings";
import {useEffect, useState} from "react";
import {buildMapLayouts} from "../../../util/mapviewer/mapLayoutUtils";
import {IMapMetaD} from "../../../types/metaMapTypes";

const tileSize = (1 / 25) * 100;

export interface MapImageProps {
    mapJson: IMapD;
    mapMetaJson: IMapMetaD;
}

export interface MapElementProps {
    tileData: HoverTileD;
}

const MapImageWrapper = styled.div`
  border: 1px solid #fff;
  position: relative;

  img {
    display: block;
    margin: 0 !important;
  }

  .hover-elements {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;

    div {
      position: absolute;
      cursor: pointer;

      &.active {
        border: 1px solid #fff;

        .hover-tooltip {
          display: block;
        }
      }

      .hover-tooltip {
        display: none;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        position: absolute;
        top: 120%;
        left: 50%;
        transform: translateX(-50%);
        color: #000;
        background: #fff;
        min-width: 145px;
        padding: 10px 5px;

        &:before {
          content: "";
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;

          border-bottom: 5px solid #fff;
          position: absolute;
          left: 50%;
          top: -5px;
          transform: translateX(-50%);
        }
      }
    }
  }
`;

const MapElement = ({tileData}: MapElementProps) => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const style = {
        width: `${tileData.size * tileSize}%`,
        height: `${tileData.size * tileSize}%`,
        left: `${tileData.offset.x}%`,
        top: `${tileData.offset.y}%`,
        zIndex: `${tileData.size > 1 ? 2 : 1} `,
    };
    return (
        <div
            className={isActive ? "active" : ""}
            style={style}
            onMouseEnter={() => {
                setIsActive(true);
            }}
            onMouseLeave={() => {
                setIsActive(false);
            }}
        >
            {tileData.type == "dweller" ? (
                <div className="hover-tooltip">
                    <p>{tileData.description}</p>
                    {tileData.rarity && <p className={tileData.rarity}>[{tileData.rarity}]</p>}
                    {Math.round(10000 * (tileData.countPerMap / 5757)) / 100}% of maps
                </div>
            ) : tileData.type == "trap" ? (
                <div className="hover-tooltip">
                    <p>trap: {tileData.description}</p>
                    {tileData.rarity && <p className={tileData.rarity}>[{tileData.rarity}]</p>}
                    {Math.round(10000 * (tileData.countPerMap / 5757)) / 100}% of maps
                </div>
            ) : tileData.countPerMap != null ? (
                <div className="hover-tooltip">
                    <p>{tileData.type.indexOf("treasure") == -1 ? tileData.name : tileData.description}</p>
                    {tileData.type.indexOf("treasure") == -1 && tileData.rarity && (
                        <p className={tileData.rarity}>[{tileData.rarity}]</p>
                    )}
                    {Math.round(10000 * (tileData.countPerMap / 5757)) / 100}% of maps
                </div>
            ) : (
                <div className="hover-tooltip">
                    <p>{tileData.description}</p>
                    {tileData.rarity && <p className={tileData.rarity}>[{tileData.rarity}]</p>}
                </div>
            )}
        </div>
    );
};

const MapViewImage = ({mapJson, mapMetaJson}: MapImageProps) => {
    const [mapsElements, setMapElements] = useState<HoverTileD[]>([]);
    useEffect(() => {
        setMapElements(buildMapLayouts(mapJson, mapMetaJson));
    }, []);

    return (
        <MapImageWrapper>
            <img src={`${settings.IMAGE_URL}${mapJson.image.substring(7).split('/')[1]}`} alt=""/>
            <div className="hover-elements">
                {mapsElements.map((elem) => {
                    return <MapElement tileData={elem}/>;
                })}
            </div>
        </MapImageWrapper>
    );
};

export default MapViewImage;
