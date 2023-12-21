import IEncomiendaCreateDto from "./create.dto";

interface IEncomiendaUpdateDto extends IEncomiendaCreateDto {
    id: string;
}

export default IEncomiendaUpdateDto