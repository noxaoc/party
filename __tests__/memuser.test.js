const MemUser = require('../models/memuser').MemUser

test('test MemUser', () => {
 const db_user = new MemUser();
    // uid - user identificator
  const  data_john = {email:"john@gmail.com", firstName:"John", secondName: "", familyName: "Smith"}
  const  uid_john = db_user.create( data_john, null )
  expect( uid_john ).toEqual( expect.anything() )
  const data_mary = {email:"mary@gmail.com", firstName:"Mary", secondName: "Santa", familyName: "Red"}
  const uid_mary = db_user.create(data_mary, null )
  expect( uid_mary ).toEqual( expect.anything() )
  expect( uid_john != uid_mary ).toBeTruthy()
  const data_iren = {email:"iren@gmail.com", firstName:"Iren", secondName: "", familyName: "Flower"}
  const uid_iren = db_user.create(data_iren, null )
  expect( uid_iren ).toEqual( expect.anything() )
  expect( uid_john != uid_iren && uid_mary != uid_iren ).toBeTruthy()   
  // поиск по email
  expect( db_user.id_by_email( data_john.email ) ).toBe( uid_john )
  expect( db_user.id_by_email( data_mary.email ) ).toBe( uid_mary )
  expect( db_user.id_by_email( data_iren.email ) ).toBe( uid_iren )
  // чтение по uid
  expect( db_user.read(uid_john) ).toEqual(data_john)
  expect( db_user.read(uid_mary) ).toEqual(data_mary)
  expect( db_user.read(uid_iren) ).toEqual(data_iren)
  // удаление по uid
  db_user.delete(uid_john)
  expect( db_user.id_by_email( data_john.email ) ).toBeUndefined()
  expect( db_user.id_by_email( data_mary.email ) ).toBe( uid_mary )
  expect( db_user.id_by_email( data_iren.email ) ).toBe( uid_iren )
  expect( db_user.read(uid_john) ).toBeUndefined()
  expect( db_user.read(uid_mary) ).toEqual(data_mary)
  expect( db_user.read(uid_iren) ).toEqual(data_iren)
  // удаление всех
  db_user.delete_all()
  expect( db_user.id_by_email( data_john.email ) ).toBeUndefined()
  expect( db_user.id_by_email( data_mary.email ) ).toBeUndefined()
  expect( db_user.id_by_email( data_iren.email ) ).toBeUndefined()
  expect( db_user.read(uid_john) ).toBeUndefined()
  expect( db_user.read(uid_mary) ).toBeUndefined()
  expect( db_user.read(uid_iren) ).toBeUndefined()
  const data_miles = {email:"miles@gmail.com", firstName:"Miles", secondName: "", familyName: "Davis"}
  const uid_miles = db_user.create(data_miles, null )
  expect( uid_miles ).toEqual( expect.anything() )
  expect( uid_john != uid_miles && uid_mary != uid_miles && uid_iren != uid_miles  ).toBeTruthy()   
  // попытка вставить пользователя с тем же email
  const data_jaco = {email: data_miles.email, firstName:"Jaco", secondName: "", familyName: "Pastorius"}
  expect( () => { 
    db_user.create(data_jaco, null ) } ).toThrow(Error)
  // // попытка вставить пользователя без email
  expect( () => { 
    db_user.create( { firstName:"Jaco", secondName: "", familyName: "Pastorius"}, null ) } ).toThrow(Error)
  expect( () => { 
    db_user.create( { email: null, firstName:"Jaco", secondName: "", familyName: "Pastorius"}, null ) }).toThrow(Error)
  expect( () => {  
    db_user.create( { email: "", firstName:"Jaco", secondName: "", familyName: "Pastorius"}, null ) }).toThrow(Error)
  db_user.delete_all()
})