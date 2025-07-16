export class TipoParentescoNotFoundError extends Error {
    constructor(message: string = "Tipo de parentesco no encontrado") {
        super(message);
        this.name = "TipoParentescoNotFoundError";
    }
}
