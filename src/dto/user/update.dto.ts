import IUserCreateDto from "./create.dto";

export default interface IUpdateUserDto extends IUserCreateDto{
    id?: string;
}