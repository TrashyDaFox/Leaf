export const betweenXYZ = (XYZa, XYZb, XYZc) =>
    XYZc.length ===
    XYZc.filter(
        (c, i) =>
            c >= Math.min(XYZa[i], XYZb[i]) && c <= Math.max(XYZa[i], XYZb[i])
    ).length;