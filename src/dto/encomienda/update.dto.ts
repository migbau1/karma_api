import IEncomiendaCreateDto from "./create.dto";

interface IEncomiendaUpdateDto extends IEncomiendaCreateDto {
    id: number;
}

export default IEncomiendaUpdateDto