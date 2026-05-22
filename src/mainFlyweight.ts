/// <reference types="node" />

// Função para medir memória de forma legível
function getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
        heapUsed: `${Math.round(usage.heapUsed)} B`,
        rss: `${Math.round(usage.rss)} B`,
        raw: usage
    };
}

function printMemory(label: string) {
    const mem = getMemoryUsage();
    console.log(`\n[${label}]`);
    console.log(`   Heap Usado: ${mem.heapUsed}`);
    console.log(`   RSS: ${mem.rss}`);
}

// Helper para simular textura de 1024KB
function createTexture(): Buffer {
    // 1024 KB = 1024 * 1024 bytes
    return Buffer.alloc(1024 * 1024, 'x');
}

interface Flyweight {
    operation(extrinsicState: any): any;
}

//Flyweight compartilhado
//Partes da arvore que se repetem, ou seja, tem partes compartilhaveis
class ConcreteFlyweight_Arvore implements Flyweight {
    public type: string;
    public texture: any | null; //uma simulacao de textura com arquivo de 1024kb para futuros calculos de memoria
    public environment: string = "floreta";

    constructor(type: string, intrinsicState: any, environment: string) {
        this.type = type;
        this.texture = intrinsicState;
        this.environment = environment;
    }

    setPropieties(texture: any, environment: string, averageHeight: number) {
        this.texture = texture;
        this.environment = environment;
    }


    public operation(extrinsicState: any): any {   

    }
}

class Arvore  {
    public type: string;
    public texture: any | null; //uma simulacao de textura com arquivo de 1024kb para futuros calculos de memoria
    public environment: string = "floreta";
    public averageHeight: number;

    constructor(type: string, intrinsicState: any, environment: string, averageHeight: number) {
        this.type = type;
        this.texture = intrinsicState;
        this.environment = environment;
        this.averageHeight = averageHeight;
    }

    setPropieties(texture: any, environment: string, averageHeight: number) {
        this.texture = texture;
        this.environment = environment;
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

class FlyweightFactory {
    private flyweightsmap: Map<string, ConcreteFlyweight_Arvore> = new Map<string, ConcreteFlyweight_Arvore>();

    CriaFlyweight_Arvore(type: string, texture: any = null, environment: string = "floresta"): ConcreteFlyweight_Arvore {
        if (!this.flyweightsmap.has(type)) {
            const flyweight = new ConcreteFlyweight_Arvore(type, createTexture(), environment);
            this.flyweightsmap.set(type, flyweight);
            return flyweight;
        } else {
            return this.flyweightsmap.get(type)!;
        }
    }


}

function simuledclientCode() {
    printMemory("Início");

    const factory = new FlyweightFactory();
    
    printMemory("Após criar factory");
    
    const oakTree1 = factory.CriaFlyweight_Arvore("Oak");
    printMemory("Após criar Oak 1");
    
    const oakTree2 = factory.CriaFlyweight_Arvore("Oak");
    printMemory("Após criar Oak 2 (compartilhado)");
        
    const pineTree1 = factory.CriaFlyweight_Arvore("Pine");
    printMemory("Após criar Pine 1");

    const unsharedOakTree = new UnsharedConcreteFlyweight(15, oakTree1);
    const unsharedOakTree2 = new UnsharedConcreteFlyweight(12, oakTree1);
    const unsharedPineTree = new UnsharedConcreteFlyweight(20, pineTree1);
    
    printMemory("Após criar instâncias não compartilhadas");

}

// ============================================
// TESTE COMPARATIVO: COM vs SEM Flyweight
// ============================================

function testSemFlyweight() {
    console.log("\n\n" + "=".repeat(60));
    console.log("SEM PADRÃO FLYWEIGHT (Criando 1000 árvores)");
    console.log("=".repeat(60));
    
    printMemory("Início - Sem Flyweight");
    
    const arvores: Arvore[] = [];
    
    for (let i = 0; i < 1000; i++) {
        // Sem compartilhamento - cria uma nova árvore para cada iteração
        const arvore = new Arvore(
            `arvore_${i}`,
            createTexture(),
            "floresta",
            10 + Math.random() * 30
        );
        arvores.push(arvore);
    }
    
    printMemory("Após criar 1000 árvores - Sem Flyweight");
}

function testComFlyweight() {
    console.log("\n\n" + "=".repeat(60));
    console.log("COM PADRÃO FLYWEIGHT (Criando 1000 árvores)");
    console.log("=".repeat(60));
    
    printMemory("Início - Com Flyweight");
    
    const factory = new FlyweightFactory();
    const arvoresUnshared: UnsharedConcreteFlyweight[] = [];
    const tipos: string[] = ["Oak", "Pine", "Birch", "Maple", "Spruce"]; // Apenas 5 tipos
    
    for (let i = 0; i < 1000; i++) {
        // Com compartilhamento - reutiliza tipos existentes
        const tipo: string = tipos[i % 5] as string; // Garante que só 5 tipos sejam usados
        const shared: ConcreteFlyweight_Arvore = factory.CriaFlyweight_Arvore(tipo);
        const unshared = new UnsharedConcreteFlyweight(10 + Math.random() * 20, shared);
        arvoresUnshared.push(unshared);
    }
    
    printMemory("Após criar 1000 árvores - Com Flyweight");
}

function testeComparativo() {
    console.log("\n\n" + "=".repeat(60));
    console.log("=" + " ".repeat(15) + "COMPARATIVO DE MEMÓRIA" + " ".repeat(23) + "=");
    console.log("=".repeat(60));
    
    // MUDANÇA AQUI: usando rss em vez de heapUsed
    const memoriaAntesComFlyweight = process.memoryUsage().rss; 

    testComFlyweight();
    
    // MUDANÇA AQUI
    const memoriaDepoisComFlyweight = process.memoryUsage().rss;
    const memoriaGastoComFlyweight = memoriaDepoisComFlyweight - memoriaAntesComFlyweight;
    
    // MUDANÇA AQUI
    const memoriaAntesSemFlyweight = process.memoryUsage().rss;
    testSemFlyweight();
    
    // MUDANÇA AQUI
    const memoriaDepoisSemFlyweight = process.memoryUsage().rss;

    const memoriaGastoSemFlyweight = memoriaDepoisSemFlyweight - memoriaAntesSemFlyweight;

    console.log("RESULTADO FINAL");

    const economiaPercentual = ((memoriaGastoSemFlyweight - memoriaGastoComFlyweight) / memoriaGastoSemFlyweight * 100).toFixed(2);
    const economiaBytes = (memoriaGastoSemFlyweight - memoriaGastoComFlyweight) / 1024 / 1024;
    const eficiencia = (memoriaGastoSemFlyweight / memoriaGastoComFlyweight).toFixed(2);
    
    console.log(`\nMemória gasta COM Flyweight:    ${(memoriaGastoComFlyweight / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Memória gasta SEM Flyweight:    ${(memoriaGastoSemFlyweight / 1024 / 1024).toFixed(2)} MB`);
    console.log(`\nECONOMIA:                       ${economiaBytes.toFixed(2)} MB (${economiaPercentual}%)`);
    console.log(`\nFlyweight foi ${eficiencia}x mais eficiente!\n`);
}


// Executar testes
testeComparativo();