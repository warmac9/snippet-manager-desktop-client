/*
PrioritizedList is sorted list based on priority

Priority is defined as number array

Items in PrioritizedList are sorted accoring to first number in priority,
from greatest to smallest, if first numbers of priorities is equal,
order of items is determined based on next number. The same principle
applies to the next number

ex.
[2, 1] -> [2, 0] -> [1, 99] -> [0, 0]
*/


interface PrioritizedItem {
    priority: number[]
    val: any
}

export class PrioritizedList {
    list: PrioritizedItem[]

    constructor(list: PrioritizedItem[] = []) {
        this.list = list
    }

    sort() {
        this.list.sort(({ priority: a }, { priority: b }) => {
            for (let index = 0; index < Math.min(a.length, b.length); index++) {
                if(a[index] == b[index]) continue
                return a[index] > b[index] ? -1 : 1
            }
            return -1
        })
        return this
    }

    getValues() {
        return this.list.map(item => item.val)
    }

    get values() {
        return this.getValues()
    }
}