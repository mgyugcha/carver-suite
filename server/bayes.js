// obtencion de recursos de la libreria
Object.defineProperty(exports, 'yyesModule', { value: true })
const servidorbayes = require('bayes-server')
const network = new servidorbayes.Network('Tesis')

// generar las variables para el nodo a
const aForemost = new servidorbayes.State('Foremost')
const aScalpel = new servidorbayes.State('Scalpel')
const a = new servidorbayes.Node('A', [aForemost, aScalpel])
// generar las variables para el nodo b
const bm1m = new servidorbayes.State('M1M')
const be1y2m = new servidorbayes.State('E1y2M')
const bd4m = new servidorbayes.State('D4M')
const bd8m = new servidorbayes.State('D8M')
const bd11m = new servidorbayes.State('D11M')
const b = new servidorbayes.Node('B', [bm1m, be1y2m, bd4m, bd8m, bd11m])
// generar las variables para el nodo c
const cLiviano = new servidorbayes.State('Liviano')
const cMediano = new servidorbayes.State('Mediano')
const cPesado = new servidorbayes.State('Pesado')
const cObjcontun = new servidorbayes.State('ObjContund')
const c = new servidorbayes.Node('C', [cLiviano, cMediano, cPesado, cObjcontun])
// generar las variables para el nodo d
const d0y10s = new servidorbayes.State('De0y10seg')
const d10y60s = new servidorbayes.State('De10y60seg')
const dmas60s = new servidorbayes.State('Mas60seg')
const d = new servidorbayes.Node('D', [d0y10s, d10y60s, dmas60s])

// Carga de nodos a la red
network.nodes.push(a)
network.nodes.push(b)
network.nodes.push(c)
network.nodes.push(d)

//  Realizamos los links hacia el nodo a
network.links.push(new servidorbayes.Link(a, b))
network.links.push(new servidorbayes.Link(a, c))
network.links.push(new servidorbayes.Link(a, d))

//  Carga de datos estadisticos en la tabla a pertenciente al nodo a
const tableA = a.newDistribution().table
tableA.set(0.4458, [aForemost])
tableA.set(0.5542, [aScalpel])
a.distribution = tableA//  Agregamos la distribucion de la tabla a al nodo a

//  Carga de datos estadisticos en la tabla b pertenciente al nodo b
const tableB = b.newDistribution().table
tableB.set(0.2057, [aForemost, bm1m])
tableB.set(0.2052, [aForemost, be1y2m])
tableB.set(0.184, [aForemost, bd4m])
tableB.set(0.187, [aForemost, bd8m])
tableB.set(0.2181, [aForemost, bd11m])
tableB.set(0.1945, [aScalpel, bm1m])
tableB.set(0.1950, [aScalpel, be1y2m])
tableB.set(0.2154, [aScalpel, bd4m])
tableB.set(0.2125, [aScalpel, bd8m])
tableB.set(0.1826, [aScalpel, bd11m])
b.distribution = tableB//  Agregamos la distribucion de la tabla b al nodo b

//  Carga de datos estadisticos en la tabla c pertenciente al nodo c
const tableC = c.newDistribution().table
tableC.set(0.2933, [aForemost, cLiviano])
tableC.set(0.3608, [aForemost, cMediano])
tableC.set(0.3459, [aForemost, cPesado])
tableC.set(0.0, [aForemost, cObjcontun])
tableC.set(0.3763, [aScalpel, cLiviano])
tableC.set(0.3039, [aScalpel, cMediano])
tableC.set(0.3198, [aScalpel, cPesado])
tableC.set(0.0, [aScalpel, cObjcontun])
c.distribution = tableC//  Agregamos la distribucion de la tabla c al nodo c

//  Carga de datos estadisticos en la tabla d pertenciente al nodo d
const tableD = d.newDistribution().table
tableD.set(0.3290, [aForemost, d0y10s])
tableD.set(0.3355, [aForemost, d10y60s])
tableD.set(0.3355, [aForemost, dmas60s])
tableD.set(0.3369, [aScalpel, d0y10s])
tableD.set(0.3316, [aScalpel, d10y60s])
tableD.set(0.3315, [aScalpel, dmas60s])
d.distribution = tableD//  Agregamos la distribucion de la tabla d al nodo d

// creacion de la inferencia
const arbol = new servidorbayes.RelevanceTreeInferenceFactory()
const inferencia = arbol.createInferenceEngine(network)
const queryOptions = arbol.createQueryOptions()
const queryOutput = arbol.createQueryOutput()

//inferencia.evidence.setState(cMediano)// envio del parametro para generar la inferencia
const queryA = new servidorbayes.Table(a)// consulta sobre que tabla se va a realizar la inferencia
inferencia.queryDistributions.pushDistribution(queryA)// realiza la inferencia a la tabla
inferencia.query(queryOptions, queryOutput)
//console.log('{' + queryA.get([aForemost]) + ',' + queryA.get([aScalpel]) + '}.')//  resultados estadisticos de la inferencia
function inferir (inf){
    inferencia.evidence.setState(inf)
    inferencia.queryDistributions.pushDistribution(queryA)
    inferencia.query(queryOptions, queryOutput)
    var valor1 = queryA.get([aForemost])
    var valor2 = queryA.get([aScalpel])
    return{
    valor1: valor1,
    valor2: valor2
    }
}
var result = inferir(cObjcontun)
console.log(result.valor1*100)
console.log(result.valor2*100)
