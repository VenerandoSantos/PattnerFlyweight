interface Flyweight {
    operation(extrinsicState: any): any;
}

//Flyweight compartilhado
//Partes da arvore que se repetem, ou seja, tem partes compartilhaveis
class ConcreteFlyweight_Arvore implements Flyweight {
    public type: string;
    public texture: any | null; //uma simulacao de textura com arquivo de 1024kb para futuros calculos de memoria
    public environment: string = "floreta";
    public averageHeight: number = 10;


    constructor(type: string, intrinsicState: any, environment: string, averageHeight: number) {
        this.type = type;
        this.texture = intrinsicState;
        this.environment = environment;
        this.averageHeight = averageHeight;
    }

    setPropieties(texture: any, environment: string, averageHeight: number) {
        this.texture = texture;
        this.environment = environment;
        this.averageHeight = averageHeight;
    }


    public operation(extrinsicState: any): any {   

    }
}

//Flyweight não compartilhado
//Parte da arvore que sao unicas, ou seja, nao tem partes compartilhaveis
class UnsharedConcreteFlyweight implements Flyweight {
    private RealHeight: number;
    private tree: ConcreteFlyweight_Arvore;


    constructor(state: any, tree: ConcreteFlyweight_Arvore) {
        this.RealHeight = state;
        this.tree = tree
    }

    public operation(extrinsicState: any): any {

    }
}


//Factory misturado com singleton
//Responsavel por criar os flyweights compartilhados, e garantir que eles sejam unicos
class FlyweightFactory {
    //usa-se um map para facilitar a busca e garantir que sejam unicos
    private flyweightsmap: Map<string, ConcreteFlyweight_Arvore> = new Map<string, ConcreteFlyweight_Arvore>();

    //criar flyweight 
    CriaFlyweight_Arvore(type: string, texture: any = null, environment: string = "floresta", averageHeight: number = 10): ConcreteFlyweight_Arvore {
        //verificar se o flyweight ja existe, se nao existir criar um novo e adicionar ao map
        if (!this.flyweightsmap.has(type)) {
            console.log("Criando novo flyweight :" + type);
            const flyweight = new ConcreteFlyweight_Arvore(type, null, "floresta", 10);
            this.flyweightsmap.set(type, flyweight);
            return flyweight;
        } else {
            console.log("Flyweight ja existe: " + type);
            return this.flyweightsmap.get(type)!;
        }
    }


}

function simuledclientCode() {
    const factory = new FlyweightFactory();
    const oakTree1 = factory.CriaFlyweight_Arvore("Oak");
    const oakTree2 = factory.CriaFlyweight_Arvore("Oak");
    console.log(oakTree1 === oakTree2); // true, ambos são o mesmo objeto
    const pineTree1 = factory.CriaFlyweight_Arvore("Pine");


    const unsharedOakTree = new UnsharedConcreteFlyweight(15, oakTree1);
    const unsharedOakTree2 = new UnsharedConcreteFlyweight(12, oakTree1);
    const unsharedPineTree = new UnsharedConcreteFlyweight(20, pineTree1);

}

simuledclientCode();