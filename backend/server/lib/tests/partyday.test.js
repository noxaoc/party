import dayjs from "dayjs"
import { PartyDate } from "../partyday"

test("PartyDate.dateToTS('15.01.23')", () => {
    const dt_str = '15.01.23'
    const ts = PartyDate.dateToTS(dt_str)
    const dt = PartyDate.dateFromTS(ts)
    expect(dt).toEqual(dt_str)
})

test("PartyDate.getCurrDate()", () => {
    const curDate = dayjs()
    const dt = dayjs.unix(PartyDate.getCurrDate())
    expect(curDate.year()).toEqual(dt.year())
    expect(curDate.month()).toEqual(dt.month())
    expect(curDate.day()).toEqual(dt.day())
    expect(dt.hour()).toEqual(0)
    expect(dt.minute()).toEqual(0)
    expect(dt.second()).toEqual(0)

})