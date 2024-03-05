import MapRect from "../../utils/mapRect";

//Placement zone for map generator to use when placing rooms.
//
export class MapGenRoomQuad extends MapRect {
    merged: boolean = false;
    tilecount: number = 1;

    //NOTE: this only works with immediate cardinal neighbors, will break badly otherwise.
    mergeWith(quad: MapGenRoomQuad) {
        this.merged = true;
        if (this.origin.x < quad.origin.x || this.origin.y < quad.origin.y) {
            quad.UpdateOrigin(this.origin.x, this.origin.y);
        } else {
            quad.UpdateBottomRight(this.bottomRight.x, this.bottomRight.y);
        }
        quad.tilecount++;
    }

    checkIfRectFitsInside(rect: MapRect) {
        if (rect.extents.x <= this.extents.x && rect.extents.y <= this.extents.y) {
            return true;
        } else {
            return false;
        }
    }
}
