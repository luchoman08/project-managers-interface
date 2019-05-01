export class Point {
    id: number;
    value: number | null;
    name: number;
    order: number;
    public static sortFunction(point1: Point, point2: Point) {
        return point1.order <= point2.order ? -1 : 1;
    }
}