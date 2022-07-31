const SessionStorage = require('../models/session_storage').SessionStorage

test('test class SessionStorage', () => {
const s_storage = new SessionStorage()
const session_data1 = { userID: 1}
const sid1 = s_storage.create(session_data1)
expect( sid1.length ).toBe( SessionStorage.SID_LENGHT )
expect(s_storage.check(sid1) ).toBeTruthy()
expect(s_storage.get_data(sid1) ).toEqual(session_data1)

const session_data2 = { userID: 2}
const sid2 = s_storage.create(session_data2)
expect( sid2.length ).toBe( SessionStorage.SID_LENGHT )
expect( sid2 ).not.toBe( sid1 )
expect(s_storage.check(sid2) ).toBeTruthy()
expect(s_storage.get_data(sid2) ).toEqual(session_data2)

const session_data3 = { userID: 3}
const sid3 = s_storage.create(session_data3)
expect( sid3.length ).toBe( SessionStorage.SID_LENGHT )
expect( sid3 ).not.toBe( sid1 )
expect( sid3 ).not.toBe( sid2 )
expect(s_storage.check(sid3) ).toBeTruthy()
expect(s_storage.get_data(sid3) ).toEqual(session_data3)

s_storage.remove( sid1 )
expect( s_storage.check(sid1)).toBeFalsy()
expect(s_storage.get_data(sid1) ).toBeUndefined()
expect(s_storage.check(sid2) ).toBeTruthy()
expect(s_storage.get_data(sid2) ).toEqual(session_data2)
expect(s_storage.check(sid3) ).toBeTruthy()
expect(s_storage.get_data(sid3) ).toEqual(session_data3)

s_storage.flush()
expect( s_storage.check(sid2)).toBeFalsy()
expect(s_storage.get_data(sid2) ).toBeUndefined()
expect( s_storage.check(sid3)).toBeFalsy()
expect(s_storage.get_data(sid3) ).toBeUndefined()
    
})