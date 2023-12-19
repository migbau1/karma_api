import { compareSync, hash } from 'bcrypt'

const hashPassword = async (password: string) => {
    try {
        const hashPassword = await hash(password, 10)
        return hashPassword
    } catch (error) {
        console.log(error);
        throw error
    }
}

const isMatch = (password: string, hash: string): boolean => {
    const pass = compareSync(password, hash)
    return pass
}

export {
    hashPassword,
    isMatch
}