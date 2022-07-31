const User = require('../models/user').User

test('test class User', () => {
    const user = new User();
       // uid - user identificator
     const  data_john = {email:"john@gmail.com", firstName:"John", secondName: "", familyName: "Smith", password: "748995hf95t95959h599f"}
     const  uid_john = user.create( data_john, null )
     expect( uid_john ).toEqual( expect.anything() )
     expect( user.checkPassword( data_john.email, data_john.password ) ).toBe(uid_john)
     const data_mary = {email:"mary@gmail.com", firstName:"Mary", secondName: "Santa", familyName: "Red", password: "748995hf95t95959h594f"}
     const uid_mary = user.create(data_mary, null )
     expect( uid_mary ).toEqual( expect.anything() )
     expect( uid_john != uid_mary ).toBeTruthy()
     expect( user.checkPassword( data_mary.email, data_mary.password ) ).toBe(uid_mary)
     expect( user.checkPassword( data_mary.email, data_john.password ) ).toBeUndefined()
     const data_iren = {email:"iren@gmail.com", firstName:"Iren", secondName: "", familyName: "Flower", password: "748995hf95t95959h595f"}
     const uid_iren = user.create(data_iren, null )
     expect( uid_iren ).toEqual( expect.anything() )
     expect( uid_john != uid_iren && uid_mary != uid_iren ).toBeTruthy()   
     expect( user.checkPassword( data_iren.email, data_iren.password ) ).toBe(uid_iren)
     // поиск по email
     expect( user.id_by_email( data_john.email ) ).toBe( uid_john )
     expect( user.id_by_email( data_mary.email ) ).toBe( uid_mary )
     expect( user.id_by_email( data_iren.email ) ).toBe( uid_iren )
     // чтение по uid
     expect( user.read(uid_john) ).toEqual(data_john)
     expect( user.read(uid_mary) ).toEqual(data_mary)
     expect( user.read(uid_iren) ).toEqual(data_iren)
     // удаление по uid
     user.delete(uid_john)
     expect( user.id_by_email( data_john.email ) ).toBeUndefined()
     expect( user.id_by_email( data_mary.email ) ).toBe( uid_mary )
     expect( user.id_by_email( data_iren.email ) ).toBe( uid_iren )
     expect( user.read(uid_john) ).toBeUndefined()
     expect( user.read(uid_mary) ).toEqual(data_mary)
     expect( user.read(uid_iren) ).toEqual(data_iren)
     // удаление всех
     user.delete_all()
     expect( user.id_by_email( data_john.email ) ).toBeUndefined()
     expect( user.id_by_email( data_mary.email ) ).toBeUndefined()
     expect( user.id_by_email( data_iren.email ) ).toBeUndefined()
     expect( user.read(uid_john) ).toBeUndefined()
     expect( user.read(uid_mary) ).toBeUndefined()
     expect( user.read(uid_iren) ).toBeUndefined()
     const data_miles = {email:"miles@gmail.com", firstName:"Miles", secondName: "", familyName: "Davis", password: "748995hf95t95959h596f"}
     const uid_miles = user.create(data_miles, null )
     expect( uid_miles ).toEqual( expect.anything() )
     expect( uid_john != uid_miles && uid_mary != uid_miles && uid_iren != uid_miles  ).toBeTruthy()   
     expect( user.checkPassword( data_miles.email, data_miles.password ) ).toBe(uid_miles)
     // попытка вставить пользователя с тем же email
     const data_jaco = {email: data_miles.email, firstName:"Jaco", secondName: "", familyName: "Pastorius", password: "748995hf95t95959h597f"}
     expect( () => { 
       user.create(data_jaco, null ) } ).toThrow(Error)
     // // попытка вставить пользователя без email
     expect( () => { 
       user.create( { firstName:"Jaco", secondName: "", familyName: "Pastorius"}, null ) } ).toThrow(Error)
     expect( () => { 
       user.create( { email: null, firstName:"Jaco", secondName: "", familyName: "Pastorius"}, null ) }).toThrow(Error)
     expect( () => {  
       user.create( { email: "", firstName:"Jaco", secondName: "", familyName: "Pastorius"}, null ) }).toThrow(Error)
     user.delete_all()
})