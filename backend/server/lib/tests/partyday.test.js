import { PartyDate } from "../partyday"

test("PartyDate.dateToTS('15.01.23')", () => {
    const dt_str = '15.01.23'
    const ts = PartyDate.dateToTS(dt_str)
    const dt = PartyDate.dateFromTS(ts)
    expect(dt).toEqual(dt_str)
})