export class IColaborator{
    id: number;
    name: string;
    email: string;

    constructor(id: number, nome: string, email: string){
        this.id = id;
        this.name = nome;
        this.email = email;
    }
}