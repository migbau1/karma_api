import ISedeCreateDto from "./create.dto";

interface ISedeUpdateDto extends ISedeCreateDto {
    id?: string;
}

export default ISedeUpdateDto