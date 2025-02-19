class ChestGUICommon {
    rowColToSlotId(row, col) {
        return 9 * (row - 1) + (col - 1)
    }
    slotIdToRowCol(id) {
        return [
            Math.floor(id / 9) + 1,
            id % 9 + 1
        ]
    }
}

export default new ChestGUICommon();