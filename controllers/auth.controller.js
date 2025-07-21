const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const signupController = async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

        console.log(firstName, lastName, email, phone, password, confirmPassword);
        
        if( email === '' || password === '' || firstName === '' || lastName === '' || confirmPassword === '' || phone === ''){
            res.status(400).json({ message: "The fields name, last name, profile, email, password are required" })
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if(!emailRegex.test(email)) {
            res.status(400).json({ message: "The email format is not valid" })
            return
        } 

        if(password !== confirmPassword) {
            res.status(400).json({ message: "The passwords do not match" })
            return
        }
        
        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if(!passwordRegex.test(password)) {
            res.status(400).json({ message: `
                The pass should have at least 6 characters, at least one number, 
                one uppercase and one lowercase letter hola
            ` })
            return
        } 

        const user = await User.findOne({ email })
        if(user) {
          res.status(400).json({ message: "This email is already taken" }) 
          return
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const createdUser = await User.create({ firstName, lastName, email, phone, password: hashedPassword })
        const { email: savedEmail, _id } = createdUser;

        res.status(201).json({ user: { email: savedEmail, _id } })

    } catch (error) {
        if(error.code === 500){
            res.status(500).json({ message: 'Internal server error' })
        }
        console.log(error)
        
    }
}

const loginController = async (req, res, next) =>{
    try {

        const  { password, email } = req.body;
        // Revisamos si el email o password no son strings vacios
        if(email === '' || password === '') {
            res.status(400).json({ message: "The fields name and password are required" })
            return
        }

        // revisamos que el usuario realmente exista en nuestra DB
        const foundUser = await User.findOne({ email })
        if(!foundUser) {
          console.log("no se encontro el usuario")
            res.status(401).json({ message: "User not found" })
            return 
        }

        const isPasswordCorrect = bcrypt.compareSync(password, foundUser.password)

        if(isPasswordCorrect) {

            const authToken = jwt.sign(
                { _id: foundUser._id, firtName: foundUser.firstName, lastName: foundUser.lastName, phone: foundUser.phone, email: foundUser.email}, // payload
                process.env.SECRET_KEY,                       // secret key
                { algorithm: 'HS256', expiresIn: '1h' }       // header
            )

            res.status(200).json ({ authToken })
            return
        }

        res.status(400).json({message: "Contraseña incorrecta"})


    } catch (error) {
        if(error.code === 500){
            res.status(500).json({ message: 'Internal server error' })
        }
        console.log(error)
    }
}

const verifyController = async (req, res, next) => {
    // verifyController se ejecuta si el request tenia un token valido
    // eso hace que el middleware isAuthenticated, de-codifique el token
    // y guarde el resultado en un objeto llamado payload el cual es agregado
    // al objeto request
    console.log('req.payload: ', req.payload)
    res.status(200).json(req.payload)

}

module.exports = {
    signupController,
    loginController,
    verifyController
}