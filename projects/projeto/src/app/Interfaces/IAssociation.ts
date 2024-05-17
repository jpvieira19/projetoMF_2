export class IAssociation{
    id: number;
    colaboratorId: number;
    projectId: number;
    startDate: string;
    endDate: string;

    constructor(id: number, idcolab: number, idProject: number, startDate: string, endDate: string){
        this.id = id;
        this.colaboratorId = idcolab;
        this.projectId = idProject;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}